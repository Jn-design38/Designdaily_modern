import { useEffect, useMemo, useState } from 'react';
import projects from '../data/projects.json';
import Masonry from './Masonry';
import Lightbox from './Lightbox';
import { Artwork, ProjectCard } from './Portfolio';
import { Arrow } from './Icons';

export const categories = [
  ['all', 'All work'],
  ['brand-identity', 'Brand identity'],
  ['merchandise', 'Merchandise'],
  ['stationery', 'Stationery'],
  ['banners', 'Banners'],
  ['posters', 'Posters'],
  ['billboards', 'Billboards'],
  ['social-creatives', 'Social creatives'],
  ['packaging', 'Packaging archive']
];

const labelFor = id => categories.find(([key]) => key === id)?.[1] || id;

export function WorkArchive() {
  const initial = new URLSearchParams(window.location.search);
  const [category, setCategory] = useState(
    categories.some(([id]) => id === initial.get('category')) ? initial.get('category') : 'all'
  );
  const [query, setQuery] = useState(initial.get('q') || '');
  const [limit, setLimit] = useState(9);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (query) params.set('q', query);
    history.replaceState(null, '', `/work${params.size ? `?${params}` : ''}`);
    setLimit(9);
  }, [category, query]);

  const filtered = useMemo(
    () =>
      projects.filter(
        project =>
          (category === 'all' || project.categoryIds.includes(category)) &&
          `${project.title} ${project.description} ${project.discipline}`.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [category, query]
  );

  const items = filtered.slice(0, limit).map(project => ({
    id: project.id,
    img: project.cover,
    title: project.title,
    description: project.discipline,
    url: `/work/${project.id}`,
    width: project.images[0].width,
    height: project.images[0].height,
    alt: project.images[0].alt,
    captionSpace: 68
  }));

  return (
    <div className="archive-page wrap">
      <header className="archive-heading">
        <a className="back-link" href="/#works">
          <Arrow /> Back to studio
        </a>
        <div className="archive-heading-content">
          <div>
            <div className="studio-status-pill">
              <span className="status-indicator-dot" />
              <span>Selected Works Catalog • 13 Projects</span>
            </div>
            <h1>A world of work.</h1>
          </div>
          <p>Different businesses. Different personalities.<br />The same care in every detail.</p>
        </div>
      </header>

      <div className="archive-filter-bar">
        <div className="filter-list" aria-label="Filter projects">
          {categories.map(([id, label]) => {
            const count = id === 'all' ? projects.length : projects.filter(project => project.categoryIds.includes(id)).length;
            return (
              count > 0 && (
                <button
                  key={id}
                  className={`filter-pill-btn ${category === id ? 'is-active' : ''}`}
                  aria-pressed={category === id}
                  onClick={() => setCategory(id)}
                >
                  <span>{label}</span>
                  <span className="filter-count-badge">{count}</span>
                </button>
              )
            );
          })}
        </div>

        <div className="archive-search-wrap">
          <label className="archive-search">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Find a project or brand…"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>
      </div>

      <div className="archive-meta-row">
        <p className="archive-count" aria-live="polite">
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}
          {category !== 'all' ? ` in ${labelFor(category)}` : ''}
        </p>
        {(category !== 'all' || query) && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={() => { setCategory('all'); setQuery(''); }}
          >
            Reset filters
          </button>
        )}
      </div>

      {items.length ? (
        <Masonry
          items={items}
          columns="auto"
          columnWidth={340}
          gap={30}
          radius={8}
          animateFrom="none"
          stagger={0}
          duration={0.35}
          bounce={0}
          blurToFocus={false}
          revealOnScroll={false}
          hoverEffect="none"
          captions="always"
          lightbox={false}
          draggable={false}
          className="work-masonry"
        />
      ) : (
        <div className="empty-results">
          <h2>No projects match that search.</h2>
          <p>Try a different keyword or explore the full collection of studio work.</p>
          <button
            className="button button-dark"
            onClick={() => {
              setCategory('all');
              setQuery('');
            }}
          >
            Show all work
          </button>
        </div>
      )}

      {filtered.length > limit && (
        <div className="load-more">
          <button className="button button-outline" onClick={() => setLimit(value => value + 9)}>
            <span>Show more projects</span>
            <span className="load-more-counter">({filtered.length - limit} remaining)</span>
          </button>
        </div>
      )}

      <div className="archive-contact">
        <div>
          <span className="section-note">Commission Work</span>
          <h2>Have something in mind?</h2>
        </div>
        <a className="button button-dark" href="/#contact">
          <span>Let’s talk about it</span>
          <Arrow diagonal />
        </a>
      </div>
    </div>
  );
}

