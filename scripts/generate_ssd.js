import * as THREE from 'three';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for Node.js
class NodeFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
      if (this.onload) this.onload();
    });
  }
}
global.FileReader = NodeFileReader;

const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');


// Standard M.2 2280 dimensions: 80mm long, 22mm wide, ~2.5mm thick (scale: 1 unit = 100mm)
// length = 0.80, width = 0.22, thickness = 0.012
const pcbLength = 0.80;
const pcbWidth = 0.22;
const pcbThick = 0.012;

const scene = new THREE.Scene();
const ssdGroup = new THREE.Group();
ssdGroup.name = "Samsung_980_PRO_M2_NVMe_SSD";

// 1. Materials
const pcbMat = new THREE.MeshStandardMaterial({
  color: 0x14171d, // Matte cyber black PCB
  roughness: 0.45,
  metalness: 0.15,
  side: THREE.DoubleSide
});

const goldMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37, // Real Gold pin plating
  roughness: 0.25,
  metalness: 0.95
});

const chipMat = new THREE.MeshStandardMaterial({
  color: 0x1a1c23,
  roughness: 0.35,
  metalness: 0.4
});

const controllerMat = new THREE.MeshStandardMaterial({
  color: 0xb0b8c4, // Nickel plated heat spreader controller
  roughness: 0.2,
  metalness: 0.9
});

const smdMat = new THREE.MeshStandardMaterial({
  color: 0x8a7962, // SMD Ceramic Capacitor
  roughness: 0.4,
  metalness: 0.7
});

const silverMat = new THREE.MeshStandardMaterial({
  color: 0xdde2e8,
  roughness: 0.2,
  metalness: 0.9
});

// 2. Main PCB Board
const pcbGeo = new THREE.BoxGeometry(pcbLength, pcbThick, pcbWidth);
const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
ssdGroup.add(pcbMesh);

// 3. Gold Pins at Connector End (x = +0.38)
const pinCount = 34;
const pinGroup = new THREE.Group();
for (let i = 0; i < pinCount; i++) {
  // Leave M-Key gap at index 24..27
  if (i >= 24 && i <= 27) continue;
  
  const zPos = -pcbWidth / 2 + 0.01 + (i / pinCount) * (pcbWidth - 0.02);
  const pinGeo = new THREE.BoxGeometry(0.045, pcbThick + 0.002, 0.0038);
  
  // Top pin
  const pinTop = new THREE.Mesh(pinGeo, goldMat);
  pinTop.position.set(pcbLength / 2 - 0.024, 0, zPos);
  pinGroup.add(pinTop);
}
ssdGroup.add(pinGroup);

// 4. Rear Semi-Circular Screw Notch (x = -0.40)
const notchRing = new THREE.Mesh(
  new THREE.CylinderGeometry(0.025, 0.025, pcbThick + 0.004, 16, 1, false, 0, Math.PI),
  goldMat
);
notchRing.rotation.y = -Math.PI / 2;
notchRing.position.set(-pcbLength / 2 + 0.005, 0, 0);
ssdGroup.add(notchRing);

// 5. Controller Chip (Samsung Elpis)
const ctrlGeo = new THREE.BoxGeometry(0.12, 0.014, 0.12);
const ctrlMesh = new THREE.Mesh(ctrlGeo, controllerMat);
ctrlMesh.position.set(0.18, pcbThick / 2 + 0.007, 0);
ssdGroup.add(ctrlMesh);

// 6. DRAM Cache Chip
const dramGeo = new THREE.BoxGeometry(0.08, 0.010, 0.09);
const dramMesh = new THREE.Mesh(dramGeo, chipMat);
dramMesh.position.set(0.06, pcbThick / 2 + 0.005, 0);
ssdGroup.add(dramMesh);

// 7. NAND Flash Chip 1 (1TB V-NAND)
const nand1Geo = new THREE.BoxGeometry(0.15, 0.012, 0.14);
const nand1 = new THREE.Mesh(nand1Geo, chipMat);
nand1.position.set(-0.10, pcbThick / 2 + 0.006, 0);
ssdGroup.add(nand1);

// 8. NAND Flash Chip 2
const nand2Geo = new THREE.BoxGeometry(0.15, 0.012, 0.14);
const nand2 = new THREE.Mesh(nand2Geo, chipMat);
nand2.position.set(-0.28, pcbThick / 2 + 0.006, 0);
ssdGroup.add(nand2);

// 9. SMD Capacitor & Resistor Arrays
const smdGroup = new THREE.Group();
const smdPositions = [
  // Near controller & power
  [0.26, 0.07], [0.26, -0.07], [0.27, 0.04], [0.27, -0.04],
  [0.18, 0.08], [0.18, -0.08], [0.12, 0.07], [0.12, -0.07],
  // Near DRAM
  [0.06, 0.07], [0.06, -0.07], [0.01, 0.06], [0.01, -0.06],
  // Near NAND 1
  [-0.10, 0.085], [-0.10, -0.085], [-0.19, 0.08], [-0.19, -0.08],
  // Near NAND 2
  [-0.28, 0.085], [-0.28, -0.085], [-0.36, 0.06], [-0.36, -0.06]
];

smdPositions.forEach(([x, z]) => {
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.014, 0.008, 0.009),
    smdMat
  );
  cap.position.set(x, pcbThick / 2 + 0.004, z);
  smdGroup.add(cap);

  // End caps (silver)
  const leftCap = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.009, 0.01), silverMat);
  leftCap.position.set(x - 0.006, pcbThick / 2 + 0.004, z);
  smdGroup.add(leftCap);

  const rightCap = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.009, 0.01), silverMat);
  rightCap.position.set(x + 0.006, pcbThick / 2 + 0.004, z);
  smdGroup.add(rightCap);
});
ssdGroup.add(smdGroup);

// 10. Copper Heat-Spreader Branding Label
const labelGeo = new THREE.BoxGeometry(0.38, 0.002, 0.16);
const labelMat = new THREE.MeshStandardMaterial({
  color: 0x1e222b,
  roughness: 0.3,
  metalness: 0.6
});
const labelMesh = new THREE.Mesh(labelGeo, labelMat);
labelMesh.position.set(-0.19, pcbThick / 2 + 0.013, 0);
ssdGroup.add(labelMesh);

// Add top subtle stripe accent on label (Samsung Red/Orange accent)
const stripeGeo = new THREE.BoxGeometry(0.02, 0.003, 0.16);
const stripeMat = new THREE.MeshStandardMaterial({
  color: 0xe11d48, // Ruby red 980 PRO stripe
  roughness: 0.3,
  metalness: 0.5
});
const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
stripeMesh.position.set(0.00, pcbThick / 2 + 0.014, 0);
ssdGroup.add(stripeMesh);

scene.add(ssdGroup);

// Export to GLB
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    const buffer = Buffer.from(gltf);
    fs.writeFileSync('public/3d/m2ssd_painter.glb', buffer);
    fs.writeFileSync('3d/m2ssd_painter.glb', buffer);
    console.log(`Successfully generated full M.2 2280 NVMe SSD GLB! Size: ${buffer.length} bytes`);
  },
  (error) => {
    console.error('An error occurred exporting GLB:', error);
  },
  { binary: true }
);
