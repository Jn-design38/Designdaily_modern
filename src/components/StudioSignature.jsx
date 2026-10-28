import { Arrow } from './Icons';
import './StudioSignature.css';

const studioWork = [
  {
    href: '/work/atuendo',
    src: '/work/atuendo/cover.webp',
    alt: 'Atuendo identity applied to packaging, garments and printed pieces',
    label: 'Identity system',
    className: 'studio-signature__frame--wide',
    width: 1672,
    height: 941,
  },
  {
    href: '/work/design-daily',
    src: '/work/design-daily/03.webp',
    alt: 'Original pencil sketch of the Design Daily symbol',
    label: 'First sketch',
    className: 'studio-signature__frame--sketch',
    width: 1254,
    height: 1254,
  },
  {
    href: '/work/goodybro',
    src: '/work/goodybro/cover.webp',
    alt: 'Goodybro Create Goodness apparel campaign artwork',
    label: 'Campaign world',
    className: 'studio-signature__frame--colour',
    width: 1920,
    height: 1080,
  },
];

function OfficialWordmark() {
  return (
    <svg className="studio-signature__wordmark" viewBox="88 116 224 156" role="img" aria-label="Design Daily">
      <image href="/agency-wordmark.svg" width="400" height="400" />
    </svg>
  );
}

export default function StudioSignature({ contactHref = '#contact', className = '' }) {
  return (
    <section id="studio-signature" className={`studio-signature ${className}`} aria-labelledby="studio-signature-heading">
      <div className="studio-signature__inner">
        <div className="studio-signature__copy">
          <p className="studio-signature__eyebrow"><span aria-hidden="true" /> The people behind the pixels</p>
          <h2 id="studio-signature-heading">A small studio.<br />A close creative partnership.</h2>
          <p className="studio-signature__description">
            Design Daily is founder-led by Julkarnine Arabi in Dhaka. Every project stays close—from the first conversation and visual direction to the final files you can put to work.
          </p>
          <div className="studio-signature__actions">
            <a className="studio-signature__primary-link" href={contactHref}>Start a conversation <Arrow diagonal /></a>
            <a className="studio-signature__text-link" href="/work">See all work <Arrow /></a>
          </div>
          <div className="studio-signature__founder">
            <img src="/agency-icon.svg" alt="" width="48" height="48" />
            <p><strong>Julkarnine Arabi</strong><span>Founder and creative partner</span></p>
            <p className="studio-signature__location">Dhaka, Bangladesh<br />Working with brands everywhere.</p>
          </div>
        </div>

        <div className="studio-signature__contact-sheet" aria-label="Selected Design Daily project details">
          <div className="studio-signature__sheet-head">
            <span>Made here, shaped for the real world.</span>
            <span>Selected details</span>
          </div>
          <div className="studio-signature__frames">
            {studioWork.map(item => (
              <a className={`studio-signature__frame ${item.className}`} href={item.href} key={item.href} aria-label={`View ${item.label}`}>
                <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
                <span>{item.label}</span>
              </a>
            ))}
            <div className="studio-signature__brand-card" aria-hidden="true">
              <OfficialWordmark />
              <span>Independent design studio · Dhaka</span>
            </div>
          </div>
          <p className="studio-signature__sheet-note">Brand identity, campaigns, packaging and everyday creative systems—directed with one consistent point of view.</p>
        </div>
      </div>
    </section>
  );
}
