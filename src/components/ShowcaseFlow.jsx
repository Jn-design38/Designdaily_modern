import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.json';
import { chapterDefinitions, getChapterImages, getChapterProjects } from '../data/showcase';
import { packages, makeInquiry, studioEmail } from '../data/packages';
import SplitText from './SplitText';
import Magnet from './Magnet';
import { Arrow, Star } from './Icons';
import { Artwork } from './Portfolio';

gsap.registerPlugin(ScrollTrigger);

/**
 * Generates an orthogonal path with rounded 90-degree corners.
 * Path routes from (x1, y1) down to yBridge, across to x2, then down to y2.
 */
function roundedCornerPath(x1, y1, x2, y2, yBridge, radius = 24) {
  if (Math.abs(x1 - x2) < 4) {
    return `M ${x1} ${y1} V ${y2}`;
  }
  const dir = x2 > x1 ? 1 : -1;
  const r = Math.min(radius, Math.abs(x2 - x1) / 2, Math.abs(yBridge - y1) / 2, Math.abs(y2 - yBridge) / 2);
  
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
 * FlowTrail: Calculates deterministic SVG path that strictly travels through
 * open surrounding space, connecting to element edges without ever intersecting
 * pills, paragraphs, boxes, cards, or prices.
 */
function FlowTrail({ rootRef, activeChapter, setActiveChapter }) {
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
          // Continuous single-rail on mobile
          const startEl = root.querySelector('[data-flow-start]');
          const endEl = root.querySelector('[data-flow-finale-cta]');
          if (!startEl || !endEl) return;
          const startY = startEl.getBoundingClientRect().bottom - origin.top + 8;
          const endY = endEl.getBoundingClientRect().top - origin.top + 16;
          setTrailPath(`M 24 ${startY} V ${endY}`);
          return;
        }

        const chapters = [...root.querySelectorAll('[data-chapter-id]')];
        if (chapters.length === 0) return;

        const pathCommands = [];

        // 1. Start line: from opening badge down to Chapter 01 pill top
        const startAnchor = root.querySelector('[data-flow-start]');
        const firstPill = chapters[0].querySelector('[data-flow-pill]');
        if (startAnchor && firstPill) {
          const sRect = startAnchor.getBoundingClientRect();
          const pRect = firstPill.getBoundingClientRect();
          const x0 = pRect.left - origin.left + pRect.width / 2;
          const yStart = sRect.bottom - origin.top + 12;
          const yPillTop = pRect.top - origin.top;
          // Connects strictly to top of pill — stops there, never flows behind
          pathCommands.push(`M ${x0} ${yStart} V ${yPillTop}`);
        }

        // 2. Inter-chapter transitions (Chapters 01 through 07)
        for (let i = 0; i < chapters.length - 1; i++) {
          const currChapter = chapters[i];
          const nextChapter = chapters[i + 1];

          const currPill = currChapter.querySelector('[data-flow-pill]');
          const currInfoCol = currChapter.querySelector('.flow-info-col');
          const nextPill = nextChapter.querySelector('[data-flow-pill]');
          const bridgeEl = currChapter.querySelector('[data-flow-bridge]');

          if (!currPill || !currInfoCol || !nextPill || !bridgeEl) continue;

          const currPillRect = currPill.getBoundingClientRect();
          const currInfoRect = currInfoCol.getBoundingClientRect();
          const nextPillRect = nextPill.getBoundingClientRect();
          const bridgeRect = bridgeEl.getBoundingClientRect();

          // Rail X coordinates align with the pill centers
          const x1 = currPillRect.left - origin.left + currPillRect.width / 2;
          // Exit below the text column — ZERO lines behind heading, paragraph, or micro-notes!
          const yExit = currInfoRect.bottom - origin.top + 16;

          const x2 = nextPillRect.left - origin.left + nextPillRect.width / 2;
          // Connects strictly to top of next pill — stops there!
          const yEntry = nextPillRect.top - origin.top;

          // Bridge Y sits in the vertical clearance gap between chapters
          const yBridge = bridgeRect.top - origin.top + bridgeRect.height / 2;

          if (yExit < yBridge && yBridge < yEntry) {
            pathCommands.push(roundedCornerPath(x1, yExit, x2, yEntry, yBridge, 24));
          } else {
            // Safety fallback if viewport is unusually compressed
            pathCommands.push(`M ${x1} ${yExit} V ${yBridge} H ${x2} V ${yEntry}`);
          }
        }

        // 3. Transition from Chapter 07 to Studio Approach
        const lastChapter = chapters[chapters.length - 1];
        const approachBridge = root.querySelector('[data-flow-bridge-approach]');
        const approachSection = root.querySelector('.flow-approach-section');

        if (lastChapter && approachBridge && approachSection) {
          const lastPill = lastChapter.querySelector('[data-flow-pill]');
          const lastInfoCol = lastChapter.querySelector('.flow-info-col');

          if (lastPill && lastInfoCol) {
            const lastPillRect = lastPill.getBoundingClientRect();
            const lastInfoRect = lastInfoCol.getBoundingClientRect();
            const appBridgeRect = approachBridge.getBoundingClientRect();
            const appSecRect = approachSection.getBoundingClientRect();

            const xLast = lastPillRect.left - origin.left + lastPillRect.width / 2;
            const yLastExit = lastInfoRect.bottom - origin.top + 16;
            const xMid = rootW / 2;
            const yAppBridge = appBridgeRect.top - origin.top + appBridgeRect.height / 2;
            const yAppTop = appSecRect.top - origin.top + 10;

            // Routes in empty vertical corridor between Ch 07 and Approach to xMid!
            pathCommands.push(roundedCornerPath(xLast, yLastExit, xMid, yAppTop, yAppBridge, 24));
          }
        }

        // 4. From Approach bottom to Packages top
        const approachSteps = root.querySelector('.flow-approach-steps');
        const packagesSection = root.querySelector('.flow-packages-section');
        if (approachSteps && packagesSection) {
          const appStepsRect = approachSteps.getBoundingClientRect();
          const pkgSecRect = packagesSection.getBoundingClientRect();
          const xMid = rootW / 2;
          const yAppExit = appStepsRect.bottom - origin.top + 16;
          const yPkgTop = pkgSecRect.top - origin.top + 12;
          pathCommands.push(`M ${xMid} ${yAppExit} V ${yPkgTop}`);
        }

        // 5. From Packages bottom down to Scale Benefit top
        const packageGrid = root.querySelector('.package-grid');
        const scaleSection = root.querySelector('.scale-benefit');
        if (packageGrid && scaleSection) {
          const pkgGridRect = packageGrid.getBoundingClientRect();
          const scaleRect = scaleSection.getBoundingClientRect();
          const xMid = rootW / 2;
          const yPkgExit = pkgGridRect.bottom - origin.top + 20;
          const yScaleTop = scaleRect.top - origin.top + 10;
          pathCommands.push(`M ${xMid} ${yPkgExit} V ${yScaleTop}`);
        }

        // 6. From FAQ bottom down to Final CTA Magnet button
        const faqSection = root.querySelector('.faq-section');
        const finaleCtaBtn = root.querySelector('[data-flow-finale-cta]');
        if (faqSection && finaleCtaBtn) {
          const faqRect = faqSection.getBoundingClientRect();
          const ctaRect = finaleCtaBtn.getBoundingClientRect();
          const xMid = rootW / 2;
          const yFaqExit = faqRect.bottom - origin.top + 20;
          const yCtaTop = ctaRect.top - origin.top;
          pathCommands.push(`M ${xMid} ${yFaqExit} V ${yCtaTop}`);
        }

        setTrailPath(pathCommands.join(' '));
      });
    };

    const observer = new ResizeObserver(calculatePath);
    observer.observe(root);
    root.querySelectorAll('[data-chapter-id]').forEach(ch => observer.observe(ch));

    window.addEventListener('resize', calculatePath);
    document.fonts.ready.then(calculatePath);
    calculatePath();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', calculatePath);
    };
  }, [rootRef]);

  // ScrollTrigger to animate active coral line along the SVG path
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

  // Observer to toggle active state on chapters as the line reaches them
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const chapters = root.querySelectorAll('[data-chapter-id]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const chapterId = entry.target.getAttribute('data-chapter-id');
            entry.target.classList.add('is-reached');
            setActiveChapter(chapterId);
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px' }
    );

    chapters.forEach(ch => observer.observe(ch));
    return () => observer.disconnect();
  }, [rootRef, setActiveChapter]);

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
 * Individual Chapter Component
 */