export function ProjectPage({ project }) {
  const [open, setOpen] = useState(null);
  const next = projects[(projects.findIndex(item => item.id === project.id) + 1) % projects.length];

  return (
    <article className="project-page wrap">
      <a className="back-link" href="/work">
        <Arrow /> All work
      </a>

      <header className="project-page-heading">
        <div>
          <div className="project-meta-pill">
            <span className="project-meta-dot" />
            <span>{project.discipline}</span>
          </div>
          <h1>{project.title}</h1>
        </div>
        <div>
          <p>{project.description}</p>
          <div className="project-tags">
            {project.categoryIds.map(id => (
              <a key={id} href={`/work?category=${id}`} className="project-category-tag">
                {labelFor(id)}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="project-hero-wrap">
        <button
          className="project-hero-image"
          onClick={() => setOpen(0)}
          aria-label="View cover artwork full size"
        >
          <Artwork image={project.images[0]} eager />
          <span className="image-expand">
            <span>View full artwork</span>
            <Arrow diagonal />
          </span>
        </button>
      </div>

      <div className="project-gallery-heading">
        <div>
          <span className="section-note">Visual Exploration</span>
          <h2>A closer look.</h2>
        </div>
        <span className="gallery-count-badge">{project.images.length} deliverable assets</span>
      </div>

      <div className="project-gallery">
        {project.images.slice(1).map((image, index) => (
          <figure key={image.src} className={index % 5 === 4 ? 'gallery-wide' : ''}>
            <button
              onClick={() => setOpen(index + 1)}
              aria-label={`Expand ${image.alt}`}
              className="gallery-card-btn"
            >
              <Artwork image={image} />
              <span className="image-expand">
                <Arrow diagonal />
              </span>
            </button>
            <figcaption>{image.alt}</figcaption>
          </figure>
        ))}
      </div>

      <div className="project-end-cta">
        <div className="cta-copy">
          <span className="section-note">Start A Brief</span>
          <h2>Let’s make something<br />that feels like you.</h2>
        </div>
        <a
          className="button button-dark"
          href={`/?service=${encodeURIComponent(
            project.discipline === 'Packaging archive'
              ? 'Something else'
              : project.discipline.includes('Social') || project.discipline.includes('social')
              ? 'Social creatives'
              : project.discipline
          )}#contact`}
        >
          <span>Start a conversation</span>
          <Arrow diagonal />
        </a>
      </div>

      <div className="next-project">
        <div>
          <span className="section-note">Keep exploring</span>
          <h2>Another brief.<br />Another point of view.</h2>
        </div>
        <ProjectCard id={next.id} />
      </div>

      {open !== null && <Lightbox images={project.images} initialIndex={open} onClose={() => setOpen(null)} />}
    </article>
  );
}

export function NotFound() {
  return (
    <div className="not-found wrap">
      <span className="section-note">Page not found</span>
      <h1>A little off<br />the artboard.</h1>
      <p>This project or page isn’t in the collection.</p>
      <a className="button button-dark" href="/work">
        <span>Explore our work</span>
        <Arrow />
      </a>
    </div>
  );
}
