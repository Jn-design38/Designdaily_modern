import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.json';
import { chapterDefinitions, getChapterImages, getChapterProjects } from '../data/showcase';
import SplitText from './SplitText';
import SpotlightCard from './SpotlightCard';
import TiltedCard from './TiltedCard';
import Magnet from './Magnet';
import { Arrow, Star } from './Icons';
import { Artwork } from './Portfolio';
import { Packages, ScaleBenefit, FAQ, Contact } from './StudioSections';

gsap.registerPlugin(ScrollTrigger);

function roundedRoute(a, b) {
  if (Math.abs(a.x - b.x) < 1) return `M${a.x},${a.y} V${b.y}`;
  const mid = a.y + (b.y - a.y) / 2;
  const sign = b.x > a.x ? 1 : -1;
  const r = Math.min(38, Math.abs(b.x - a.x) / 4, Math.max(0, (b.y - a.y) / 4));
  return `M${a.x},${a.y} V${mid-r} Q${a.x},${mid} ${a.x+sign*r},${mid} H${b.x-sign*r} Q${b.x},${mid} ${b.x},${mid+r} V${b.y}`;
}

// Coordinates come from the layout, so the line follows content and font reflow.
function FlowTrail({ rootRef }) {
  const [segments, setSegments] = useState([]);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const pathsRef = useRef([]);
  const svgRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!root) return;
        const origin = root.getBoundingClientRect();
        const mobile = window.innerWidth < 900;
        const points = [...root.querySelectorAll('[data-flow-node]')].map(node => {
          const rect = node.getBoundingClientRect();
          return { x: mobile ? 15 : rect.left - origin.left + rect.width / 2, y: rect.top - origin.top + rect.height / 2 };
        });
        setSize({ width: root.clientWidth, height: root.scrollHeight });
        setSegments(points.slice(1).map((point, index) => ({ d: roundedRoute(points[index], point), start: points[index].y, end: point.y })));
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll('.flow-chapter,.journey-closing').forEach(element => observer.observe(element));
    root.addEventListener('load', measure, true);
    window.addEventListener('resize', measure);
    document.fonts.ready.then(measure);
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); root.removeEventListener('load', measure, true); window.removeEventListener('resize', measure); };
  }, [rootRef]);

  useEffect(() => {
    if (!segments.length) return;
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const reached = -root.getBoundingClientRect().top + window.innerHeight * .66;
      pathsRef.current.forEach((path, index) => {
        if (!path) return;
        const segment = segments[index];
        const progress = reduce.matches ? 1 : gsap.utils.clamp(0, 1, (reached - segment.start) / Math.max(1, segment.end - segment.start));
        path.style.strokeDashoffset = String(1 - progress);
      });
    };
    const trigger = ScrollTrigger.create({trigger:root,start:'top bottom',end:'bottom top',onUpdate:update,onRefresh:update});
    reduce.addEventListener('change', update);
    update();
    return () => { trigger.kill(); reduce.removeEventListener('change', update); };
  }, [segments, rootRef]);

  return <svg ref={svgRef} className="flow-trail" width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
    {segments.map((segment, index) => <g key={index}><path className="flow-trail-base" d={segment.d} /><path ref={element => { pathsRef.current[index] = element; }} className="flow-trail-active" d={segment.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" /></g>)}
  </svg>;
}

function rememberFlow() {
  try { sessionStorage.setItem('dd-flow-return', JSON.stringify({y:window.scrollY, chapter:location.hash})); } catch { /* Navigation works if storage is disabled. */ }
}

function FlowProject({ project, chapter, featured, index }) {
  const images = getChapterImages(chapter, project);
  if (!images.length) return null;
  const [lead, ...details] = images;
  const showcaseTilt = featured && ['packaging', 'merchandise'].includes(chapter.id);
  const visual = <Artwork image={lead} eager={chapter.id === 'brand-identity' && index === 0} />;
  return <article className={`flow-project ${featured ? 'flow-project-featured' : ''} ${chapter.id === 'banners' ? 'flow-project-wide' : ''}`} data-flow-reveal data-project-id={project.id}>
    <a href={`/work/${project.id}?from=${chapter.id}`} onClick={rememberFlow} className="flow-project-link" aria-label={`Explore ${project.title}: ${chapter.label}`}>
      <div className="flow-artwork" style={{'--art-ratio':`${lead.width} / ${lead.height}`}}>
        {showcaseTilt ? <TiltedCard containerHeight="100%" containerWidth="100%" imageHeight="100%" imageWidth="100%" rotateAmplitude={5} scaleOnHover={1.015} showTooltip={false} glare={.15} shadow={.3} parallax={0} floating={false} gyroscope={false} intro={false} radius={16}>{visual}</TiltedCard> : visual}
        <span className="flow-open" aria-hidden="true"><Arrow diagonal /></span>
      </div>
      {details.length > 0 && <div className={`flow-details ${chapter.id === 'banners' ? 'flow-banner-details' : ''}`}>{details.map(image => <div key={image.src}><Artwork image={image} /></div>)}</div>}
      <div className="flow-caption"><div><h3>{project.title}</h3><p>{chapter.label}</p></div><span className="flow-view">View project <Arrow diagonal /></span></div>
    </a>
  </article>;
}

function FlowChapter({ chapter, index }) {
  const collection = getChapterProjects(chapter, projects);
  return <section id={chapter.id} className={`flow-chapter ${index % 2 ? 'flow-reverse' : ''}`} aria-labelledby={`${chapter.id}-title`} data-chapter={chapter.id}>
    <div className="flow-chapter-layout">
      <div className="flow-copy">
        <div className="flow-milestone" data-flow-node><span className="flow-dot" /><span>{chapter.label}</span><span className="flow-chapter-number">{String(index + 1).padStart(2, '0')}</span></div>
        <h2 id={`${chapter.id}-title`} className="flow-heading" data-flow-reveal>{chapter.title.split('\n').map((line, i) => <span key={i}>{line}</span>)}</h2>
        <p className="flow-intro-copy" data-flow-reveal>{chapter.intro}</p>
        <div className="flow-notes">{chapter.notes.map(([title, copy], noteIndex) => <div className="flow-note-wrap" data-flow-node key={title}>
          <SpotlightCard className="flow-note" spotlightColor="#ff6c56" intensity={.13} borderGlow={.4} proximity={60} flare={false} data-flow-reveal>
            <span className="flow-note-symbol" aria-hidden="true">{noteIndex === 0 ? '✳' : noteIndex === 1 ? '↗' : '↔'}</span><div><h3>{title}</h3><p>{copy}</p></div>
          </SpotlightCard>
        </div>)}</div>
        <a href={`/work?category=${chapter.categories[0]}`} className="flow-category-link">{collection.length} {collection.length === 1 ? 'project' : 'projects'} to explore <Arrow diagonal /></a>
      </div>
      <div className={`flow-gallery flow-gallery-${chapter.id}`} aria-label={`${chapter.label} projects`}>
        {collection.map((project, cardIndex) => <FlowProject key={project.id} project={project} chapter={chapter} index={cardIndex} featured={cardIndex === 0} />)}
      </div>
    </div>
    <div className="flow-bridge"><span data-flow-node>{chapter.transition}</span><span className="flow-bridge-arrow" aria-hidden="true">↓</span></div>
  </section>;
}

function FlowNavigation() {
  const [active, setActive] = useState('brand-identity');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, {rootMargin:'-15% 0px -65% 0px'});
    document.querySelectorAll('[data-chapter]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <label className="flow-jump"><span>Follow the work</span><select aria-label="Jump to discipline" value={active} onChange={event => { setActive(event.target.value); history.replaceState(null,'',`#${event.target.value}`); document.getElementById(event.target.value)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}); }}>{chapterDefinitions.map(chapter => <option value={chapter.id} key={chapter.id}>{chapter.label}</option>)}</select><span aria-hidden="true">↓</span></label>;
}

export default function ShowcaseFlow({ service, setService }) {
  const root = useRef(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        // No hidden-by-default CSS: content remains available if enhancement fails.
        root.current.querySelectorAll('[data-flow-reveal]').forEach(element => {
          gsap.from(element, {opacity:0, y:26, duration:.7, ease:'power3.out', scrollTrigger:{trigger:element,start:'top 96%',once:true}});
        });
        root.current.querySelectorAll('.flow-milestone').forEach(element => {
          ScrollTrigger.create({trigger:element,start:'top 70%',toggleClass:{targets:element,className:'is-reached'}});
        });
        gsap.from('.assessment-sheet', {y:32,rotation:-9,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:'.planning-preview',start:'top 86%',once:true}});
        gsap.from('.calendar-sheet', {y:60,rotation:8,opacity:0,duration:.85,delay:.12,ease:'power3.out',scrollTrigger:{trigger:'.planning-preview',start:'top 86%',once:true}});
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return <div ref={root} className="showcase-flow" id="works">
    <FlowTrail rootRef={root} />
    <div className="flow-opening">
      <div className="flow-opening-top"><span><Star /> Made by Design Daily</span><a href="/work">The complete collection <Arrow diagonal /></a></div>
      <div className="flow-opening-copy"><SplitText tag="h2" text="One recognisable brand. Everywhere you show up." className="flow-opening-title" textAlign="left" splitType="words" delay={45} duration={.6} rootMargin="0px" /><p>Follow the thread.<br />From the first mark to every impression after.</p></div>
      <div className="flow-entry"><span data-flow-node className="flow-entry-dot" aria-hidden="true" /><FlowNavigation /></div>
    </div>
    <div id="capabilities" className="flow-chapters">{chapterDefinitions.map((chapter, index) => <FlowChapter key={chapter.id} chapter={chapter} index={index} />)}</div>
    <div className="journey-closing">
      <section id="studio" className="flow-approach">
        <div className="flow-milestone" data-flow-node><span className="flow-dot" /> A little structure. A lot of care.</div>
        <h2>You bring the business.<br />We bring the design.</h2>
        <p>We listen, explore, refine, and deliver. One clear conversation, with the same care at every step.</p>
        <div className="flow-process" aria-label="Our process">{['Understand', 'Design', 'Refine', 'Deliver'].map((label,index) => <span key={label}><i>{String(index+1).padStart(2,'0')}</i>{label}{index < 3 && <Arrow />}</span>)}</div>
      </section>
      <div className="closing-connector" data-flow-node><span>Choose your next chapter</span></div>
      <Packages onChoose={setService} />
      <div className="closing-connector" data-flow-node><span>A little more direction</span></div>
      <ScaleBenefit onChoose={setService} />
      <FAQ />
      <section className="flow-finale" id="contact" aria-labelledby="flow-cta-title">
        <span className="finale-port" data-flow-node aria-hidden="true"><Star /></span>
        <SplitText text="Your brand could be next." tag="h2" className="flow-cta-title" textAlign="center" splitType="words" delay={65} duration={.65} rootMargin="0px" />
        <p>From the first identity to the next campaign,<br />let’s make every touchpoint feel like you.</p>
        <div className="flow-finale-actions"><Magnet padding={32} maxOffset={6} magnetStrength={8}><a className="button flow-primary" href="#project-inquiry">Start your project <Arrow diagonal /></a></Magnet><a className="text-link" href="#packages">Explore packages <Arrow /></a></div>
      </section>
      <Contact service={service} setService={setService} />
    </div>
  </div>;
}
