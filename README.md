# 🖥️ SISTEM KOMPUTER 3D — Media Pembelajaran Hardware Interaktif

Media pembelajaran interaktif berbasis web 3D (*Three.js & WebGL*) untuk mempelajari arsitektur fisik perangkat keras komputer (*hardware*) dengan navigasi 360° ala Sketchfab, penjelasan komprehensif, dan arena kuis visual interaktif.

---

## ✨ Fitur Utama

- 🏠 **Menu Utama Sinematik**: Latar belakang 3D Set PC Gaming & Monitor yang berputar otomatis dengan navigasi minimalis terpusat.
- 📚 **Pembahasan 6 Komponen Inti**:
  - 🧠 **Processor (CPU)** — AMD Ryzen AM4 dengan detail pin emas dan IHS.
  - 🖲️ **Motherboard (Papan Induk)** — ASUS Prime X570 dengan slot PCIe, RAM, chipset, dan socket AM4.
  - ⚡ **Memori RAM** — Kingston HyperX DDR4 dengan heatsink aluminium.
  - 🎮 **Kartu Grafis (GPU/VGA)** — ASUS ROG Strix GeForce RTX 4090 triple fan.
  - 🔌 **Power Supply (PSU)** — Corsair HX1000 Full Modular.
  - 💾 **Media Penyimpanan (Storage)** — Kombinasi M.2 NVMe SSD, 2.5" SATA SSD, dan 3.5" HDD BarraCuda.
- 🎯 **Kuis Interaktif 3D**: Uji pemahaman dengan mengamati dan menebak model 3D langsung di layar disertai sistem skor dan selebrasi.
- 🕹️ **Kontrol 3D Tingkat Lanjut (Sketchfab-Style)**:
  - Rotasi orbit 360° top-to-bottom tanpa batasan sudut.
  - Smooth inertia damping & pinch-to-zoom di layar sentuh / mouse wheel.
  - *Double-click / double-tap focus* ke titik komponen.
  - Efek kemunculan objek *smooth scale pop-in* dari kecil ke besar.
  - Mode wireframe, preset pencahayaan studio, dan tangkapan layar HD.
- ⚡ **Optimasi Performa Super Cepat**:
  - *Silent Background Preload*: Semua model 3D diunduh di latar belakang sehingga perpindahan komponen berlangsung instan (0 detik).
  - *Draco Compression*: Ukuran aset 3D terkompresi secara optimal sehingga sangat ringan di perangkat *low-spec* (Laptop/HP).

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/adlizerss/sistem-komputer.git
   cd sistem-komputer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan dev server:**
   ```bash
   npm run dev
   ```

4. Buka di browser:
   👉 `http://localhost:5173/` atau `http://localhost:5174/`

---

## 🛠️ Teknologi yang Digunakan

- **Vite** — Fast modern frontend build tool.
- **Three.js & WebGL** — 3D rendering engine, PBR shaders, RoomEnvironment.
- **OrbitControls & DracoLoader** — Smooth touch controls & compressed 3D meshes.
- **Canvas Confetti** — Efek selebrasi kuis.
- **Vanilla CSS & Glassmorphism** — Desain UI modern cyber-dark.
