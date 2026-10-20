import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.json';
import { chapterDefinitions, getChapterImages, getChapterProjects } from '../data/showcase';
import SplitText from './SplitText';
import { Arrow, Star } from './Icons';
import { Artwork } from './Portfolio';

gsap.registerPlugin(ScrollTrigger);

function roundedCornerPath(x1, y1, x2, y2, yBridge, radius = 24) {
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
          // Single vertical line along the left rail on mobile
          const startEl = root.querySelector('[data-flow-start]');
          const endEl = root.querySelector('[data-flow-end]');
          if (!startEl || !endEl) return;
          const startY = startEl.getBoundingClientRect().top - origin.top;
          const endY = endEl.getBoundingClientRect().top - origin.top;
          setTrailPath(`M 24 ${startY} V ${endY}`);
          return;
        }

        const chapters = [...root.querySelectorAll('[data-chapter-id]')];
        if (chapters.length === 0) return;

        const pathCommands = [];

        // 1. Entry line from start anchor down to Chapter 01
        const startAnchor = root.querySelector('[data-flow-start]');
        const firstPill = chapters[0].querySelector('[data-flow-pill]');
        if (startAnchor && firstPill) {
          const sRect = startAnchor.getBoundingClientRect();
          const pRect = firstPill.getBoundingClientRect();
          const x0 = pRect.left - origin.left + 24;
          const yStart = sRect.top - origin.top + sRect.height / 2;
          const y0 = pRect.top - origin.top + pRect.height / 2;
          pathCommands.push(`M ${x0} ${yStart} V ${y0}`);
        }

        // 2. Connect each Chapter i to Chapter i + 1 via outer rail and bridge gap
        for (let i = 0; i < chapters.length - 1; i++) {
          const currChapter = chapters[i];
          const nextChapter = chapters[i + 1];

          const currPill = currChapter.querySelector('[data-flow-pill]');
          const nextPill = nextChapter.querySelector('[data-flow-pill]');
          const bridgeEl = currChapter.querySelector('[data-flow-bridge]');

          if (!currPill || !nextPill || !bridgeEl) continue;

          const currPillRect = currPill.getBoundingClientRect();
          const nextPillRect = nextPill.getBoundingClientRect();
          const bridgeRect = bridgeEl.getBoundingClientRect();

          const isCurrLeft = i % 2 === 0;
          const isNextLeft = (i + 1) % 2 === 0;

          const x1 = isCurrLeft 
            ? currPillRect.left - origin.left + 24
            : currPillRect.right - origin.left - 24;
          const y1 = currPillRect.top - origin.top + currPillRect.height / 2;

          const x2 = isNextLeft
            ? nextPillRect.left - origin.left + 24
            : nextPillRect.right - origin.left - 24;
          const y2 = nextPillRect.top - origin.top + nextPillRect.height / 2;

          const yBridge = bridgeRect.top - origin.top + bridgeRect.height / 2;

          pathCommands.push(roundedCornerPath(x1, y1, x2, y2, yBridge, 28));
        }

        // 3. Connect Chapter 07 to Finale terminal node
        const lastChapter = chapters[chapters.length - 1];
        const finaleEl = root.querySelector('[data-flow-end]');
        if (lastChapter && finaleEl) {
          const lastPill = lastChapter.querySelector('[data-flow-pill]');
          if (lastPill) {
            const lastPillRect = lastPill.getBoundingClientRect();
            const finRect = finaleEl.getBoundingClientRect();

            const xLast = lastPillRect.left - origin.left + 24;
            const yLast = lastPillRect.top - origin.top + lastPillRect.height / 2;

            const xFin = finRect.left - origin.left + finRect.width / 2;
            const yFin = finRect.top - origin.top;

            const yBridgeFin = yFin - 36;
            pathCommands.push(roundedCornerPath(xLast, yLast, xFin, yFin, yBridgeFin, 28));
          }
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

  // ScrollTrigger to animate active blue line along the SVG path
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
      const progress = gsap.utils.clamp(0, 1, (-rect.top + viewportH * 0.45) / Math.max(1, rect.height - viewportH * 0.5));
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

function FlowChapter({ chapter, index, total }) {
  const collection = getChapterProjects(chapter, projects);
  const isOdd = index % 2 === 1; // 0, 2, 4, 6: Pill on Left; 1, 3, 5: Pill on Right
  const leadProject = collection[0];
  const images = leadProject ? getChapterImages(chapter, leadProject) : [];
  const [lead, ...details] = images;

  const pillIcon = index === 0 ? '✦' : index === 1 ? '📦' : index === 2 ? '≡' : index === 3 ? '◫' : index === 4 ? '⊞' : index === 5 ? '👕' : '✉';

  return (
    <section
      id={chapter.id}
      className={`flow-chapter ${isOdd ? 'flow-reverse' : ''}`}
      data-chapter-id={chapter.id}
      data-index={index}
      aria-labelledby={`${chapter.id}-heading`}
    >
      <div className="flow-chapter-grid">
        {/* Information Rail (Pill Button + Title + Paragraph + Micro-Notes) */}
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

        {/* Showcase Display Card (Clean elevated container in the opposite column) */}
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

      {/* Inter-chapter Transition Bridge (Runs strictly in the open vertical gap) */}
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

export default function ShowcaseFlow() {
  const root = useRef(null);
  const [activeChapter, setActiveChapter] = useState('brand-identity');

  return (
    <div ref={root} className="showcase-flow-container" id="works">
      {/* SVG Connecting Trail (Orthogonal circuit, never behind cards) */}
      <FlowTrail
        rootRef={root}
        activeChapter={activeChapter}
        setActiveChapter={setActiveChapter}
      />

      {/* 1. Opening Header */}
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

        {/* Quick jump discipline pills */}
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

      {/* 2. The 7 Project Showcase Chapters */}
      <div className="flow-chapters-list">
        {chapterDefinitions.map((chapter, index) => (
          <FlowChapter
            key={chapter.id}
            chapter={chapter}
            index={index}
            total={chapterDefinitions.length}
          />
        ))}
      </div>

      {/* 3. The Showcase Finale (THE FLOW TERMINATES HERE) */}
      <footer className="flow-finale-section" aria-labelledby="flow-finale-title">
        <div className="flow-terminal-node" data-flow-end aria-hidden="true">
          <span className="flow-terminal-dot" />
        </div>

        <h3 id="flow-finale-title" className="flow-finale-heading">
          All work connected. One clear brand.
        </h3>

        <p className="flow-finale-sub">
          From the first identity to the next campaign, every touchpoint was built to belong together.
        </p>

        <div className="flow-finale-actions">
          <a href="/work" className="button flow-primary-btn">
            <span>View All Projects in Archive</span>
            <Arrow diagonal />
          </a>
          <a
            href="#packages"
            className="flow-secondary-btn"
            onClick={e => {
              e.preventDefault();
              document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Monthly Packages ↓</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
