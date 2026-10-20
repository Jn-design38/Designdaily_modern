import { useState } from 'react';
import { Arrow, Star } from './Icons';
import { byId, Artwork } from './Portfolio';
import Magnet from './Magnet';
import SplitText from './SplitText';
import { packages, makeInquiry, studioEmail } from '../data/packages';

const services = [
  { name: 'Brand identity', copy: 'A logo, a visual language, and the guidelines that bring it all together.', tags: 'Logo design / Visual identity / Brand guidelines', image: byId('tripty').images[3] },
  { name: 'Merchandise', copy: 'Wearable graphics and branded objects with a character of their own.', tags: 'Apparel graphics / Branded merchandise', image: byId('goodybro').images[2] },
  { name: 'Stationery', copy: 'The everyday details that make your business feel considered.', tags: 'Business cards / Letterheads / Envelopes', image: byId('atuendo').images[4] },
  { name: 'Posters, banners & billboards', copy: 'A clear message, made for the space it needs to fill.', tags: 'Print campaigns / Digital banners / Outdoor design', image: byId('norea').images[7] },
  { name: 'Social creatives', copy: 'Static content that makes your feed feel unmistakably yours.', tags: 'Static posts / Carousels / Cover designs', image: byId('aves').images[0] }
];

export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="capabilities" className="services-section wrap">
      <div className="section-heading">
        <span className="section-note">What we do</span>
        <h2>Everything your brand<br />needs to show up.</h2>
      </div>

      <div className="services-layout">
        <div className="services-art">
          <div className="services-art-header">
            <span className="service-count-tag">[0{active + 1} / 05]</span>
            <span className="service-mode-tag">Static Atelier Deliverable</span>
          </div>
          <div className="services-art-frame">
            <Artwork image={services[active].image} key={services[active].name} />
          </div>
          <div className="services-art-footer">
            <span className="services-art-name">{services[active].name}</span>
            <span className="services-art-status">Ready for Production</span>
          </div>
        </div>

        <div className="service-list">
          {services.map((service, index) => (
            <div className={`service-item ${index === active ? 'is-active' : ''}`} key={service.name}>
              <button
                aria-expanded={index === active}
                aria-controls={`service-${index}`}
                onClick={() => setActive(index)}
              >
                <div className="service-title-wrap">
                  <span className="service-index">0{index + 1}</span>
                  <h3>{service.name}</h3>
                </div>
                <span className="service-toggle" aria-hidden="true">{index === active ? '−' : '+'}</span>
              </button>
              <div id={`service-${index}`} hidden={index !== active} className="service-body">
                <p>{service.copy}</p>
                <div className="service-tags-list">
                  {service.tags.split(' / ').map(tag => (
                    <span key={tag} className="service-tag-pill">{tag}</span>
                  ))}
                </div>
                <div className="service-mobile-art">
                  <Artwork image={service.image} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { name: 'Understand', tag: 'Discovery & Briefing', copy: 'Tell us about your business, your audience, and what you need to communicate.' },
  { name: 'Design', tag: 'Concept & Exploration', copy: 'We explore a visual direction and turn the brief into considered design.' },
  { name: 'Refine', tag: 'Feedback & Craft', copy: 'We review the details together and shape the work around your feedback.' },
  { name: 'Deliver', tag: 'Production & Assets', copy: 'Your agreed designs are prepared for the places you want to use them.' }
];

export function Process() {
  return (
    <section id="studio" className="process-section wrap">
      <div className="process-intro">
        <span className="section-note">A little structure. A lot of care.</span>
        <h2>You bring the business.<br />We bring the design.</h2>
        <p>One clear conversation, from the first idea to the final detail.</p>
      </div>

      <div className="process-timeline-wrap">
        <div className="process-timeline-line" aria-hidden="true" />
        <ol className="process-steps">
          {steps.map((step, index) => (
            <li key={step.name} className="process-step-card">
              <div className="step-header">
                <span className="step-number">0{index + 1}</span>
                <span className="step-tag">{step.tag}</span>
              </div>
              <h3>{step.name}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Packages({ onChoose }) {
  return (
    <section id="packages" className="packages-section" aria-labelledby="packages-title">
      <div className="packages-header">
        <span className="section-note">Fixed Transparent Pricing</span>
        <h2 id="packages-title" className="package-main-title">Our Packages</h2>
        <p className="packages-subtitle">Dedicated monthly design capacity for founders, brands, and growing businesses.</p>
      </div>

      <div className="package-grid">
        {packages.map(pack => (
          <article className={`package-card package-${pack.id}`} key={pack.id}>
            {pack.id === 'growth' && <span className="package-badge-popular">★ Studio Recommended</span>}
            {pack.id === 'scale' && <span className="package-badge-scale">✦ Complete System</span>}
            <header className="package-heading">
              <h3><span>{pack.name}</span></h3>
              <p>{pack.subtitle}</p>
            </header>
            <div className="package-body">
              <p className="package-includes">Includes everything you need:</p>
              <ul>
                {pack.features.map(feature => (
                  <li key={feature}>
                    <span className="check-bullet" aria-hidden="true">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="package-prices">
                <div className="price-strike-row">
                  <span className="price-strike-label">Original Price</span>
                  <span className="price-strike-val">{pack.original} BDT</span>
                </div>
                <div className="price-final-box">
                  <div className="discount-pill">Launch Discount 50% OFF</div>
                  <div className="final-price-text">
                    <span className="price-label">Final Price</span>
                    <strong className="price-number">{pack.price} BDT / Month</strong>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="package-actions">
        {packages.map(pack => (
          <a
            href="#contact"
            className={`package-choose choose-${pack.id}`}
            key={pack.id}
            onClick={() => onChoose(pack.name)}
          >
            <span>Choose {pack.name.replace(' Package', '')}</span>
            <Arrow diagonal />
          </a>
        ))}
      </div>
    </section>
  );
}

export function ScaleBenefit({ onChoose }) {
  const themes = ['Meet the brand', 'A product story', 'Helpful advice', 'Behind the scenes', 'A reason to choose you', 'Community spotlight'];

  return (
    <section className="scale-benefit wrap" aria-labelledby="scale-title">
      <div className="scale-copy">
        <span className="benefit-label"><Star /> Included with Scale</span>
        <h2 id="scale-title">Good design.<br />A clearer direction.</h2>
        <p>Our highest social creative pack comes with a free assessment of your online business and a content calendar.</p>
        <ul className="benefit-list">
          <li><span className="benefit-check">✓</span> <span>A fresh look at your online presence</span></li>
          <li><span className="benefit-check">✓</span> <span>A content calendar to guide what comes next</span></li>
          <li><span className="benefit-check">✓</span> <span>Creatives that connect the plan to your brand</span></li>
        </ul>
        <a href="#contact" className="text-link" onClick={() => onChoose('Scale Package')}>
          Let’s plan your next chapter <Arrow />
        </a>
      </div>

      <div className="planning-preview" aria-label="Illustrative assessment and content calendar">
        <div className="assessment-sheet">
          <div className="sheet-top-bar">
            <span className="sheet-kicker">Design Daily / Brand assessment</span>
            <span className="sheet-badge">Audit Score: 94%</span>
          </div>
          <h3>A fresh perspective.</h3>
          {[
            { label: 'Visual consistency', pct: 88 },
            { label: 'Clarity of your offer', pct: 71 },
            { label: 'Content opportunities', pct: 54 }
          ].map(item => (
            <div className="assessment-line" key={item.label}>
              <div className="assessment-line-header">
                <span>{item.label}</span>
                <span className="assessment-pct">{item.pct}%</span>
              </div>
              <div className="assessment-progress-track">
                <i style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
          <p>Your business. Seen with fresh eyes.</p>
        </div>

        <div className="calendar-sheet">
          <div className="calendar-sheet-header">
            <div>
              <span className="calendar-title">Content calendar</span>
              <span className="calendar-sub">Month 01 • Social Rhythm</span>
            </div>
            <span className="calendar-pill">Plan ahead</span>
          </div>
          <div className="calendar-grid">
            {themes.map((theme, index) => (
              <div key={theme} className="calendar-tile">
                <span className="calendar-tile-num">0{index + 1}</span>
                <strong>{theme}</strong>
                <i className={`calendar-bar bar-${index % 3}`} />
              </div>
            ))}
          </div>
          <small>Illustrative planning example</small>
        </div>
      </div>
    </section>
  );
}

const faq = [
  ['What kind of design do you create?', 'We create static design: brand identities, merchandise graphics, stationery, banners, posters, billboards, and 2D social media creatives.'],
  ['Can I order a single design or a custom project?', 'Yes. Tell us what you need through the project form. We can discuss a brief for an individual design, a connected set of materials, or one of the listed packages.'],
  ['What does the Scale package include beyond the creatives?', 'Scale includes a free assessment of your online business and a content calendar. We agree on the assessment scope and calendar period with you when discussing the order.'],
  ['How do revisions work?', 'The listed packages include unlimited revisions. We agree on the brief and deliverable scope first, then refine the designs with your feedback.'],
  ['Do you also post content or run advertisements?', 'Our listed services focus on designing your creative assets. Posting, account management, printing, and media buying are not included in these package descriptions.'],
  ['How do I get started?', 'Choose a package or describe your project below. The form prepares an email with your brief so you can review and send it directly to Design Daily. We will discuss the scope and next steps with you.']
];

export function FAQ() {
  return (
    <section className="faq-section wrap" aria-labelledby="faq-title">
      <div className="faq-heading-block">
        <span className="section-note">Before we begin</span>
        <h2 id="faq-title">A few things<br />you might ask.</h2>
        <p className="faq-subtitle">Clear answers on our static design scope, turnaround, revisions, and onboarding process.</p>
      </div>
      <div className="faq-list">
        {faq.map(([question, answer], index) => (
          <details key={question} className="faq-card">
            <summary>
              <span className="faq-question-text">{question}</span>
              <span className="faq-icon" aria-hidden="true">+</span>
            </summary>
            <div className="faq-content">
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
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
    try {
      await navigator.clipboard.writeText(studioEmail);
      setCopyState('Email copied to clipboard! ✓');
      setTimeout(() => setCopyState(''), 4000);
    } catch {
      setCopyState(`Copy studio email: ${studioEmail}`);
    }
  };

  return (
    <section id="contact" className="contact-section wrap">
      <div className="contact-copy">
        <span className="section-note">Your next chapter starts here</span>
        <SplitText
          text="Let’s make your next impression count."
          tag="h2"
          className="contact-heading"
          textAlign="left"
          splitType="words"
          duration={0.5}
          delay={50}
          rootMargin="0px"
        />
        <p>A new brand, a fresh campaign, or something you’ve been thinking about. We’d like to hear it.</p>

        <div className="studio-card">
          <div className="studio-card-row">
            <span className="card-kicker">Studio Direct</span>
            <span className="card-online-badge"><i /> Available for projects</span>
          </div>
          <div className="email-contact">
            <a href={`mailto:${studioEmail}`} className="email-address">{studioEmail}</a>
            <button type="button" onClick={copyEmail} aria-label="Copy studio email" className="email-copy-btn">
              {copyState ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          {copyState && <p className="form-status" role="status">{copyState}</p>}
          <div className="studio-meta-grid">
            <div>
              <span className="meta-label">Location</span>
              <span className="meta-val">Dhaka, Bangladesh</span>
            </div>
            <div>
              <span className="meta-label">Turnaround</span>
              <span className="meta-val">24h Response</span>
            </div>
            <div>
              <span className="meta-label">Discipline</span>
              <span className="meta-val">100% Static Focus</span>
            </div>
          </div>
        </div>
      </div>

      <form className="contact-form" onSubmit={prepare} onChange={() => setDraft('')}>
        <div className="form-row">
          <label>
            Your name
            <input name="name" autoComplete="name" placeholder="How should we call you?" maxLength={100} required />
          </label>
          <label>
            Email address
            <input name="contact" type="email" autoComplete="email" placeholder="you@yourbusiness.com" required />
          </label>
        </div>

        <label>
          Your business link <span>(optional)</span>
          <input name="business" placeholder="Website or social profile (https://...)" maxLength={300} />
        </label>

        <label>
          What can we help with?
          <select name="service" value={service} onChange={event => setService(event.target.value)} required>
            <option value="">Select a service or package</option>
            <optgroup label="Packages">
              {packages.map(pack => <option key={pack.id}>{pack.name}</option>)}
            </optgroup>
            <optgroup label="Custom projects">
              {services.map(item => <option key={item.name}>{item.name}</option>)}
              <option>Something else</option>
            </optgroup>
          </select>
        </label>

        <label>
          A little about your project
          <textarea name="brief" rows={4} placeholder="Your business, your idea, and what you need designed…" maxLength={4000} required />
        </label>

        <div className="form-finish">
          <p>We’ll prepare your message.<br />You review and send it by email.</p>
          <Magnet padding={24} maxOffset={4} magnetStrength={8}>
            <button className="button button-dark contact-submit-btn" type="submit">
              <span>Create email draft</span>
              <Arrow diagonal />
            </button>
          </Magnet>
        </div>

        {draft && (
          <div className="draft-ready" role="status">
            <div className="draft-ready-header">
              <span className="draft-check">✓</span>
              <strong>Your draft is ready.</strong>
            </div>
            <p>Open it in your email app, review the details, and press send.</p>
            <a className="button button-dark draft-link-btn" href={draft}>
              <span>Open email draft</span>
              <Arrow diagonal />
            </a>
            <small>No email app? Send your brief directly to {studioEmail}.</small>
          </div>
        )}
      </form>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div className="footer-top">
        <a href="/#home" aria-label="Design Daily home" className="footer-wordmark">
          design daily<span aria-hidden="true" className="footer-star">✳</span>
        </a>
        <div className="footer-manifesto">
          <p className="footer-lead">One recognisable brand.<br />Everywhere you show up.</p>
          <p className="footer-founder">Independent graphic design studio founded by <strong>Julkarnine Arabi</strong>. Dhaka, Bangladesh.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Design Daily. All rights reserved.</span>
        <nav aria-label="Footer">
          <a href="/work">All work</a>
          <a href="/#packages">Packages</a>
          <a href={`mailto:${studioEmail}`}>Email us</a>
          <a href="#top">Back to top ↑</a>
        </nav>
        <span>Good design. Every day.</span>
      </div>
    </footer>
  );
}
