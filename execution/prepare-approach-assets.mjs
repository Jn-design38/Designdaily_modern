/**
 * Validates and compresses the four transparent Approach assets.
 * Source PNGs live in .tmp/approach-source by default and remain uncommitted.
 */
import { mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = resolve(process.env.APPROACH_SOURCE_DIR || join(projectRoot, '.tmp/approach-source'));
const outputRoot = join(projectRoot, 'public/approach');
const names = ['brief', 'direction', 'create', 'deliver'];

await mkdir(outputRoot, { recursive: true });

const results = await Promise.all(names.map(async name => {
  const input = join(sourceRoot, `approach-${name}.png`);
  const output = join(outputRoot, `approach-${name}.webp`);
  const metadata = await sharp(input).metadata();
  if (!metadata.hasAlpha) throw new Error(`${input} does not contain transparency.`);
  if (Math.min(metadata.width || 0, metadata.height || 0) < 1000) {
    throw new Error(`${input} is below the 1000px high-resolution floor.`);
  }

  const written = await sharp(input)
    .resize({
      width: 1536,
      height: 1536,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(output);

  return {
    name,
    source: { width: metadata.width, height: metadata.height, hasAlpha: metadata.hasAlpha },
    output: { width: written.width, height: written.height, bytes: written.size }
  };
}));

console.log(JSON.stringify(results, null, 2));
