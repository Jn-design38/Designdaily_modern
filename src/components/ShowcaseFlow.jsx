import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.json';
import { showcaseItems, getItemImages, getItemProject } from '../data/showcase';
import { packages } from '../data/packages';
import { Arrow, Check, Star } from './Icons';
import { Artwork } from './Portfolio';
import SpecularButton from './SpecularButton';
import BounceCards from './BounceCards';
import { ScopeSection, ApproachSection, PackageGuide } from './BulkStudio';
import StudioSignature from './StudioSignature';
import BeforeWeBegin from './BeforeWeBegin';
import InquiryStudio from './InquiryStudio';
import AnimatedContent from './reactbits/AnimatedContent';
import { MOBILE_SHOWCASE_QUERY, mobileShowcasePath, animateMobileShowcase } from './mobileShowcaseFlow';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const SCALE_BENEFIT_IMAGES = [
  {
    src: '/optimized/home/all-organics-outdoor-advertising.webp',
    alt: 'All Organics - Outdoor Billboard Advertising',
    width: 320,
    height: 240,
    aspectRatio: '1448 / 1086'
  },
  {
    src: '/optimized/home/artboard-1-dd-social.webp',
    alt: 'Design Daily - Brand Identity Social Creative',
    width: 236,
    height: 295,
    aspectRatio: '1508 / 1885'
  },
  {
    src: '/optimized/home/tripty-logo-sketch.webp',
    alt: 'Tripty Branding - Hand-Drawn Logo Sketch & Construction Grid',
    width: 220,
    height: 321,
    aspectRatio: '1038 / 1515'
  },
  {
    src: '/optimized/home/artboard-1-aves-social.webp',
    alt: 'AVES Real Estate - Social Creative Campaign',
    width: 236,
    height: 295,
    aspectRatio: '1508 / 1885'
  },
  {
    src: '/optimized/home/tripty-detail-b.webp',
    alt: 'Tripty Branding - Packaging & Brand Identity Detail',
    width: 330,
    height: 232,
    aspectRatio: '1496 / 1051'
  }
];

