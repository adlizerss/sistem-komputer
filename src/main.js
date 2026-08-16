import confetti from 'canvas-confetti';
import { ThreeViewer } from './viewer/ThreeViewer.js';
import { COMPONENTS_DATA } from './data/components.js';
import { QUIZ_QUESTIONS } from './data/quiz.js';

class App {
  constructor() {
    this.viewer = null;
    this.activeTab = 'beranda'; // 'beranda' | 'pembahasan' | 'kuis'
    this.selectedComponentIndex = 0;

    // Quiz State
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;

    // DOM Elements
    this.elements = {};

    this.init();
  }

  init() {
    this.cacheDomElements();
    this.initThreeViewer();
    this.renderBottomCarousel();
    this.bindEvents();

    // Initial load: Beranda with 1 Set Gaming PC Desktop & Monitor
    this.switchTab('beranda');

    // Fade out gesture hint after first interaction or 6 seconds
    setTimeout(() => {
      if (this.elements.gestureHint) {
        this.elements.gestureHint.classList.add('fade-out');
      }
    }, 6000);
  }

  cacheDomElements() {
    this.elements = {
      canvasContainer: document.getElementById('canvas-container'),
      loadingOverlay: document.getElementById('loading-overlay'),
      loadingTitle: document.getElementById('loading-title'),
      loadingProgressBar: document.getElementById('loading-progress-bar'),
      loadingPercentage: document.getElementById('loading-percentage'),
      gestureHint: document.getElementById('gesture-hint'),
      canvasContainer: document.getElementById('canvas-container'),

      // Tabs & Home Overlay
      tabBeranda: document.getElementById('tab-beranda'),
      tabPembahasan: document.getElementById('tab-pembahasan'),
      tabKuis: document.getElementById('tab-kuis'),
      homeCenterMenu: document.getElementById('home-center-menu'),
      btnHomePembahasan: document.getElementById('btn-home-pembahasan'),
      btnHomeKuis: document.getElementById('btn-home-kuis'),
      btnHomeKeluar: document.getElementById('btn-home-keluar'),

      // Floating Panels & Gallery
      panelPembahasan: document.getElementById('panel-pembahasan'),
      btnToggleSheet: document.getElementById('btn-toggle-sheet'),
      btnUnhideSheet: document.getElementById('btn-unhide-sheet'),
      componentsTopBar: document.getElementById('components-top-bar'),
      compChipsContainer: document.getElementById('comp-chips-container'),
      floatingCompNav: document.getElementById('floating-comp-nav'),
      btnCompPrev: document.getElementById('btn-comp-prev'),
      btnCompNext: document.getElementById('btn-comp-next'),
      compStepIndicator: document.getElementById('comp-step-indicator'),
      panelKuis: document.getElementById('panel-kuis'),
      bottomGallery: document.getElementById('bottom-gallery'),
      componentsCarousel: document.getElementById('components-carousel'),
      floatingHud: document.querySelector('.floating-hud'),

      // Pembahasan Elements
      compIcon: document.getElementById('comp-icon'),
      compTitle: document.getElementById('comp-title'),
      compSubtitle: document.getElementById('comp-subtitle'),
      compBootBadge: document.getElementById('comp-boot-badge'),
      compBootText: document.getElementById('comp-boot-text'),
      compTagline: document.getElementById('comp-tagline'),
      compFungsi: document.getElementById('comp-fungsi'),
      compSyarat: document.getElementById('comp-syarat'),
      compPosisi: document.getElementById('comp-posisi'),
      compSpecsList: document.getElementById('comp-specs-list'),

      // Quiz Elements
      quizQuestionCounter: document.getElementById('quiz-question-counter'),
      quizScoreDisplay: document.getElementById('quiz-score-display'),
      quizProgressBar: document.getElementById('quiz-progress-bar'),
      quizQuestionText: document.getElementById('quiz-question-text'),
      quizOptionsContainer: document.getElementById('quiz-options-container'),
      quizFeedbackBox: document.getElementById('quiz-feedback-box'),
      feedbackIcon: document.getElementById('feedback-icon'),
      feedbackHeader: document.getElementById('feedback-header'),
      feedbackText: document.getElementById('feedback-text'),
      btnNextQuestion: document.getElementById('btn-next-question'),

      // HUD Buttons
      btnResetCam: document.getElementById('btn-reset-cam'),
      btnAutoRotate: document.getElementById('btn-auto-rotate'),
      iconPlay: document.querySelector('.icon-play'),
      iconPause: document.querySelector('.icon-pause'),
      btnWireframe: document.getElementById('btn-wireframe'),
      btnLighting: document.getElementById('btn-lighting'),
      btnScreenshot: document.getElementById('btn-screenshot'),

      // Top Actions & Modals
      btnHelpModal: document.getElementById('btn-help-modal'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      modalHelp: document.getElementById('modal-help'),
      btnCloseHelp: document.getElementById('btn-close-help'),
      btnUnderstandHelp: document.getElementById('btn-understand-help'),

      // Exit Modal
      modalExit: document.getElementById('modal-exit'),
      btnConfirmExit: document.getElementById('btn-confirm-exit'),
      btnCancelExit: document.getElementById('btn-cancel-exit'),

      // Quiz Result Modal
      modalQuizResult: document.getElementById('modal-quiz-result'),
      resultFinalScore: document.getElementById('result-final-score'),
      resultTitle: document.getElementById('result-title'),
      resultMessage: document.getElementById('result-message'),
      btnRestartQuiz: document.getElementById('btn-restart-quiz'),
      btnBackToPembahasan: document.getElementById('btn-back-to-pembahasan')
    };
  }

  initThreeViewer() {
    this.viewer = new ThreeViewer(
      this.elements.canvasContainer,
      (progress) => this.handleLoadingProgress(progress)
    );

    // Silently preload all component 3D models in the background for 0-second instant transitions
    setTimeout(() => {
      const allUrls = COMPONENTS_DATA.map(c => c.modelFile);
      this.viewer.preloadModels(allUrls);
    }, 800);
  }


  handleLoadingProgress(progress) {
    if (!this.elements.loadingOverlay) return;

    if (progress < 100) {
      this.elements.loadingOverlay.classList.remove('hidden');
      if (this.elements.loadingProgressBar) {
        this.elements.loadingProgressBar.style.width = `${progress}%`;
      }
      if (this.elements.loadingPercentage) {
        this.elements.loadingPercentage.textContent = `${progress}%`;
      }
    } else {
      if (this.elements.loadingProgressBar) {
        this.elements.loadingProgressBar.style.width = '100%';
      }
      if (this.elements.loadingPercentage) {
        this.elements.loadingPercentage.textContent = '100%';
      }
      setTimeout(() => {
        this.elements.loadingOverlay.classList.add('hidden');
      }, 200);
    }
  }

  renderBottomCarousel() {
    if (!this.elements.componentsCarousel) return;
    this.elements.componentsCarousel.innerHTML = '';

    COMPONENTS_DATA.forEach((comp, index) => {
      const btn = document.createElement('button');
      btn.className = `comp-item-btn ${index === this.selectedComponentIndex ? 'active' : ''}`;
      btn.dataset.index = index;
      btn.innerHTML = `
        <span class="item-emoji">${comp.icon}</span>
        <span class="item-name">${comp.name}</span>
      `;
      btn.addEventListener('click', () => {
        this.selectComponent(index);
      });
      this.elements.componentsCarousel.appendChild(btn);
    });
  }

  prevComponent() {
    const total = COMPONENTS_DATA.length;
    const newIndex = (this.selectedComponentIndex - 1 + total) % total;
    this.selectComponent(newIndex);
  }

  nextComponent() {
    const total = COMPONENTS_DATA.length;
    const newIndex = (this.selectedComponentIndex + 1) % total;
    this.selectComponent(newIndex);
  }

  selectComponent(index) {
    this.selectedComponentIndex = index;
    const comp = COMPONENTS_DATA[index];
    if (!comp) return;

    // Update Active Button in Carousel (if exists)
    if (this.elements.componentsCarousel) {
      const buttons = this.elements.componentsCarousel.querySelectorAll('.comp-item-btn');
      buttons.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
    }

    // Update Active Chip in Top Chips Bar
    if (this.elements.compChipsContainer) {
      const topChips = this.elements.compChipsContainer.querySelectorAll('.comp-chip');
      topChips.forEach((chip, idx) => {
        const isActive = idx === index;
        chip.classList.toggle('active', isActive);
        if (isActive) {
          chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }

    // Update Component Step Indicator
    if (this.elements.compStepIndicator) {
      this.elements.compStepIndicator.innerHTML = `
        <span class="step-num">${index + 1} / ${COMPONENTS_DATA.length}</span>
      `;
    }

    // Update Info Card with concise facts (Clean Component Name & Description Only)
    if (this.elements.compIcon) this.elements.compIcon.textContent = comp.icon;
    if (this.elements.compTitle) this.elements.compTitle.textContent = comp.name;
    if (this.elements.compSubtitle) this.elements.compSubtitle.textContent = comp.subtitle;
    if (this.elements.compTagline) this.elements.compTagline.textContent = comp.tagline;
    if (this.elements.compFungsi) this.elements.compFungsi.textContent = comp.explanation.fungsi;

    // Optional legacy element guards
    if (this.elements.compBootBadge) this.elements.compBootBadge.className = `boot-badge ${comp.bootBadge}`;
    if (this.elements.compBootText) this.elements.compBootText.textContent = comp.bootRole;
    if (this.elements.compSyarat) this.elements.compSyarat.textContent = comp.explanation.syaratBoot;
    if (this.elements.compPosisi) this.elements.compPosisi.textContent = comp.explanation.posisi;
    if (this.elements.compSpecsList) {
      this.elements.compSpecsList.innerHTML = comp.specs
        .map(s => `<div class="spec-chip"><strong>${s.label}:</strong> ${s.value}</div>`)
        .join('');
    }

    // Load 3D Model into Viewport with pembahasan layout mode
    if (this.elements.loadingTitle) {
      this.elements.loadingTitle.textContent = `Memuat ${comp.name}...`;
    }
    this.viewer.loadModel(comp.modelFile, comp.cameraOffset, 'pembahasan');
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update Tab Buttons
    if (this.elements.tabBeranda) {
      const isBeranda = tabName === 'beranda';
      this.elements.tabBeranda.classList.toggle('active', isBeranda);
      this.elements.tabBeranda.setAttribute('aria-selected', isBeranda);
    }
    if (this.elements.tabPembahasan) {
      const isPembahasan = tabName === 'pembahasan';
      this.elements.tabPembahasan.classList.toggle('active', isPembahasan);
      this.elements.tabPembahasan.setAttribute('aria-selected', isPembahasan);
    }
    if (this.elements.tabKuis) {
      const isKuis = tabName === 'kuis';
      this.elements.tabKuis.classList.toggle('active', isKuis);
      this.elements.tabKuis.setAttribute('aria-selected', isKuis);
    }

    if (tabName === 'beranda') {
      // Non-interactive 3D background: auto-rotate smoothly, controls locked
      this.viewer.setInteractive(false);
      if (this.elements.canvasContainer) this.elements.canvasContainer.style.pointerEvents = 'none';

      if (this.elements.homeCenterMenu) this.elements.homeCenterMenu.classList.remove('hidden');
      if (this.elements.panelPembahasan) this.elements.panelPembahasan.classList.add('hidden');
      if (this.elements.componentsTopBar) this.elements.componentsTopBar.classList.add('hidden');
      if (this.elements.floatingCompNav) this.elements.floatingCompNav.classList.add('hidden');
      if (this.elements.btnUnhideSheet) this.elements.btnUnhideSheet.classList.add('hidden');
      if (this.elements.panelKuis) this.elements.panelKuis.classList.add('hidden');
      if (this.elements.bottomGallery) this.elements.bottomGallery.classList.add('hidden');
      if (this.elements.floatingHud) this.elements.floatingHud.classList.add('hidden');
      if (this.elements.gestureHint) this.elements.gestureHint.classList.add('hidden');

      // Load 1 Set Gaming PC Desktop & Monitor with home offset framing
      if (this.elements.loadingTitle) {
        this.elements.loadingTitle.textContent = "Menyiapkan Setup PC Desktop & Monitor...";
      }
      this.viewer.loadModel('/3d/gaming_desktop_pc.glb', { x: 0, y: 0.4, z: 1.1 }, 'home');

    } else if (tabName === 'pembahasan') {
      // Interactive 3D mode enabled (free 360 rotation, zoom, pan)
      this.viewer.setInteractive(true);
      if (this.elements.canvasContainer) this.elements.canvasContainer.style.pointerEvents = 'auto';

      if (this.elements.homeCenterMenu) this.elements.homeCenterMenu.classList.add('hidden');
      if (this.elements.panelPembahasan) {
        this.elements.panelPembahasan.classList.remove('hidden');
        this.elements.panelPembahasan.classList.remove('sheet-collapsed');
      }
      if (this.elements.componentsTopBar) this.elements.componentsTopBar.classList.remove('hidden');
      if (this.elements.floatingCompNav) this.elements.floatingCompNav.classList.remove('hidden');
      if (this.elements.btnUnhideSheet) this.elements.btnUnhideSheet.classList.add('hidden');
      if (this.elements.panelKuis) this.elements.panelKuis.classList.add('hidden');
      if (this.elements.bottomGallery) this.elements.bottomGallery.classList.remove('hidden');
      if (this.elements.floatingHud) this.elements.floatingHud.classList.remove('hidden');
      if (this.elements.gestureHint) this.elements.gestureHint.classList.remove('hidden');

      // Load selected component model
      this.selectComponent(this.selectedComponentIndex);
    } else if (tabName === 'kuis') {
      // Interactive 3D mode enabled for inspection
      this.viewer.setInteractive(true);
      if (this.elements.canvasContainer) this.elements.canvasContainer.style.pointerEvents = 'auto';

      if (this.elements.homeCenterMenu) this.elements.homeCenterMenu.classList.add('hidden');
      if (this.elements.panelPembahasan) this.elements.panelPembahasan.classList.add('hidden');
      if (this.elements.componentsTopBar) this.elements.componentsTopBar.classList.add('hidden');
      if (this.elements.floatingCompNav) this.elements.floatingCompNav.classList.add('hidden');
      if (this.elements.btnUnhideSheet) this.elements.btnUnhideSheet.classList.add('hidden');
      if (this.elements.panelKuis) this.elements.panelKuis.classList.remove('hidden');
      if (this.elements.bottomGallery) this.elements.bottomGallery.classList.add('hidden');
      if (this.elements.floatingHud) this.elements.floatingHud.classList.remove('hidden');
      if (this.elements.gestureHint) this.elements.gestureHint.classList.add('hidden');

      // Start / load current quiz question
      this.loadQuizQuestion(this.currentQuizIndex);
    }
  }



  loadQuizQuestion(index) {
    this.currentQuizIndex = index;
    this.quizAnswered = false;
    const q = QUIZ_QUESTIONS[index];
    if (!q) return;

    // Counter & Progress
    const total = QUIZ_QUESTIONS.length;
    this.elements.quizQuestionCounter.textContent = `Soal ${index + 1} / ${total}`;
    this.elements.quizScoreDisplay.textContent = this.quizScore;
    this.elements.quizProgressBar.style.width = `${((index + 1) / total) * 100}%`;

    // Question Text
    this.elements.quizQuestionText.textContent = q.question;

    // Render Options
    this.elements.quizOptionsContainer.innerHTML = '';
    const prefixes = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${prefixes[optIdx]}</span>
        <span class="opt-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => this.handleAnswer(opt, btn, q));
      this.elements.quizOptionsContainer.appendChild(btn);
    });

    // Hide Feedback Box
    this.elements.quizFeedbackBox.classList.add('hidden');

    // Load corresponding 3D Model into Viewport with kuis layout mode
    const targetComp = COMPONENTS_DATA.find(c => c.id === q.targetModelId);
    if (targetComp) {
      this.elements.loadingTitle.textContent = `Menyiapkan Objek 3D Soal ${index + 1}...`;
      this.viewer.loadModel(targetComp.modelFile, targetComp.cameraOffset, 'kuis');
    }
  }

  handleAnswer(selectedOption, clickedButton, question) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    // Disable all option buttons
    const allButtons = this.elements.quizOptionsContainer.querySelectorAll('.quiz-option-btn');
    allButtons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedOption.correct;

    if (isCorrect) {
      this.quizScore += 10;
      this.elements.quizScoreDisplay.textContent = this.quizScore;
      clickedButton.classList.add('correct');

      this.elements.feedbackIcon.textContent = '🎉';
      this.elements.feedbackHeader.textContent = 'Jawaban Tepat!';
      this.elements.feedbackHeader.style.color = 'var(--accent-emerald)';
      this.elements.feedbackText.textContent = question.explanation;

      // Small confetti burst for correct answer
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      clickedButton.classList.add('wrong');

      // Highlight the correct one
      question.options.forEach((opt, idx) => {
        if (opt.correct) {
          allButtons[idx].classList.add('correct');
        }
      });

      this.elements.feedbackIcon.textContent = '💡';
      this.elements.feedbackHeader.textContent = 'Penjelasan:';
      this.elements.feedbackHeader.style.color = 'var(--primary-cyan)';
      this.elements.feedbackText.textContent = question.explanation;
    }

    // Show Feedback Box
    this.elements.quizFeedbackBox.classList.remove('hidden');

    // Check if last question
    if (this.currentQuizIndex === QUIZ_QUESTIONS.length - 1) {
      this.elements.btnNextQuestion.innerHTML = `
        <span>Lihat Hasil Akhir</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-next">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      this.elements.btnNextQuestion.innerHTML = `
        <span>Lanjut ke Soal Berikutnya</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-next">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
    }
  }

  nextQuizQuestion() {
    if (this.currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      this.loadQuizQuestion(this.currentQuizIndex + 1);
    } else {
      this.showQuizResult();
    }
  }

  showQuizResult() {
    const totalScore = QUIZ_QUESTIONS.length * 10;
    const finalScore = this.quizScore;
    const percentage = Math.round((finalScore / totalScore) * 100);

    this.elements.resultFinalScore.textContent = finalScore;

    if (percentage >= 80) {
      this.elements.resultTitle.textContent = '🌟 Luar Biasa! Ahli Hardware!';
      this.elements.resultMessage.textContent = 'Hebat sekali! Kamu menguasai semua bentuk fisik dan fungsi komponen inti komputer dengan sempurna!';
      // Mega victory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } else if (percentage >= 50) {
      this.elements.resultTitle.textContent = '👍 Kerja Bagus!';
      this.elements.resultMessage.textContent = 'Pemahamanmu tentang komponen komputer sudah cukup baik. Pelajari lagi di menu Pembahasan untuk hasil sempurna!';
    } else {
      this.elements.resultTitle.textContent = '💪 Tetap Semangat!';
      this.elements.resultMessage.textContent = 'Yuk buka menu Pembahasan untuk mengamati detail bentuk 3D dan fungsi komponen sekali lagi!';
    }

    this.elements.modalQuizResult.classList.remove('hidden');
  }

  restartQuiz() {
    this.elements.modalQuizResult.classList.add('hidden');
    this.quizScore = 0;
    this.loadQuizQuestion(0);
  }

  bindEvents() {
    // Navigation Tabs
    if (this.elements.tabBeranda) {
      this.elements.tabBeranda.addEventListener('click', () => this.switchTab('beranda'));
    }
    this.elements.tabPembahasan.addEventListener('click', () => this.switchTab('pembahasan'));
    this.elements.tabKuis.addEventListener('click', () => this.switchTab('kuis'));

    // Top Component Chips Bar Click Events
    if (this.elements.compChipsContainer) {
      const topChips = this.elements.compChipsContainer.querySelectorAll('.comp-chip');
      topChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const idx = parseInt(chip.dataset.index, 10);
          this.selectComponent(idx);
        });
      });
    }

    // Sheet Minimize / Collapse Button (in card header)
    if (this.elements.btnToggleSheet && this.elements.panelPembahasan) {
      const hideSheetAction = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.type === 'touchend') e.preventDefault();
        }
        this.elements.panelPembahasan.classList.add('sheet-collapsed');
        if (this.elements.btnUnhideSheet) {
          this.elements.btnUnhideSheet.classList.remove('hidden');
        }
      };

      this.elements.btnToggleSheet.addEventListener('click', hideSheetAction);
      this.elements.btnToggleSheet.addEventListener('touchend', hideSheetAction);
    }

    // Floating Standalone Unhide Action Button (at bottom center)
    if (this.elements.btnUnhideSheet && this.elements.panelPembahasan) {
      const unhideSheetAction = (e) => {
        if (e) {
          e.stopPropagation();
          if (e.type === 'touchend') e.preventDefault();
        }
        this.elements.panelPembahasan.classList.remove('sheet-collapsed');
        this.elements.btnUnhideSheet.classList.add('hidden');
      };

      this.elements.btnUnhideSheet.addEventListener('click', unhideSheetAction);
      this.elements.btnUnhideSheet.addEventListener('touchend', unhideSheetAction);
    }

    // Component Navigation Buttons (Prev / Next)
    if (this.elements.btnCompPrev) {
      this.elements.btnCompPrev.addEventListener('click', () => this.prevComponent());
    }
    if (this.elements.btnCompNext) {
      this.elements.btnCompNext.addEventListener('click', () => this.nextComponent());
    }

    // Keyboard Arrow Navigation for Components
    window.addEventListener('keydown', (e) => {
      if (this.activeTab === 'pembahasan') {
        if (e.key === 'ArrowLeft') {
          this.prevComponent();
        } else if (e.key === 'ArrowRight') {
          this.nextComponent();
        }
      }
    });

    // Home Center Hero Buttons
    if (this.elements.btnHomePembahasan) {
      this.elements.btnHomePembahasan.addEventListener('click', () => this.switchTab('pembahasan'));
    }
    if (this.elements.btnHomeKuis) {
      this.elements.btnHomeKuis.addEventListener('click', () => this.switchTab('kuis'));
    }
    if (this.elements.btnHomeKeluar) {
      this.elements.btnHomeKeluar.addEventListener('click', () => {
        if (this.elements.modalExit) this.elements.modalExit.classList.remove('hidden');
      });
    }

    // Exit Modal Buttons
    if (this.elements.btnCancelExit) {
      this.elements.btnCancelExit.addEventListener('click', () => {
        if (this.elements.modalExit) this.elements.modalExit.classList.add('hidden');
      });
    }
    if (this.elements.btnConfirmExit) {
      this.elements.btnConfirmExit.addEventListener('click', () => {
        if (this.elements.modalExit) this.elements.modalExit.classList.add('hidden');
        this.switchTab('beranda');
      });
    }

    // Next Quiz Question Button
    this.elements.btnNextQuestion.addEventListener('click', () => this.nextQuizQuestion());

    // Restart Quiz Buttons
    this.elements.btnRestartQuiz.addEventListener('click', () => this.restartQuiz());
    this.elements.btnBackToPembahasan.addEventListener('click', () => {
      this.elements.modalQuizResult.classList.add('hidden');
      this.switchTab('pembahasan');
    });



    // Floating HUD Buttons
    this.elements.btnResetCam.addEventListener('click', () => {
      this.viewer.resetCamera();
    });

    this.elements.btnAutoRotate.addEventListener('click', () => {
      const isRotating = this.viewer.toggleAutoRotate();
      this.elements.btnAutoRotate.classList.toggle('active', isRotating);
      this.elements.iconPlay.classList.toggle('hidden', isRotating);
      this.elements.iconPause.classList.toggle('hidden', !isRotating);
    });

    this.elements.btnWireframe.addEventListener('click', () => {
      const isWire = this.viewer.toggleWireframe();
      this.elements.btnWireframe.classList.toggle('active', isWire);
    });

    this.elements.btnLighting.addEventListener('click', () => {
      const mode = this.viewer.cycleLightingMode();
      const labels = ['Studio', 'Cyber Neon', 'Daylight'];
      const tooltip = this.elements.btnLighting.querySelector('.hud-tooltip');
      if (tooltip) {
        tooltip.textContent = `Pencahayaan: ${labels[mode]}`;
      }
    });

    this.elements.btnScreenshot.addEventListener('click', () => {
      const currentName = this.activeTab === 'pembahasan' 
        ? COMPONENTS_DATA[this.selectedComponentIndex].id 
        : `kuis-soal-${this.currentQuizIndex + 1}`;
      this.viewer.captureScreenshot(`komponen-${currentName}.png`);
    });

    // Help Modal
    this.elements.btnHelpModal.addEventListener('click', () => {
      this.elements.modalHelp.classList.remove('hidden');
    });
    this.elements.btnCloseHelp.addEventListener('click', () => {
      this.elements.modalHelp.classList.add('hidden');
    });
    this.elements.btnUnderstandHelp.addEventListener('click', () => {
      this.elements.modalHelp.classList.add('hidden');
    });

    // Fullscreen Toggle
    this.elements.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn("Fullscreen request error:", err);
        });
      } else {
        document.exitFullscreen().catch(err => {
          console.warn("Exit fullscreen error:", err);
        });
      }
    });

    // Dismiss gesture hint on first pointerdown on canvas
    this.elements.canvasContainer.addEventListener('pointerdown', () => {
      if (this.elements.gestureHint) {
        this.elements.gestureHint.classList.add('fade-out');
      }
    }, { once: true });
  }
}

// Bootstrap App immediately or on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}

