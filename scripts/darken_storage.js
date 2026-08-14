import fs from 'fs';

const glbPath = 'public/3d/storage_ssd_hdd_m.2.glb';
const file = fs.readFileSync(glbPath);

// Parse GLB Header
const magic = file.readUInt32LE(0);
const version = file.readUInt32LE(4);
const length = file.readUInt32LE(8);
const jsonLength = file.readUInt32LE(12);
const jsonChunkType = file.readUInt32LE(16);

let jsonStr = file.toString('utf8', 20, 20 + jsonLength);
const gltf = JSON.parse(jsonStr);

console.log('Original Materials:', JSON.stringify(gltf.materials, null, 2));

// Update Materials for Dark Iron / Cast Steel Finish
if (gltf.materials) {
  gltf.materials.forEach((mat) => {
    const name = mat.name || '';
    
    // 1. HDD Metal Chassis & Top Lid (Material.002, Material.003, Material.004)
    if (name === 'Material.002' || name === 'Material.003' || name === 'Material.004') {
      mat.pbrMetallicRoughness = mat.pbrMetallicRoughness || {};
      mat.pbrMetallicRoughness.baseColorFactor = [0.14, 0.16, 0.18, 1.0]; // Deep gunmetal iron steel
      mat.pbrMetallicRoughness.metallicFactor = 0.92;
      mat.pbrMetallicRoughness.roughnessFactor = 0.32;
    }
    
    // 2. HDD White Sticker Label (Material.001)
    if (name === 'Material.001') {
      mat.pbrMetallicRoughness = mat.pbrMetallicRoughness || {};
      mat.pbrMetallicRoughness.baseColorFactor = [0.62, 0.62, 0.62, 1.0]; // Subdued anti-glare white label
      mat.pbrMetallicRoughness.roughnessFactor = 0.45;
      mat.pbrMetallicRoughness.metallicFactor = 0.05;
    }

    // 3. Samsung SSD & M.2 (Material, Material.006 - 010)
    if (name === 'Material' || name.startsWith('Material.00')) {
      mat.pbrMetallicRoughness = mat.pbrMetallicRoughness || {};
      if (mat.pbrMetallicRoughness.baseColorTexture && !mat.pbrMetallicRoughness.baseColorFactor) {
        mat.pbrMetallicRoughness.baseColorFactor = [0.75, 0.75, 0.75, 1.0];
      }
    }
  });
}

// Re-serialize JSON chunk
let newJsonStr = JSON.stringify(gltf);
// Align to 4-byte boundary with spaces
while (newJsonStr.length % 4 !== 0) {
  newJsonStr += ' ';
}

const newJsonBuffer = Buffer.from(newJsonStr, 'utf8');
const binaryChunk = file.subarray(20 + jsonLength);

// Create new GLB Header
const newTotalLength = 12 + 8 + newJsonBuffer.length + binaryChunk.length;
const newHeader = Buffer.alloc(20);
newHeader.writeUInt32LE(magic, 0);
newHeader.writeUInt32LE(version, 4);
newHeader.writeUInt32LE(newTotalLength, 8);
newHeader.writeUInt32LE(newJsonBuffer.length, 12);
newHeader.writeUInt32LE(jsonChunkType, 16);

const finalGlb = Buffer.concat([newHeader, newJsonBuffer, binaryChunk]);
fs.writeFileSync('public/3d/storage_ssd_hdd_m.2.glb', finalGlb);
fs.writeFileSync('3d/storage_ssd_hdd_m.2.glb', finalGlb);

console.log(`Successfully updated storage model to Dark Steel Metallic finish! Total Size: ${finalGlb.length} bytes`);
