import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedContent from './reactbits/AnimatedContent';
import TiltedCard from './TiltedCard';
import { Arrow } from './Icons';
import './StudioPrelude.css';

gsap.registerPlugin(ScrollTrigger);

const disciplines = [
  {
    id: 'packaging',
    number: '01',
    label: 'Packaging',
    title: 'Make the shelf feel like your brand.',
    copy: 'Clear hierarchy, memorable colour and a product world that can grow across every size.',
    image: '/prelude/packaging-ngr-rice.webp',
    alt: 'NGR rice packaging arranged in a warm agricultural setting'
  },
  {
    id: 'campaigns',
    number: '02',
    label: 'Campaigns',
    title: 'Turn one offer into a complete visual run.',
    copy: 'Connected posts, ads and launch graphics built to feel like one campaign—not isolated artwork.',
    image: '/prelude/social-seor-feeding-set.webp',
    alt: 'A coordinated pink social campaign for a baby feeding set'
  },
  {
    id: 'extensions',
    number: '03',
    label: 'Brand extensions',
    title: 'Carry the identity into the details.',
    copy: 'Stationery, inserts and everyday brand touchpoints designed with the same visual logic.',
    image: '/prelude/packaging-applegears-card-envelope.webp',
    alt: 'AppleGears cards, box and branded envelope presented together'
  },
  {
    id: 'merchandise',
    number: '04',
    label: 'Merchandise',
    title: 'Create graphics people want to keep.',
    copy: 'Wearable ideas with enough personality to work as both a product and a brand signal.',
    image: '/prelude/tshirt-goodybro-chaotic-world.webp',
    alt: 'Goodybro black T-shirt shown from the front and back'
  }
];

const objects = [
  { id: 'product', label: 'Product', image: '/prelude/zaro-bottle-packaging.webp', alt: 'Zaro bottle and packaging cutout' },
  { id: 'campaign', label: 'Campaign', image: '/prelude/applegears-social-campaign.webp', alt: 'AppleGears campaign artwork and products cutout' },
  { id: 'merch', label: 'Merch', image: '/prelude/goodybro-tshirt-collection.webp', alt: 'Goodybro T-shirt collection cutout' },
  { id: 'identity', label: 'Identity', image: '/prelude/all-organics-brand-world.webp', alt: 'All Organics brand packaging and stationery cutout' }
];

export default function StudioPrelude() {
  const root = useRef(null);
  const objectStage = useRef(null);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [activeObject, setActiveObject] = useState(0);
  const selected = disciplines[activeDiscipline];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo('.studio-prelude__range-stage',
        { rotateX: 8, rotateY: -5, y: 72 },
        {
          rotateX: -3,
          rotateY: 3,
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: '.studio-prelude__range',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8
          }
        }
      );

      gsap.utils.toArray('.studio-prelude__object').forEach((item, index) => {
        gsap.fromTo(item,
          { yPercent: 10 + index * 3, rotateZ: index % 2 ? 3 : -3 },
          {
            yPercent: -10 - index * 3,
            rotateZ: index % 2 ? -2 : 2,
            ease: 'none',
            scrollTrigger: {
              trigger: objectStage.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.65 + index * 0.08
            }
          }
        );
      });
    }, root);

    return () => context.revert();
  }, []);

  const focusObject = index => {
    setActiveObject(index);
  };

  return (
    <div className="studio-prelude" ref={root}>
      <section className="studio-prelude__range" id="studio-range" aria-labelledby="studio-range-title">
        <div className="studio-prelude__wrap">
          <AnimatedContent distance={28} tilt={3} duration={0.85}>
            <header className="studio-prelude__heading">
              <p className="studio-prelude__eyebrow"><span aria-hidden="true" /> The studio range</p>
              <h2 id="studio-range-title">One studio.<br />Four ways to move your brand.</h2>
              <p>Choose a surface. See how the same design discipline stretches from one asset to a complete rollout.</p>
            </header>
          </AnimatedContent>

          <div className="studio-prelude__range-grid">
            <div className="studio-prelude__discipline-list" role="tablist" aria-label="Design disciplines">
              {disciplines.map((item, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeDiscipline === index}
                  aria-controls="studio-range-panel"
                  id={`studio-discipline-${item.id}`}
                  className={activeDiscipline === index ? 'is-active' : ''}
                  onClick={() => setActiveDiscipline(index)}
                  key={item.id}
                >
                  <span>{item.number}</span>
                  <strong>{item.label}</strong>
                  <span className="studio-prelude__tab-line" aria-hidden="true" />
                </button>
              ))}
            </div>

            <div
              className="studio-prelude__range-stage"
              id="studio-range-panel"
              role="tabpanel"
              aria-labelledby={`studio-discipline-${selected.id}`}
              key={selected.id}
            >
              <TiltedCard
                imageSrc={selected.image}
                altText={selected.alt}
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                showTooltip={false}
                intro={false}
                gyroscope={false}
                rotateAmplitude={4.5}
                scaleOnHover={1.012}
                radius={28}
                className="studio-prelude__tilt-card"
              />
              <div className="studio-prelude__image-index" aria-hidden="true">{selected.number} / 04</div>
            </div>

            <div className="studio-prelude__range-copy" aria-live="polite">
              <span>{selected.label}</span>
              <h3>{selected.title}</h3>
              <p>{selected.copy}</p>
              <a href="#works">Enter the work showcase <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="studio-prelude__system" id="studio-system" aria-labelledby="studio-system-title">
        <div className="studio-prelude__wrap studio-prelude__system-grid">
          <div className="studio-prelude__system-copy">
            <p className="studio-prelude__eyebrow"><span aria-hidden="true" /> Built for design at volume</p>
            <h2 id="studio-system-title">Every brief gets a human eye.<br />Every batch gets a system.</h2>
            <p className="studio-prelude__system-lead">The goal is not more graphics. It is more useful design without losing taste, clarity or brand recognition.</p>

            <div className="studio-prelude__principles">
              <article>
                <img src="/credits/noun-ai-6480915.png" alt="" aria-hidden="true" />
                <div><h3>Technology assists the repetitive work.</h3><p>Useful for speed and versioning—never a substitute for direction.</p></div>
              </article>
              <article>
                <img src="/credits/flaticon-layers-5857869.png" alt="" aria-hidden="true" />
                <div><h3>A visual system keeps the output together.</h3><p>One hierarchy, one set of rules, many brand-ready pieces.</p></div>
              </article>
            </div>
          </div>

          <div className="studio-prelude__object-column">
            <div className="studio-prelude__object-stage" ref={objectStage}>
              <div className="studio-prelude__object-orbit" aria-hidden="true" />
              {objects.map((item, index) => (
                <button
                  type="button"
                  className={`studio-prelude__object studio-prelude__object--${index + 1}${activeObject === index ? ' is-active' : ''}`}
                  aria-label={`Focus ${item.label.toLowerCase()} example`}
                  aria-pressed={activeObject === index}
                  onClick={() => focusObject(index)}
                  key={item.id}
                >
                  <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                </button>
              ))}
              <div className="studio-prelude__object-caption" aria-live="polite">
                <span>{String(activeObject + 1).padStart(2, '0')}</span>
                <strong>{objects[activeObject].label}</strong>
              </div>
            </div>
            <div className="studio-prelude__object-selector" aria-label="Featured output">
              {objects.map((item, index) => (
                <button
                  type="button"
                  className={activeObject === index ? 'is-active' : ''}
                  aria-pressed={activeObject === index}
                  onClick={() => focusObject(index)}
                  key={item.id}
                >{item.label}</button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
