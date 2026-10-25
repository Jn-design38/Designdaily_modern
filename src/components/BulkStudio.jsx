import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedContent from './reactbits/AnimatedContent';
import Folder from './reactbits/Folder';
import BounceCards from './BounceCards';
import TiltedCard from './TiltedCard';
import SpecularButton from './SpecularButton';
import { Arrow, Plus } from './Icons';
import './BulkStudio.css';
import './ApproachSection.css';

gsap.registerPlugin(ScrollTrigger);

const scopes = [
  { title: 'Show up every day.', name: 'Monthly content', text: 'A recognisable feed. A steady flow of fresh design.', tags: ['Social posts', 'Carousels', 'Campaign graphics'], image: '/work/seor/cover.webp', accent: '#bfad8b', service: 'Growth Package' },
  { title: 'Make your next launch count.', name: 'Campaign batches', text: 'One idea, considered across every place it appears.', tags: ['Product launches', 'Seasonal offers', 'Ad variations'], image: '/work/aves/cover.webp', accent: '#b5bcff', service: 'Custom batch' },
  { title: 'Build something recognisable.', name: 'Brand & print', text: 'From the first mark to the details people take home.', tags: ['Identity', 'Packaging', 'Merchandise'], image: '/work/tripty/05.webp', accent: '#ffb6af', service: 'Brand identity' }
];

export function jumpToInquiry(service, setService) {
  setService?.(service);
  document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

export function ScopeSection({ setService }) {
  const [active, setActive] = useState(0);
  const item = scopes[active];
  return (
    <section id="benefits" className="bulk-section bulk-scope" aria-labelledby="scope-title">
      <div className="bulk-heading"><span className="bulk-kicker">Designed around your business</span><h2 id="scope-title">More to say.<br />One unmistakable brand.</h2></div>
      <div className="scope-layout">
        <div className="scope-menu">
          {scopes.map((scope, i) => <button key={scope.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className={`scope-option ${active === i ? 'is-active' : ''}`}><span>{scope.name}</span><Arrow diagonal /></button>)}
          <div className="scope-details" aria-live="polite"><h3>{item.title}</h3><p>{item.text}</p><div className="bulk-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <SpecularButton size="md" radius={999} lineColor="#ff4c42" onClick={() => jumpToInquiry(item.service, setService)}>Let's talk about it <Arrow diagonal /></SpecularButton>
        </div>
        <AnimatedContent className="scope-art-shell" tilt={10} distance={35} duration={0.9}>
          <TiltedCard key={item.image} imageSrc={item.image} altText={`${item.name}: selected Design Daily portfolio artwork`} containerWidth="100%" containerHeight="100%" imageWidth="100%" imageHeight="100%" showTooltip={false} rotateAmplitude={5} scaleOnHover={1.015} radius={24} intro={false} gyroscope={false} className="scope-art" />
          <span className="scope-art-caption">Selected work / {item.name}</span>
        </AnimatedContent>
      </div>
      <div className="scope-assurances"><span><i /> Direct designer access</span><span><i /> Priced in BDT</span><span><i /> Scope agreed upfront</span></div>
    </section>
  );
}

const stages = [
  { title: 'Gather what matters.', short: 'Gather', text: 'Goals, formats, deadline.', accent: '#ff5148' },
  { title: 'Find one direction.', short: 'Direct', text: 'One look. Agreed.', accent: '#f4c64e' },
  { title: 'Build the full set.', short: 'Build', text: 'One system. Every piece.', accent: '#ff725f' },
  { title: 'Send it out ready.', short: 'Deliver', text: 'Correct files. Clear handover.', accent: '#f4c64e' }
];

const buildCards = [
  { src: '/approach/portfolio/build-all-organics.webp', alt: 'All Organics finished identity system' },
  { src: '/approach/portfolio/build-atuendo.webp', alt: 'Atuendo finished embossed brand application' },
  { src: '/approach/portfolio/build-norea.webp', alt: 'Norea finished packaging system' }
];

function useDepth(ref, selector, mode = 'desk') {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 850px) and (prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(selector, mode === 'desk' ? { rotateX: 14, rotateY: -5, y: 45 } : { rotateX: 13, y: 65, scale: 0.94 }, { rotateX: 0, rotateY: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'center 50%', scrub: 0.7 } });
      }, ref);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [ref, selector, mode]);
}

