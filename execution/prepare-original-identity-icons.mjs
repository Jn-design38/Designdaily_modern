/** Faithful monochrome derivatives of the owner's original Noréa and Fresh Paws art. */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const folio = join(root, '..', 'Designdaily Assets', 'LOGO FOLIO');

async function saveIcon(source, name, pinkOnly = false) {
  const { data, info } = await source.flatten({ background: '#fff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const ink = pinkOnly ? data[i] - data[i + 1] : 255 - Math.min(data[i], data[i + 1], data[i + 2]);
    rgba[j] = rgba[j + 1] = rgba[j + 2] = 255;
    rgba[j + 3] = Math.max(0, Math.min(255, (ink - (pinkOnly ? 20 : 12)) * 2.2));
  }
  const icon = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: '#00000000', threshold: 2 })
    .resize({ width: 360, height: 360, fit: 'contain', position: 'centre', background: '#00000000' })
    .extend({ top: 76, bottom: 76, left: 76, right: 76, background: '#00000000' })
    .png().toBuffer();
  await sharp(icon).toFile(join(root, 'public', 'logo-loop', `${name}.png`));
  if (pinkOnly) await sharp(icon).negate({ alpha: false }).png().toFile(join(root, 'public', 'logo-loop', `${name}-black.png`));
}
const norea = await sharp(join(folio, '1. Norea Logo.jpg')).resize(1600, 1200).png().toBuffer();
await saveIcon(sharp(norea).extract({ left: 715, top: 265, width: 170, height: 355 }), 'norea-original');
await saveIcon(sharp(join(folio, 'freshpaws logo icon.png')), 'fresh-paws-original', true);
