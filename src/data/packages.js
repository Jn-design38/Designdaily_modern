// Static-only offer approved in the website plan. Original prices and non-motion quantities retained.
export const packages = [
  { id: 'starter', name: 'Starter Package', subtitle: 'Lets, Launch', original: '7,000', price: '3,500', features: ['01 Custom Logo Design', '10–15 Pages Brand Guideline PDF', '04 Social Media Creatives', '01 Social Media Cover Design', '(FB, Instagram, LinkedIn, YouTube)', 'Max 02 Cover Design Variations', 'Unlimited Revisions', 'Basic Competitor Analysis', 'Priority Support'] },
  { id: 'growth', name: 'Growth Package', subtitle: 'PRO', original: '18,000', price: '8,999', features: ['24 Social Media Creatives', '04 Carousel Posts (20 designs total)', 'Ad Creative Optimization', 'Competitor Content Analysis', 'Unlimited Revisions', 'Priority Support'] },
  { id: 'scale', name: 'Scale Package', subtitle: 'Premium', original: '30,000', price: '14,999', features: ['36 Social Media Creatives', '06 Carousel Posts (30 designs total)', 'Campaign Creative Concepts', 'Advanced Competitor Content analysis', 'Unlimited Revisions', 'Priority Support'] }
];
export const studioEmail = 'julkarnine.arabi@gmail.com';
export function makeInquiry({ name, contact, business, service, brief }) {
  const subject = `Design Daily enquiry — ${service || 'A new project'}`;
  const body = `Hello Design Daily,\n\nName: ${name}\nContact: ${contact}\nBusiness: ${business || 'Not provided'}\nInterested in: ${service || 'A new project'}\n\n${brief}\n\nPlease share the next steps.`;
  return `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