function BriefVisual() {
  return <div className="approach-object approach-object--brief" aria-hidden="true">
    <div className="approach-browser approach-browser--references">
      <div className="approach-window-bar"><span className="approach-window-dots"><i /><i /><i /></span><strong>Image search</strong><span>+</span></div>
      <div className="approach-browser-address"><span>←</span><span>→</span><div>visuals.design / brand references</div></div>
      <div className="approach-reference-grid"><span className="approach-reference-tile tile-a" /><span className="approach-reference-tile tile-b" /><span className="approach-reference-tile tile-c" /><span className="approach-reference-tile tile-d" /></div>
    </div>
    <div className="approach-browser approach-browser--brief">
      <div className="approach-window-bar"><span className="approach-window-dots"><i /><i /><i /></span><strong>Project brief</strong><span>+</span></div>
      <div className="approach-brief-browser-body"><span>Launch system</span><strong>One campaign.<br />Every format.</strong><dl><div><dt>Audience</dt><dd>Dhaka / 20–40</dd></div><div><dt>Outputs</dt><dd>12 pieces</dd></div><div><dt>Live</dt><dd>18 Nov</dd></div></dl></div>
    </div>
    <div className="approach-explorer">
      <div className="approach-explorer__titlebar"><span className="approach-explorer__app"><i /> Creative research</span><span className="approach-explorer__controls"><i /><i /><i /></span></div>
      <div className="approach-explorer__toolbar"><span>‹</span><span>›</span><span>↑</span><div><i /> This PC <b>›</b> Studio <b>›</b> Client research</div><span>⌕</span></div>
      <div className="approach-explorer__body">
        <aside><span>Quick access</span><span>Desktop</span><span>Downloads</span><strong>Client research</strong></aside>
        <div className="approach-explorer__files"><div className="approach-file approach-file--folder"><i /><span>Market refs</span><small>File folder</small></div><div className="approach-file approach-file--folder"><i /><span>Competitor scan</span><small>File folder</small></div><div className="approach-file approach-file--image"><i /><span>materials-07.jpg</span><small>4.8 MB</small></div><div className="approach-file approach-file--document"><i>PDF</i><span>brief-v3.pdf</span><small>1.2 MB</small></div></div>
      </div>
      <div className="approach-explorer__status"><span>4 items</span><span>38.4 MB</span></div>
      <div className="approach-explorer-save"><span className="approach-explorer-save__thumb" /><div><span>Saving from Web</span><strong>reference-board-12.jpg</strong><i><b /></i></div><em>76%</em></div>
    </div>
  </div>;
}

function DirectionVisual() {
  return <div className="approach-object approach-object--direction">
    <figure className="approach-direction-panel approach-direction-panel--left"><img src="/approach/portfolio/sketch-all-organics.webp" alt="All Organics pencil logo study" loading="lazy" /></figure>
    <figure className="approach-direction-panel approach-direction-panel--focus"><img src="/approach/portfolio/sketch-norea.webp" alt="Selected Norea pencil logo study" loading="lazy" /><figcaption>Selected study</figcaption></figure>
    <figure className="approach-direction-panel approach-direction-panel--right"><img src="/approach/portfolio/sketch-atuendo.webp" alt="Atuendo pencil logo study" loading="lazy" /></figure>
  </div>;
}

function BuildVisual() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);
  const compact = viewportWidth <= 600;
  const narrow = viewportWidth <= 900;
  return <div className="approach-object approach-object--build">
    <BounceCards
      images={buildCards}
      className="approach-bounce-cards"
      containerWidth={compact ? 358 : narrow ? 680 : 860}
      containerHeight={compact ? 290 : narrow ? 370 : 430}
      cardSize={compact ? 148 : narrow ? 220 : 270}
      spread={compact ? 78 : narrow ? 138 : 176}
      rotation={7}
      arc={24}
      animationDelay={0.06}
      animationStagger={0.05}
      bounciness={0.52}
      pushDistance={compact ? 44 : 94}
      hoverScale={1.035}
      borderWidth={5}
      borderColor="#f7f6f2"
      radius={8}
    />
    <span className="approach-build-count" aria-hidden="true">03 studies / 03 brand worlds</span>
  </div>;
}

