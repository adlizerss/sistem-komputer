import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, weld, simplify, dedup, resample, prune } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import fs from 'fs';
import path from 'path';

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    'draco3d.decoder': await draco3d.createDecoderModule(),
    'draco3d.encoder': await draco3d.createEncoderModule(),
  });

const dir = path.resolve('public/3d');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.glb'));

console.log(`Starting compression on ${files.length} GLB files...`);

for (const file of files) {
  const filePath = path.join(dir, file);
  const initialSize = fs.statSync(filePath).size;

  try {
    console.log(`Optimizing ${file} (${(initialSize / (1024 * 1024)).toFixed(2)} MB)...`);
    const document = await io.read(filePath);

    // Apply optimization pipeline
    await document.transform(
      dedup(),
      prune(),
      weld({ tolerance: 0.0001 }),
      resample(),
      draco({
        quantizePosition: 14,
        quantizeNormal: 10,
        quantizeTexcoord: 12,
        quantizeColor: 8,
        quantizeGeneric: 12
      })
    );

    await io.write(filePath, document);
    const finalSize = fs.statSync(filePath).size;
    const savings = (((initialSize - finalSize) / initialSize) * 100).toFixed(1);
    console.log(`✓ ${file}: ${(finalSize / (1024 * 1024)).toFixed(2)} MB (Hemat ${savings}%)`);
  } catch (err) {
    console.error(`Error compressing ${file}:`, err.message);
  }
}

console.log("All GLB models compressed successfully!");
