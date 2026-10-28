import { useEffect, useMemo, useRef, useState } from 'react';
import projects from '../data/projects.json';
import { getCaseStudy } from '../data/caseStudies';
import BranchedMenu from './BranchedMenu';
import Lightbox from './Lightbox';
import { Arrow, Chevron } from './Icons';
import './ProjectPage.css';

function scrollToChapter(target, compact, immediate = false) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.querySelector('h2')?.focus({ preventScroll: true });
  // Lenis reads CSS scroll-margin; native window scrolling needs an explicit offset.
  if (window.__lenis) window.__lenis.scrollTo(target, { duration: 0.8, immediate: immediate || reduced });
  else window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - (compact ? 76 : 16), behavior: immediate || reduced ? 'instant' : 'smooth' });
}

function ProjectArtwork({ image, index, openArtwork }) {
  return (
    <figure className={`case-media${image.height > image.width ? ' case-media--portrait' : ''}`}>
      <button type="button" className="case-media__open" onClick={() => openArtwork(index)} aria-label={`View full artwork: ${image.alt}`}>
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} decoding="async" />
        <span className="case-media__expand" aria-hidden="true"><Arrow diagonal /></span>
      </button>
    </figure>
  );
}

export default function ProjectPage({ project }) {
  const story = useMemo(() => getCaseStudy(project), [project]);
  const next = projects[(projects.findIndex(item => item.id === project.id) + 1) % projects.length];
  const nextStory = getCaseStudy(next);
  const artworkOrder = useMemo(() => story.chapters.flatMap(chapter => chapter.rows.flat()), [story]);
  const galleryImages = useMemo(() => artworkOrder.map(index => project.images[index]), [artworkOrder, project]);
  const inquiryHref = `/?service=${encodeURIComponent(project.discipline === 'Packaging archive' ? 'Something else' : /social/i.test(project.discipline) ? 'Social creatives' : project.discipline)}#contact`;
  const [openArtwork, setOpenArtwork] = useState(null);
  const [active, setActive] = useState(story.chapters[0].id);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useRef(null);
  const menuTrigger = useRef(null);
  const chapters = useRef(new Map());
  const menuItems = useMemo(() => [{
    label: 'In this project',
    children: story.chapters.map(chapter => ({ value: chapter.id, label: chapter.label }))
  }], [story]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const update = () => { setCompact(media.matches); setMenuOpen(false); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const track = () => {
      frame = 0;
      const offset = compact ? 110 : Math.min(window.innerHeight * 0.25, 220);
      let current = story.chapters[0].id;
      for (const chapter of story.chapters) {
        if (chapters.current.get(chapter.id)?.getBoundingClientRect().top <= offset) current = chapter.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(track); };
    track();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [story, compact]);

  useEffect(() => {
    let frame = 0;
    const restoreChapter = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const id = window.location.hash.slice(1) || story.chapters[0].id;
        const target = chapters.current.get(id);
        if (!target) return;
        setMenuOpen(false);
        setActive(id);
        scrollToChapter(target, compact, true);
      });
    };
    // Keep Back/Forward and native hash links in sync with the smooth-scroll state.
    window.addEventListener('popstate', restoreChapter);
    window.addEventListener('hashchange', restoreChapter);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', restoreChapter);
      window.removeEventListener('hashchange', restoreChapter);
    };
  }, [story, compact]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const dismiss = event => {
      if (!navigation.current?.contains(event.target)) setMenuOpen(false);
    };
    const escape = event => {
      if (event.key === 'Escape') { setMenuOpen(false); menuTrigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (openArtwork === null) return undefined;
    const lenis = window.__lenis;
    const alreadyStopped = lenis?.isStopped;
    lenis?.stop();
    return () => { if (!alreadyStopped) lenis?.start(); };
  }, [openArtwork]);

  function navigate(value) {
    const target = chapters.current.get(value);
    if (!target) return;
    setMenuOpen(false);
    setActive(value);
    if (window.location.hash !== `#${value}`) history.pushState(null, '', `#${value}`);
    scrollToChapter(target, compact);
  }

  return (
    <article className="case-study" aria-labelledby="case-title">
      <a href="#case-content" className="skip-link">Skip to project story</a>
      <aside className="case-study__rail" aria-label={`${story.name} project information`}>
        <header className="case-study__site">
          <a href="/" className="case-study__home" aria-label="Design Daily home"><img src="/design-daily-icon-white.svg" alt="" width="34" height="34" /></a>
          <a href="/work" className="case-study__back"><Arrow /><span>All work</span></a>
        </header>
        <div className="case-study__intro">
          <h1 id="case-title">{story.name}</h1>
          <p className="case-study__tagline">{story.tagline}</p>
          <dl className="case-study__details">
            <div><dt>Sector</dt><dd>{story.sector}</dd></div>
            <div><dt>Discipline</dt><dd>{project.discipline}</dd></div>
          </dl>
        </div>
        <div ref={navigation} className="case-study__navigation">
          <button ref={menuTrigger} className="case-study__menu-trigger" type="button" aria-expanded={menuOpen} aria-controls="case-chapter-menu" onClick={() => setMenuOpen(value => !value)}>
            <span>Project index</span><span>{story.chapters.find(chapter => chapter.id === active)?.label}<Chevron direction={menuOpen ? 'up' : 'down'} /></span>
          </button>
          <div id="case-chapter-menu" className="case-study__menu" hidden={compact && !menuOpen} data-lenis-prevent>
            <BranchedMenu
              items={menuItems}
              defaultOpen={[0]}
              defaultActive="challenge"
              activeValue={active}
              ariaLabel={`${story.name} chapters`}
              onSelect={navigate}
              color="#f5f5f5"
              accentColor="#f5f5f5"
              lineColor="#3f3f46"
              width={240}
              rowHeight={compact ? 44 : 36}
              indent={40}
              trunk={14}
              radius={10}
              lineWidth={1.5}
              fontSize={14}
              drawDuration={400}
              foldDuration={300}
            />
          </div>
        </div>
        <a className="case-study__enquiry" href={inquiryHref}>Have a project in mind?<Arrow diagonal /></a>
      </aside>

      <div className="case-study__content" id="case-content" tabIndex={-1}>
        {story.chapters.map(chapter => (
          <section key={chapter.id} id={chapter.id} className="case-chapter" ref={element => { if (element) chapters.current.set(chapter.id, element); else chapters.current.delete(chapter.id); }} aria-labelledby={`${chapter.id}-heading`}>
            {chapter.rows.map((row, rowIndex) => (
              <div className={`case-media-row${row.length > 1 ? ' case-media-row--pair' : ''}`} key={rowIndex}>
                {row.map(index => <ProjectArtwork key={project.images[index].src} image={project.images[index]} index={index} openArtwork={originalIndex => setOpenArtwork(artworkOrder.indexOf(originalIndex))} />)}
              </div>
            ))}
            <div className="case-chapter__copy">
              <h2 id={`${chapter.id}-heading`} tabIndex={-1}>{chapter.label}</h2>
              <div>
                {chapter.heading && <h3>{chapter.heading}</h3>}
                <p>{chapter.body}</p>
              </div>
            </div>
          </section>
        ))}

        <div className="case-study__closing">
          <p>Your next chapter starts with a conversation.</p>
          <a href={inquiryHref}>Start a project<Arrow diagonal /></a>
        </div>
        <a className="case-next" href={`/work/${next.id}`} aria-label={`Next project: ${next.title}`}>
          <div className="case-next__heading"><div><span>Next project</span><h2>{nextStory.name}</h2><p>{nextStory.tagline}</p></div><Arrow diagonal /></div>
          <div className="case-next__image"><img src={next.cover} alt={next.images[0].alt} width={next.images[0].width} height={next.images[0].height} loading="lazy" decoding="async" /></div>
        </a>
      </div>
      {openArtwork !== null && <Lightbox images={galleryImages} initialIndex={openArtwork} onClose={() => setOpenArtwork(null)} />}
    </article>
  );
}