function FlowChapter({ chapter, index, total }) {
  const collection = getChapterProjects(chapter, projects);
  const isOdd = index % 2 === 1; // 0, 2, 4, 6: Pill on Left; 1, 3, 5: Pill on Right
  const leadProject = collection[0];
  const images = leadProject ? getChapterImages(chapter, leadProject) : [];
  const [lead, ...details] = images;

  const pillIcon =
    index === 0 ? '✦' :
    index === 1 ? '📦' :
    index === 2 ? '≡' :
    index === 3 ? '◫' :
    index === 4 ? '⊞' :
    index === 5 ? '👕' : '✉';

  return (
    <section
      id={chapter.id}
      className={`flow-chapter ${isOdd ? 'flow-reverse' : ''}`}
      data-chapter-id={chapter.id}
      data-index={index}
      aria-labelledby={`${chapter.id}-heading`}
    >
      <div className="flow-chapter-grid">
        {/* Information Rail (Discipline Node Pill + Title + Paragraph + Micro-Notes) */}
        <div className="flow-info-col">
          <div className="flow-pill" data-flow-pill={chapter.id}>
            <span className="flow-pill-icon" aria-hidden="true">{pillIcon}</span>
            <span className="flow-pill-label">{chapter.label}</span>
            <span className="flow-pill-index">0{index + 1}</span>
          </div>

          <h3 id={`${chapter.id}-heading`} className="flow-chapter-title">
            {chapter.title.split('\n').map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </h3>

          <p className="flow-chapter-intro">{chapter.intro}</p>

          <div className="flow-chapter-notes">
            {chapter.notes.map(([title, desc], nIdx) => (
              <div key={title} className="flow-note-card">
                <span className="flow-note-bullet" aria-hidden="true">
                  {nIdx === 0 ? '⚡' : nIdx === 1 ? '↗' : '↔'}
                </span>
                <div className="flow-note-text">
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flow-chapter-footer">
            <a href={`/work?category=${chapter.categories[0]}`} className="flow-explore-link">
              <span>Explore all {collection.length} {chapter.label.toLowerCase()} projects</span>
              <Arrow diagonal />
            </a>
          </div>
        </div>

        {/* Artwork Display Card (Elevated container with quiet framing) */}
        <div className="flow-card-col">
          {leadProject && lead && (
            <article className="flow-display-card">
              <a href={`/work/${leadProject.id}?from=${chapter.id}`} className="flow-card-link">
                <div className="flow-card-topbar">
                  <div className="flow-card-meta">
                    <span className="flow-card-badge">{chapter.label}</span>
                    <h4 className="flow-card-name">{leadProject.title}</h4>
                  </div>
                  <span className="flow-card-action">
                    <span>View project</span>
                    <Arrow diagonal />
                  </span>
                </div>

                <div className="flow-card-artwork" style={{ '--art-ratio': `${lead.width} / ${lead.height}` }}>
                  <Artwork image={lead} eager={index === 0} />
                </div>

                {details.length > 0 && (
                  <div className="flow-card-details">
                    {details.slice(0, 3).map((img, dIdx) => (
                      <div key={img.src || dIdx} className="flow-card-thumb">
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

      {/* Inter-chapter Transition Bridge (Runs strictly in the open clearance gap) */}
      {index < total - 1 && (
        <div className="flow-bridge-row" data-flow-bridge={chapter.id}>
          <div className="flow-bridge-tag">
            <span>{chapter.transition}</span>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Condensed Studio Approach Statement
 */
function ApproachStatement() {
  const steps = [
    { num: '01', title: 'Understand', copy: 'Discovery and brief around your business, audience, and offer.' },
    { num: '02', title: 'Design', copy: 'Exploring directions and turning the brief into considered static concepts.' },
    { num: '03', title: 'Refine', copy: 'Iterative feedback with unlimited revisions until every detail is right.' },
    { num: '04', title: 'Deliver', copy: 'Production-ready assets organized with clear specs for launch.' }
  ];

  return (
    <section className="flow-approach-section" id="approach" aria-label="Studio Approach">
      <div className="flow-approach-content">
        <span className="section-note">Studio Approach</span>
        <h2 className="flow-approach-title">
          You bring the business.<br />We bring the design.
        </h2>
        <p className="flow-approach-lead">
          One clear conversation, from the first idea to the final detail.
        </p>

        <div className="flow-approach-steps">
          {steps.map(step => (
            <div key={step.num} className="approach-step-card">
              <span className="approach-step-num">{step.num}</span>
              <h4 className="approach-step-title">{step.title}</h4>
              <p className="approach-step-copy">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * White Package Cards on Dark Canvas (Exact Reference Card Styling)
 */
function FlowPackages({ onChoose }) {
  return (
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
            onClick={() => onChoose && onChoose(pack.name)}
          >
            <span>Choose {pack.name.replace(' Package', '')}</span>
            <Arrow diagonal />
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * Scale Benefit Section
 */
function FlowScaleBenefit({ onChoose }) {
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
        <a href="#contact" className="text-link" onClick={() => onChoose && onChoose('Scale Package')}>
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

/**
 * Compact FAQ Section
 */
function FlowFAQ() {
  const faqList = [
    ['What kind of design do you create?', 'We create static design: brand identities, merchandise graphics, stationery, banners, posters, billboards, and 2D social media creatives.'],
    ['Can I order a single design or a custom project?', 'Yes. Tell us what you need through the project form. We can discuss a brief for an individual design, a connected set of materials, or one of the listed packages.'],
    ['What does the Scale package include beyond the creatives?', 'Scale includes a free assessment of your online business and a content calendar. We agree on the assessment scope and calendar period with you when discussing the order.'],
    ['How do revisions work?', 'The listed packages include unlimited revisions. We agree on the brief and deliverable scope first, then refine the designs with your feedback.'],
    ['Do you also post content or run advertisements?', 'Our listed services focus on designing your creative assets. Posting, account management, printing, and media buying are not included in these package descriptions.'],
    ['How do I get started?', 'Choose a package or describe your project below. The form prepares an email with your brief so you can review and send it directly to Design Daily. We will discuss the scope and next steps with you.']
  ];

  return (
    <section className="faq-section wrap" aria-labelledby="faq-title">
      <div className="faq-heading-block">
        <span className="section-note">Before we begin</span>
        <h2 id="faq-title">A few things<br />you might ask.</h2>
        <p className="faq-subtitle">Clear answers on our static design scope, turnaround, revisions, and onboarding process.</p>
      </div>
      <div className="faq-list">
        {faqList.map(([question, answer]) => (
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

/**
 * Final CTA Section
 */
function FlowFinale({ onChoose }) {
  return (
    <section className="flow-finale-section" id="finale-cta" aria-labelledby="finale-cta-title">
      <div className="flow-finale-card">
        <span className="flow-finale-port" aria-hidden="true">✦</span>
        <h2 id="finale-cta-title" className="flow-finale-title">
          Your brand could be next.
        </h2>
        <p className="flow-finale-desc">
          From the first identity to the next campaign, let’s make every touchpoint feel like you.
        </p>

        <div className="flow-finale-actions">
          <div data-flow-finale-cta>
            <Magnet padding={28} maxOffset={6} magnetStrength={8}>
              <a href="#contact" className="button flow-primary-btn">
                <span>Start your project</span>
                <Arrow diagonal />
              </a>
            </Magnet>
          </div>
          <a href="#packages" className="flow-secondary-link">
            <span>Explore packages</span>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Direct Studio Inquiry Form
 */
function FlowContact({ service, setService }) {
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

  const servicesList = [
    'Brand identity',
    'Packaging',
    'Social creatives',
    'Banners',
    'Posters & billboards',
    'Merchandise',
    'Stationery & brochures'
  ];

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
              {servicesList.map(item => <option key={item}>{item}</option>)}
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

/**
 * Main ShowcaseFlow Component
 */
export default function ShowcaseFlow({ service, setService }) {
  const root = useRef(null);
  const [activeChapter, setActiveChapter] = useState('brand-identity');

  return (
    <div ref={root} className="showcase-flow-container" id="works">
      {/* Continuous Glowing Coral SVG Connector (Zero Overlaps) */}
      <FlowTrail
        rootRef={root}
        activeChapter={activeChapter}
        setActiveChapter={setActiveChapter}
      />

      {/* 1. Opening Section */}
      <header className="flow-opening-section">
        <div className="flow-opening-badge" data-flow-start>
          <Star />
          <span>Made by Design Daily • Project Showcase</span>
        </div>

        <SplitText
          tag="h2"
          text="One recognisable brand. Everywhere you show up."
          className="flow-opening-heading"
          textAlign="center"
          splitType="words"
          delay={40}
          duration={0.6}
          rootMargin="0px"
        />

        <p className="flow-opening-sub">
          Follow the thread. From the first mark to every impression after.
        </p>

        {/* Quick Jump Navigation */}
        <nav className="flow-jump-nav" aria-label="Jump to discipline">
          {chapterDefinitions.map((ch, idx) => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              className={`flow-jump-pill ${activeChapter === ch.id ? 'is-current' : ''}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(ch.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>0{idx + 1}</span>
              <span>{ch.label}</span>
            </a>
          ))}
        </nav>
      </header>

      {/* 2. Seven Discipline Chapters */}
      <div className="flow-chapters-wrapper">
        {chapterDefinitions.map((ch, idx) => (
          <FlowChapter
            key={ch.id}
            chapter={ch}
            index={idx}
            total={chapterDefinitions.length}
          />
        ))}
      </div>

      {/* 3. Transition Bridge from Ch 07 to Approach */}
      <div className="flow-bridge-row" data-flow-bridge-approach>
        <div className="flow-bridge-tag">
          <span>Different touchpoints. One recognisable brand.</span>
        </div>
      </div>

      {/* 4. Condensed Studio Approach Statement */}
      <ApproachStatement />

      {/* 5. Packages Section (White Cards on Dark Canvas) */}
      <FlowPackages onChoose={setService} />

      {/* 6. Transition Bridge to Scale Benefit */}
      <div className="flow-bridge-row" data-flow-bridge-scale>
        <div className="flow-bridge-tag">
          <span>More clarity for what comes next.</span>
        </div>
      </div>

      {/* 7. Scale Benefit Section */}
      <FlowScaleBenefit onChoose={setService} />

      {/* 8. Compact Studio FAQ */}
      <FlowFAQ />

      {/* 9. Transition Bridge to Final CTA */}
      <div className="flow-bridge-row" data-flow-bridge-finale>
        <div className="flow-bridge-tag">
          <span>Your brand could be next.</span>
        </div>
      </div>

      {/* 10. Finale CTA with Magnet Button */}
      <FlowFinale onChoose={setService} />

      {/* 11. Project Inquiry Form & Studio Direct */}
      <FlowContact service={service} setService={setService} />
    </div>
  );
}
