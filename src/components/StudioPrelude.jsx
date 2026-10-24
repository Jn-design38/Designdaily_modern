import { useState } from 'react';
import OptionWheel from './OptionWheel';
import DriftWall from './DriftWall';
import './StudioPrelude.css';

const disciplines = [
  {
    id: 'packaging',
    label: 'Packaging',
    image: '/prelude/packaging-ngr-rice.webp',
    alt: 'NGR rice packaging arranged in a warm agricultural setting'
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    image: '/prelude/campaigns-summer-launch-v2.webp',
    alt: 'A mango beverage campaign expressed across posters, packaging and a social post'
  },
  {
    id: 'extensions',
    label: 'Brand extensions',
    image: '/prelude/brand-extensions-system-v2.webp',
    alt: 'A coordinated identity system across boxes, bags, stationery, tape and tissue paper'
  },
  {
    id: 'merchandise',
    label: 'Merchandise',
    image: '/prelude/merchandise-dhaka-editorial-v2.webp',
    alt: 'Two young adults wearing a coordinated merchandise collection on a Dhaka rooftop'
  }
];

const volumeItems = [
  { image: '/prelude/campaigns-summer-launch-v2.webp', title: 'Campaign system' },
  { image: '/work/tripty/cover.webp', title: 'Tripty identity and packaging' },
  { image: '/prelude/brand-extensions-system-v2.webp', title: 'Brand extension system' },
  { image: '/work/norea/cover.webp', title: 'Noréa brand identity' },
  { image: '/prelude/packaging-ngr-rice.webp', title: 'NGR Rice packaging' },
  { image: '/work/aves/cover.webp', title: 'AVES campaign' },
  { image: '/prelude/merchandise-dhaka-editorial-v2.webp', title: 'Merchandise system' },
  { image: '/work/finn/cover.webp', title: 'FINN gift packaging' },
  { image: '/prelude/all-organics-brand-world.webp', title: 'All Organics brand world' },
  { image: '/work/sandbox/cover.webp', title: 'Sandbox Lounge identity' },
  { image: '/prelude/zaro-bottle-packaging.webp', title: 'ZARO bottle packaging' },
  { image: '/work/goodfie/cover.webp', title: 'GOODFIE sustainable packaging' },
  { image: '/prelude/applegears-social-campaign.webp', title: 'AppleGears campaign' },
  { image: '/work/goodybro/cover.webp', title: 'Goodybro brand world' },
  { image: '/work/atuendo/cover.webp', title: 'Atuendo fashion identity' }
];

export default function StudioPrelude() {
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const selected = disciplines[activeDiscipline];

  return (
    <div className="studio-prelude">
      <section className="studio-prelude__range" id="studio-range" aria-labelledby="studio-range-title">
        <h2 className="sr-only" id="studio-range-title">Choose a design discipline</h2>
        <div className="studio-prelude__range-grid">
          <div className="studio-prelude__discipline-wheel-shell">
            <OptionWheel
              items={disciplines.map(item => item.label)}
              defaultSelected={0}
              onChange={index => setActiveDiscipline(index)}
              textColor="#747680"
              activeColor="#ffffff"
              side="left"
              fontSize={1.7}
              spacing={2.15}
              curve={1.08}
              tilt={6}
              blur={0.55}
              fade={0.22}
              minOpacity={0.22}
              smoothing={170}
              inset={64}
              ariaLabel="Choose a design discipline"
              className="studio-prelude__discipline-wheel"
            />
          </div>

          <div
            className="studio-prelude__range-stage"
            id="studio-range-panel"
            role="tabpanel"
            aria-label={`${selected.label} example`}
            key={selected.id}
          >
            <img
              className="studio-prelude__range-image"
              src={selected.image}
              alt={selected.alt}
              loading={activeDiscipline === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="studio-prelude__system" id="studio-system" aria-labelledby="studio-system-title">
        <div className="studio-prelude__system-wall" aria-hidden="true">
          <DriftWall
            items={volumeItems}
            columns={5}
            tileWidth={220}
            tileHeight={146}
            gap={18}
            radius={12}
            tilt={12}
            turn={-14}
            perspective={1200}
            depth={110}
            speed={24}
            variance={0.34}
            parallax={0.32}
            pauseOnHover={false}
            lift={38}
            fade={0.34}
            dim={0.48}
            overlayColor="#0b0c11"
            grayscale={false}
            decorative
            className="studio-prelude__volume-wall"
          />
        </div>
        <div className="studio-prelude__system-matte" aria-hidden="true" />
        <div className="studio-prelude__wrap studio-prelude__system-content">
          <div className="studio-prelude__system-copy">
            <p className="studio-prelude__eyebrow"><span aria-hidden="true" /> Built for design at volume</p>
            <h2 id="studio-system-title">Made to multiply.<br />Designed to stay yours.</h2>
            <p className="studio-prelude__system-lead">One clear visual system can become a complete month of brand-ready work—without every piece looking like it came from a different campaign.</p>

            <div className="studio-prelude__principles">
              <article>
                <span aria-hidden="true" />
                <div><h3>Directed by people</h3><p>The idea, hierarchy and taste are set before production scales.</p></div>
              </article>
              <article>
                <span aria-hidden="true" />
                <div><h3>Built as a system</h3><p>Reusable rules keep every format recognisable, from the first post to the final print file.</p></div>
              </article>
            </div>
            <p className="studio-prelude__system-close"><span aria-hidden="true" /> One direction. Many useful pieces.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
