import DriftWall from './DriftWall';
import './StudioPrelude.css';

export const volumeItems = [
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
  return (
    <div className="studio-prelude">
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