const SCALE_BENEFIT_IMAGES_MOBILE = SCALE_BENEFIT_IMAGES.map((img) => ({
  ...img,
  width: Math.round(img.width * 0.55),
  height: Math.round(img.height * 0.55)
}));

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
        const isMobile = window.matchMedia(MOBILE_SHOWCASE_QUERY).matches;
        const finale = root.querySelector('.flow-quote-finale');
        const finaleRect = finale?.getBoundingClientRect();
        const rootH = isMobile && finaleRect
          ? Math.ceil(finaleRect.bottom - origin.top)
          : root.scrollHeight;

        setSize({ width: rootW, height: rootH });

        if (isMobile) {
          setTrailPath(mobileShowcasePath(root));
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
        const xDiscCenter = dRect.left - origin.left + dRect.width / 2;

        // Exactly ONE 'M' command at the very start: flows into Brand identity center axis
        pathCommands.push(`M ${xStart} ${yStart} H ${xDiscCenter}`);

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

        // Bridge from Brand identity center down to yFirstBridge, across through Crafted for perfection to xRail0, and down along card 0
        appendOrthogonalBridge(pathCommands, xDiscCenter, yStart, xRail0, yCardFinish0, yFirstBridge, 24);

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

    const isMobile = window.matchMedia(MOBILE_SHOWCASE_QUERY).matches;
    const observer = new ResizeObserver(calculatePath);
    if (isMobile) {
      root.querySelectorAll('.flow-wireframe-header-section, .flow-wireframe-items-wrapper, [data-flow-bridge-quote], .flow-quote-finale')
        .forEach(el => observer.observe(el));
    } else {
      observer.observe(root);
      root.querySelectorAll('[data-showcase-item], [data-item-pill], .flow-item-brief-card, .flow-wireframe-meta-col')
        .forEach(el => observer.observe(el));
    }

    let viewportWidth = window.innerWidth;
    const onResize = () => {
      if (!isMobile || window.innerWidth !== viewportWidth) {
        viewportWidth = window.innerWidth;
        calculatePath();
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('load', calculatePath);
    document.fonts.ready.then(calculatePath);
    calculatePath();

    const t1 = setTimeout(calculatePath, 100);
    const t2 = setTimeout(calculatePath, 350);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', calculatePath);
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

    if (window.matchMedia(MOBILE_SHOWCASE_QUERY).matches) {
      return animateMobileShowcase(root, pathEl, totalLength);
    }

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

      // Button 1: "what we do?"
      const startBox = root.querySelector('[data-flow-start]');
      const sRect = startBox ? startBox.getBoundingClientRect() : null;
      const isStartLit = sRect ? targetY >= (sRect.top - rect.top - 40) : (progress > 0.001 || drawnLength > 5);
      if (startBox) {
        startBox.classList.toggle('is-lit', isStartLit);
      }

      // Button 2: "Brand identity"
      const discPill = root.querySelector('[data-discipline-pill]');
      if (discPill) {
        const dRect = discPill.getBoundingClientRect();
        const seg1Len = sRect ? Math.max(10, dRect.left - sRect.right) : 600;
        const isDiscLit = isStartLit && drawnLength >= (seg1Len - 15);
        discPill.classList.toggle('is-lit', isDiscLit);
      }

      // Button 3+: All bridge pills ("Crafted for perfection", "The packaging and merch", "social media creatives", teaser phrases, finale bridge)
      const bridgePills = root.querySelectorAll('.bridge-pill-tag');
      bridgePills.forEach(pill => {
        const pRect = pill.getBoundingClientRect();
        const yPillCenter = pRect.top - rect.top + pRect.height / 2;
        const isLit = targetY >= (yPillCenter - 25);
        pill.classList.toggle('is-lit', isLit);
      });

      // Button 4+: All project brand pills ("Tripty", "SandBox Lounge", "Goody Bro", "Vastra", "Kalyan", etc.)
      const itemPills = root.querySelectorAll('[data-item-pill]');
      itemPills.forEach(pill => {
        const pRect = pill.getBoundingClientRect();
        const yPillCenter = pRect.top - rect.top + pRect.height / 2;
        const isLit = targetY >= (yPillCenter - 30);
        pill.classList.toggle('is-lit', isLit);
      });

      // Button 5: "Order now" finale CTA
      const orderBtn = root.querySelector('.flow-order-now-btn');
      if (orderBtn) {
        const oRect = orderBtn.getBoundingClientRect();
        const isLit = targetY >= (oRect.top - rect.top - 30);
        orderBtn.classList.toggle('is-lit', isLit);
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

    // Instantaneous synchronization with Lenis momentum scroll
    const onLenisScroll = () => {
      updateTrail();
    };
    if (window.__lenis) {
      window.__lenis.on('scroll', onLenisScroll);
    }
    const onLenisReady = (e) => {
      if (e.detail) {
        e.detail.on('scroll', onLenisScroll);
      }
    };
    window.addEventListener('lenis-ready', onLenisReady);

    updateTrail();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTrail);
      window.removeEventListener('lenis-ready', onLenisReady);
      if (window.__lenis) {
        window.__lenis.off('scroll', onLenisScroll);
      }
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
  const lead = item.thumbnail || images[0];

  return (
    <div
      className={`flow-wireframe-row ${isOdd ? 'flow-reverse' : ''}`}
      data-showcase-item={item.id}
      id={`project-${item.id}`}
    >
      {/* 1. Pill & Brief Column (1/3 width) - Rest of the buttons do NOT light up */}
      <div className="flow-wireframe-meta-col">
        <div className="flow-wireframe-pill-wrap">
          <SpecularButton
            className="flow-item-pill"
            data-item-pill={item.id}
            size="sm"
            radius={999}
            tint="#12131b"
            tintOpacity={0.92}
            blur={14}
            textColor="#ffffff"
            lineColor="#ff4c42"
            baseColor="rgba(255, 76, 66, 0.25)"
            intensity={1.1}
            idleIntensity={0.35}
            glow={0.8}
            thickness={1.0}
            followMouse
          >
            <span className="pill-brand-name">{item.brandName}</span>
          </SpecularButton>
        </div>

        <div className="flow-item-brief-card">
          <p className="flow-item-brief">{item.brief}</p>
        </div>
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
  const [activePackage, setActivePackage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_SHOWCASE_QUERY);
    const updateMobile = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    if (mql.addEventListener) {
      mql.addEventListener('change', updateMobile);
      return () => mql.removeEventListener('change', updateMobile);
    } else {
      mql.addListener(updateMobile);
      return () => mql.removeListener(updateMobile);
    }
  }, []);

  useEffect(() => {
    if (!activePackage) return;
    const handleOutside = (e) => {
      if (!e.target.closest('.package-card')) {
        setActivePackage(null);
      }
    };
    window.addEventListener('pointerdown', handleOutside, { passive: true });
    return () => window.removeEventListener('pointerdown', handleOutside);
  }, [activePackage]);

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
          <SpecularButton
            data-flow-start
            className="flow-wireframe-start-box"
            size="md"
            radius={20}
            tint="#12131b"
            tintOpacity={0.92}
            blur={14}
            textColor="#ffffff"
            lineColor="#ff4c42"
            baseColor="rgba(255, 76, 66, 0.25)"
            intensity={1.1}
            idleIntensity={0.4}
            glow={0.8}
            thickness={1.0}
            followMouse
          >
            <span className="box-text">what we do?</span>
          </SpecularButton>

          <SpecularButton
            data-discipline-pill
            className="flow-wireframe-discipline-pill"
            size="sm"
            radius={999}
            tint="#12131b"
            tintOpacity={0.92}
            blur={14}
            textColor="#ffffff"
            lineColor="#ff4c42"
            baseColor="rgba(255, 76, 66, 0.25)"
            intensity={1.1}
            idleIntensity={0.4}
            glow={0.8}
            thickness={1.0}
            followMouse
          >
            <span className="pill-label">Brand identity</span>
          </SpecularButton>
        </div>

        {/* First Bridge: "Crafted for perfection" */}
        <div className="flow-sketch-bridge" data-bridge-index="0">
          <SpecularButton
            className="bridge-pill-tag"
            size="sm"
            radius={999}
            tint="#0b0c11"
            tintOpacity={0.92}
            blur={12}
            textColor="#ff9e99"
            lineColor="#ff4c42"
            baseColor="rgba(255, 76, 66, 0.2)"
            intensity={1.1}
            idleIntensity={0.35}
            glow={0.8}
            thickness={1.0}
            followMouse
          >
            <span>Crafted for perfection</span>
          </SpecularButton>
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
                <SpecularButton
                  className="bridge-pill-tag"
                  data-bridge-pill={showcaseItems[idx + 1].teaser}
                  size="sm"
                  radius={999}
                  tint="#0b0c11"
                  tintOpacity={0.92}
                  blur={12}
                  textColor="#ff9e99"
                  lineColor="#ff4c42"
                  baseColor="rgba(255, 76, 66, 0.2)"
                  intensity={1.1}
                  idleIntensity={0.35}
                  glow={0.8}
                  thickness={1.0}
                  followMouse
                >
                  <span>{showcaseItems[idx + 1].teaser}</span>
                </SpecularButton>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Transition Bridge to Quote Finale */}
      <div className="flow-sketch-bridge" data-flow-bridge-quote>
        <SpecularButton
          className="bridge-pill-tag"
          size="sm"
          radius={999}
          tint="#0b0c11"
          tintOpacity={0.92}
          blur={12}
          textColor="#ff9e99"
          lineColor="#ff4c42"
          baseColor="rgba(255, 76, 66, 0.2)"
          intensity={1.1}
          idleIntensity={0.35}
          glow={0.8}
          thickness={1.0}
          followMouse
        >
          <span>Ready for your next chapter</span>
        </SpecularButton>
      </div>

      {/* 4. "Get your Quote" & "Order now" Button (directly from sketch) */}
      <section className="flow-quote-finale" id="quote" aria-labelledby="quote-title">
        <div className="flow-quote-card">
          <span className="flow-quote-logo" aria-hidden="true" />
          <h3 id="quote-title" className="flow-quote-title">Get your Quote</h3>
          <p className="flow-quote-desc">
            Choose a dedicated monthly package or request a custom brief tailored to your brand.
          </p>
          <div className="flow-quote-action">
            <SpecularButton
              className="flow-order-now-btn"
              size="lg"
              radius={999}
              tint="#ff4c42"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#ff4c42"
              intensity={1.2}
              idleIntensity={0.4}
              shineSize={12}
              thickness={1.0}
              glow={0.9}
              followMouse
              onClick={() => {
                const target = document.getElementById('packages');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Order now</span>
              <Arrow diagonal />
            </SpecularButton>
          </div>
        </div>
      </section>

      <ScopeSection setService={setService} />
      <ApproachSection />

      {/* 4.8. Scale Benefit Section (Good design. A clearer direction.) with BounceCards */}
      <section className="scale-benefit wrap" aria-labelledby="scale-title">
        <div className="scale-copy">
          <span className="benefit-label"><Star /> Included with Scale</span>
          <h2 id="scale-title">Good design.<br />A clearer direction.</h2>
          <p>Our highest social creative pack comes with a free assessment of your online business and a content calendar.</p>
          <ul className="benefit-list">
            <li><Check className="benefit-check" /> <span>A fresh look at your online presence</span></li>
            <li><Check className="benefit-check" /> <span>A content calendar to guide what comes next</span></li>
            <li><Check className="benefit-check" /> <span>Creatives that connect the plan to your brand</span></li>
          </ul>
          <a href="#contact" className="text-link" onClick={() => setService && setService('Scale Package')}>
            Let’s plan your next chapter <Arrow />
          </a>
        </div>

        <div className="scale-bounce-wrap" aria-label="Design Daily featured works showcase">
          <BounceCards
            images={isMobile ? SCALE_BENEFIT_IMAGES_MOBILE : SCALE_BENEFIT_IMAGES}
            containerWidth={isMobile ? 320 : 580}
            containerHeight={isMobile ? 290 : 440}
            cardSize={isMobile ? 140 : 240}
            spread={isMobile ? 38 : 88}
            rotation={isMobile ? 8 : 10}
            arc={0}
            pushDistance={isMobile ? 55 : 160}
            hoverScale={isMobile ? 1.06 : 1.1}
            bounciness={0.6}
            animationDelay={0.4}
            animationStagger={0.07}
            borderWidth={isMobile ? 3 : 4}
            borderColor="#ffffff"
            radius={isMobile ? 16 : 22}
            shadow={true}
            enableHover={true}
          />
        </div>
      </section>

      {/* 5. Our Packages Section (Liquid Glass Cards on Dark Canvas from Reference) */}
      <section id="packages" className="flow-packages-section packages-section" aria-labelledby="packages-pill-title">
        <div className="packages-head">
          <div className="packages-pill-badge" id="packages-pill-title">
            <span>Our Packages</span>
          </div>
          <p className="packages-sub">
            A considered package. A predictable design budget. Choose your starting point.
          </p>
        </div>

        <AnimatedContent distance={35} tilt={6} duration={0.9}>
        <div className="packages-grid">
          {packages.map(pack => (
            <article
              className={`package-card ${pack.tierClass} ${activePackage === pack.id ? 'is-touched' : ''}`}
              key={pack.id}
              tabIndex={0}
              onClick={() => setActivePackage(prev => prev === pack.id ? null : pack.id)}
              onTouchStart={() => setActivePackage(pack.id)}
            >
              {/* Floating Capsule Header Pill */}
              <div className="package-header-pill">
                <h3 className="package-card-title">{pack.name}</h3>
                <div className={`package-underline ${pack.underlineClass}`} aria-hidden="true" />
                <span className={`package-tag ${pack.tagClass}`}>{pack.subtitle}</span>
              </div>

              {/* Card Body / Features List */}
              <div className="package-body">
                <p className="package-fit">{pack.id === 'starter' ? 'For your first brand chapter.' : pack.id === 'growth' ? 'For a steady creative rhythm.' : 'For a bigger content schedule.'}</p>
                <h4 className="package-features-heading">Your package includes:</h4>
                <ul className="package-features-list">
                  {pack.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <span className="p-bullet" aria-hidden="true" />
                      {feat.sub ? (
                        <div className="p-feat-text">
                          <span>{feat.text}</span>
                          <small className="p-feat-sub">{feat.sub}</small>
                        </div>
                      ) : (
                        <span>{feat.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Box */}
              <div className="package-price-box">
                <div className="price-orig-row">
                  <span className="p-price-label">Original Price</span>
                  <span className="p-orig-val">{pack.original} BDT</span>
                </div>
                <div className={`p-discount-pill pill-${pack.id}`}>
                  <span>Launch offer</span>
                </div>
                <div className="price-final-row">
                  <span className="p-price-label">Final Price</span>
                  <div className="p-final-val-wrap">
                    <span className="p-final-val">{pack.price} BDT</span>
                    <span className="p-period">/ Month</span>
                  </div>
                </div>
                <a
                  href="#contact"
                  className={`package-cta-btn ${pack.btnClass}`}
                  onClick={() => setService && setService(pack.name)}
                >
                  <span>{pack.btnText}</span>
                  <Arrow diagonal />
                </a>
              </div>
            </article>
          ))}
        </div>
        </AnimatedContent>
      </section>

      <PackageGuide setService={setService} />
      <StudioSignature />
      <BeforeWeBegin />
      <InquiryStudio service={service} setService={setService} />
    </div>
  );
}
