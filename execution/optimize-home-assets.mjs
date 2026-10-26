import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');

const jobs = [
  ['all-organics-outdoor-advertising.png', 'optimized/home/all-organics-outdoor-advertising.webp', 800],
  ['artboard-1-dd-social.png', 'optimized/home/artboard-1-dd-social.webp', 800],
  ['tripty-logo-sketch.png', 'optimized/home/tripty-logo-sketch.webp', 800],
  ['artboard-1-aves-social.png', 'optimized/home/artboard-1-aves-social.webp', 800],
  ['tripty-detail-b.png', 'optimized/home/tripty-detail-b.webp', 800],
  ['covers/social-tripty-campaign.jpg', 'optimized/covers/social-tripty-campaign.webp', 1600],
  ['covers/brand-identity-norea.jpg', 'optimized/covers/brand-identity-norea.webp', 1600],
  ['covers/brand-identity-atuendo.jpg', 'optimized/covers/brand-identity-atuendo.webp', 1600],
  ['covers/brand-identity-sandbox-lounge.jpg', 'optimized/covers/brand-identity-sandbox-lounge.webp', 1600],
  ['covers/packaging-finn-gift-box.jpg', 'optimized/covers/packaging-finn-gift-box.webp', 1600],
  ['covers/tshirt-zaro-activewear.jpg', 'optimized/covers/tshirt-zaro-activewear.webp', 1600],
  ['covers/tshirt-goodybro-create-goodness.jpg', 'optimized/covers/tshirt-goodybro-create-goodness.webp', 1600],
  ['covers/social-aves-real-estate.jpg', 'optimized/covers/social-aves-real-estate.webp', 1600],
  ['covers/SEOR.png', 'optimized/covers/seor.webp', 1600],
  ['covers/social-applegears-campaign.png', 'optimized/covers/social-applegears-campaign.webp', 1600]
];

for (const [source, output, width] of jobs) {
  const target = path.join(publicDir, output);
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(path.join(publicDir, source))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(target);
  const metadata = await sharp(target).metadata();
  process.stdout.write(`${output}: ${metadata.width}x${metadata.height}\n`);
}
