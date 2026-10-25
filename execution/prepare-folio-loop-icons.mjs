/** Extract verified marks from the supplied folio; existing correct icons are never rewritten. */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const folio = join(root, '..', 'Designdaily Assets', 'LOGO FOLIO');
const output = join(root, 'public', 'logo-loop');
// Crop coordinates refer to a 1600 × 1200 review of each original folio sheet.
const marks = [
  ['seor', 'LOGO B&W#RAW_1.png', [685, 30, 255, 235]],
  ['tripty', 'LOGO B&W#RAW_1.png', [65, 45, 390, 290]],
  ['slaz', 'LOGO B&W#RAW_1.png', [1150, 75, 180, 193]],
  ['oxymoron', 'LOGO B&W#RAW_1.png', [100, 455, 290, 245]],
  ['roasted', 'LOGO B&W#RAW_1.png', [1250, 455, 245, 245]],
  ['shaad', 'LOGO B&W#RAW_1.png', [75, 880, 370, 305]],
  ['daily-bites', 'LOGO B&W#RAW_1.png', [670, 895, 260, 158]],
  ['naogaon-rice', 'LOGO B&W#RAW_1.png', [1145, 890, 140, 242]],
  ['aves', 'LOGO B&W#RAW_2.png', [60, 125, 402, 185]],
  ['gear-nexus', 'LOGO B&W#RAW_2.png', [730, 95, 145, 120]],
  ['car-gears', 'LOGO B&W#RAW_2.png', [1140, 215, 130, 85]],
  ['triduate', 'LOGO B&W#RAW_2.png', [65, 625, 106, 115]],
  ['noor', 'LOGO B&W#RAW_2.png', [645, 425, 380, 290]],
  ['tunes-360', 'LOGO B&W#RAW_2.png', [1140, 555, 395, 190]],
  ['todays-deals', 'LOGO B&W#RAW-03.png', [65, 125, 390, 150]],
  ['chara-holiday', 'LOGO B&W#RAW-03.png', [730, 70, 140, 140]],
  ['mave', 'LOGO B&W#RAW-03.png', [1140, 125, 150, 155]],
  ['batg', 'LOGO B&W#RAW-03.png', [110, 505, 300, 210]],
  ['big-panda', 'LOGO B&W#RAW-03.png', [675, 450, 225, 325]],
  ['my-limitless-idea', 'LOGO B&W#RAW-03.png', [1210, 450, 260, 330]],
  ['floral-commerce', 'LOGO B&W#RAW-03.png', [65, 955, 395, 170]],
  ['zelo', 'LOGO B&W#RAW-03.png', [615, 905, 370, 255]],
  ['progista', 'LOGO B&W#RAW-03.png', [1145, 985, 110, 140]],
];

await mkdir(output, { recursive: true });
const sheets = new Map();
for (const [, file] of marks) {
  if (!sheets.has(file)) sheets.set(file, await sharp(join(folio, file)).resize(3200, 2400).png().toBuffer());
}
for (const [name, file, crop] of marks) {
  const [left, top, width, height] = crop.map(v => v * 2);
  const { data, info } = await sharp(sheets.get(file)).extract({ left, top, width, height })
    .flatten({ background: '#fff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const ink = 255 - Math.min(data[i], data[i + 1], data[i + 2]);
    rgba[j] = rgba[j + 1] = rgba[j + 2] = 255;
    rgba[j + 3] = Math.max(0, Math.min(255, (ink - 12) * 2.2));
    // Remove adjacent wordmark fragments where a slanted icon overlaps its text column.
    const x = left / 2 + (i / 3 % info.width) / 2;
    const y = top / 2 + Math.floor(i / 3 / info.width) / 2;
    if (name === 'slaz' && x >= 1290 && y >= 180) rgba[j + 3] = 0;
    if (name === 'triduate' && x >= 145 && y >= 674) rgba[j + 3] = 0;
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: '#00000000', threshold: 2 })
    .resize({ width: 360, height: 360, fit: 'contain', background: '#00000000' })
    .extend({ top: 76, bottom: 76, left: 76, right: 76, background: '#00000000' })
    .png({ compressionLevel: 9 }).toFile(join(output, `${name}.png`));
  console.log(name);
}
