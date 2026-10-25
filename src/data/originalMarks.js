const originalMarks = [
  {
    src: '/logo-loop/norea-original.png',
    alt: 'Noréa fashion identity logo',
    title: 'Noréa',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/all-organics.png',
    alt: 'All Organics leaf identity logo',
    title: 'All Organics',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/atuendo.png',
    alt: 'Atuendo fashion identity symbol',
    title: 'Atuendo',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/sandbox.png',
    alt: 'Sandbox Lounge identity guidelines',
    title: 'Sandbox Lounge',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/alloy.png',
    alt: 'Alloy identity symbol',
    title: 'Alloy',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/aura.png',
    alt: 'Aura identity symbol',
    title: 'Aura',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/apple-gears.png',
    alt: 'Apple Gears identity symbol',
    title: 'Apple Gears',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/finn.png',
    alt: 'Finn identity monogram',
    title: 'Finn',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/fresh-paws-original.png',
    alt: 'Fresh Paws identity symbol',
    title: 'Fresh Paws',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/monarch.png',
    alt: 'Monarch identity crown',
    title: 'Monarch',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/seor.png',
    alt: 'Seor identity seal',
    title: 'Seor',
    width: 512,
    height: 512,
  },
  {
    src: '/logo-loop/steller.png',
    alt: 'Steller identity symbol',
    title: 'Steller',
    width: 512,
    height: 512,
  },
];

// Additional identities verified against the owner's LOGO FOLIO sheets.
const folioMarks = [
  ['tripty', 'Tripty'],
  ['slaz', 'Slaz'],
  ['oxymoron', 'Oxymoron'],
  ['roasted', 'Roasted'],
  ['shaad', 'Shaad'],
  ['daily-bites', 'DailyBites'],
  ['naogaon-rice', 'Naogaon Rice'],
  ['aves', 'Aves'],
  ['gear-nexus', 'Gear Nexus'],
  ['car-gears', 'Car Gears'],
  ['triduate', 'Triduate'],
  ['noor', 'Noor Lifestyles'],
  ['tunes-360', 'Tunes 360'],
  ['todays-deals', "Today's Deals"],
  ['chara-holiday', 'Chara Holiday'],
  ['mave', 'Mave'],
  ['batg', 'BATG'],
  ['big-panda', 'Big Panda Studios'],
  ['my-limitless-idea', 'My Limitless Idea'],
  ['floral-commerce', 'Floral commerce identity'],
  ['zelo', 'Zelo'],
  ['progista', 'Progista'],
];

originalMarks.push(...folioMarks.map(([slug, name]) => ({
  src: `/logo-loop/${slug}.png`,
  alt: `${name} logo`,
  title: name,
  width: 512,
  height: 512,
})));

// Keep the small hero strip focused on substantial, readable silhouettes.
// The complete inventory and original artwork remain available above.
const heroMarkSlugs = new Set([
  'norea-original', 'all-organics', 'atuendo', 'sandbox', 'aura',
  'apple-gears', 'fresh-paws-original', 'monarch', 'steller', 'slaz',
  'daily-bites', 'car-gears', 'triduate', 'batg',
  'seor', 'roasted', 'tripty', 'noor', 'tunes-360', 'aves',
]);

export default originalMarks.filter(mark => heroMarkSlugs.has(mark.src.split('/').pop().replace('.png', '')));
