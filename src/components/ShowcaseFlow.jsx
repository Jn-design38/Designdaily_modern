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
 * Appends an orthogonal bridge segment with rounded corners from current pen position.
 * Routes vertically from current Y to yBridge, horizontally across to x2, then vertically down to y2.
 * Zero disconnected subpaths or M jumps: one continuous flowing line.
 */
function appendOrthogonalBridge(commands, x1, y1, x2, y2, yBridge, radius = 24) {
  if (Math.abs(x1 - x2) < 4) {
    commands.push(`V ${y2}`);
    return;
  }
  const dir = x2 > x1 ? 1 : -1;
  const r = Math.min(
    radius,
    Math.abs(x2 - x1) / 2,
    Math.max(4, Math.abs(yBridge - y1) / 2),
    Math.max(4, Math.abs(y2 - yBridge) / 2)
  );

  commands.push(`V ${yBridge - r}`);
  commands.push(`Q ${x1} ${yBridge} ${x1 + dir * r} ${yBridge}`);
  commands.push(`H ${x2 - dir * r}`);
  commands.push(`Q ${x2} ${yBridge} ${x2} ${yBridge + r}`);
  commands.push(`V ${y2}`);
}

/**
 * FlowTrail: Deterministic SVG connector implementing the exact hand-sketched wireframe.
 * - Single unbroken continuous line starting at top-left "what we do?" box
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
        const isMobile = window.innerWidth < 640;

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

        // 1. Single start point for the entire circuit
        const startBox = root.querySelector('[data-flow-start]');
        const discPill = root.querySelector('[data-discipline-pill]');
        if (!startBox || !discPill) return;

        const sRect = startBox.getBoundingClientRect();
        const dRect = discPill.getBoundingClientRect();

        const xStart = sRect.right - origin.left + 8;
        const yStart = sRect.top - origin.top + sRect.height / 2;
        const xDisc = dRect.left - origin.left;

        // Exactly ONE 'M' command at the very start of the continuous circuit!
        pathCommands.push(`M ${xStart} ${yStart} H ${xDisc}`);

        // From "Brand identity" to First Project ("Tripty")
        const firstPill = items[0].querySelector('[data-item-pill]');
        const firstBridge = root.querySelector('[data-bridge-index="0"]');
        const firstCard = items[0].querySelector('.flow-wireframe-card');

        if (!firstPill || !firstBridge || !firstCard) return;

        const pRect0 = firstPill.getBoundingClientRect();
        const bRect0 = firstBridge.getBoundingClientRect();
        const cRect0 = firstCard.getBoundingClientRect();

        const xRail0 = pRect0.left - origin.left + pRect0.width / 2;
        const yFirstBridge = bRect0.top - origin.top + bRect0.height / 2;
        const yCardFinish0 = cRect0.bottom - origin.top;

        // Bridge from (xDisc, yStart) down to yFirstBridge, across to xRail0, and down along card 0
        appendOrthogonalBridge(pathCommands, xDisc, yStart, xRail0, yCardFinish0, yFirstBridge, 24);

        // 2. Inter-project flow: from (xCurrRail, yCurrFinish) across bridge to (xNextRail, yNextFinish)
        for (let i = 0; i < items.length - 1; i++) {
          const currItem = items[i];
          const nextItem = items[i + 1];

          const currPill = currItem.querySelector('[data-item-pill]');
          const currCard = currItem.querySelector('.flow-wireframe-card');
          const bridgeEl = root.querySelector(`[data-bridge-index="${i + 1}"]`);
          const nextPill = nextItem.querySelector('[data-item-pill]');
          const nextCard = nextItem.querySelector('.flow-wireframe-card');

          if (!currPill || !currCard || !bridgeEl || !nextPill || !nextCard) continue;

          const currPillRect = currPill.getBoundingClientRect();
          const currCardRect = currCard.getBoundingClientRect();
          const bridgeRect = bridgeEl.getBoundingClientRect();
          const nextPillRect = nextPill.getBoundingClientRect();
          const nextCardRect = nextCard.getBoundingClientRect();

          const xCurrRail = currPillRect.left - origin.left + currPillRect.width / 2;
          const yCurrFinish = currCardRect.bottom - origin.top;

          const xNextRail = nextPillRect.left - origin.left + nextPillRect.width / 2;
          const yNextFinish = nextCardRect.bottom - origin.top;
          const yBridge = bridgeRect.top - origin.top + bridgeRect.height / 2;

          appendOrthogonalBridge(pathCommands, xCurrRail, yCurrFinish, xNextRail, yNextFinish, yBridge, 24);
        }

        // 3. From Last Project down to "Get your Quote" finale
        const lastItem = items[items.length - 1];
        const quoteBtn = root.querySelector('.flow-order-now-btn');
        const quoteBridge = root.querySelector('[data-flow-bridge-quote]');

        if (lastItem && quoteBtn && quoteBridge) {
          const lastPill = lastItem.querySelector('[data-item-pill]');
          const lastCard = lastItem.querySelector('.flow-wireframe-card');
          if (lastPill && lastCard) {
            const pRect = lastPill.getBoundingClientRect();
            const cRect = lastCard.getBoundingClientRect();
            const qBridgeRect = quoteBridge.getBoundingClientRect();
            const qBtnRect = quoteBtn.getBoundingClientRect();

            const xLastRail = pRect.left - origin.left + pRect.width / 2;
            const yLastFinish = cRect.bottom - origin.top;
            const xMid = rootW / 2;
            const yQuoteTop = qBtnRect.top - origin.top - 12;
            const yQBridge = qBridgeRect.top - origin.top + qBridgeRect.height / 2;

            appendOrthogonalBridge(pathCommands, xLastRail, yLastFinish, xMid, yQuoteTop, yQBridge, 24);
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

  // Scroll tracking: Real-time path flow + Button color fill on contact
  useEffect(() => {
    if (!trailPath || !activePathRef.current) return;
    const root = rootRef.current;
    if (!root) return;

    const pathEl = activePathRef.current;
    let totalLength = 0;
    try {
      totalLength = pathEl.getTotalLength();
    } catch {
      return;
    }
    if (totalLength <= 0) return;

    pathEl.style.strokeDasharray = `${totalLength}`;
    pathEl.style.strokeDashoffset = `${totalLength}`;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      pathEl.style.strokeDashoffset = '0';
      return;
    }

    // Pre-sample points along path for instantaneous, 100% accurate Y-to-distance mapping
    const samples = [];
    const numSteps = 240;
    for (let i = 0; i <= numSteps; i++) {
      const d = (totalLength * i) / numSteps;
      const pt = pathEl.getPointAtLength(d);
      samples.push({ d, x: pt.x, y: pt.y });
    }

    const getDistanceForY = (targetY) => {
      if (targetY <= samples[0].y) return 0;
      if (targetY >= samples[samples.length - 1].y) return totalLength;

      // Binary search for the matching sample segment
      let low = 0;
      let high = samples.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (samples[mid].y < targetY) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      const idx = Math.max(0, Math.min(samples.length - 2, high));
      const s0 = samples[idx];
      const s1 = samples[idx + 1];
      const dy = s1.y - s0.y;
      const t = dy > 0.0001 ? gsap.utils.clamp(0, 1, (targetY - s0.y) / dy) : 0.5;
      return s0.d + t * (s1.d - s0.d);
    };

    const updateTrail = () => {
      if (!root || !activePathRef.current) return;
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // Reading focus sits comfortably at 55% of viewport
      const targetY = window.scrollY - (rect.top + window.scrollY) + viewportH * 0.55;

      const drawnLength = gsap.utils.clamp(0, totalLength, getDistanceForY(targetY));
      const offset = totalLength - drawnLength;
      pathEl.style.strokeDashoffset = String(offset);

      const progress = totalLength > 0 ? drawnLength / totalLength : 0;

      // 3. Only these 4 buttons light up. Rest of the buttons will not light up:
      // Button 1: "what we do"
      const startBox = root.querySelector('[data-flow-start]');
      if (startBox) {
        if (progress > 0.001) {
          startBox.classList.add('is-lit');
        } else {
          startBox.classList.remove('is-lit');
        }
      }

      // Button 2: "brand identity"
      const discPill = root.querySelector('[data-discipline-pill]');
      if (discPill) {
        const dRect = discPill.getBoundingClientRect();
        const sRect = startBox ? startBox.getBoundingClientRect() : null;
        const seg1Len = sRect ? Math.max(10, dRect.left - sRect.right) : 600;
        if (drawnLength >= (seg1Len - 10) || targetY > (dRect.bottom - rect.top)) {
          discPill.classList.add('is-lit');
        } else {
          discPill.classList.remove('is-lit');
        }
      }

      // Button 3: "packaging & merch" (The packaging and merch)
      const packBridge = root.querySelector('[data-bridge-pill*="packag" i]');
      if (packBridge) {
        const pRect = packBridge.getBoundingClientRect();
        const yPack = pRect.top - rect.top;
        if (targetY >= (yPack - 20)) {
          packBridge.classList.add('is-lit');
        } else {
          packBridge.classList.remove('is-lit');
        }
      }

      // Button 4: "social media Creatives"
      const socialBridge = root.querySelector('[data-bridge-pill*="social" i]');
      if (socialBridge) {
        const sRect = socialBridge.getBoundingClientRect();
        const ySocial = sRect.top - rect.top;
        if (targetY >= (ySocial - 20)) {
          socialBridge.classList.add('is-lit');
        } else {
          socialBridge.classList.remove('is-lit');
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTrail();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTrail, { passive: true });
    updateTrail();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTrail);
    };
  }, [trailPath, rootRef]);

  return (
    <svg
      className="flow-circuit-svg"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
    >
      {trailPath && (
        <path
          ref={activePathRef}
          className="flow-circuit-active"
          d={trailPath}
        />
      )}
    </svg>
  );
}

/**
 * Individual Project Row matching user specification:
 * - Pill Button + Middle-Aligned 2-3 Line Brief on one side (buttons do NOT light up)
 * - Single image card (NO bounding box, NO topbar, NO thumb strip)
 * - Name in bottom left over card + 2-line description
 * - Soft dark faded gradient coming from the bottom of the card
 */