function DeliverVisual() {
  const files = [
    { title: 'Social exports', description: 'RGB / web ready' },
    { title: 'Print artwork', description: 'CMYK / press ready' },
    { title: 'Source package', description: 'Organised working files' }
  ];
  return <div className="approach-object approach-object--deliver">
    <Folder
      items={files}
      label="Final artwork"
      mode="flap"
      variant="solid"
      color="#ff5148"
      paperColor="#f7f6f2"
      tabPosition="left"
      layout="spread"
      size={1.42}
      openOn="click"
      defaultOpen
      draggable
      zoomOnClick
      peek
      intro
      tilt={0.65}
      bounce={0.48}
      speed={1.15}
      theme="dark"
      className="approach-delivery-folder"
    />
  </div>;
}

function ApproachVisual({ active }) {
  return <div className={`approach-runway__visual approach-runway__visual--${active}`} key={active} style={{ '--approach-accent': stages[active].accent }}>
    <div className="approach-runway__wash" aria-hidden="true" />
    {active === 0 && <BriefVisual />}
    {active === 1 && <DirectionVisual />}
    {active === 2 && <BuildVisual />}
    {active === 3 && <DeliverVisual />}
  </div>;
}

export function ApproachSection() {
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const pin = useRef(null);
  const scrollTrigger = useRef(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        pin: pin.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3.15}`,
        scrub: 0.45,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const next = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));
          setActive(current => current === next ? current : next);
        }
      });
      scrollTrigger.current = trigger;
      return () => {
        scrollTrigger.current = null;
        trigger.kill();
      };
    });
    return () => media.revert();
  }, []);

  const selectStage = index => {
    const next = Math.max(0, Math.min(stages.length - 1, index));
    setActive(next);
    const trigger = scrollTrigger.current;
    if (!trigger) return;
    const target = trigger.start + ((next + 0.5) / stages.length) * (trigger.end - trigger.start);
    if (window.__lenis?.scrollTo) window.__lenis.scrollTo(target, { duration: 0.9 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return <section id="approach" className="approach-runway" ref={root} aria-labelledby="approach-title">
    <div className="approach-runway__pin" ref={pin}>
      <div className="approach-runway__frame">
        <header className="approach-runway__topline">
          <h2 id="approach-title"><span aria-hidden="true" />Our approach</h2>
          <span aria-live="polite">0{active + 1} / 04</span>
        </header>

        <ApproachVisual active={active} />

        <div className="approach-runway__caption" id="approach-detail" aria-live="polite" aria-atomic="true" key={`caption-${active}`}>
          <h3>{stages[active].title}</h3>
          <p>{stages[active].text}</p>
        </div>

        <div className="approach-runway__steps" role="group" aria-label="Explore our design process">
          <span className="approach-runway__progress" aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / stages.length})` }} /></span>
          {stages.map((stage, i) => <button type="button" key={stage.short} aria-pressed={active === i} aria-controls="approach-detail" className={active === i ? 'is-active' : ''} onClick={() => selectStage(i)}><span>0{i + 1}</span>{stage.short}</button>)}
        </div>
      </div>
    </div>
  </section>;
}

