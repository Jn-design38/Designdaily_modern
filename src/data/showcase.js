// Design Daily — Hand-Sketched Wireframe Project Sequence
// Each project has a brand name, discipline, teaser sentence, 2-3 line middle-aligned brief,
// and curated artwork references from projects.json.

export const showcaseItems = [
  // 1. BRAND IDENTITY
  {
    id: 'tripty',
    brandName: 'Tripty',
    discipline: 'Brand identity',
    teaser: 'Crafted for perfection',
    brief: 'Artisanal cafe branding, packaging, and interior identity rooted in sensory delight and hand-crafted craft.',
    projectId: 'tripty',
    thumbnail: {
      src: '/optimized/covers/social-tripty-campaign.webp',
      alt: 'Tripty Social Campaign Cover',
      width: 1920,
      height: 1080
    },
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
    thumbnail: {
      src: '/optimized/covers/brand-identity-norea.webp',
      alt: 'Noréa Brand Identity Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 1, 7]
  },
  {
    id: 'atuendo',
    brandName: 'Atuendo',
    discipline: 'Brand identity',
    teaser: 'Linen power & tailored poise',
    brief: 'Contemporary fashion and bespoke apparel branding with understated typography and monochrome luxury.',
    projectId: 'atuendo',
    thumbnail: {
      src: '/optimized/covers/brand-identity-atuendo.webp',
      alt: 'Atuendo Brand Identity Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 1, 4]
  },
  {
    id: 'sandbox',
    brandName: 'Sandbox Lounge',
    discipline: 'Brand identity',
    teaser: 'Casual luxury & warmth',
    brief: 'Hospitality and lounge branding merging playful mid-century character with modern urban aesthetics.',
    projectId: 'sandbox',
    thumbnail: {
      src: '/optimized/covers/brand-identity-sandbox-lounge.webp',
      alt: 'Sandbox Lounge Brand Identity Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 2, 4]
  },

  // 2. PACKAGING & MERCHANDISE
  // After Sandbox Lounge: bridge is called "packaging & merch", with Goodybro included before social media creatives
  {
    id: 'finn',
    brandName: 'Finn',
    discipline: 'Packaging',
    teaser: 'packaging & merch',
    brief: 'Luxury black-and-silver product packaging with custom dielines, tactile unboxing, and embossed finishes.',
    projectId: 'finn',
    thumbnail: {
      src: '/optimized/covers/packaging-finn-gift-box.webp',
      alt: 'Finn Gift Box Packaging Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 1, 2]
  },
  {
    id: 'zaro',
    brandName: 'Zaro',
    discipline: 'Packaging',
    teaser: 'Form meets botanical function',
    brief: 'Glass bottle packaging and tactile product labels engineered for memorable shelf presence.',
    projectId: 'zaro',
    thumbnail: {
      src: '/optimized/covers/tshirt-zaro-activewear.webp',
      alt: 'Zaro Activewear T-Shirt Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 3, 5]
  },
  {
    id: 'goodybro',
    brandName: 'Goodybro',
    discipline: 'Merchandise',
    teaser: 'Wearable character',
    brief: 'Organic cotton t-shirt illustrations, graphic prints, and custom apparel badges people want to wear.',
    projectId: 'goodybro',
    thumbnail: {
      src: '/optimized/covers/tshirt-goodybro-create-goodness.webp',
      alt: 'Goodybro Create Goodness T-Shirt Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 2, 4]
  },

  // 3. SOCIAL MEDIA CREATIVES
  // Bridge before starting social media creatives is called "social media Creatives"
  {
    id: 'aves',
    brandName: 'Aves',
    discipline: 'Social creatives',
    teaser: 'social media Creatives',
    brief: 'High-end real estate social campaigns featuring architectural layouts and consistent luxury tones.',
    projectId: 'aves',
    thumbnail: {
      src: '/optimized/covers/social-aves-real-estate.webp',
      alt: 'AVES Real Estate Social Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 1, 2]
  },
  {
    id: 'seor',
    brandName: 'Seor',
    discipline: 'Social creatives',
    teaser: 'Carry with confidence',
    brief: 'Curated social media product story with high-converting static carousel compositions and editorial angles.',
    projectId: 'seor',
    thumbnail: {
      src: '/optimized/covers/seor.webp',
      alt: 'Seor Campaign Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [0, 3, 4]
  },

  // 4. BANNERS
  {
    id: 'apple-gears',
    brandName: 'Apple Gears',
    discipline: 'Banners',
    teaser: 'Make the message fit the space',
    brief: 'Widescreen 16:9 banner campaigns and responsive display ads for premium accessories and phone covers.',
    projectId: 'apple-gears',
    thumbnail: {
      src: '/optimized/covers/social-applegears-campaign.webp',
      alt: 'Apple Gears Social Campaign Cover',
      width: 1920,
      height: 1080
    },
    featuredIndices: [1, 2, 3]
  }
];

export function getItemImages(item, projects) {
  if (item.thumbnail) {
    const project = projects.find(p => p.id === item.projectId);
    const rest = project && item.featuredIndices ? item.featuredIndices.map(idx => project.images[idx]).filter(Boolean) : [];
    return [item.thumbnail, ...rest];
  }
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
