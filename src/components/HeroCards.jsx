import React, { useState, useRef } from 'react';
import './HeroCards.css';

const CARDS_DATA = [
  {
    id: 'card-1',
    title: 'Seor Leathercraft',
    category: 'Luxury Identity & Campaign',
    year: '2026',
    image: '/seor-campaign.jpg',
    defaultRotate: -18.09,
    defaultZ: 2,
    badge: '01 / BRAND IDENTITY',
    client: 'Seor Leather Goods'
  },
  {
    id: 'card-2',
    title: 'Tripty Foods',
    category: 'Artisanal Packaging & Digital',
    year: '2026',
    image: '/tripty-cover.png',
    defaultRotate: 0,
    defaultZ: 5,
    badge: '02 / PACKAGING & WEB',
    client: 'Tripty Gourmet Co.'
  },
  {
    id: 'card-3',
    title: 'All Organics',
    category: 'Botanical System & Print',
    year: '2026',
    image: '/all-organics-cover.png',
    defaultRotate: 30,
    defaultZ: 3,
    badge: '03 / VISUAL IDENTITY',
    client: 'All Organics Living'
  }
];

export default function HeroCards({ onSelectCard }) {
  const [activeCard, setActiveCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setActiveCard(null);
  };

  return (
    <div
      ref={containerRef}
      className="hero-cards-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Design Daily Featured Visual Work Showcase"
    >
      <div className="hero-cards-glow-backdrop" />
      
      {CARDS_DATA.map((card, index) => {
        const isHovered = activeCard === card.id;
        // Subtle parallax displacement
        const parallaxX = mousePos.x * (index === 1 ? 15 : index === 0 ? -12 : 20);
        const parallaxY = mousePos.y * (index === 1 ? 15 : 20);
        const currentRotation = isHovered 
          ? card.defaultRotate * 0.35 
          : card.defaultRotate + mousePos.x * 6;

        return (
          <div
            key={card.id}
            className={`hero-card hero-card--${index + 1} ${isHovered ? 'hero-card--active' : ''}`}
            style={{
              '--card-base-rotate': `${card.defaultRotate}deg`,
              '--card-current-rotate': `${currentRotation}deg`,
              '--card-z': isHovered ? 10 : card.defaultZ,
              '--parallax-x': `${parallaxX}px`,
              '--parallax-y': `${parallaxY}px`
            }}
            onMouseEnter={() => setActiveCard(card.id)}
            onClick={() => onSelectCard?.(card)}
            role="button"
            tabIndex={0}
            aria-label={`${card.title} - ${card.category}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectCard?.(card);
              }
            }}
          >
            <div className="hero-card__inner">
              <div className="hero-card__media-wrap">
                <img
                  src={card.image}
                  alt={card.title}
                  className="hero-card__img"
                  loading="eager"
                  decoding="async"
                />
                <div className="hero-card__overlay" />
              </div>

              {/* Glass Tag Badge */}
              <div className="hero-card__badge-pill">
                <span className="hero-card__badge-dot" />
                <span className="hero-card__badge-text">{card.badge}</span>
              </div>

              {/* Card Bottom Meta */}
              <div className="hero-card__info">
                <div className="hero-card__meta-group">
                  <span className="hero-card__client">{card.client}</span>
                  <h3 className="hero-card__title">{card.title}</h3>
                </div>
                <div className="hero-card__arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>

              {/* Luminous Specular Border */}
              <div className="hero-card__rim" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
