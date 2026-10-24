/**
 * Builds the web-ready Studio Range image set from the retained generated masters.
 */
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const masterRoot = fileURLToPath(new URL('../assets/generated/studio-range/', import.meta.url));
const outputRoot = fileURLToPath(new URL('../public/prelude/', import.meta.url));

const assets = [
  ['campaigns-summer-launch-v2-master.png', 'campaigns-summer-launch-v2.webp'],
  ['brand-extensions-system-v2-master.png', 'brand-extensions-system-v2.webp'],
  ['merchandise-dhaka-editorial-v2-master.png', 'merchandise-dhaka-editorial-v2.webp']
];

await mkdir(outputRoot, { recursive: true });

const outputs = await Promise.all(
  assets.map(async ([source, output]) => {
    const result = await sharp(`${masterRoot}${source}`, { limitInputPixels: false })
      .rotate()
      .resize({ width: 1448, height: 1086, fit: 'cover', position: 'centre' })
      .webp({ quality: 88, smartSubsample: true, effort: 6 })
      .toFile(`${outputRoot}${output}`);

    return { source, output, bytes: result.size, width: result.width, height: result.height };
  })
);

console.log(JSON.stringify(outputs, null, 2));
