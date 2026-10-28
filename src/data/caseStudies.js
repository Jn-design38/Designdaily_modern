// Editorial descriptions of the supplied artwork. No inferred launch dates,
// client quotations, performance claims or additional deliverables.
const stories = {
  tripty: {
    name: 'Tripty', tagline: 'An appetite for personality.', sector: 'Food & hospitality',
    challenge: 'Bring a restaurant personality into focus, from the first glimpse of its sign to the last detail on a takeaway. Tripty combines a chef-hat wordmark, food illustrations and a red, yellow and white palette.',
    strategy: 'Keep a small set of ingredients recognisable everywhere: the chef’s hat, the flame and a generous use of red. The same visual cues connect the restaurant space with printed and everyday objects.',
    identity: 'The wordmark is supported by a loose, illustrative food pattern and a compact flame motif. Guidelines bring those elements together so the identity can move between a quiet logo placement and a more expressive surface.',
    voice: 'Food takes the lead, with direct headlines and playful supporting graphics. The posters let the name, the meal and the illustration do the talking.',
    application: 'Stationery, a tote, staff apparel, outdoor advertising and a delivery van carry the same ingredients at different scales. Each composition gives the identity room to breathe while keeping it unmistakably Tripty.',
    outcome: 'A connected restaurant identity, expressed across the space, the team and the materials people take away.',
    strategyRows: [[1]], identityRows: [[2, 3]], voiceRows: [[6]], applicationRows: [[4, 5], [7, 8]]
  },
  norea: {
    name: 'Noréa', tagline: 'A quieter kind of presence.', sector: 'Fashion & lifestyle',
    challenge: 'Give a fashion identity a recognisable signature without relying on visual noise. Noréa brings together a slender monogram, flowing lines and a palette of warm neutrals and pale blue.',
    strategy: 'Start with the proportions of the N. Its fine, elongated form provides a consistent point of recognition, whether it appears alone or alongside the wordmark.',
    identity: 'The monogram extends into flowing patterns. Terracotta, cream and pale blue keep the system soft, while careful spacing gives the fine linework enough contrast to remain legible.',
    application: 'Letterheads, envelopes, business cards, shopping bags and a billboard show how the same visual language works close up and at a distance.',
    outcome: 'A coherent collection of fashion brand materials, held together by one distinctive monogram and a restrained use of colour.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4], [5, 6], [7]]
  },
  'all-organics': {
    name: 'All Organics', tagline: 'Naturally, full of life.', sector: 'Organic goods',
    challenge: 'Make a nature-led identity feel vivid and recognisable across everyday brand materials. All Organics pairs a leaf monogram with a bright green and chocolate palette.',
    strategy: 'Use the leaf as a shared starting point. The symbol, flowing linework and colour system all draw from the same organic shapes, making the wider collection feel connected.',
    identity: 'The compact leaf symbol sits alongside a clear wordmark. Organic lines add movement and texture without competing with the main mark.',
    voice: '“Eat Well Live Well” gives the outdoor work a simple, everyday message. The short line sits within the green-and-brown visual system rather than asking the layout to carry a long explanation.',
    application: 'Totes, transparent cards, bottles, apparel, stationery and vehicle graphics translate the same identity into different materials and sizes.',
    outcome: 'A flexible family of brand applications with a consistent visual link back to the leaf symbol.',
    strategyRows: [[1]], identityRows: [[2]], voiceRows: [[7]], applicationRows: [[3, 4], [5], [6]]
  },
  atuendo: {
    name: 'Atuendo', tagline: 'Identity, woven together.', sector: 'Fashion',
    challenge: 'Build a fashion identity that feels considered in both its mark and its materials. Atuendo combines a looping symbol with fine-line patterns and a cream, charcoal and olive palette.',
    strategy: 'Let the looping symbol set the rhythm. Its continuous shape gives the identity a central idea that can extend into patterns, printed pieces and tactile details.',
    identity: 'Fine organic lines sit beside solid areas of cream, olive and charcoal. The contrast lets the symbol feel clear while giving the supporting surfaces texture.',
    application: 'Letterheads, envelopes, presentation folders, patterned paper and embossed materials bring the identity into physical form. The supplied still lifes make those material relationships visible.',
    outcome: 'A fashion identity whose symbol, palette and material details speak the same visual language.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4], [5]]
  },
  sandbox: {
    name: 'Sandbox Lounge', tagline: 'Set the mood. Keep the signature.', sector: 'Hospitality',
    challenge: 'Carry a lounge identity across a varied set of guest-facing details. A geometric gold mark anchors Sandbox Lounge’s navy and charcoal palette.',
    strategy: 'Keep the core identity compact and consistent. The brand guide places the geometric mark at the centre, giving both small objects and larger applications a common reference.',
    identity: 'Gold brings contrast to deep navy and charcoal. The palette supports a recognisable mark while leaving room for patterns and more understated logo placements.',
    application: 'Stationery, a cup, a notebook, staff apparel, a bar mat and entrance graphics show the system across the lounge experience.',
    outcome: 'A coordinated set of hospitality applications, from printed details to the first impression at the door.',
    strategyRows: [[1]], identityRows: [[2]], applicationRows: [[3], [4, 5], [6]]
  },
  goodybro: {
    name: 'Goodybro', tagline: 'Goodness, with a graphic punch.', sector: 'Apparel & culture',
    challenge: 'Give a collection of T-shirt graphics a strong personality of its own. Goodybro brings oversized typography, illustrated characters and vivid colour into the garment.',
    strategy: 'Treat the graphic and the garment as one composition. Large back prints and smaller front placements let each idea work both as artwork and as something to wear.',
    identity: 'Characters, expressive lettering and high-contrast colour create a shared attitude across the collection. Each graphic has its own composition while retaining the same playful energy.',
    voice: '“Create Goodness” and “Style Fades Goodness Does Not” make the message part of the artwork. The words act as graphic material as much as copy.',
    application: 'The collection moves between illustrated tees, bold type-led garments and printed customer details. Front-and-back views show how the designs sit on the clothing.',
    outcome: 'A collection where the graphics, garment placements and supporting print all carry the same expressive character.',
    strategyRows: [[1]], identityRows: [[4]], voiceRows: [[2]], applicationRows: [[3], [5], [6]]
  },
  zaro: {
    name: 'Zaro', tagline: 'Built around a bright signature.', sector: 'Apparel & accessories',
    challenge: 'Connect apparel and accessories with a recognisable visual language. Zaro uses black surfaces, bright green details, geometric lines and an illustrated walking mascot.',
    strategy: 'Give the mascot and green symbol clear roles within the same system. The character adds personality, while the smaller mark works where a simpler signature is needed.',
    identity: 'Geometric linework expands the system beyond a single logo. The technical T-shirt layout makes the relationship between small front details and the larger back graphic explicit.',
    application: 'Footwear views and bottle packaging extend the black-and-green palette into new formats while retaining the symbol, character and linework.',
    outcome: 'An apparel and accessories concept connected by colour, character and a consistent graphic vocabulary.',
    strategyRows: [[1]], identityRows: [[2]], applicationRows: [[3, 4], [5]]
  },
  aves: {
    name: 'Aves', tagline: 'Make room for a clearer story.', sector: 'Real estate',
    challenge: 'Keep a four-part real estate creative set recognisable while giving each property image its own space. The campaign pairs architectural imagery with Bengali headlines in blue, yellow and white.',
    strategy: 'Use the architecture as the focal point. Framing devices and clear headline areas guide the eye from the property to the message.',
    identity: 'Blue panels and yellow accents tie the individual layouts together. A consistent type hierarchy makes room for changing imagery without losing the campaign’s visual rhythm.',
    application: 'The series carries the same palette and compositional logic across its building-led creatives, with different proportions of image and headline.',
    outcome: 'Four coordinated campaign compositions with a clear family resemblance and room for different property stories.',
    strategyRows: [[1]], identityRows: [[2]], applicationRows: [[3]]
  },
  seor: {
    name: 'Seor', tagline: 'Carry with confidence.', sector: 'Fashion accessories',
    challenge: 'Present a bag collection through both product detail and personal style. This Seor campaign combines restrained typography, still life and fashion photography in square creatives.',
    strategy: 'Alternate between the bag in use and the bag on its own. The model imagery provides context, while the still lifes give the product shape and details more attention.',
    identity: 'Dark tones, measured typography and a consistent product focus hold the campaign together across different outfits and settings.',
    application: 'Product arrangements and fashion-led compositions extend the series, keeping the bag central as the surroundings change.',
    outcome: 'A coordinated set of square campaign creatives that balances product presentation with lifestyle imagery.',
    strategyRows: [[1]], identityRows: [[2]], applicationRows: [[3, 4], [5]]
  },
  'tripty-social': {
    name: 'Tripty', tagline: 'A taste of the brand.', sector: 'Food & social content',
    challenge: 'Bring the Tripty identity into food-led social creatives. Red and yellow, playful type and familiar brand motifs connect the individual dishes to the restaurant.',
    strategy: 'Let the food lead and build the composition around it. Flames, colour and headline scale add emphasis while keeping the dish easy to recognise.',
    identity: 'The restaurant palette supports more playful arrangements, including a plate-and-spoon composition and a food clock. The format changes while the visual cues stay familiar.',
    application: 'The supplied series spans product-focused images and a before-and-after scene, using the same bold brand ingredients throughout.',
    outcome: 'A set of food creatives that carries the restaurant identity into a distinct social content format.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4]]
  },
  'apple-gears': {
    name: 'Apple Gears', tagline: 'The collection, clearly presented.', sector: 'Consumer accessories',
    challenge: 'Organise accessories into a recognisable set of collection graphics, product-category banners and printed customer cards. Black, white and orange form the shared palette.',
    strategy: 'Give each banner a clear product focus. Wide compositions separate the collection story from individual categories while keeping the visual treatment consistent.',
    identity: 'Orange fields and bold product arrangements connect charging, accessories and audio. The repeated layout logic makes the categories feel like parts of one collection.',
    application: 'The system moves from product banners into a printed thank-you card, extending the visual language to a customer-facing detail.',
    outcome: 'A coordinated set of digital category graphics and supporting print for the accessory collection.',
    strategyRows: [[1], [2]], identityRows: [[3, 4], [5]], applicationRows: [[6]]
  },
  finn: {
    name: 'Finn', tagline: 'A considered first impression.', sector: 'Accessories',
    challenge: 'Connect the outer packaging with the details revealed inside. This archive project pairs a fine-line monogram with black boxes, pale yellow inserts and a red accent.',
    strategy: 'Build a contrast between the outside and the inside. The dark outer box provides a quiet frame for the lighter printed insert and the product it holds.',
    identity: 'The fine-line monogram works as a signature and a repeated pattern. Black, pale yellow and red connect the packaging to the product presentation.',
    application: 'An illustrated envelope, contact card and welcome letter extend the identity beyond the box, giving the printed details the same considered treatment.',
    outcome: 'A packaging archive that brings the box, product presentation and printed inserts into one visual system.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4, 5]]
  },
  'seor-clutch': {
    name: 'Seor', tagline: 'Leather essentials, in focus.', sector: 'Accessories & social content',
    challenge: 'Explain a leather clutch through a mix of product detail and everyday context. Warm browns, lifestyle imagery and concise feature layouts connect the series.',
    strategy: 'Let each creative answer a different product question. Comparison and material-focused layouts create space for information alongside the lifestyle imagery.',
    identity: 'Leather tones and a consistent product focus give the set its continuity. Close material views sit comfortably beside images of the clutch in use.',
    application: 'Cafe imagery, interior-capacity views and locking-feature layouts extend the series across use, detail and function.',
    outcome: 'A connected product-content series covering lifestyle, material and practical features. Claims remain those shown in the supplied artwork.',
    strategyRows: [[1]], identityRows: [[2]], applicationRows: [[3], [4, 5]]
  },
  'seor-baby': {
    name: 'Seor', tagline: 'Little everyday moments.', sector: 'Baby products & social content',
    challenge: 'Make a feeding-set content series easy to follow across product information and family imagery. Pink and cream provide a consistent visual setting.',
    strategy: 'Give measurements and individual features their own compositions. Clear product views help separate practical information from the wider lifestyle story.',
    identity: 'Pink accents, simple icons and product-led layouts keep the series recognisable. The flexible-material image gives one feature room to be seen in detail.',
    application: 'Parent-and-child imagery brings context to the product views, while the bib layout presents its adjustable and cleaning features as shown in the supplied creative.',
    outcome: 'A coordinated content set spanning product dimensions, feature details and everyday family imagery.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4, 5]]
  },
  'seor-sleep': {
    name: 'Sleep Mask', tagline: 'Rest, considered.', sector: 'Lifestyle & social content',
    challenge: 'Give a sleep-mask content series a calm, consistent presentation. Blue panels, product imagery and feature illustrations connect the individual creatives.',
    strategy: 'Focus each composition on one part of the product story. The cover-care layout introduces the information-led side of the series alongside lifestyle imagery.',
    identity: 'Blue fields, simple night-time illustrations and clear product views create a shared visual language across the different layouts.',
    application: 'The set moves from lifestyle and eye-cover details into a feature comparison and a simple product-and-accessories arrangement.',
    outcome: 'A cohesive collection of lifestyle and product-information creatives, using the content shown in the supplied artwork.',
    strategyRows: [[1]], identityRows: [[2, 3]], applicationRows: [[4, 5]]
  }
};

export function getCaseStudy(project) {
  const story = stories[project.id];
  if (!story) {
    return {
      name: project.title, tagline: project.discipline, sector: project.discipline,
      chapters: [
        { id: 'challenge', label: 'Overview', heading: project.title, body: project.description, rows: [[0]] },
        { id: 'application', label: 'Application', body: '', rows: project.images.slice(1).map((_, i) => [i + 1]) }
      ]
    };
  }

  return {
    ...story,
    chapters: [
      { id: 'challenge', label: 'Challenge', heading: story.tagline, body: story.challenge, rows: [[0]] },
      { id: 'strategy', label: 'Strategy', body: story.strategy, rows: story.strategyRows },
      { id: 'identity', label: 'Identity', body: story.identity, rows: story.identityRows },
      ...(story.voice ? [{ id: 'brand-voice', label: 'Brand voice', body: story.voice, rows: story.voiceRows }] : []),
      { id: 'application', label: 'Application', body: story.application, rows: story.applicationRows },
      { id: 'outcome', label: 'Outcome', body: story.outcome, rows: [] }
    ]
  };
}
