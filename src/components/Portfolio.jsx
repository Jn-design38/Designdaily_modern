import { useState } from 'react';
import projects from '../data/projects.json';
import { Arrow, Star } from './Icons';
import BounceCards from './BounceCards';
import SplitText from './SplitText';
import Lightbox from './Lightbox';

export const byId = id => projects.find(project => project.id === id);

export function Artwork({ image, className = '', eager = false, ...props }) {
  return (
    <img
      className={className}
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
}

export function ProjectCard({ id, className = '', imageIndex = 0, caption }) {
  const project = byId(id);
  if (!project) return null;
  return (
    <a className={`project-card ${className}`} href={`/work/${id}`} aria-label={`${project.title} — ${caption || project.discipline}`}>
      <div className="project-image">
        <span className="project-badge">{project.discipline}</span>
        <div className="project-artwork-wrap">
          <Artwork image={project.images[imageIndex]} />
        </div>
        <span className="project-open" aria-hidden="true">
          <Arrow diagonal />
        </span>
      </div>
      <div className="project-caption">
        <div className="caption-main">
          <h3>{project.title}</h3>
          <p className="caption-sub">{caption || project.discipline}</p>
        </div>
        <span className="caption-meta">Explore →</span>
      </div>
    </a>
  );
}

export function BrandWork() {
  return (
    <section id="works" className="work-section wrap">
      <div className="promise-row">
        <div>
          <div className="studio-status-pill">
            <span className="status-indicator-dot" />
            <span>Studio Positioning • Dhaka Atelier</span>
          </div>
          <SplitText
            text="One recognisable brand. Everywhere you show up."
            tag="h2"
            className="promise-heading"
            textAlign="left"
            splitType="words"
            duration={0.55}
            delay={55}
            rootMargin="0px"
          />
        </div>
        <div className="promise-note">
          <div className="promise-icon-wrap"><Star /></div>
          <p>From your logo to your next campaign, we create the static designs that help your business look like itself.</p>
          <a className="text-link" href="/work">
            Explore our work <Arrow />
          </a>
        </div>
      </div>

      <div className="work-intro">
        <div className="intro-lead">
          <span className="section-note">Made by Design Daily</span>
          <p>Start with a brand that feels like you.</p>
        </div>
        <div className="intro-metrics">
          <span className="metric-pill">08 Brand Identities</span>
          <span className="metric-pill">100% Static Craft</span>
        </div>
      </div>

      <div className="identity-lead">
        <ProjectCard id="tripty" caption="A little flavour. A whole identity." />
        <div className="identity-aside">
          <a href="/work/tripty" className="detail-link" aria-label="View Tripty project details">
            <div className="detail-image-wrap">
              <Artwork image={byId('tripty').images[3]} />
              <span className="detail-badge">Brand System</span>
            </div>
            <span>The details make the difference. <Arrow diagonal /></span>
          </a>
          <p>A mark. A colour. A feeling.<br />A hundred ways to make it yours.</p>
          <div className="colour-notes" aria-label="Tripty brand colours">
            <span className="colour-chip" title="Crimson (#ea0046)">
              <i style={{ background: '#ea0046' }} />
              <span>Crimson</span>
            </span>
            <span className="colour-chip" title="Ochre (#ffcb30)">
              <i style={{ background: '#ffcb30' }} />
              <span>Ochre</span>
            </span>
            <span className="colour-chip" title="Cream (#fff6eb)">
              <i style={{ background: '#fff6eb' }} />
              <span>Cream</span>
            </span>
          </div>
        </div>
      </div>

      <div className="identity-pair">
        <ProjectCard id="norea" caption="Quiet detail. Lasting character." />
        <ProjectCard id="all-organics" caption="A naturally connected visual world." />
      </div>

      <div className="more-identities">
        <div className="more-identities-copy">
          <span className="section-note">Visual Systems</span>
          <p>Every business has its own character.<br /><strong>We help you put it into the world.</strong></p>
        </div>
        <a href="/work/atuendo" className="mini-card" aria-label="Explore Atuendo identity">
          <div className="mini-image-wrap">
            <Artwork image={byId('atuendo').images[0]} />
            <span className="mini-tag">Atuendo</span>
          </div>
          <span>Atuendo Identity <Arrow diagonal /></span>
        </a>
        <a href="/work/sandbox" className="mini-card" aria-label="Explore Sandbox Lounge identity">
          <div className="mini-image-wrap">
            <Artwork image={byId('sandbox').images[0]} />
            <span className="mini-tag">Sandbox</span>
          </div>
          <span>Sandbox Lounge <Arrow diagonal /></span>
        </a>
      </div>
    </section>
  );
}

export function PhysicalWork() {
  const printImages = [byId('atuendo').images[4], byId('norea').images[6], byId('sandbox').images[3]];
  const [open, setOpen] = useState(null);

  return (
    <section className="physical-section wrap" aria-labelledby="physical-title">
      <div className="section-heading split-heading">
        <div>
          <span className="section-note">Tangible Touchpoints</span>
          <h2 id="physical-title">On the things people<br />see, hold, and wear.</h2>
        </div>
        <div>
          <p>Give your identity a life beyond the logo. A favourite tee. A thoughtful letterhead. A poster that makes you look twice.</p>
          <a className="text-link" href="/work?category=merchandise">Explore apparel & merchandise <Arrow /></a>
        </div>
      </div>

      <ProjectCard id="goodybro" className="merch-lead" caption="Graphics with something to say." />

      <div className="physical-pair">
        <ProjectCard id="zaro" caption="From a character to a collection." />
        <div className="print-story">
          <div className="print-fan">
            <BounceCards
              images={printImages}
              containerWidth={520}
              containerHeight={330}
              cardSize={220}
              spread={125}
              rotation={8}
              bounciness={0.25}
              borderWidth={5}
              radius={8}
              enableHover
              pushDistance={38}
              hoverScale={1.03}
              onCardClick={index => setOpen(typeof index === 'number' ? index : 0)}
            />
          </div>
          <div className="print-mobile">
            {printImages.map((image, index) => (
              <button onClick={() => setOpen(index)} key={image.src} aria-label={`View ${image.alt}`}>
                <Artwork image={image} />
              </button>
            ))}
          </div>
          <div className="print-story-copy">
            <span className="print-kicker">Collateral Suite</span>
            <h3>Good design.<br />You can put your hands on.</h3>
            <p>Stationery, brand collateral, and the small details that make a business feel considered.</p>
            <a className="text-link" href="/work?category=stationery">Explore stationery <Arrow /></a>
          </div>
        </div>
      </div>

      <div className="print-wide">
        <a href="/work/norea" className="billboard-image" aria-label="View Norea outdoor campaign">
          <div className="billboard-container">
            <Artwork image={byId('norea').images[7]} />
            <span className="billboard-badge">Outdoor Spec // Norea 08</span>
          </div>
        </a>
        <div className="print-wide-copy">
          <span className="section-note">A bigger impression</span>
          <h3>Same brand.<br />Different scale.</h3>
          <p>Posters, banners, and billboards that take your visual language out into the world.</p>
          <div className="billboard-points">
            <span>• Billboard specs</span>
            <span>• Outdoor durability</span>
            <span>• High contrast typography</span>
          </div>
          <a className="text-link" href="/work?category=billboards">See the applications <Arrow /></a>
        </div>
      </div>

      {open !== null && <Lightbox images={printImages} initialIndex={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

const campaigns = [
  { id: 'aves', label: 'Aves' },
  { id: 'seor', label: 'Seor' },
  { id: 'tripty-social', label: 'Tripty' },
  { id: 'apple-gears', label: 'Apple Gears' }
];

export function SocialWork() {
  const [campaign, setCampaign] = useState('aves');
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(null);
  const project = byId(campaign);
  const move = amount => setPosition(index => (index + amount + project.images.length) % project.images.length);

  return (
    <section className="social-section wrap" aria-labelledby="social-title">
      <div className="section-heading split-heading">
        <div>
          <span className="section-note">Digital Surfaces</span>
          <h2 id="social-title">Show up with something<br />worth seeing.</h2>
        </div>
        <div>
          <p>Static posts. Thoughtful carousels. Campaigns with a consistent point of view.</p>
          <a className="text-link" href="/work?category=social-creatives">All social creatives <Arrow /></a>
        </div>
      </div>

      <div className="campaign-toolbar">
        <div className="campaign-tabs" role="tablist" aria-label="Social campaign">
          {campaigns.map(item => (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-controls="campaign-panel"
              aria-selected={campaign === item.id}
              onClick={() => {
                setCampaign(item.id);
                setPosition(0);
              }}
            >
              {item.label}
              <span className="tab-count-pill">{byId(item.id)?.images.length || 0}</span>
            </button>
          ))}
        </div>
        <span className="campaign-tagline">Campaigns, with character.</span>
      </div>

      <div className="campaign-stage" id="campaign-panel" role="tabpanel" aria-labelledby={`tab-${campaign}`}>
        <div className="stage-glow" aria-hidden="true" />
        {[0, 1, 2].map(offset => {
          const index = (position + offset) % project.images.length;
          return (
            <button
              key={`${campaign}-${offset}`}
              className={`campaign-art campaign-art-${offset}`}
              onClick={() => setOpen(index)}
              aria-label={`View ${project.images[index].alt}`}
            >
              <div className="campaign-card-frame">
                <Artwork image={project.images[index]} />
                <span className="campaign-index-tag">#{String(index + 1).padStart(2, '0')}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="campaign-caption">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <div className="campaign-pagination">
          <span aria-live="polite">{String(position + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</span>
          <button className="round-button" onClick={() => move(-1)} aria-label="Previous creative">←</button>
          <button className="round-button" onClick={() => move(1)} aria-label="Next creative">→</button>
        </div>
      </div>

      <div className="archive-invitation">
        <div>
          <span className="section-note">There’s more where that came from</span>
          <h3>Different briefs.<br />The same care.</h3>
        </div>
        <a className="large-link" href="/work">
          <span>Explore all {projects.length} projects</span>
          <Arrow diagonal />
        </a>
      </div>

      {open !== null && <Lightbox images={project.images} initialIndex={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
