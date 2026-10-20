import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.json';
import { showcaseItems, getItemImages, getItemProject } from '../data/showcase';
import { packages, makeInquiry, studioEmail } from '../data/packages';
import SplitText from './SplitText';
import Magnet from './Magnet';
import { Arrow, Star } from './Icons';
import { Artwork } from './Portfolio';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generates an orthogonal SVG path with rounded 90-degree corners.
 * Path routes from (x1, y1) down to yBridge, horizontally across to x2, then down to y2.
 */
function roundedCornerPath(x1, y1, x2, y2, yBridge, radius = 24) {
  if (Math.abs(x1 - x2) < 4) {
    return `M ${x1} ${y1} V ${y2}`;
  }
  const dir = x2 > x1 ? 1 : -1;
  const r = Math.min(
    radius,
    Math.abs(x2 - x1) / 2,
    Math.abs(yBridge - y1) / 2,
    Math.abs(y2 - yBridge) / 2
  );

  return [
    `M ${x1} ${y1}`,
    `V ${yBridge - r}`,
    `Q ${x1} ${yBridge} ${x1 + dir * r} ${yBridge}`,
    `H ${x2 - dir * r}`,
    `Q ${x2} ${yBridge} ${x2} ${yBridge + r}`,
    `V ${y2}`
  ].join(' ');
}

/**
 * FlowTrail: Deterministic SVG connector implementing the exact hand-sketched wireframe.
 * - Starts at top-left "what we do?" box
 * - Flows horizontally to top-right "Brand identity" pill
 * - Routes down and left via "Crafted for perfection" bridge to first brand pill "Tripty"
 * - Follows outer rails alongside thumbnail cards
 * - Crosses horizontally in clearance gaps via teaser phrase bridges
 * - Terminates at center "Get your Quote" and "Order now" button
 */