function ShowcaseRow({ item, index, total }) {
  const isOdd = index % 2 === 1; // 0, 2, 4: Pill on Left, Card on Right. 1, 3, 5: Card on Left, Pill on Right.
  const project = getItemProject(item, projects);
  const images = getItemImages(item, projects);
  const lead = images[0];

  return (
    <div
      className={`flow-wireframe-row ${isOdd ? 'flow-reverse' : ''}`}
      data-showcase-item={item.id}
      id={`project-${item.id}`}
    >
      {/* 1. Pill & Brief Column (1/3 width) - Rest of the buttons do NOT light up */}
      <div className="flow-wireframe-meta-col">
        <div className="flow-wireframe-pill-wrap">
          <div className="flow-item-pill" data-item-pill={item.id}>
            <span className="pill-star">✦</span>
            <span className="pill-brand-name">{item.brandName}</span>
          </div>
        </div>

        <p className="flow-item-brief">{item.brief}</p>
      </div>

      {/* 2. Single Image Card (NO bounding box, ONE image, bottom-left name & 2-line desc over soft dark faded gradient) */}
      <div className="flow-wireframe-card-col">
        {project && lead && (
          <article className="flow-wireframe-card">
            <a href={`/work/${project.id}`} className="flow-card-image-link">
              <div className="flow-card-image-container">
                <Artwork image={lead} eager={index === 0} />
              </div>
              <div className="flow-card-bottom-gradient" aria-hidden="true" />
              <div className="flow-card-bottom-info">
                <h4 className="flow-card-overlay-title">{project.title || item.brandName}</h4>
                <p className="flow-card-overlay-desc">{item.brief || project.description}</p>
              </div>
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
                <div className="bridge-pill-tag" data-bridge-pill={showcaseItems[idx + 1].teaser}>
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
