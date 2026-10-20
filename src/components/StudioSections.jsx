import { useState } from 'react';
import { Arrow, Star } from './Icons';
import { byId, Artwork } from './Portfolio';
import Magnet from './Magnet';
import SplitText from './SplitText';
import { packages, makeInquiry, studioEmail } from '../data/packages';

const services = [
  { name:'Brand identity', copy:'A logo, a visual language, and the guidelines that bring it all together.', tags:'Logo design / Visual identity / Brand guidelines', image:byId('tripty').images[3] },
  { name:'Merchandise', copy:'Wearable graphics and branded objects with a character of their own.', tags:'Apparel graphics / Branded merchandise', image:byId('goodybro').images[2] },
  { name:'Stationery', copy:'The everyday details that make your business feel considered.', tags:'Business cards / Letterheads / Envelopes', image:byId('atuendo').images[4] },
  { name:'Posters, banners & billboards', copy:'A clear message, made for the space it needs to fill.', tags:'Print campaigns / Digital banners / Outdoor design', image:byId('norea').images[7] },
  { name:'Social creatives', copy:'Static content that makes your feed feel unmistakably yours.', tags:'Static posts / Carousels / Cover designs', image:byId('aves').images[0] }
];

export function Services() {
  const [active, setActive] = useState(0);
  return <section id="capabilities" className="services-section wrap">
    <div className="section-heading"><span className="section-note">What we do</span><h2>Everything your brand<br />needs to show up.</h2></div>
    <div className="services-layout"><div className="services-art"><Artwork image={services[active].image} key={services[active].name} /><span>{services[active].name}</span></div><div className="service-list">{services.map((service, index) => <div className={`service-item ${index === active ? 'is-active' : ''}`} key={service.name}><button aria-expanded={index === active} aria-controls={`service-${index}`} onClick={() => setActive(index)}><h3>{service.name}</h3><span aria-hidden="true">{index === active ? '−' : '+'}</span></button><div id={`service-${index}`} hidden={index !== active}><p>{service.copy}</p><span className="service-tags">{service.tags}</span><div className="service-mobile-art"><Artwork image={service.image} /></div></div></div>)}</div></div>
  </section>;
}

const steps = [
  ['Understand','Tell us about your business, your audience, and what you need to communicate.'],
  ['Design','We explore a visual direction and turn the brief into considered design.'],
  ['Refine','We review the details together and shape the work around your feedback.'],
  ['Deliver','Your agreed designs are prepared for the places you want to use them.']
];
export function Process() {
  return <section id="studio" className="process-section wrap"><div className="process-intro"><span className="section-note">A little structure. A lot of care.</span><h2>You bring the business.<br />We bring the design.</h2><p>One clear conversation, from the first idea to the final detail.</p></div><ol className="process-steps">{steps.map(([name, copy],index) => <li key={name}><span className="step-number">0{index + 1}</span><h3>{name}</h3><p>{copy}</p></li>)}</ol></section>;
}

export function Packages({ onChoose }) {
  return <section id="packages" className="packages-section" aria-labelledby="packages-title"><h2 id="packages-title" className="package-main-title">Our Packages</h2><div className="package-grid">{packages.map(pack => <article className={`package-card package-${pack.id}`} key={pack.id}><header className="package-heading"><h3><span>{pack.name}</span></h3><p>{pack.subtitle}</p></header><div className="package-body"><p className="package-includes">Includes everything you need:</p><ul>{pack.features.map(feature => <li key={feature}>{feature}</li>)}</ul><div className="package-prices"><p>Original Price<br />{pack.original} BDT</p><p>Launch Discount 50% OFF<br />Final Price<br /><strong>{pack.price} BDT / Month</strong></p></div></div></article>)}</div><div className="package-actions">{packages.map(pack => <a href="#contact" className={`package-choose choose-${pack.id}`} key={pack.id} onClick={() => onChoose(pack.name)}>Choose {pack.name.replace(' Package','')} <Arrow diagonal /></a>)}</div></section>;
}

export function ScaleBenefit({ onChoose }) {
  const themes = ['Meet the brand','A product story','Helpful advice','Behind the scenes','A reason to choose you','Community spotlight'];
  return <section className="scale-benefit wrap" aria-labelledby="scale-title"><div className="scale-copy"><span className="benefit-label"><Star /> Included with Scale</span><h2 id="scale-title">Good design.<br />A clearer direction.</h2><p>Our highest social creative pack comes with a free assessment of your online business and a content calendar.</p><ul className="benefit-list"><li><span>✓</span> A fresh look at your online presence</li><li><span>✓</span> A content calendar to guide what comes next</li><li><span>✓</span> Creatives that connect the plan to your brand</li></ul><a href="#contact" className="text-link" onClick={() => onChoose('Scale Package')}>Let’s plan your next chapter <Arrow /></a></div><div className="planning-preview" aria-label="Illustrative assessment and content calendar"><div className="assessment-sheet"><span className="sheet-kicker">Design Daily / Brand assessment</span><h3>A fresh perspective.</h3>{['Visual consistency','Clarity of your offer','Content opportunities'].map((label,index) => <div className="assessment-line" key={label}><span>{label}</span><i style={{width:`${88-index*17}%`}} /></div>)}<p>Your business. Seen with fresh eyes.</p></div><div className="calendar-sheet"><div><span>Content calendar</span><span className="calendar-pill">Plan ahead</span></div><div className="calendar-grid">{themes.map((theme,index) => <div key={theme}><span>0{index+1}</span><strong>{theme}</strong><i /></div>)}</div><small>Illustrative planning example</small></div></div></section>;
}