function FlowTrail({ rootRef, activeItem, setActiveItem }) {
  const [trailPath, setTrailPath] = useState('');
  const [size, setSize] = useState({ width: 1, height: 1 });
  const activePathRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const calculatePath = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!root) return;
        const origin = root.getBoundingClientRect();
        const rootW = root.clientWidth;
        const rootH = root.scrollHeight;
        const isMobile = window.innerWidth < 850;

        setSize({ width: rootW, height: rootH });

        if (isMobile) {
          // Single left rail on mobile
          const startEl = root.querySelector('[data-flow-start]');
          const endBtn = root.querySelector('.flow-order-now-btn');
          if (!startEl || !endBtn) return;
          const startY = startEl.getBoundingClientRect().bottom - origin.top + 8;
          const endY = endBtn.getBoundingClientRect().top - origin.top + 16;
          setTrailPath(`M 24 ${startY} V ${endY}`);
          return;
        }

        const items = [...root.querySelectorAll('[data-showcase-item]')];
        if (items.length === 0) return;

        const pathCommands = [];

        // 1. Wireframe Header: from "what we do?" box horizontally to "Brand identity" pill
        const startBox = root.querySelector('[data-flow-start]');
        const discPill = root.querySelector('[data-discipline-pill]');

        if (startBox && discPill) {
          const sRect = startBox.getBoundingClientRect();
          const dRect = discPill.getBoundingClientRect();

          const xStart = sRect.right - origin.left + 8;
          const yStart = sRect.top - origin.top + sRect.height / 2;
          const xDisc = dRect.left - origin.left;

          pathCommands.push(`M ${xStart} ${yStart} H ${xDisc}`);

          // From bottom of "Brand identity" pill to First Brand Pill ("Tripty")
          const firstPill = items[0].querySelector('[data-item-pill]');
          const firstBridge = root.querySelector('[data-bridge-index="0"]');

          if (firstPill && firstBridge) {
            const pRect = firstPill.getBoundingClientRect();
            const bRect = firstBridge.getBoundingClientRect();

            const xDiscExit = dRect.left - origin.left + dRect.width / 2;
            const yDiscExit = dRect.bottom - origin.top;

            const xFirstPill = pRect.left - origin.left + pRect.width / 2;
            const yFirstPill = pRect.top - origin.top;
            const yBridge0 = bRect.top - origin.top + bRect.height / 2;

            pathCommands.push(
              roundedCornerPath(xDiscExit, yDiscExit, xFirstPill, yFirstPill, yBridge0, 24)
            );
          }
        }

        // 2. Inter-project flow: Rail along cards -> Bridge -> Next Pill
        for (let i = 0; i < items.length - 1; i++) {
          const currItem = items[i];
          const nextItem = items[i + 1];

          const currPill = currItem.querySelector('[data-item-pill]');
          const currCard = currItem.querySelector('.flow-wireframe-card');
          const bridgeEl = root.querySelector(`[data-bridge-index="${i + 1}"]`);
          const nextPill = nextItem.querySelector('[data-item-pill]');

          if (!currPill || !currCard || !bridgeEl || !nextPill) continue;

          const currPillRect = currPill.getBoundingClientRect();
          const currCardRect = currCard.getBoundingClientRect();
          const bridgeRect = bridgeEl.getBoundingClientRect();
          const nextPillRect = nextPill.getBoundingClientRect();

          const currBrief = currItem.querySelector('.flow-item-brief');
          const currBriefRect = currBrief ? currBrief.getBoundingClientRect() : currPillRect;

          // Rail X coordinate follows the current pill/brief column (LEFT for even, RIGHT for odd)
          const isCurrLeft = i % 2 === 0;

          const xRail = currPillRect.left - origin.left + currPillRect.width / 2;

          // The line flows below the brief alongside the thumbnail card down until the card finishes
          const yCardStart = currBriefRect.bottom - origin.top + 18;
          const yCardFinish = currCardRect.bottom - origin.top;

          // Next rail X aligns with the next pill center
          const xNextRail = nextPillRect.left - origin.left + nextPillRect.width / 2;
          const yNextPill = nextPillRect.top - origin.top;

          // Bridge Y sits in the vertical clearance gap below the thumbnail card
          const yBridge = bridgeRect.top - origin.top + bridgeRect.height / 2;

          // Line runs down the rail alongside the card, then crosses via bridge to the next pill
          if (yCardFinish > yCardStart) {
            pathCommands.push(`M ${xRail} ${yCardStart} V ${yCardFinish}`);
            pathCommands.push(roundedCornerPath(xRail, yCardFinish, xNextRail, yNextPill, yBridge, 24));
          } else {
            pathCommands.push(roundedCornerPath(xRail, yCardStart, xNextRail, yNextPill, yBridge, 24));
          }
        }

        // 3. From Last Project down to "Get your Quote" finale
        const lastItem = items[items.length - 1];
        const quoteSection = root.querySelector('.flow-quote-finale');
        const quoteBtn = root.querySelector('.flow-order-now-btn');
        const quoteBridge = root.querySelector('[data-flow-bridge-quote]');

        if (lastItem && quoteSection && quoteBtn && quoteBridge) {
          const lastPill = lastItem.querySelector('[data-item-pill]');
          const lastBrief = lastItem.querySelector('.flow-item-brief');
          const lastCard = lastItem.querySelector('.flow-wireframe-card');
          const qBridgeRect = quoteBridge.getBoundingClientRect();
          const qBtnRect = quoteBtn.getBoundingClientRect();

          if (lastPill && lastCard) {
            const pRect = lastPill.getBoundingClientRect();
            const bRect = lastBrief ? lastBrief.getBoundingClientRect() : pRect;
            const cRect = lastCard.getBoundingClientRect();

            const xLast = pRect.left - origin.left + pRect.width / 2;
            const yCardStart = bRect.bottom - origin.top + 18;
            const yCardFinish = cRect.bottom - origin.top;

            const xMid = rootW / 2;
            const yQuoteTop = qBtnRect.top - origin.top - 12;
            const yQBridge = qBridgeRect.top - origin.top + qBridgeRect.height / 2;

            if (yCardFinish > yCardStart) {
              pathCommands.push(`M ${xLast} ${yCardStart} V ${yCardFinish}`);
              pathCommands.push(roundedCornerPath(xLast, yCardFinish, xMid, yQuoteTop, yQBridge, 24));
            } else {
              pathCommands.push(roundedCornerPath(xLast, yCardStart, xMid, yQuoteTop, yQBridge, 24));
            }
          }
        }

        setTrailPath(pathCommands.join(' '));
      });
    };

    const observer = new ResizeObserver(calculatePath);
    observer.observe(root);
    root.querySelectorAll('[data-showcase-item]').forEach(el => observer.observe(el));

    window.addEventListener('resize', calculatePath);
    document.fonts.ready.then(calculatePath);
    calculatePath();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', calculatePath);
    };
  }, [rootRef]);

  // ScrollTrigger to animate active coral line
  useEffect(() => {
    if (!trailPath || !activePathRef.current) return;
    const root = rootRef.current;
    if (!root) return;

    const pathEl = activePathRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      pathEl.style.strokeDashoffset = '0';
      return;
    }

    const updateTrail = () => {
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = gsap.utils.clamp(
        0,
        1,
        (-rect.top + viewportH * 0.45) / Math.max(1, rect.height - viewportH * 0.5)
      );
      pathEl.style.strokeDashoffset = String(1 - progress);
    };

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 80%',
      end: 'bottom 40%',
      onUpdate: updateTrail,
      onRefresh: updateTrail,
    });

    updateTrail();

    return () => trigger.kill();
  }, [trailPath, rootRef]);

  // IntersectionObserver to illuminate pills as reached
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll('[data-showcase-item]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-showcase-item');
            entry.target.classList.add('is-reached');
            setActiveItem(itemId);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef, setActiveItem]);

  return (
    <svg
      className="flow-circuit-svg"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      {trailPath && (
        <>
          <path className="flow-circuit-base" d={trailPath} />
          <path
            ref={activePathRef}
            className="flow-circuit-active"
            d={trailPath}
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </>
      )}
    </svg>
  );
}

