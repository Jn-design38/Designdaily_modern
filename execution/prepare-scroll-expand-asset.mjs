/**
 * Prepares the generated ScrollExpand artwork for production delivery.
 * The source stays in .tmp and is intentionally not committed.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const source = process.argv[2] || join(projectRoot, '.tmp', 'scroll-expand-brand-thread-source.png');
const outputRoot = join(projectRoot, 'public', 'scroll-expand');
const output = join(outputRoot, process.argv[3] || 'brand-thread-v1.webp');

await mkdir(outputRoot, { recursive: true });

const input = await sharp(source).metadata();
if ((input.width || 0) < 1400 || (input.height || 0) < 900) {
  throw new Error(`Generated source is below the required section-image floor: ${input.width}x${input.height}`);
}

const written = await sharp(source)
  .rotate()
  .webp({ quality: 92, effort: 6, smartSubsample: true })
  .toFile(output);

console.log(JSON.stringify({
  source: { width: input.width, height: input.height, format: input.format },
  output: { path: output, width: written.width, height: written.height, bytes: written.size },
}, null, 2));
