import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class ThreeViewer {
  constructor(containerElement, onLoadingProgress) {
    this.container = containerElement;
    this.onLoadingProgress = onLoadingProgress || (() => {});

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.gltfLoader = null;
    this.currentModel = null;
    this.modelCache = new Map(); // Fast caching for instant component switching

    // Settings
    this.isAutoRotating = false;
    this.isWireframe = false;
    this.lightingModeIndex = 0; // 0: Studio, 1: Cyber Neon, 2: Daylight Clean
    this.lights = [];

    // Animation & Smooth Transition State
    this.animatingCamera = false;
    this.camTargetPos = new THREE.Vector3();
    this.camTargetLookAt = new THREE.Vector3();
    this.camLerpSpeed = 0.08;

    // Raycaster for Sketchfab-style double click focus
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x161e2e);

    // 2. Camera with optimized clipping planes to prevent Z-fighting flicker
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 120);
    this.camera.position.set(0, 1.2, 2.8);

    // 3. Renderer with PBR & Performance Optimization for Low-Spec & High-Spec Devices
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Required for clean HD screenshots
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0)); // Crystal clear high DPI clarity
    this.renderer.toneMapping = THREE.NeutralToneMapping || THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.90; // Anti-glare exposure so white labels & metallic circuits are crisp & legible
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Environment Map for Realistic Metallic / Chrome Reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    this.scene.environment = pmremGenerator.fromScene(roomEnvironment, 0.04).texture;
    pmremGenerator.dispose();


    // 4. Sketchfab-style OrbitControls (Smooth, Buttery & Unrestricted 360°)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.rotateSpeed = 0.88;
    this.controls.zoomSpeed = 1.1;
    this.controls.panSpeed = 0.88;
    this.controls.minDistance = 0.02;
    this.controls.maxDistance = 200.0;
    this.controls.minPolarAngle = 0.01;
    this.controls.maxPolarAngle = Math.PI - 0.01; // Full 360° top-to-bottom rotation
    this.controls.target.set(0, 0, 0);

    // Cancel automatic camera lerp animation immediately when user starts interacting
    this.controls.addEventListener('start', () => {
      this.animatingCamera = false;
    });

    // 5. Lighting Setup (Bright High-Fidelity Studio)
    this.setupLighting();

    // 6. Loaders
    this.setupLoaders();

    // 7. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.setupDoubleTapFocus();

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  /**
   * Set interactive mode (locked rotating turntable on Home, free 360 controls on Pembahasan/Quiz)
   */
  setInteractive(isInteractive) {
    if (!isInteractive) {
      this.controls.enabled = false;
      this.controls.autoRotate = false; // Disable controls autoRotate to prevent eccentric orbit wobble
      this.isAutoRotating = true; // Pure turntable spin around model's exact geometric center
    } else {
      this.controls.enabled = true;
      this.controls.autoRotate = false;
      this.isAutoRotating = false;
    }
  }

  setupLighting() {
    // Clear previous lights if any
    this.lights.forEach(light => this.scene.remove(light));
    this.lights = [];

    // Main Ambient / Hemisphere Light (Soft natural fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.65);
    hemiLight.position.set(0, 25, 0);
    this.scene.add(hemiLight);
    this.lights.push(hemiLight);

    // Primary Key Light (Balanced directional light with soft shadow)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.05);
    keyLight.position.set(5, 10, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);
    this.lights.push(keyLight);

    // Front-Left Fill Light (Gentle balance)
    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 0.6);
    fillLight.position.set(-6, 6, 5);
    this.scene.add(fillLight);
    this.lights.push(fillLight);

    // Top-Back Rim Light (Crisp metallic edge highlights)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.75);
    rimLight.position.set(0, 8, -6);
    this.scene.add(rimLight);
    this.lights.push(rimLight);

    // Subtle Bottom Light (Soft underglow)
    const bottomLight = new THREE.DirectionalLight(0x6366f1, 0.45);
    bottomLight.position.set(0, -6, 0);
    this.scene.add(bottomLight);
    this.lights.push(bottomLight);
  }


  setupLoaders() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.preload();

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(dracoLoader);
  }

  /**
   * Process and tune model materials: Force 100% solid opaque outer casing, crystal-clear anisotropic textures & anti-glare PBR
   */
  processModelMaterials(model) {
    if (!model) return;
    const maxAniso = this.renderer ? this.renderer.capabilities.getMaxAnisotropy() : 4;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Force 100% solid opaque surface with zero transparency or see-through X-ray glitches
          child.material.transparent = false;
          child.material.opacity = 1.0;
          child.material.depthWrite = true;
          child.material.depthTest = true;
          child.material.alphaTest = 0;
          child.material.side = THREE.FrontSide; // Pure solid surface culling - only the outer chassis is visible!
          child.material.blending = THREE.NormalBlending;

          // Apply Anisotropic filtering for super sharp, crystal-clear labels & circuit details
          const textures = [
            child.material.map,
            child.material.normalMap,
            child.material.roughnessMap,
            child.material.metalnessMap,
            child.material.emissiveMap
          ];

          textures.forEach((tex) => {
            if (tex) {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.generateMipmaps = true;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.anisotropy = Math.min(maxAniso, 8);
              tex.needsUpdate = true;
            }
          });

          // Authentic dark cast aluminum / steel metal finish for HDD/PSU metal chassis
          if (!child.material.map && (child.material.name.includes('Material.') || child.material.name.toLowerCase().includes('metal') || child.material.name.toLowerCase().includes('iron') || child.material.name.toLowerCase().includes('case') || child.material.name.toLowerCase().includes('steel') || child.material.name.includes('phong'))) {
            child.material.metalness = 0.88;
            child.material.roughness = 0.38;
            child.material.color.setRGB(0.32, 0.35, 0.40); // Dark sleek metallic tone
            child.material.envMapIntensity = 1.0;
          } else if (child.material.map) {
            child.material.envMapIntensity = 0.40;
            if (child.material.color) {
              child.material.color.setRGB(0.85, 0.85, 0.85); // Anti-glare on sticker labels
            }
          } else {
            child.material.envMapIntensity = 0.6;
          }

          child.material.needsUpdate = true;
          if (this.isWireframe) {
            child.material.wireframe = true;
          }
        }
      }
    });
  }

  /**
   * Preload 3D models into memory cache
   */
  preloadModels(urls) {
    urls.forEach((url) => {
      if (this.modelCache.has(url)) return;
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.processModelMaterials(gltf.scene);
          this.modelCache.set(url, gltf.scene);
        },
        undefined,
        (err) => console.warn('Background preload skipped:', url, err)
      );
    });
  }

  /**
   * Load and display a 3D model with auto-framing and progress updates
   */
  async loadModel(url, customOffset = null, layoutMode = 'center') {
    // Instantaneous 0-second switching if already in memory
    if (this.modelCache.has(url)) {
      const cached = this.modelCache.get(url).clone();
      this.processModelMaterials(cached);
      this.displayLoadedModel(cached, customOffset, layoutMode);
      return Promise.resolve(this.modelCache.get(url));
    }

    this.onLoadingProgress(5);

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          this.processModelMaterials(model);

          // Cache raw model
          this.modelCache.set(url, model);

          // Display
          this.displayLoadedModel(model.clone(), customOffset, layoutMode);
          this.onLoadingProgress(100);
          resolve(model);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            this.onLoadingProgress(Math.min(percent, 99));
          } else {
            this.onLoadingProgress(60);
          }
        },
        (error) => {
          console.error("Error loading 3D model:", error);
          this.onLoadingProgress(100);
          reject(error);
        }
      );
    });
  }


  /**
   * Replace current scene model and calculate smooth bounding box auto-framing
   */
  displayLoadedModel(model, customOffset, layoutMode = 'center') {
    if (this.currentModel) {
      this.scene.remove(this.currentModel);
    }

    // Reset model position before calculating bounding box
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.updateMatrixWorld(true);

    // Calculate exact Bounding Box of only visible geometry in world space
    let box = new THREE.Box3();
    let hasGeometry = false;
    model.traverse((child) => {
      if (child.isMesh && child.geometry) {
        if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
        const meshBox = child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld);
        box.union(meshBox);
        hasGeometry = true;
      }
    });

    if (!hasGeometry || box.isEmpty()) {
      box.setFromObject(model);
    }

    let sphere = box.getBoundingSphere(new THREE.Sphere());

    // Auto-normalize scale for tiny objects (like CPU & M.2 NVMe SSD) so they appear clean, compact & proportional
    if (sphere.radius < 0.25 && sphere.radius > 0.001) {
      const targetNormalizedRadius = 0.38;
      const scaleFactor = targetNormalizedRadius / sphere.radius;
      model.scale.set(scaleFactor, scaleFactor, scaleFactor);
      model.updateMatrixWorld(true);

      // Recalculate box & sphere after scaling
      box = new THREE.Box3();
      model.traverse((child) => {
        if (child.isMesh && child.geometry) {
          if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
          const meshBox = child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld);
          box.union(meshBox);
        }
      });
      if (box.isEmpty()) box.setFromObject(model);
      sphere = box.getBoundingSphere(new THREE.Sphere());
    }

    const center = box.getCenter(new THREE.Vector3());

    // Create a Pivot Group at origin (0, 0, 0)
    const pivot = new THREE.Group();
    pivot.name = "ModelPivot";

    // Place model inside pivot shifted by -center so true geometric center is precisely at (0, 0, 0) of the pivot
    model.position.set(-center.x, -center.y, -center.z);
    pivot.add(model);

    // Set initial scale to small for smooth unified scale-up entrance animation
    pivot.scale.set(0.05, 0.05, 0.05);
    this.scaleAnimationStart = performance.now();
    this.scaleAnimationDuration = 340; // ms snappy & buttery smooth
    this.animatingModelScale = true;

    // Add pivot to the scene
    this.scene.add(pivot);
    this.currentModel = pivot;
    pivot.updateMatrixWorld(true);

    // Position Camera with optimal framing distance based on object size
    const radius = Math.max(sphere.radius, 0.1);
    this.currentLayoutMode = layoutMode;
    const isMobile = window.innerWidth <= 768;

    let pivotX = 0;
    let pivotY = 0;
    let targetLookX = 0;
    let targetLookY = 0;
    let camX = 0;
    let camY = 0;
    let camZ = 0;

    if (layoutMode === 'home') {
      if (isMobile) {
        // Mobile Home: Perfectly balanced framing in upper-middle area
        pivotX = 0;
        pivotY = 0;
        targetLookX = 0;
        targetLookY = -radius * 0.55;
        const camDist = radius * 3.35;
        camX = camDist * 0.35;
        camY = -radius * 0.10;
        camZ = camDist * 1.05;
      } else {
        // Desktop Home: Large, elevated on left side of screen
        pivotX = -radius * 0.52;
        pivotY = radius * 0.16;
        targetLookX = pivotX;
        targetLookY = pivotY;
        const camDist = radius * 2.15;
        camX = targetLookX + camDist * 0.40;
        camY = targetLookY + camDist * 0.35;
        camZ = camDist * 1.15;
      }
    } else {
      // Pembahasan or Quiz Mode (Centered 3D Models)
      if (isMobile) {
        // Mobile Pembahasan: Perfectly centered in safe area between chips and sheet
        pivotX = 0;
        pivotY = radius * 0.15;
        targetLookX = 0;
        targetLookY = pivotY;
        const camDist = radius * 5.6;
        camX = camDist * 0.40;
        camY = targetLookY + camDist * 0.55;
        camZ = camDist * 0.95;
      } else {
        // Desktop Pembahasan: Centered
        pivotX = 0;
        pivotY = radius * 0.15;
        targetLookX = 0;
        targetLookY = pivotY;
        const camDist = radius * 3.6;
        camX = camDist * 0.45;
        camY = targetLookY + camDist * 0.55;
        camZ = camDist * 0.95;
      }
    }

    pivot.position.set(pivotX, pivotY, 0);
    this.controls.target.set(targetLookX, targetLookY, 0);
    this.controls.minDistance = Math.max(radius * 0.1, 0.01);
    this.controls.maxDistance = Math.max(radius * 40.0, 50.0);

    // Position camera looking directly at targetLook
    this.camera.position.set(camX, camY, camZ);
    this.controls.update();
    this.animatingCamera = false;
  }



  /**

   * Smooth camera glide transition
   */
  animateCameraTo(targetPosition, targetLookAt) {
    this.camTargetPos.copy(targetPosition);
    this.camTargetLookAt.copy(targetLookAt);
    this.animatingCamera = true;
  }

  /**
   * Reset camera to default framing
   */
  resetCamera() {
    if (!this.currentModel) return;
    const box = new THREE.Box3().setFromObject(this.currentModel);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 0.05);

    const isMobile = window.innerWidth <= 768;
    let pivotX = 0;
    let pivotY = 0;
    let targetLookX = 0;
    let targetLookY = 0;
    let camX = 0;
    let camY = 0;
    let camZ = 0;

    if (this.currentLayoutMode === 'home') {
      if (isMobile) {
        pivotX = 0;
        pivotY = 0;
        targetLookX = 0;
        targetLookY = -radius * 0.55;
        const camDist = radius * 3.35;
        camX = camDist * 0.35;
        camY = -radius * 0.10;
        camZ = camDist * 1.05;
      } else {
        pivotX = -radius * 0.52;
        pivotY = radius * 0.16;
        targetLookX = pivotX;
        targetLookY = pivotY;
        const camDist = radius * 2.15;
        camX = targetLookX + camDist * 0.40;
        camY = targetLookY + camDist * 0.35;
        camZ = camDist * 1.15;
      }
    } else {
      if (isMobile) {
        pivotX = 0;
        pivotY = radius * 0.15;
        targetLookX = 0;
        targetLookY = pivotY;
        const camDist = radius * 5.6;
        camX = camDist * 0.40;
        camY = targetLookY + camDist * 0.55;
        camZ = camDist * 0.95;
      } else {
        pivotX = 0;
        pivotY = radius * 0.15;
        targetLookX = 0;
        targetLookY = pivotY;
        const camDist = radius * 3.6;
        camX = camDist * 0.45;
        camY = targetLookY + camDist * 0.55;
        camZ = camDist * 0.95;
      }
    }

    this.currentModel.position.set(pivotX, pivotY, 0);
    this.animateCameraTo(
      new THREE.Vector3(camX, camY, camZ),
      new THREE.Vector3(targetLookX, targetLookY, 0)
    );
  }



  /**
   * Toggle auto rotation
   */
  toggleAutoRotate() {
    this.isAutoRotating = !this.isAutoRotating;
    this.controls.autoRotate = false;
    return this.isAutoRotating;
  }




  /**
   * Capture high-definition screenshot
   */
  captureScreenshot(filename = 'sistem-komputer-3d.png') {
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.renderer.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    link.click();
  }

  /**
   * Sketchfab signature double click / double tap focus to clicked point
   */
  setupDoubleTapFocus() {
    const dom = this.renderer.domElement;
    let lastTap = 0;

    const handleFocus = (clientX, clientY) => {
      if (!this.controls.enabled) return; // Do not focus when in locked home mode
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      if (!this.currentModel) return;

      const intersects = this.raycaster.intersectObject(this.currentModel, true);
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const offset = this.camera.position.clone().sub(this.controls.target);
        this.animateCameraTo(hitPoint.clone().add(offset), hitPoint);
      }
    };

    dom.addEventListener('dblclick', (e) => {
      handleFocus(e.clientX, e.clientY);
    });

    dom.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0 && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        handleFocus(touch.clientX, touch.clientY);
      }
      lastTap = currentTime;
    });
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Standardized Scale-Up Pop-In Animation (from small to full size) for all models without bounce
    if (this.animatingModelScale && this.currentModel) {
      const elapsed = performance.now() - this.scaleAnimationStart;
      const t = Math.min(elapsed / this.scaleAnimationDuration, 1.0);

      // Pure smooth monotonic ease-out: starts briskly, smoothly decelerates to 1.0 (Zero bounce)
      const ease = 1 - Math.pow(1 - t, 3.5);
      const currentScale = 0.05 + ease * 0.95;

      this.currentModel.scale.set(currentScale, currentScale, currentScale);

      if (t >= 1.0) {
        this.currentModel.scale.set(1, 1, 1);
        this.animatingModelScale = false;
      }
    }


    // Auto rotate model smoothly for ALL components whenever auto-rotate is active
    if (this.isAutoRotating && this.currentModel) {
      this.currentModel.rotation.y -= 0.008; // Continuous smooth spin to the left for any model
    }



    // Smooth camera transition lerp
    if (this.animatingCamera) {
      this.camera.position.lerp(this.camTargetPos, this.camLerpSpeed);
      this.controls.target.lerp(this.camTargetLookAt, this.camLerpSpeed);

      if (
        this.camera.position.distanceTo(this.camTargetPos) < 0.01 &&
        this.controls.target.distanceTo(this.camTargetLookAt) < 0.01
      ) {
        this.camera.position.copy(this.camTargetPos);
        this.controls.target.copy(this.camTargetLookAt);
        this.animatingCamera = false;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
