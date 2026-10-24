/**
 * Rebuilds the compact WebP assets used by StudioPrelude from the user's image library.
 * Override DESIGN_DAILY_WEBSITE_IMAGES when the library lives somewhere else.
 */
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const defaultLibrary = fileURLToPath(new URL('../../Designdaily Assets/Website Images 2026-10-22/', import.meta.url));
const sourceRoot = process.env.DESIGN_DAILY_WEBSITE_IMAGES || defaultLibrary;
const outputRoot = fileURLToPath(new URL('../public/prelude/', import.meta.url));

const assets = [
  ['1920x1080 Web JPG Covers/packaging-ngr-rice.jpg', 'packaging-ngr-rice.webp', false],
  ['1920x1080 Web JPG Covers/social-seor-feeding-set.jpg', 'social-seor-feeding-set.webp', false],
  ['1920x1080 Web JPG Covers/packaging-applegears-card-envelope.jpg', 'packaging-applegears-card-envelope.webp', false],
  ['1920x1080 Web JPG Covers/tshirt-goodybro-chaotic-world.jpg', 'tshirt-goodybro-chaotic-world.webp', false],
  ['Transparent Visuals/zaro-bottle-packaging.png', 'zaro-bottle-packaging.webp', true],
  ['Transparent Visuals/applegears-social-campaign.png', 'applegears-social-campaign.webp', true],
  ['Transparent Visuals/goodybro-tshirt-collection.png', 'goodybro-tshirt-collection.webp', true],
  ['Transparent Visuals/all-organics-brand-world.png', 'all-organics-brand-world.webp', true]
];

await mkdir(outputRoot, { recursive: true });
const outputs = await Promise.all(assets.map(async ([source, output, transparent]) => {
  const inputPath = join(sourceRoot, source);
  const outputPath = join(outputRoot, output);
  const result = await sharp(inputPath, { limitInputPixels: false })
    .rotate()
    .resize({ width: transparent ? 1120 : 1440, withoutEnlargement: true })
    .webp({ quality: transparent ? 86 : 82, alphaQuality: 90, effort: 6 })
    .toFile(outputPath);
  return { source, output, bytes: result.size, width: result.width, height: result.height };
}));

console.log(JSON.stringify(outputs, null, 2));