/**
 * Individual Project Row matching the wireframe:
 * Pill Button + Middle-Aligned 2-3 Line Brief on one side,
 * Thumbnail Card on the other side.
 */
function ShowcaseRow({ item, index, total }) {
  const isOdd = index % 2 === 1; // 0, 2, 4: Pill on Left, Card on Right. 1, 3, 5: Card on Left, Pill on Right.
  const project = getItemProject(item, projects);
  const images = getItemImages(item, projects);
  const [lead, ...details] = images;

  return (
    <div
      className={`flow-wireframe-row ${isOdd ? 'flow-reverse' : ''}`}
      data-showcase-item={item.id}
      id={`project-${item.id}`}
    >
      {/* 1. Pill & Brief Column (1/3 width) */}
      <div className="flow-wireframe-meta-col">
        <div className="flow-wireframe-pill-wrap">
          <div className="flow-item-pill" data-item-pill={item.id}>
            <span className="pill-star">✦</span>
            <span className="pill-brand-name">{item.brandName}</span>
          </div>
        </div>

        <p className="flow-item-brief">{item.brief}</p>
      </div>

      {/* 2. Thumbnail Card Column (2/3 width) */}
      <div className="flow-wireframe-card-col">
        {project && lead && (
          <article className="flow-wireframe-card">
            <a href={`/work/${project.id}`} className="flow-wireframe-link">
              <div className="card-topbar">
                <div className="card-topbar-info">
                  <span className="card-disc-tag">{item.discipline}</span>
                  <h4 className="card-brand-title">{project.title}</h4>
                </div>
                <span className="card-action-btn">
                  <span>View project</span>
                  <Arrow diagonal />
                </span>
              </div>

              <div className="card-art-canvas" style={{ '--art-ratio': `${lead.width} / ${lead.height}` }}>
                <Artwork image={lead} eager={index === 0} />
              </div>

              {details.length > 0 && (
                <div className="card-details-strip">
                  {details.slice(0, 3).map((img, dIdx) => (
                    <div key={img.src || dIdx} className="card-thumb-item">
                      <Artwork image={img} />
                    </div>
                  ))}
                </div>
              )}
            </a>
          </article>
        )}
      </div>
    </div>
  );
}

/**
 * Main ShowcaseFlow Component implementing the exact Hand-Sketched Wireframe:
 * - "what we do?" box (top left)
 * - "Brand identity" pill (top right)
 * - "Crafted for perfection" bridge
 * - Alternating Brand Pills with 2-3 line middle-aligned brief & Thumbnail Cards
 * - Inter-brand bridges with teaser phrases ("Let's go organic", "Linen power", etc.)
 * - "Get your Quote" + "Order now" button (links to #packages)
 * - Packages (3 White Reference Cards on Dark Canvas)
 * - Scale Benefit, FAQ, and Inquiry Form
 */