const faq = [
  ['What kind of design do you create?','We create static design: brand identities, merchandise graphics, stationery, banners, posters, billboards, and 2D social media creatives.'],
  ['Can I order a single design or a custom project?','Yes. Tell us what you need through the project form. We can discuss a brief for an individual design, a connected set of materials, or one of the listed packages.'],
  ['What does the Scale package include beyond the creatives?','Scale includes a free assessment of your online business and a content calendar. We agree on the assessment scope and calendar period with you when discussing the order.'],
  ['How do revisions work?','The listed packages include unlimited revisions. We agree on the brief and deliverable scope first, then refine the designs with your feedback.'],
  ['Do you also post content or run advertisements?','Our listed services focus on designing your creative assets. Posting, account management, printing, and media buying are not included in these package descriptions.'],
  ['How do I get started?','Choose a package or describe your project below. The form prepares an email with your brief so you can review and send it directly to Design Daily. We will discuss the scope and next steps with you.']
];
export function FAQ() {
  return <section className="faq-section wrap" aria-labelledby="faq-title"><div><span className="section-note">Before we begin</span><h2 id="faq-title">A few things<br />you might ask.</h2></div><div className="faq-list">{faq.map(([question,answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>;
}

export function Contact({ service, setService }) {
  const [draft, setDraft] = useState('');
  const [copyState, setCopyState] = useState('');
  const prepare = event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setDraft(makeInquiry(values));
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(studioEmail); setCopyState('Email copied.'); }
    catch { setCopyState(`You can copy our email: ${studioEmail}`); }
  };
  return <section id="contact" className="contact-section wrap"><div className="contact-copy"><span className="section-note">Your next chapter starts here</span><SplitText text="Let’s make your next impression count." tag="h2" className="contact-heading" textAlign="left" splitType="words" duration={0.5} delay={50} rootMargin="0px" /><p>A new brand, a fresh campaign, or something you’ve been thinking about. We’d like to hear it.</p><div className="email-contact"><a href={`mailto:${studioEmail}`}>{studioEmail}</a><button type="button" onClick={copyEmail} aria-label="Copy studio email">Copy</button></div><p className="form-status" role="status">{copyState}</p></div><form className="contact-form" onSubmit={prepare} onChange={() => setDraft('')}><div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="How should we call you?" maxLength={100} required /></label><label>Email address<input name="contact" type="email" autoComplete="email" placeholder="you@yourbusiness.com" required /></label></div><label>Your business link <span>(optional)</span><input name="business" placeholder="Website or social profile" maxLength={300} /></label><label>What can we help with?<select name="service" value={service} onChange={event => setService(event.target.value)} required><option value="">Select a service or package</option><optgroup label="Packages">{packages.map(pack => <option key={pack.id}>{pack.name}</option>)}</optgroup><optgroup label="Custom projects">{services.map(item => <option key={item.name}>{item.name}</option>)}<option>Something else</option></optgroup></select></label><label>A little about your project<textarea name="brief" rows={4} placeholder="Your business, your idea, and what you need designed…" maxLength={4000} required /></label><div className="form-finish"><p>We’ll prepare your message.<br />You review and send it by email.</p><Magnet padding={24} maxOffset={4} magnetStrength={8}><button className="button button-dark" type="submit">Create email draft <Arrow diagonal /></button></Magnet></div>{draft && <div className="draft-ready" role="status"><strong>Your draft is ready.</strong><p>Open it in your email app, review the details, and press send.</p><a className="text-link" href={draft}>Open email draft <Arrow diagonal /></a><small>No email app? Send your brief directly to {studioEmail}.</small></div>}</form></section>;
}

export function Footer() {
  return <footer className="site-footer wrap"><div className="footer-top"><a href="/#home" aria-label="Design Daily home" className="footer-wordmark">design daily<span aria-hidden="true">✳</span></a><p>One recognisable brand.<br />Everywhere you show up.</p></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Design Daily</span><nav aria-label="Footer"><a href="/work">All work</a><a href="/#packages">Packages</a><a href={`mailto:${studioEmail}`}>Email us</a><a href="#top">Back to top ↑</a></nav><span>Design with a little more care.</span></div></footer>;
}
