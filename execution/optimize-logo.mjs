/**
 * Reproducible web derivative of the user's Design Daily GLB. Source stays intact.
 * Run from any directory: node execution/optimize-logo.mjs
 * Build-only dependencies: @gltf-transform/{core,extensions,functions}, meshoptimizer.
 * No Draco decoder, CDN, external texture, or environment asset is required at runtime.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, meshopt, simplify, weld, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';

const input = fileURLToPath(new URL('../public/agency-logo-3d.glb', import.meta.url));
const output = fileURLToPath(new URL('../public/agency-logo-web.glb', import.meta.url));
const expectedHash = '4e403c3b1a2c70121f9b1ffe1c0678a5cef2d22604725270bc17765eb9408753';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const source = await readFile(input);
if (hash(source) !== expectedHash) throw new Error('Source GLB differs from the verified user asset. Review provenance before regenerating.');

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const document = await io.readBinary(new Uint8Array(source));
const stats = doc => {
  let triangles = 0;
  let vertices = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const primitive of mesh.listPrimitives()) {
      const count = primitive.getAttribute('POSITION').getCount();
      vertices += count;
      triangles += (primitive.getIndices()?.getCount() ?? count) / 3;
    }
  }
  return { triangles, vertices };
};
const before = stats(document);
await MeshoptSimplifier.ready;
await document.transform(
  dedup(),
  weld(),
  // Limit geometric error to 0.05%; retain original UVs, vertex colors and texture.
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.24, error: 0.0005 }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 88 }),
  meshopt({ encoder: MeshoptEncoder, level: 'high', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 14, quantizeColor: 8 }),
  prune(),
);
const bytes = await io.writeBinary(document);
if (bytes.length >= source.length) throw new Error('Optimization did not reduce asset size; output not written.');
// Round-trip the generated GLB before replacing the derivative.
const verified = await io.readBinary(bytes);
const after = stats(verified);
if (!after.triangles || after.triangles > before.triangles) throw new Error('Unexpected optimized geometry.');
await writeFile(output, bytes);
console.log(JSON.stringify({ input, output, sourceSha256: hash(source), outputSha256: hash(bytes), sourceBytes: source.length, outputBytes: bytes.length, reductionPercent: +(100 * (1 - bytes.length / source.length)).toFixed(2), before, after }, null, 2));
