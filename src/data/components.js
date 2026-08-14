/**
 * Data Komponen Komputer untuk Menu Pembahasan
 */
export const COMPONENTS_DATA = [
  {
    id: "cpu",
    name: "Processor (CPU)",
    subtitle: "AMD AM4 Socket CPU",
    category: "Unit Pemrosesan",
    icon: "🧠",
    modelFile: "/3d/am4_cpu__free.glb",
    bootRole: "WAJIB (Kritis)",
    bootBadge: "critical",
    tagline: "Otak utama yang mengeksekusi semua instruksi & kalkulasi sistem.",
    explanation: {
      fungsi: "Memproses seluruh data, logika program, dan perhitungan matematika dalam komputer.",
      syaratBoot: "Komputer tidak akan menyala sama sekali (mati total/no POST) tanpa CPU.",
      posisi: "Dipasang di socket motherboard (Socket AM4) dan harus dilapisi pasta termal serta heatsink pendingin.",
      tips: "Perhatikan tanda segitiga kecil di sudut CPU agar pin tidak bengkok saat dipasang ke socket."
    },
    specs: [
      { label: "Tipe Socket", value: "AMD AM4 (PGA)" },
      { label: "Jumlah Pin", value: "1.331 Pin Emas" },
      { label: "Pelindung", value: "Integrated Heat Spreader (IHS)" }
    ],
    cameraOffset: { x: 0, y: 0.1, z: 0.3 }
  },
  {
    id: "motherboard",
    name: "Motherboard",
    subtitle: "ASUS Prime X570 PBR",
    category: "Papan Sirkuit Utama",
    icon: "🔲",
    modelFile: "/3d/x570_prime_motherboard_hq_pbr.glb",
    bootRole: "WAJIB (Kritis)",
    bootBadge: "critical",
    tagline: "Pondasi utama yang menghubungkan dan mengalirkan data ke semua komponen.",
    explanation: {
      fungsi: "Menghubungkan CPU, RAM, GPU, Storage, dan PSU agar dapat saling berkomunikasi.",
      syaratBoot: "Komputer mati total jika motherboard rusak atau sirkuit dayanya terputus.",
      posisi: "Dipasang di dalam casing komputer dengan baut penopang (standoff).",
      tips: "Memiliki chipset (X570), slot PCIe untuk VGA, slot DIMM untuk RAM, dan port I/O belakang."
    },
    specs: [
      { label: "Chipset", value: "AMD X570" },
      { label: "Slot PCIe", value: "PCIe 4.0 x16" },
      { label: "Slot Memori", value: "4x DDR4 DIMM" }
    ],
    cameraOffset: { x: 0, y: 0.5, z: 1.2 }
  },
  {
    id: "ram",
    name: "Memori RAM",
    subtitle: "Kingston HyperX Fury DDR4",
    category: "Memori Utama",
    icon: "⚡",
    modelFile: "/3d/kingston_hyperx_fury_black_ram_module.glb",
    bootRole: "WAJIB (Kritis)",
    bootBadge: "critical",
    tagline: "Penyimpanan data sementara kecepatan tinggi saat program berjalan.",
    explanation: {
      fungsi: "Menyimpan data dan instruksi aktif sementara agar CPU bisa mengaksesnya secara instan.",
      syaratBoot: "Tanpa RAM, komputer gagal POST, monitor blank hitam, dan biasanya berbunyi beep panjang berulang.",
      posisi: "Ditancapkan ke slot DIMM motherboard hingga terdengar bunyi 'klik' dari pengaitnya.",
      tips: "Gunakan konfigurasi Dual-Channel (slot 2 & 4) untuk kecepatan transfer maksimal."
    },
    specs: [
      { label: "Tipe Memori", value: "DDR4 SDRAM" },
      { label: "Pendingin", value: "Aluminium Heat Spreader" },
      { label: "Sifat Data", value: "Volatile (hilang saat mati)" }
    ],
    cameraOffset: { x: 0, y: 0.2, z: 0.4 }
  },
  {
    id: "gpu",
    name: "Kartu Grafis (GPU/VGA)",
    subtitle: "ASUS ROG Strix RTX 4090",
    category: "Pengolah Grafis",
    icon: "🎮",
    modelFile: "/3d/asus_rog_geforce_rtx_4090_v2.0.glb",
    bootRole: "WAJIB (Untuk Tampilan Layar)",
    bootBadge: "warning",
    tagline: "Mengolah jutaan piksel visual dan mengirimkan output gambar ke layar monitor.",
    explanation: {
      fungsi: "Merender gambar 2D/3D, video, dan antarmuka OS untuk ditampilkan ke monitor.",
      syaratBoot: "Jika CPU tidak punya kartu grafis terintegrasi (iGPU), VGA diskrit wajib ada agar layar tidak blank hitam.",
      posisi: "Dipasang ke slot PCIe x16 motherboard dan dikunci dengan sekrup di bracket casing.",
      tips: "Memiliki kipas pendingin besar dan memerlukan kabel daya tambahan (12VHPWR/PCIe 8-pin)."
    },
    specs: [
      { label: "Arsitektur", value: "NVIDIA Ada Lovelace" },
      { label: "Pendingin", value: "Triple Axial-tech Fans" },
      { label: "Interface", value: "PCIe 4.0 x16" }
    ],
    cameraOffset: { x: 0, y: 0.3, z: 0.8 }
  },
  {
    id: "psu",
    name: "Power Supply (PSU)",
    subtitle: "Corsair HX1000 Modular",
    category: "Catu Daya Listrik",
    icon: "🔌",
    modelFile: "/3d/m1000_inspired_by_corsair_hx1000_free.glb",
    bootRole: "WAJIB (Kritis)",
    bootBadge: "critical",
    tagline: "Mengubah arus listrik AC PLN menjadi arus DC yang stabil untuk semua komponen.",
    explanation: {
      fungsi: "Menyuplai tegangan listrik DC (+12V, +5V, +3.3V) ke seluruh komponen PC.",
      syaratBoot: "Tanpa PSU yang sehat, komputer mati total tanpa tanda-tanda kehidupan.",
      posisi: "Dipasang di bagian bawah/atas casing komputer dengan kipas pembuang panas mengarah ke luar.",
      tips: "Model Modular memudahkan merapikan kabel karena hanya kabel yang terpakai yang dipasang."
    },
    specs: [
      { label: "Daya Output", value: "1000 Watt" },
      { label: "Kabel", value: "Full Modular" },
      { label: "Tegangan", value: "+12V, +5V, +3.3V DC" }
    ],
    cameraOffset: { x: 0, y: 0.2, z: 0.6 }
  },
  {
    id: "storage",
    name: "Media Penyimpanan (Storage)",
    subtitle: "SSD NVMe M.2 & Hard Disk (HDD)",
    category: "Penyimpanan Data",
    icon: "💾",
    modelFile: "/3d/storage_ssd_hdd_m.2.glb",
    bootRole: "Wajib untuk Masuk Windows/OS",
    bootBadge: "primary",
    tagline: "Tempat menyimpan Sistem Operasi (Windows/Linux), aplikasi, dan seluruh data pengguna secara permanen.",
    explanation: {
      fungsi: "Menyimpan file sistem dan data permanen. SSD M.2 memberikan kecepatan transfer super cepat, sedangkan HDD menyediakan ruang kapasitas besar.",
      syaratBoot: "Tanpa storage, komputer hanya dapat menyala sampai BIOS dan tidak bisa masuk ke Windows/OS.",
      posisi: "SSD M.2 terpasang langsung di slot motherboard, sedangkan HDD 3.5\" terpasang pada rak casing dengan kabel SATA.",
      tips: "Kombinasi ideal: SSD NVMe untuk OS & aplikasi penting, HDD untuk arsip file besar."
    },
    specs: [
      { label: "Tipe Storage", value: "M.2 NVMe SSD + 3.5\" SATA HDD" },
      { label: "Kecepatan SSD", value: "Hingga 5000+ MB/s (NAND Flash)" },
      { label: "Kapasitas HDD", value: "Piringan Magnetik 1TB - 4TB+" }
    ],
    cameraOffset: { x: 0, y: 0.2, z: 0.6 }
  }
];



