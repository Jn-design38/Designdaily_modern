export const packages = [
  {
    id: 'starter',
    tierClass: 'tier-starter',
    name: 'Starter Package',
    underlineClass: 'underline-starter',
    tagClass: 'tag-starter',
    subtitle: 'Lets, Launch',
    original: '7,000',
    price: '3,500',
    btnClass: 'btn-starter',
    btnText: 'Choose Starter',
    features: [
      { text: '01 Custom Logo Design' },
      { text: '10–15 Pages Brand Guideline PDF' },
      { text: '01 Logo Animation' },
      { text: '04 Social Media Creatives' },
      { text: '01 Social Media Cover Design', sub: '(FB, Instagram, LinkedIn, YouTube)' },
      { text: 'Max 02 Cover Design Variations' },
      { text: 'Unlimited Revisions' },
      { text: 'Basic Competitor Analysis' },
      { text: 'Priority Support' }
    ]
  },
  {
    id: 'growth',
    tierClass: 'tier-growth is-featured',
    name: 'Growth Package',
    underlineClass: 'underline-growth',
    tagClass: 'tag-growth',
    subtitle: 'PRO',
    original: '18,000',
    price: '8,999',
    btnClass: 'btn-growth',
    btnText: 'Choose Growth PRO',
    features: [
      { text: '24 Social Media Creatives' },
      { text: '04 Carousel Posts (20 designs total)' },
      { text: '05 Motion Graphics Videos (30s max)' },
      { text: 'Ad Creative Optimization' },
      { text: 'Competitor Content Analysis' },
      { text: 'Unlimited Revisions' },
      { text: 'Priority Support' }
    ]
  },
  {
    id: 'scale',
    tierClass: 'tier-scale',
    name: 'Scale Package',
    underlineClass: 'underline-scale',
    tagClass: 'tag-scale',
    subtitle: 'Premium',
    original: '30,000',
    price: '14,999',
    btnClass: 'btn-scale',
    btnText: 'Choose Scale Premium',
    features: [
      { text: '36 Social Media Creatives' },
      { text: '06 Carousel Posts (30 designs total)' },
      { text: '08 Motion Graphics Videos (40s max)' },
      { text: 'Campaign Creative Concepts' },
      { text: 'Advanced Competitor Content Analysis' },
      { text: 'Unlimited Revisions' },
      { text: 'Priority Support' }
    ]
  }
];

export const studioEmail = 'julkarnine.arabi@gmail.com';
export function makeInquiry({ name, contact, business, service, brief }) {
  const subject = `Design Daily enquiry — ${service || 'A new project'}`;
  const body = `Hello Design Daily,\n\nName: ${name}\nContact: ${contact}\nBusiness: ${business || 'Not provided'}\nInterested in: ${service || 'A new project'}\n\n${brief}\n\nPlease share the next steps.`;
  return `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
