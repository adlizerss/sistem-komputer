/**
 * Dataset Kuis Interaktif Tebak Komponen 3D
 */
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    targetModelId: "cpu",
    question: "Perhatikan objek 3D di atas! Memiliki lempengan logam pelindung dan ribuan pin emas di bawahnya. Apakah nama komponen ini?",
    options: [
      { text: "Central Processing Unit (CPU / Processor)", correct: true },
      { text: "Power Supply Unit (PSU)", correct: false },
      { text: "Random Access Memory (RAM)", correct: false },
      { text: "Solid State Drive (SSD)", correct: false }
    ],
    hint: "Dikenal sebagai 'otak' komputer yang melakukan semua proses kalkulasi.",
    explanation: "Benar! Ini adalah CPU (Processor) socket AM4. CPU bertugas memproses semua instruksi logika program dan merupakan komponen mutlak agar komputer bisa menyala (POST)."
  },
  {
    id: 2,
    targetModelId: "ram",
    question: "Amati bentuk kepingan memori 3D ini. Apakah fungsi utama dari komponen tersebut dalam sistem komputer?",
    options: [
      { text: "Menyimpan data sementara dengan akses sangat cepat saat sistem berjalan", correct: true },
      { text: "Menyuplai daya listrik ke seluruh motherboard", correct: false },
      { text: "Menghasilkan sinyal gambar visual ke layar monitor", correct: false },
      { text: "Mendinginkan processor agar tidak terjadi overheat", correct: false }
    ],
    hint: "Sifat datanya volatile (hilang saat listrik dimatikan).",
    explanation: "Tepat! Ini adalah RAM (Random Access Memory). RAM menampung data program yang sedang aktif agar CPU dapat mengaksesnya secara instan."
  },
  {
    id: 3,
    targetModelId: "motherboard",
    question: "Papan sirkuit sirkular besar ini memiliki socket CPU, slot PCIe, dan slot RAM. Apa peran utamanya?",
    options: [
      { text: "Papan induk yang menghubungkan dan mengatur komunikasi semua komponen", correct: true },
      { text: "Tempat penyimpanan permanen file sistem operasi Windows", correct: false },
      { text: "Mengubah arus listrik PLN 220V menjadi arus DC", correct: false },
      { text: "Mengendalikan kecepatan kipas pendingin saja", correct: false }
    ],
    hint: "Disebut juga Mainboard atau Mobo.",
    explanation: "Luar biasa! Ini adalah Motherboard (Papan Induk). Tanpa motherboard, komponen-komponen seperti CPU, RAM, dan GPU tidak bisa saling berkomunikasi."
  },
  {
    id: 4,
    targetModelId: "gpu",
    question: "Komponen 3D ini berukuran besar dengan kipas pendingin dan port HDMI/DisplayPort di belakangnya. Apakah fungsinya?",
    options: [
      { text: "Merender grafis visual dan mengirimkan sinyal tampilan ke layar monitor", correct: true },
      { text: "Menghubungkan komputer ke jaringan internet tanpa kabel", correct: false },
      { text: "Menyimpan file dokumen dan game secara permanen", correct: false },
      { text: "Menyalakan tombol power di depan casing", correct: false }
    ],
    hint: "Sangat penting bagi desainer grafis, editor video, dan gamer.",
    explanation: "Hebat! Ini adalah Kartu Grafis (GPU / VGA Card). GPU memproses jutaan piksel dan poligon agar visual aplikasi dan game tampil di layar monitor."
  },
  {
    id: 5,
    targetModelId: "psu",
    question: "Komponen kotak logam ini memiliki colokan kabel daya tebal dan saklar on/off di belakangnya. Apa fungsi utamanya?",
    options: [
      { text: "Mengubah arus listrik AC PLN menjadi arus DC yang aman untuk seluruh komponen", correct: true },
      { text: "Menyimpan data cadangan saat terjadi pemadaman listrik", correct: false },
      { text: "Memproses grafik resolusi tinggi ke monitor", correct: false },
      { text: "Mengatur sistem pendingin udara di dalam casing", correct: false }
    ],
    hint: "Merupakan jantung daya komputer, tanpa ini PC tidak akan mendapat arus listrik.",
    explanation: "Tepat sekali! Ini adalah Power Supply Unit (PSU). PSU mendistribusikan daya listrik DC dengan voltase spesifik (+12V, +5V, +3.3V) ke seluruh komponen."
  },
  {
    id: 6,
    targetModelId: "storage",
    question: "Amati objek 3D di layar yang menampilkan media penyimpanan data komputer (SSD & HDD). Apa fungsi utama media penyimpanan ini?",
    options: [
      { text: "Menyimpan Sistem Operasi (Windows/Linux), aplikasi, dan file secara permanen", correct: true },
      { text: "Memproses perhitungan matematika logika komputer secara langsung", correct: false },
      { text: "Mengubah voltase listrik AC dari PLN menjadi arus DC", correct: false },
      { text: "Menyimpan data sementara yang hilang saat listrik mati", correct: false }
    ],
    hint: "Tempat tersimpannya folder Windows dan semua file dokumenmu.",
    explanation: "Sempurna! Media Penyimpanan (SSD & HDD) berfungsi menyimpan OS, program, dan data pengguna secara non-volatile (tetap tersimpan meski komputer dimatikan)."
  }
];


