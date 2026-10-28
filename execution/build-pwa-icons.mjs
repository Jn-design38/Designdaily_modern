/**
 * Build deterministic Home Screen icons from the existing Design Daily mark.
 * The maskable icon keeps the mark inside the platform safe zone.
 */
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = fileURLToPath(new URL('../public/agency-icon.svg', import.meta.url));
const outputDir = fileURLToPath(new URL('../public/pwa/', import.meta.url));
const svg = await readFile(source, 'utf8');
const whiteMark = svg.replace('<path ', '<path fill="#f4f4f7" ');

await mkdir(outputDir, { recursive: true });

async function buildIcon(filename, size, markScale) {
  const markSize = Math.round(size * markScale);
  const mark = await sharp(Buffer.from(whiteMark))
    .resize(markSize, markSize, { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: '#0b0c11',
    },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(fileURLToPath(new URL(`../public/pwa/${filename}`, import.meta.url)));
}

await Promise.all([
  buildIcon('apple-touch-icon.png', 180, 0.62),
  buildIcon('icon-192.png', 192, 0.62),
  buildIcon('icon-512.png', 512, 0.62),
  buildIcon('icon-maskable-512.png', 512, 0.5),
]);

console.log('Built Design Daily Home Screen icons in public/pwa/.');
