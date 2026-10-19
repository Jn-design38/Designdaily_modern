import React, { useState } from 'react';
import BounceCards from './BounceCards';

const CAMPAIGN_COLLECTIONS = {
  seor: {
    id: 'seor',
    label: 'Seor Leather',
    client: 'Seor Leather',
    category: 'Editorial & Commercial Launch',
    cards: [
      {
        src: './assets/social-grid/previews/01-artboard-1-png.jpg',
        alt: 'Executive Briefcase Editorial',
        badgeNum: '10',
        badge: 'Seor Leather',
        title: 'Executive Briefcase Editorial',
        desc: 'Studio fashion editorial of model carrying the black leather shoulder bag on neutral sculptural background.'
      },
      {
        src: './assets/social-grid/previews/04-artboard-2-copy-png.jpg',
        alt: 'Midnight Executive Briefcase Showcase',
        badgeNum: '11',
        badge: 'Seor Leather',
        title: 'Midnight Executive Briefcase Showcase',
        desc: 'Tailored menswear model holding the black grain leather briefcase against a moody Broadway NYC night backdrop.'
      },
      {
        src: './assets/social-grid/previews/07-artboard-2v2-png.jpg',
        alt: 'Seor Axis Smart Storage Launch',
        badgeNum: '12',
        badge: 'Seor Leather',
        title: 'Seor Axis Smart Storage Launch',
        desc: 'Clean studio campaign featuring denim jacket model with briefcase, coded security lock specifications, and ergonomic layout callouts.'
      },
      {
        src: './assets/social-grid/previews/08-artboard-3-png.jpg',
        alt: 'Heraldic Knight Macro Details',
        badgeNum: '13',
        badge: 'Seor Leather',
        title: 'Heraldic Knight Macro Details',
        desc: 'Chiaroscuro studio macro focusing on the brushed silver logo plaque, heavy-duty zipper teeth, and subtle knight vector watermark.'
      },
      {
        src: './assets/social-grid/previews/11-artboard-4-png.jpg',
        alt: 'Wear Confidence & Be Confident',
        badgeNum: '14',
        badge: 'Seor Leather',
        title: 'Wear Confidence & Be Confident',
        desc: 'Dark moody desk flatlay featuring the briefcase beside black ceramic mug, eyewear, and hardcover volumes under dramatic side lighting.'
      }
    ]
  },
  tripty: {
    id: 'tripty',
    label: 'Tripty Foods',
    client: 'Tripty Foods',
    category: 'Culinary Social Campaign',
    cards: [
      {
        src: './assets/social-grid/previews/02-artboard-1dd-png.jpg',
        alt: 'Clean Plate Satisfaction Ad',
        badgeNum: '01',
        badge: 'Tripty Foods',
        title: 'Clean Plate Satisfaction Ad',
        desc: 'Post-meal satisfaction visual: "If the plate could talk... it would ask for mercy. Too good to stop." Bold crimson framing.'
      },
      {
        src: './assets/social-grid/previews/05-artboard-2dd-png.jpg',
        alt: 'Every Hour Is Food O’Clock',
        badgeNum: '02',
        badge: 'Tripty Foods',
        title: 'Every Hour Is Food O’Clock',
        desc: 'Creative culinary wall clock featuring authentic dishes mapped to each hour of the day.'
      },
      {
        src: './assets/social-grid/previews/09-artboard-3dd-png.jpg',
        alt: 'Hungry to Happy Story',
        badgeNum: '03',
        badge: 'Tripty Foods',
        title: 'Hungry to Happy Story',
        desc: 'Dynamic split-screen storytelling campaign: high-contrast moody hunger to radiant burger delight.'
      },
      {
        src: './assets/social-grid/previews/16-social-media-1-png.jpg',
        alt: 'Waiting For You At Our Kitchen',
        badgeNum: '04',
        badge: 'Tripty Foods',
        title: 'Waiting For You At Our Kitchen',
        desc: 'Vibrant hot magenta social visual featuring freshly grilled juicy double cheeseburger with seasoned fries.'
      },
      {
        src: './assets/social-grid/previews/17-social-media-2-png.jpg',
        alt: 'Signature Gourmet Launch',
        badgeNum: '05',
        badge: 'Tripty Foods',
        title: 'Signature Gourmet Launch',
        desc: 'High-conversion culinary promotional artwork with crisp typography and bold palette.'
      }
    ]
  },
  aves: {
    id: 'aves',
    label: 'AVES Real Estate',
    client: 'AVES Real Estate',
    category: 'Engineering & Architecture',
    cards: [
      {
        src: './assets/social-grid/previews/03-artboard-1jn-x-dd-aves-png.jpg',
        alt: 'Architectural Elevation Suite',
        badgeNum: '06',
        badge: 'AVES Real Estate',
        title: 'Architectural Elevation Suite',
        desc: 'Minimalist blueprint elevation showcase detailing structural rhythm and glass-curtain facades.'
      },
      {
        src: './assets/social-grid/previews/06-artboard-2jn-x-dd-aves-png.jpg',
        alt: 'Skyline Penthouse Showcase',
        badgeNum: '07',
        badge: 'AVES Real Estate',
        title: 'Skyline Penthouse Showcase',
        desc: 'Golden hour luxury residential terrace overlooking metropolitan panorama.'
      },
      {
        src: './assets/social-grid/previews/10-artboard-3jn-x-dd-aves-png.jpg',
        alt: 'Waterfront Luxury Living Tower',
        badgeNum: '08',
        badge: 'AVES Real Estate',
        title: 'Waterfront Luxury Living Tower',
        desc: 'Editorial rendering capturing daylight reflections on crystalline waterfront architecture.'
      },
      {
        src: './assets/social-grid/previews/12-artboard-4-jn-x-dd-aves-png.jpg',
        alt: 'Earthquake-Resistant Security',
        badgeNum: '09',
        badge: 'AVES Real Estate',
        title: 'Earthquake-Resistant Security',
        desc: 'Seismic dampening bearing pad structural safety engineering campaign.'
      }
    ]
  }
};

