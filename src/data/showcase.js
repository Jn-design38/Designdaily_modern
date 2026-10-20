// A project may appear in several chapters, always with the relevant application.
// All primary projects are included; galleries hold the complete artwork collection.
export const chapterDefinitions = [
  {
    id: 'brand-identity', label: 'Brand identity', title: 'First, something\nunmistakably yours.',
    intro: 'A name becomes a mark. A mark becomes a world. This is where recognition begins.',
    notes: [['A distinctive mark.', 'The beginning of a visual identity.'], ['A language of your own.', 'Color, type, and patterns working together.'], ['Every detail, connected.', 'An identity with room to grow.']],
    transition: 'An identity is only the beginning.',
    categories: ['brand-identity'], featured: 'tripty',
    selections: { tripty: [0, 1, 3], norea: [0, 1], 'all-organics': [0, 2], atuendo: [0, 1], sandbox: [0, 2] },
  },
  {
    id: 'packaging', label: 'Packaging', title: 'An impression.\nBefore it is opened.',
    intro: 'Give the identity something to wrap around. A box, a bottle, a small moment of anticipation.',
    notes: [['Considered from every side.', 'The whole pack tells the same story.'], ['Made for the first encounter.', 'A clear identity, right in your hands.']],
    transition: 'From the shelf to the screen.',
    categories: ['packaging'], featured: 'finn',
    selections: { finn: [0, 1, 2], zaro: [5] },
  },
  {
    id: 'social-creatives', label: 'Social creatives', title: 'Show up.\nStay recognisable.',
    intro: 'Every post is another opportunity to feel like your brand. Static creatives with a consistent point of view.',
    notes: [['A feed with a point of view.', 'Individual posts. One visual language.'], ['A story for every product.', 'Details, benefits, and everyday moments.'], ['Built to belong together.', 'Campaigns that feel like a collection.']],
    transition: 'The same idea. A different canvas.',
    categories: ['social-creatives'], featured: 'aves',
    selections: { aves: [0, 1, 2], seor: [0, 3, 4], 'tripty-social': [0, 1, 2], 'apple-gears': [0, 3], 'seor-clutch': [0, 2], 'seor-baby': [0, 2], 'seor-sleep': [0, 2] },
  },
  {
    id: 'banners', label: 'Banners', title: 'A clear message.\nIn the right space.',
    intro: 'A collection, a product, an offer. Compositions made for the format they live in.',
    notes: [['One strong focal point.', 'Give the message room to speak.'], ['Across every format.', 'The proportions change. The identity stays.']],
    transition: 'Now, give that message a bigger stage.',
    categories: ['banners'], featured: 'apple-gears',
    selections: { 'apple-gears': [1, 2, 3, 4, 5] },
  },
  {
    id: 'posters', label: 'Posters & billboards', title: 'Out in the world.\nHard to overlook.',
    intro: 'From a framed poster to a city wall. Design that carries the same character at a different scale.',
    notes: [['Read at a glance.', 'A message with a clear hierarchy.'], ['Recognised at a distance.', 'Your visual language, turned up.']],
    transition: 'Some impressions are made to be worn.',
    categories: ['posters', 'billboards'], featured: 'norea',
    selections: { norea: [7], 'all-organics': [7], tripty: [6, 7], 'tripty-social': [1, 3] },
  },
  {
    id: 'merchandise', label: 'Merchandise', title: 'Character you\ncan carry with you.',
    intro: 'Graphics with something to say. On a favourite tee, a bag, and the objects that become part of the everyday.',
    notes: [['More than a logo on a tee.', 'Illustration, lettering, and a little personality.'], ['From artwork to object.', 'A brand you can put your hands on.']],
    transition: 'And then, the details that tie it all together.',
    categories: ['merchandise'], featured: 'goodybro',
    selections: { goodybro: [0, 2, 4], zaro: [0, 3, 4], tripty: [5], sandbox: [4], 'all-organics': [3, 4], norea: [5], atuendo: [0] },
  },
  {
    id: 'stationery', label: 'Stationery & brochures', title: 'Care in the\nsmallest touchpoints.',
    intro: 'The card you hand over. The letter you send. Thoughtful materials that make a business feel considered.',
    notes: [['A considered introduction.', 'Business cards, letterheads, and envelopes.'], ['Information worth keeping.', 'Brochure design is available for your next brief.']],
    transition: 'Different touchpoints. One recognisable brand.',
    categories: ['stationery'], featured: 'atuendo',
    selections: { atuendo: [4, 5], norea: [4, 6], sandbox: [3], tripty: [4], 'all-organics': [5], finn: [4, 5], 'apple-gears': [6], goodybro: [6] },
  },
];

export function getChapterProjects(chapter, projects) {
  const selected = projects.filter(project => chapter.categories.some(category => project.categoryIds.includes(category)));
  return [...selected].sort((a, b) => Number(b.id === chapter.featured) - Number(a.id === chapter.featured));
}

export function getChapterImages(chapter, project) {
  const explicit = chapter.selections[project.id];
  if (explicit) return explicit.map(index => project.images[index]).filter(Boolean);
  const tagged = project.images.filter(image => image.categoryIds?.some(id => chapter.categories.includes(id)));
  return (tagged.length ? tagged : project.images).slice(0, 3);
}
