/**
 * Creates monochrome transparent logo-loop icons from the verified portfolio artwork.
 * The original files remain unchanged; outputs are deterministic web derivatives.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputRoot = join(projectRoot, 'public', 'logo-loop');

const marks = [
  { name: 'norea', input: 'public/work/norea/02.webp', crop: { left: 685, top: 165, width: 250, height: 340 } },
  { name: 'all-organics', input: 'public/work/all-organics/02.webp', crop: { left: 390, top: 350, width: 260, height: 360 } },
  { name: 'atuendo', input: 'public/work/atuendo/02.webp', crop: { left: 430, top: 335, width: 740, height: 530 } },
  { name: 'sandbox', input: '../Designdaily Assets/Brand Identity/Sandbox Lounge Branding/Logo concept.png', crop: { left: 685, top: 610, width: 220, height: 205 }, threshold: 62, gain: 2.6 },
];

const clamp = value => Math.max(0, Math.min(255, value));

await mkdir(outputRoot, { recursive: true });

const results = [];
for (const mark of marks) {
  const source = join(projectRoot, mark.input);
  const { data, info } = await sharp(source)
    .extract(mark.crop)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let sourceIndex = 0, outputIndex = 0; sourceIndex < data.length; sourceIndex += 3, outputIndex += 4) {
    const distanceFromWhite = Math.max(255 - data[sourceIndex], 255 - data[sourceIndex + 1], 255 - data[sourceIndex + 2]);
    const alpha = clamp((distanceFromWhite - (mark.threshold ?? 14)) * (mark.gain ?? 1.8));
    rgba[outputIndex] = 255;
    rgba[outputIndex + 1] = 255;
    rgba[outputIndex + 2] = 255;
    rgba[outputIndex + 3] = alpha;
  }

  const output = join(outputRoot, `${mark.name}.png`);
  const written = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
    .resize({ width: 360, height: 360, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 76, bottom: 76, left: 76, right: 76, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);

  results.push({ name: mark.name, output, width: written.width, height: written.height, bytes: written.size });
}

console.log(JSON.stringify(results, null, 2));