export default function CampaignsBounceSection() {
  const [activeCollection, setActiveCollection] = useState('seor');
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to Midnight NYC Briefcase (#11)

  const currentCollection = CAMPAIGN_COLLECTIONS[activeCollection] || CAMPAIGN_COLLECTIONS.seor;
  const currentCard = currentCollection.cards[activeCardIndex] || currentCollection.cards[0];

  const handleCardClick = (index) => {
    setActiveCardIndex(index);
  };

  const handleCollectionChange = (key) => {
    setActiveCollection(key);
    setActiveCardIndex(0);
  };

  return (
    <section className="campaigns-bounce-section" id="campaigns" aria-labelledby="campaigns-heading">
      {/* Editorial Section Header Matching Reference Screenshot */}
      <div className="campaigns-bounce-header">
        <h2 id="campaigns-heading" className="campaigns-bounce-title">
          <span className="campaigns-bounce-brand">Commercial &amp; social</span> campaigns in motion.
        </h2>
        <p className="campaigns-bounce-subtitle">
          Interactive campaign deck fanned with spring physics. Hover or click cards to inspect real campaign deliverables.
        </p>

        {/* Campaign Filter Tabs */}
        <div className="campaigns-tab-row" role="tablist" aria-label="Campaign Selection">
          {Object.entries(CAMPAIGN_COLLECTIONS).map(([key, col]) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeCollection === key}
              className={`campaign-tab-btn ${activeCollection === key ? 'active' : ''}`}
              onClick={() => handleCollectionChange(key)}
            >
              <span className="tab-indicator">•</span>
              {col.label}
              <span className="tab-count">[{col.cards.length}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* Physics Spring BounceCards Stage */}
      <div className="campaigns-bounce-stage">
        <BounceCards
          key={activeCollection}
          images={currentCollection.cards}
          containerWidth={960}
          containerHeight={380}
          cardSize={220}
          spread={92}
          rotation={8}
          arc={0}
          pushDistance={145}
          hoverScale={1.08}
          bounciness={0.65}
          animationDelay={0.2}
          animationStagger={0.06}
          borderWidth={5}
          borderColor="#ffffff"
          radius={24}
          shadow={true}
          enableHover={true}
          onCardClick={handleCardClick}
          className="campaigns-cards-instance"
        />
      </div>

      {/* Live Telemetry Card Inspector Bar */}
      <div className="campaign-inspector-card">
        <div className="inspector-badge-group">
          <span className="inspector-badge-num">{currentCard.badgeNum || '00'}</span>
          <span className="inspector-client">{currentCard.badge || currentCollection.client}</span>
          <span className="inspector-category">{currentCollection.category}</span>
        </div>
        <div className="inspector-body">
          <h4 className="inspector-title">{currentCard.title}</h4>
          <p className="inspector-desc">{currentCard.desc}</p>
        </div>
        <div className="inspector-telemetry">
          <span className="telemetry-chip">[SPRING STIFFNESS: 210]</span>
          <span className="telemetry-chip">[DAMPING: 0.72]</span>
          <span className="telemetry-chip">[STATUS: ACTIVE INTERACTION]</span>
        </div>
      </div>
    </section>
  );
}
