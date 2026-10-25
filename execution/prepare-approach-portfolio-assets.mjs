/**
 * Creates web-ready Approach assets from the six user-selected portfolio files.
 * Originals remain unchanged in the shared Design Daily asset archive.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const assetRoot = join(projectRoot, '..', 'Designdaily Assets', 'Brand Identity');
const outputRoot = join(projectRoot, 'public', 'approach', 'portfolio');

const assets = [
  {
    name: 'sketch-all-organics',
    input: join(assetRoot, 'All Organics', 'Cover Set 2026-10-15', '01-logo-sketch.png'),
    width: 1120,
  },
  {
    name: 'sketch-atuendo',
    input: join(assetRoot, 'Atuendo Brand Identity', 'Cover Set 2026-10-15', '01-logo-sketch.png'),
    width: 1120,
  },
  {
    name: 'sketch-norea',
    input: join(assetRoot, 'Norea Brand Identity', 'Cover Set 2026-10-15', '01-logo-sketch.png'),
    width: 1120,
  },
  {
    name: 'build-all-organics',
    input: join(assetRoot, 'All Organics', 'Standalone Covers', 'Middle image.png'),
    width: 1600,
  },
  {
    name: 'build-atuendo',
    input: join(assetRoot, 'Atuendo Brand Identity', 'Standalone Covers', 'Right Image 2.png'),
    width: 1600,
  },
  {
    name: 'build-norea',
    input: join(assetRoot, 'Norea Brand Identity', 'Cover Set 2026-10-15', '02-main-cover.png'),
    width: 1600,
  },
];

await mkdir(outputRoot, { recursive: true });

const results = [];
for (const asset of assets) {
  const metadata = await sharp(asset.input).metadata();
  const output = join(outputRoot, `${asset.name}.webp`);
  const written = await sharp(asset.input)
    .rotate()
    .resize({ width: asset.width, withoutEnlargement: true })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(output);

  results.push({
    name: asset.name,
    source: { width: metadata.width, height: metadata.height },
    output: { width: written.width, height: written.height, bytes: written.size },
  });
}

console.log(JSON.stringify(results, null, 2));
