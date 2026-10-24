import DriftWall from './DriftWall';
import './DriftWallSection.css';

const driftItems = [
  { image: '/prelude/all-organics-brand-world.webp', title: 'All Organics / brand world' },
  { image: '/work/tripty/cover.webp', title: 'Tripty / identity and packaging' },
  { image: '/prelude/applegears-social-campaign.webp', title: 'AppleGears / social campaign' },
  { image: '/work/norea/cover.webp', title: 'Noréa / brand identity' },
  { image: '/prelude/packaging-ngr-rice.webp', title: 'NGR Rice / packaging' },
  { image: '/work/aves/cover.webp', title: 'AVES / real estate campaign' },
  { image: '/prelude/goodybro-tshirt-collection.webp', title: 'Goodybro / merchandise' },
  { image: '/work/finn/cover.webp', title: 'FINN / gift packaging' },
  { image: '/prelude/social-seor-feeding-set.webp', title: 'SEOR / product campaign' },
  { image: '/work/sandbox/cover.webp', title: 'Sandbox Lounge / identity' },
  { image: '/prelude/zaro-bottle-packaging.webp', title: 'ZARO / bottle packaging' },
  { image: '/work/goodfie/cover.webp', title: 'GOODFIE / sustainable packaging' },
  { image: '/prelude/tshirt-goodybro-chaotic-world.webp', title: 'Goodybro / Chaotic World' },
  { image: '/work/goodybro/cover.webp', title: 'Goodybro / Create Goodness' },
  { image: '/work/atuendo/cover.webp', title: 'Atuendo / fashion identity' }
];

export default function DriftWallSection() {
  return (
    <section className="drift-wall-section" aria-labelledby="drift-wall-title">
      <div className="drift-wall-section__intro">
        <div>
          <span className="bulk-kicker">A moving selection</span>
          <h2 id="drift-wall-title">A little more<br />to look at.</h2>
        </div>
        <p>Selected identities, campaigns, packaging, and merchandise from the studio archive.</p>
      </div>
      <div className="drift-wall-section__stage">
        <DriftWall
          items={driftItems}
          columns={5}
          tileWidth={190}
          tileHeight={128}
          gap={16}
          radius={10}
          tilt={14}
          turn={-16}
          perspective={1150}
          depth={130}
          speed={38}
          pauseOnHover={false}
          lift={54}
          fade={0.58}
          dim={0.72}
          overlayColor="#0b0c11"
          grayscale={false}
          className="drift-wall-section__wall"
        />
        <span className="drift-wall-section__note" aria-hidden="true">Hover a tile / shift the wall</span>
      </div>
      <div className="drift-wall-section__footer">
        <span>Design Daily archive / 2026</span>
        <a href="#works">Enter the work showcase <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
