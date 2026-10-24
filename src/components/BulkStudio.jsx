import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedContent from './reactbits/AnimatedContent';
import TiltedCard from './TiltedCard';
import SpecularButton from './SpecularButton';
import './BulkStudio.css';

const Folder = lazy(() => import('./reactbits/Folder'));
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
          {scopes.map((scope, i) => <button key={scope.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className={`scope-option ${active === i ? 'is-active' : ''}`}><span>{scope.name}</span><span aria-hidden="true">↗</span></button>)}
          <div className="scope-details" aria-live="polite"><h3>{item.title}</h3><p>{item.text}</p><div className="bulk-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          <SpecularButton size="md" radius={999} lineColor="#ff4c42" onClick={() => jumpToInquiry(item.service, setService)}>Let's talk about it <span aria-hidden="true">↗</span></SpecularButton>
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
  { title: 'Plan the batch', short: 'Brief', text: 'Your business, your audience, your next big date. We agree on what needs designing before we begin.', output: 'A clear scope. A shared priority.' },
  { title: 'Find your direction', short: 'Direction', text: 'We shape a representative design together. The right colours, character, and tone become the starting point for the whole set.', output: 'One direction, approved by you.' },
  { title: 'Build it out', short: 'Create', text: 'The direction becomes a coordinated collection. Review each batch and bring your feedback together in one place.', output: 'Connected designs. Clear checkpoints.' },
  { title: 'Ready for the world', short: 'Deliver', text: 'Approved designs, organised and exported for their intended use. We agree on final formats and any editable files in your scope.', output: 'A considered handover.' }
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

function ApproachVisual({ stage }) {
  return <div className={`approach-desk stage-${stage}`}>
    <div className="desk-grid" aria-hidden="true" />
    <div className="desk-topline"><span><i /> Design Daily / Studio desk</span><span>0{stage + 1} — 04</span></div>
    {stage === 0 && <div className="brief-scene scene-enter">
      <div className="brief-sheet"><span className="brief-logo">Your next chapter.</span><span className="brief-rule" /><div><small>The business</small><strong>A brand with something to say.</strong></div><div><small>The task</small><strong>A connected campaign.</strong></div><div><small>The starting point</small><strong>Your ideas. Our design desk.</strong></div><span className="brief-stamp">Let's make it happen ↗</span></div>
      <img className="brief-swatch" src="/work/tripty/03.webp" alt="Tripty's red and yellow food illustration system" loading="lazy" />
      <span className="floating-note note-brief">A little clarity.<br />A lot of possibility.</span>
    </div>}
    {stage === 1 && <div className="direction-scene scene-enter"><img className="direction-hero" src="/work/tripty/04.webp" alt="Tripty brand direction and guideline book" loading="lazy" /><div className="direction-colors"><span style={{ background: '#ca0039' }} /><span style={{ background: '#ffcb44' }} /><span style={{ background: '#fff7ea' }} /><small>The visual thread</small></div><span className="floating-note note-direction">This is where<br />it comes together.</span></div>}
    {stage === 2 && <div className="create-scene scene-enter">{['02','05','07'].map((n, i) => <figure className={`create-art art-${i}`} key={n}><img src={`/work/tripty/${n}.webp`} alt={['Tripty logo design','Tripty stationery and tote bag','Tripty campaign posters'][i]} loading="lazy" /><figcaption>{['The identity','The details','The campaign'][i]}</figcaption></figure>)}</div>}
    {stage === 3 && <div className="handover-scene scene-enter"><Suspense fallback={<div className="folder-placeholder">Your final artwork</div>}><Folder label="Your final artwork" color="#ff5b4d" size={1.25} intro={false} draggable={false} zoomOnClick={true} layout="spread" items={[{ title: 'Brand files', image: '/work/tripty/02.webp' },{ title: 'Campaign artwork', image: '/work/tripty/07.webp' },{ title: 'Brand guidelines', image: '/work/tripty/04.webp' }]} /></Suspense><p>Open the folder. Explore the handover.</p></div>}
    <span className="desk-bottomline">Illustrative workflow · Tripty portfolio artwork</span>
  </div>;
}

export function ApproachSection({ setService }) {
  const [active, setActive] = useState(0);
  const root = useRef(null);
  useDepth(root, '.approach-desk');
  return <section id="approach" className="bulk-section bulk-approach" ref={root} aria-labelledby="approach-title">
    <div className="bulk-heading heading-split"><div><span className="bulk-kicker">Our approach</span><h2 id="approach-title">One clear direction.<br />A whole lot of possibility.</h2></div><p>Good design starts with a conversation.<br />Great batches start with a shared direction.</p></div>
    <div className="approach-steps" role="group" aria-label="Explore our design process">{stages.map((stage, i) => <button type="button" key={stage.short} aria-pressed={active === i} aria-controls="approach-detail" className={active === i ? 'is-active' : ''} onClick={() => setActive(i)}><span className="step-orbit">0{i + 1}</span><span>{stage.short}</span><span className="step-line" aria-hidden="true" /></button>)}</div>
    <div className="approach-layout"><div className="approach-copy" id="approach-detail" aria-live="polite"><span className="step-count">0{active + 1} <span>/ 04</span></span><h3>{stages[active].title}</h3><p>{stages[active].text}</p><div className="approach-output"><span aria-hidden="true">✳</span>{stages[active].output}</div><div className="approach-navigation"><button type="button" aria-label="Previous process stage" disabled={active === 0} onClick={() => setActive(active - 1)}>←</button><button type="button" aria-label="Next process stage" disabled={active === 3} onClick={() => setActive(active + 1)}>→</button></div></div><div className="desk-perspective"><ApproachVisual stage={active} /></div></div>
    <div className="approach-bottom"><p>Your launch date matters. Let's plan around it.</p><SpecularButton radius={999} size="md" lineColor="#ff4c42" onClick={() => jumpToInquiry('Custom batch', setService)}>Discuss your batch <span aria-hidden="true">↗</span></SpecularButton></div>
  </section>;
}

const batchFormats = [
  { label: 'The whole set', count: 'One connected campaign', detail: 'Different messages. A familiar visual language.' },
  { label: 'Feed designs', count: 'Original designs', detail: 'A distinct message and composition for each creative.' },
  { label: 'Adaptations', count: 'Same idea. A different format.', detail: 'Approved designs adapted to the placements in your brief.' },
  { label: 'Carousels', count: 'One story, across several slides.', detail: 'Slide count and content are agreed as part of your scope.' }
];

export function BatchSection({ setService }) {
  const [format, setFormat] = useState(0);
  const root = useRef(null);
  useDepth(root, '.batch-stage', 'batch');
  return <section className="bulk-section bulk-batch" id="design-batches" ref={root} aria-labelledby="batch-title">
    <div className="bulk-heading heading-split"><div><span className="bulk-kicker">Built to work together</span><h2 id="batch-title">One campaign.<br />Every angle covered.</h2></div><p>Explore the pieces of a batch.<br />We agree on the count before we create.</p></div>
    <div className="batch-switcher" role="group" aria-label="Explore design formats">{batchFormats.map((item, i) => <button key={item.label} type="button" aria-pressed={format === i} onClick={() => setFormat(i)}>{item.label}</button>)}</div>
    <div className={`batch-stage format-${format}`}>
      <span className="batch-orbit orbit-one" aria-hidden="true" /><span className="batch-orbit orbit-two" aria-hidden="true" />
      <div className="batch-art batch-left"><img src="/work/seor/02.webp" alt="Seor product campaign design" loading="lazy" /><span>Product story</span></div>
      <div className="batch-art batch-center"><TiltedCard imageSrc="/work/seor/cover.webp" altText="Seor campaign artwork" containerWidth="100%" containerHeight="100%" imageWidth="100%" imageHeight="100%" showTooltip={false} intro={false} radius={12} rotateAmplitude={6} scaleOnHover={1.02} gyroscope={false} /><span>Campaign creative</span></div>
      <div className="batch-art batch-right"><img src="/work/seor/03.webp" alt="Another design in the Seor campaign" loading="lazy" /><span>Another perspective</span></div>
      <span className="batch-marker">Same brand.<br />More possibilities.</span>
    </div>
    <div className="batch-caption" aria-live="polite"><div><h3>{batchFormats[format].count}</h3><p>{batchFormats[format].detail}</p></div><a href="/work/seor">Explore Seor <span aria-hidden="true">↗</span></a></div>
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
    <div className="package-clarity">{guideItems.map((item, i) => <div key={item.title}><button type="button" aria-expanded={open === i} aria-controls={`guide-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{item.title}<span aria-hidden="true">{open === i ? '−' : '+'}</span></button><p id={`guide-${i}`} hidden={open !== i}>{item.text}</p></div>)}</div>
    <AnimatedContent distance={25} tilt={5} duration={0.7}><div className="custom-batch-strip"><div className="custom-batch-symbol" aria-hidden="true"><span /><span /><span /></div><div><h3>A different mix in mind?</h3><p>Your formats. Your quantity. A quote built around them.</p></div><SpecularButton radius={999} size="md" lineColor="#ff4c42" onClick={() => jumpToInquiry('Custom batch', setService)}>Build a custom batch <span aria-hidden="true">↗</span></SpecularButton></div></AnimatedContent>
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
    <div className="faq-studio-intro"><span className="bulk-kicker">Before we begin</span><h2 id="studio-faq-title">Good questions.<br />Clear answers.</h2><div className="faq-selector" role="group" aria-label="Question categories">{Object.keys(faqGroups).map(name => <SpecularButton key={name} size="sm" radius={999} aria-pressed={name === group} className={name === group ? 'is-active' : ''} lineColor={name === group ? '#ff4c42' : '#555762'} onClick={() => { setGroup(name); setOpen(0); }}>{name}</SpecularButton>)}</div><span className="faq-question-object" aria-hidden="true">?</span></div>
    <div className="faq-studio-list">{faqGroups[group].map(([question, answer], i) => <div key={question} className={`faq-studio-item ${open === i ? 'is-open' : ''}`}><h3><button type="button" aria-expanded={open === i} aria-controls={`studio-answer-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{question}<span aria-hidden="true">{open === i ? '−' : '+'}</span></button></h3><div id={`studio-answer-${i}`} hidden={open !== i}><p>{answer}</p></div></div>)}</div>
  </section>;
}
