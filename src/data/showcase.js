// Design Daily — Hand-Sketched Wireframe Project Sequence
// Each project has a brand name, discipline, teaser sentence, 2-3 line middle-aligned brief,
// and curated artwork references from projects.json.

export const showcaseItems = [
  {
    id: 'tripty',
    brandName: 'Tripty',
    discipline: 'Brand identity',
    teaser: 'Crafted for perfection',
    brief: 'Artisanal cafe branding, packaging, and interior identity rooted in sensory delight and hand-crafted craft.',
    projectId: 'tripty',
    featuredIndices: [0, 1, 3]
  },
  {
    id: 'all-organics',
    brandName: 'All Organics',
    discipline: 'Brand identity',
    teaser: "Let's go organic",
    brief: 'Pure botanical wellness identity built on natural textures, earth-toned packaging, and clean botanical marks.',
    projectId: 'all-organics',
    featuredIndices: [0, 2, 7]
  },
  {
    id: 'norea',
    brandName: 'Noréa',
    discipline: 'Brand identity',
    teaser: 'Modern architectural poise',
    brief: 'Architectural and interior atelier identity defined by balanced geometry, editorial layouts, and timeless typography.',
    projectId: 'norea',
    featuredIndices: [0, 1, 7]
  },
  {
    id: 'atuendo',
    brandName: 'Atuendo',
    discipline: 'Brand identity',
    teaser: 'Linen power & tailored poise',
    brief: 'Contemporary fashion and bespoke apparel branding with understated typography and monochrome luxury.',
    projectId: 'atuendo',
    featuredIndices: [0, 1, 4]
  },
  {
    id: 'sandbox',
    brandName: 'Sandbox Lounge',
    discipline: 'Brand identity',
    teaser: 'Casual luxury & warmth',
    brief: 'Hospitality and lounge branding merging playful mid-century character with modern urban aesthetics.',
    projectId: 'sandbox',
    featuredIndices: [0, 2, 4]
  },
  {
    id: 'finn',
    brandName: 'Finn',
    discipline: 'Packaging',
    teaser: 'An impression before opening',
    brief: 'Luxury black-and-silver product packaging with custom dielines, tactile unboxing, and embossed finishes.',
    projectId: 'finn',
    featuredIndices: [0, 1, 2]
  },
  {
    id: 'zaro',
    brandName: 'Zaro',
    discipline: 'Packaging',
    teaser: 'Form meets botanical function',
    brief: 'Glass bottle packaging and tactile product labels engineered for memorable shelf presence.',
    projectId: 'zaro',
    featuredIndices: [0, 3, 5]
  },
  {
    id: 'aves',
    brandName: 'Aves',
    discipline: 'Social creatives',
    teaser: 'A recognizable feed',
    brief: 'High-end real estate social campaigns featuring architectural layouts and consistent luxury tones.',
    projectId: 'aves',
    featuredIndices: [0, 1, 2]
  },
  {
    id: 'seor',
    brandName: 'Seor',
    discipline: 'Social creatives',
    teaser: 'Carry with confidence',
    brief: 'Curated social media product story with high-converting static carousel compositions and editorial angles.',
    projectId: 'seor',
    featuredIndices: [0, 3, 4]
  },
  {
    id: 'seor-sleep',
    brandName: 'Sleep Mask',
    discipline: 'Social creatives',
    teaser: 'Rest, considered',
    brief: 'Minimalist bedtime product campaign focusing on comfort, nighttime calm, and essential wellness.',
    projectId: 'seor-sleep',
    featuredIndices: [0, 1, 2]
  },
  {
    id: 'apple-gears',
    brandName: 'Apple Gears',
    discipline: 'Banners',
    teaser: 'Make the message fit the space',
    brief: 'Widescreen 16:9 banner campaigns and responsive display ads for premium accessories and phone covers.',
    projectId: 'apple-gears',
    featuredIndices: [1, 2, 3]
  },
  {
    id: 'goodybro',
    brandName: 'Goodybro',
    discipline: 'Merchandise',
    teaser: 'Wearable character',
    brief: 'Organic cotton t-shirt illustrations, graphic prints, and custom apparel badges people want to wear.',
    projectId: 'goodybro',
    featuredIndices: [0, 2, 4]
  },
  {
    id: 'atuendo-stationery',
    brandName: 'Atuendo Collateral',
    discipline: 'Stationery & brochures',
    teaser: 'Care in the smallest touchpoint',
    brief: 'Foil-stamped business cards, envelopes, and tactile correspondence systems that establish authority.',
    projectId: 'atuendo',
    featuredIndices: [4, 5]
  }
];

export function getItemImages(item, projects) {
  const project = projects.find(p => p.id === item.projectId);
  if (!project) return [];
  if (item.featuredIndices && item.featuredIndices.length) {
    return item.featuredIndices.map(idx => project.images[idx]).filter(Boolean);
  }
  return project.images.slice(0, 3);
}

export function getItemProject(item, projects) {
  return projects.find(p => p.id === item.projectId);
}