const batchFormats = [
  {
    label: 'The whole set', count: 'One connected campaign', detail: 'Different messages. A familiar visual language.',
    artwork: [
      { src: '/work/seor/02.webp', alt: 'Seor campaign portrait featuring a structured work bag', caption: 'Product story' },
      { src: '/work/seor/cover.webp', alt: 'Seor campaign layout pairing the product with its audience', caption: 'Campaign creative' },
      { src: '/work/seor/03.webp', alt: 'Seor city campaign portrait with a black work bag', caption: 'Brand mood' }
    ]
  },
  {
    label: 'Feed designs', count: 'Original designs', detail: 'A distinct message and composition for each creative.',
    artwork: [
      { src: '/work/seor/04.webp', alt: 'Close-up Seor product detail against illustrated graphics', caption: 'Detail post' },
      { src: '/work/seor/05.webp', alt: 'Seor desk scene with campaign headline and product', caption: 'Lifestyle post' },
      { src: '/work/seor/06.webp', alt: 'Seor monochrome fashion portrait with a compact bag', caption: 'Editorial post' }
    ]
  },
  {
    label: 'Adaptations', count: 'Same idea. A different format.', detail: 'Approved designs adapted to the placements in your brief.',
    artwork: [
      { src: '/work/seor/05.webp', alt: 'Wide Seor desk campaign composition', caption: 'Wide placement' },
      { src: '/work/seor/04.webp', alt: 'Tall crop of Seor product detail artwork', caption: 'Tall placement' },
      { src: '/work/seor/02.webp', alt: 'Square crop of Seor fashion campaign artwork', caption: 'Square placement' }
    ]
  },
  {
    label: 'Carousels', count: 'One story, across several slides.', detail: 'Slide count and content are agreed as part of your scope.',
    artwork: [
      { src: '/work/seor/03.webp', alt: 'Opening Seor carousel slide with an editorial portrait', caption: '01 / Hook' },
      { src: '/work/seor/04.webp', alt: 'Second Seor carousel slide showing product detail', caption: '02 / Detail' },
      { src: '/work/seor/06.webp', alt: 'Closing Seor carousel slide with lifestyle imagery', caption: '03 / Close' }
    ]
  }
];

export function BatchSection({ setService }) {
  const [format, setFormat] = useState(0);
  const root = useRef(null);
  const selectedFormat = batchFormats[format];
  useDepth(root, '.batch-stage', 'batch');
  return <section className="bulk-section bulk-batch" id="design-batches" ref={root} aria-labelledby="batch-title">
    <div className="bulk-heading heading-split"><div><span className="bulk-kicker">Built to work together</span><h2 id="batch-title">One campaign.<br />Every angle covered.</h2></div><p>Explore the pieces of a batch.<br />We agree on the count before we create.</p></div>
    <div className="batch-switcher" role="group" aria-label="Explore design formats">{batchFormats.map((item, i) => <button key={item.label} type="button" aria-pressed={format === i} onClick={() => setFormat(i)}>{item.label}</button>)}</div>
    <div className={`batch-stage format-${format}`} key={selectedFormat.label}>
      <span className="batch-orbit orbit-one" aria-hidden="true" /><span className="batch-orbit orbit-two" aria-hidden="true" />
      <div className="batch-art batch-left"><img src={selectedFormat.artwork[0].src} alt={selectedFormat.artwork[0].alt} loading="lazy" /><span>{selectedFormat.artwork[0].caption}</span></div>
      <div className="batch-art batch-center"><TiltedCard imageSrc={selectedFormat.artwork[1].src} altText={selectedFormat.artwork[1].alt} containerWidth="100%" containerHeight="100%" imageWidth="100%" imageHeight="100%" showTooltip={false} intro={false} radius={12} rotateAmplitude={6} scaleOnHover={1.02} gyroscope={false} /><span>{selectedFormat.artwork[1].caption}</span></div>
      <div className="batch-art batch-right"><img src={selectedFormat.artwork[2].src} alt={selectedFormat.artwork[2].alt} loading="lazy" /><span>{selectedFormat.artwork[2].caption}</span></div>
      <span className="batch-marker">Same brand.<br />More possibilities.</span>
    </div>
    <div className="batch-caption" aria-live="polite"><div><h3>{selectedFormat.count}</h3><p>{selectedFormat.detail}</p></div><a href="/work/seor">Explore Seor <Arrow diagonal /></a></div>
    <p className="bulk-fineprint">Format demonstration using portfolio artwork. Adaptations and carousel slides are scoped separately; this is not a package quantity.</p>
  </section>;
}

