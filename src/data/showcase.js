// Chapter definitions matching the 17-phase storyboard specifications.
// Every discipline defines its heading, text nodes, project references, and transition sentences.
export const chapterDefinitions = [
  {
    id: 'brand-identity',
    label: 'Brand identity',
    title: 'Start with something\nunmistakably yours.',
    intro: 'A name becomes a mark. A mark becomes a world. This is where recognition begins.',
    notes: [
      ['A distinctive mark.', 'The beginning of a visual identity.'],
      ['Colors, typography, and patterns.', 'One consistent visual language.'],
      ['One consistent visual language.', 'An identity with room to grow across every touchpoint.']
    ],
    transition: 'An identity is only the beginning.',
    categories: ['brand-identity'],
    featured: 'tripty',
    selections: {
      tripty: [0, 1, 3],
      norea: [0, 1],
      'all-organics': [0, 2],
      atuendo: [0, 1],
      sandbox: [0, 2]
    }
  },
  {
    id: 'packaging',
    label: 'Packaging',
    title: 'Give the identity\nsomething to wrap around.',
    intro: 'A first impression before the first use. A box, a bottle, a small moment of anticipation.',
    notes: [
      ['A first impression before the first use.', 'A clear identity, right in your hands.'],
      ['Considered from every side.', 'The whole pack tells the same cohesive story.']
    ],
    transition: 'From the shelf to the screen.',
    categories: ['packaging'],
    featured: 'finn',
    selections: {
      finn: [0, 1, 2],
      zaro: [5]
    }
  },
  {
    id: 'social-creatives',
    label: 'Social creatives',
    title: 'Now, bring the brand\ninto the everyday.',
    intro: 'A recognizable feed with purpose. Static creatives with a consistent point of view.',
    notes: [
      ['A recognizable feed.', 'Individual posts. One unmistakable visual language.'],
      ['Product stories with purpose.', 'Details, benefits, and everyday moments.'],
      ['Campaigns that belong together.', 'Individual touchpoints that feel like a curated collection.']
    ],
    transition: 'Make the message fit the space.',
    categories: ['social-creatives'],
    featured: 'aves',
    selections: {
      aves: [0, 1, 2],
      seor: [0, 3, 4],
      'tripty-social': [0, 1, 2],
      'apple-gears': [0, 3],
      'seor-clutch': [0, 2],
      'seor-baby': [0, 2],
      'seor-sleep': [0, 2]
    }
  },
  {
    id: 'banners',
    label: 'Banners',
    title: 'Make the message\nfit the space.',
    intro: 'A clear offer, a strong focal point. Compositions made for the wide format they live in.',
    notes: [
      ['A clear offer.', 'Give the message room to speak with clear hierarchy.'],
      ['A strong focal point.', 'The proportions change. The identity stays unmistakable.']
    ],
    transition: 'Take the same identity into the world.',
    categories: ['banners'],
    featured: 'apple-gears',
    selections: {
      'apple-gears': [1, 2, 3, 4, 5]
    }
  },
  {
    id: 'posters',
    label: 'Posters & billboards',
    title: 'Take the same identity\ninto the world.',
    intro: 'Read at a glance. Recognized at a distance. Design that carries the same character at scale.',
    notes: [
      ['Read at a glance.', 'A message with an immediate, confident visual hierarchy.'],
      ['Recognized at a distance.', 'Your visual language, turned up across city walls and outdoor spaces.']
    ],
    transition: 'Make something people want to wear.',
    categories: ['posters', 'billboards'],
    featured: 'norea',
    selections: {
      norea: [7],
      'all-organics': [7],
      tripty: [6, 7],
      'tripty-social': [1, 3]
    }
  },
  {
    id: 'merchandise',
    label: 'Merchandise',
    title: 'Make something\npeople want to wear.',
    intro: 'Character in every graphic. On a favourite tee, a bag, and the objects that become part of the everyday.',
    notes: [
      ['Character in every graphic.', 'Illustration, lettering, and distinct personality.'],
      ['The brand, carried with you.', 'From artwork to wearable object. A brand people want to carry.']
    ],
    transition: 'Bring care to the smallest touchpoints.',
    categories: ['merchandise'],
    featured: 'goodybro',
    selections: {
      goodybro: [0, 2, 4],
      zaro: [0, 3, 4],
      tripty: [5],
      sandbox: [4],
      'all-organics': [3, 4],
      norea: [5],
      atuendo: [0]
    }
  },
  {
    id: 'stationery',
    label: 'Stationery & brochures',
    title: 'Bring care to the\nsmallest touchpoints.',
    intro: 'Introductions that feel considered. Thoughtful print materials that make a business feel established.',
    notes: [
      ['Introductions that feel considered.', 'Business cards, letterheads, and tactile presentation envelopes.'],
      ['Information worth keeping.', 'Brochures and editorial capability ready for your next brand brief.']
    ],
    transition: 'Choose how we build your next chapter.',
    categories: ['stationery'],
    featured: 'atuendo',
    selections: {
      atuendo: [4, 5],
      norea: [4, 6],
      sandbox: [3],
      tripty: [4],
      'all-organics': [5],
      finn: [4, 5],
      'apple-gears': [6],
      goodybro: [6]
    }
  }
];

export function getChapterProjects(chapter, projects) {
  const selected = projects.filter(project =>
    chapter.categories.some(category => project.categoryIds.includes(category))
  );
  return [...selected].sort(
    (a, b) => Number(b.id === chapter.featured) - Number(a.id === chapter.featured)
  );
}

export function getChapterImages(chapter, project) {
  const explicit = chapter.selections[project.id];
  if (explicit) return explicit.map(index => project.images[index]).filter(Boolean);
  const tagged = project.images.filter(image =>
    image.categoryIds?.some(id => chapter.categories.includes(id))
  );
  return (tagged.length ? tagged : project.images).slice(0, 3);
}