export default function ShowcaseFlow({ service, setService }) {
  const root = useRef(null);
  const [activeItem, setActiveItem] = useState('tripty');

  return (
    <div ref={root} className="showcase-flow-container" id="works">
      {/* Deterministic SVG Flow Trail following the sketch */}
      <FlowTrail
        rootRef={root}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />

      {/* 1. Top Section Header (from sketch: "what we do?" on left, "Brand identity" pill on right) */}
      <header className="flow-wireframe-header-section">
        <div className="flow-wireframe-topbar">
          <div className="flow-wireframe-start-box" data-flow-start>
            <span className="box-prefix">✦</span>
            <span className="box-text">what we do?</span>
          </div>

          <div className="flow-wireframe-discipline-pill" data-discipline-pill>
            <span className="pill-dot">✦</span>
            <span className="pill-label">Brand identity</span>
          </div>
        </div>

        {/* First Bridge: "Crafted for perfection" */}
        <div className="flow-sketch-bridge" data-bridge-index="0">
          <div className="bridge-pill-tag">
            <span>Crafted for perfection</span>
          </div>
        </div>
      </header>

      {/* 2. Alternating Projects Sequence */}
      <div className="flow-wireframe-items-wrapper">
        {showcaseItems.map((item, idx) => (
          <div key={item.id} className="flow-item-bundle">
            <ShowcaseRow item={item} index={idx} total={showcaseItems.length} />

            {/* Inter-brand bridge with teaser phrase */}
            {idx < showcaseItems.length - 1 && (
              <div className="flow-sketch-bridge" data-bridge-index={idx + 1}>
                <div className="bridge-pill-tag">
                  <span>{showcaseItems[idx + 1].teaser}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Transition Bridge to Quote Finale */}
      <div className="flow-sketch-bridge" data-flow-bridge-quote>
        <div className="bridge-pill-tag">
          <span>Ready for your next chapter</span>
        </div>
      </div>

      {/* 4. "Get your Quote" & "Order now" Button (directly from sketch) */}
      <section className="flow-quote-finale" id="quote" aria-labelledby="quote-title">
        <div className="flow-quote-card">
          <span className="flow-quote-star" aria-hidden="true">✦</span>
          <h3 id="quote-title" className="flow-quote-title">Get your Quote</h3>
          <p className="flow-quote-desc">
            Choose a dedicated monthly package or request a custom brief tailored to your brand.
          </p>
          <div className="flow-quote-action">
            <a href="#packages" className="flow-order-now-btn">
              <span>Order now</span>
              <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Packages Section (White Reference Cards on Dark Canvas) */}
      <section id="packages" className="flow-packages-section" aria-labelledby="packages-title">
        <div className="flow-packages-header">
          <span className="section-note">Fixed Transparent Pricing</span>
          <h2 id="packages-title" className="flow-packages-title">Choose how we build your next chapter.</h2>
          <p className="flow-packages-subtitle">Dedicated monthly design capacity for founders, brands, and growing businesses.</p>
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
              onClick={() => setService && setService(pack.name)}
            >
              <span>Choose {pack.name.replace(' Package', '')}</span>
              <Arrow diagonal />
            </a>
          ))}
        </div>
      </section>

      {/* 6. Scale Benefit Section */}
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
          <a href="#contact" className="text-link" onClick={() => setService && setService('Scale Package')}>
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
              {['Meet the brand', 'A product story', 'Helpful advice', 'Behind the scenes', 'A reason to choose you', 'Community spotlight'].map((theme, index) => (
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

      {/* 7. Compact Studio FAQ */}
      <section className="faq-section wrap" aria-labelledby="faq-title">
        <div className="faq-heading-block">
          <span className="section-note">Before we begin</span>
          <h2 id="faq-title">A few things<br />you might ask.</h2>
          <p className="faq-subtitle">Clear answers on our static design scope, turnaround, revisions, and onboarding process.</p>
        </div>
        <div className="faq-list">
          {[
            ['What kind of design do you create?', 'We create static design: brand identities, merchandise graphics, stationery, banners, posters, billboards, and 2D social media creatives.'],
            ['Can I order a single design or a custom project?', 'Yes. Tell us what you need through the project form. We can discuss a brief for an individual design, a connected set of materials, or one of the listed packages.'],
            ['What does the Scale package include beyond the creatives?', 'Scale includes a free assessment of your online business and a content calendar. We agree on the assessment scope and calendar period with you when discussing the order.'],
            ['How do revisions work?', 'The listed packages include unlimited revisions. We agree on the brief and deliverable scope first, then refine the designs with your feedback.'],
            ['Do you also post content or run advertisements?', 'Our listed services focus on designing your creative assets. Posting, account management, printing, and media buying are not included in these package descriptions.'],
            ['How do I get started?', 'Choose a package or describe your project below. The form prepares an email with your brief so you can review and send it directly to Design Daily. We will discuss the scope and next steps with you.']
          ].map(([question, answer]) => (
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

      {/* 8. Studio Direct Contact Form */}
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
            </div>
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

        <form
          className="contact-form"
          onSubmit={e => {
            e.preventDefault();
            const vals = Object.fromEntries(new FormData(e.currentTarget));
            const mailto = makeInquiry(vals);
            window.location.href = mailto;
          }}
        >
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
            <select name="service" value={service} onChange={e => setService(e.target.value)} required>
              <option value="">Select a service or package</option>
              <optgroup label="Packages">
                {packages.map(pack => <option key={pack.id}>{pack.name}</option>)}
              </optgroup>
              <optgroup label="Custom projects">
                {['Brand identity', 'Packaging', 'Social creatives', 'Banners', 'Posters & billboards', 'Merchandise', 'Stationery & brochures'].map(item => (
                  <option key={item}>{item}</option>
                ))}
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
        </form>
      </section>
    </div>
  );
}
