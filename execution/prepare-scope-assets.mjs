import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import sharp from 'sharp';

const source = fileURLToPath(new URL('../../Designdaily Assets/Website Images 2026-10-22/Transparent Visuals/', import.meta.url));
const output = fileURLToPath(new URL('../public/scope/', import.meta.url));
await mkdir(output, { recursive: true });
for (const name of ['monthly-content-calendar-transparent', 'applegears-social-campaign', 'tripty-packaging']) {
  const result = await sharp(join(source, `${name}.png`))
    .rotate()
    .resize({ width: 1440, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(join(output, `${name}.webp`));
  const metadata = await sharp(join(output, `${name}.webp`)).metadata();
  console.log(JSON.stringify({ name, bytes: result.size, width: result.width, height: result.height, hasAlpha: metadata.hasAlpha }));
}