const guideItems = [
  { title: 'Design counts', text: 'Originals, resizes, carousel slides, and variations are confirmed in your scope.' },
  { title: 'Delivery & revisions', text: 'We agree on review batches and timing. Larger requests are scheduled around their complexity.' },
  { title: 'Files & renewals', text: 'Your quote confirms source files, payment, renewal, and any unused-work policy.' }
];

export function PackageGuide({ setService }) {
  const [open, setOpen] = useState(-1);
  return <section className="bulk-section package-guide" aria-label="Package details and custom orders">
    <div className="package-clarity">{guideItems.map((item, i) => <div key={item.title}><button type="button" aria-expanded={open === i} aria-controls={`guide-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{item.title}<Plus minus={open === i} /></button><p id={`guide-${i}`} hidden={open !== i}>{item.text}</p></div>)}</div>
    <AnimatedContent distance={25} tilt={5} duration={0.7}><div className="custom-batch-strip"><img className="custom-batch-icon" src="/credits/flaticon-layers-5857869.png" alt="" aria-hidden="true" /><div><h3>A different mix in mind?</h3><p>Your formats. Your quantity. A quote built around them.</p></div><SpecularButton radius={999} size="md" lineColor="#ff4c42" onClick={() => jumpToInquiry('Custom batch', setService)}>Build a custom batch <Arrow diagonal /></SpecularButton></div></AnimatedContent>
  </section>;
}

const faqGroups = {
  'Getting started': [
    ['Can I order a one-off batch?', 'Yes. Share your formats, approximate quantity, and deadline. We will scope a custom batch, or help you choose a monthly package.'],
    ['What should I send with my brief?', 'Your business or social page, brand files if you have them, product images, approved text, and your target date. Tell us if anything is missing so we can plan the work.'],
    ['Is Bangla artwork or copywriting included?', 'Tell us the language your artwork needs. Copywriting, translation, and proofreading are agreed in the scope; they are not automatically included.']
  ],
  'The design work': [
    ['What counts as one design?', 'An original design, a resize, a variation, and a carousel slide are different tasks. We confirm the counting rule and full deliverables list before accepting your order.'],
    ['How do timing and revisions work?', 'We agree on the brief, review batches, and delivery schedule. Package revisions refine that agreed brief; a new direction or additional deliverable needs a scope check.'],
    ['What about motion, posting, ads, or printing?', 'The displayed packages include specific motion items. Tell us your needs so we can confirm their scope. Posting, account management, media buying, and physical printing are not included in the listed design packages.']
  ],
  'Files & payment': [
    ['Will I receive editable files?', 'Your scope confirms the editable files and export formats included. Any third-party font, image, or other licensed asset is identified separately.'],
    ['How do payment and renewal work?', 'We confirm accepted payment methods, payment timing, renewal pricing, and unused-work or pause terms in your quote before you commit.'],
    ['What is the extra benefit with Scale?', 'Scale includes an assessment of your online business and a content calendar. The assessment scope and calendar period are agreed when we discuss your order.']
  ]
};

export function StudioFAQ() {
  const [group, setGroup] = useState('Getting started');
  const [open, setOpen] = useState(0);
  return <section id="questions" className="bulk-section studio-faq" aria-labelledby="studio-faq-title">
    <div className="faq-studio-intro"><span className="bulk-kicker">Before we begin</span><h2 id="studio-faq-title">Good questions.<br />Clear answers.</h2><div className="faq-selector" role="group" aria-label="Question categories">{Object.keys(faqGroups).map(name => <SpecularButton key={name} size="sm" radius={999} aria-pressed={name === group} className={name === group ? 'is-active' : ''} lineColor={name === group ? '#ff4c42' : '#555762'} onClick={() => { setGroup(name); setOpen(0); }}>{name}</SpecularButton>)}</div></div>
    <div className="faq-studio-list">{faqGroups[group].map(([question, answer], i) => <div key={question} className={`faq-studio-item ${open === i ? 'is-open' : ''}`}><h3><button type="button" aria-expanded={open === i} aria-controls={`studio-answer-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{question}<Plus minus={open === i} /></button></h3><div id={`studio-answer-${i}`} hidden={open !== i}><p>{answer}</p></div></div>)}</div>
  </section>;
}
