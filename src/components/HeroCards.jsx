import React, { useState, useRef } from 'react';
import './HeroCards.css';

const CARDS_DATA = [
  {
    id: 'card-1',
    image: '/artboard-1-aves.png',
    alt: 'Design Daily Social Media Post 1',
    defaultRotate: -18.09,
    defaultZ: 2
  },
  {
    id: 'card-2',
    image: '/artboard-1-dd.png',
    alt: 'Design Daily Social Media Post 2',
    defaultRotate: 0,
    defaultZ: 5
  },
  {
    id: 'card-3',
    image: '/artboard-2-aves.png',
    alt: 'Design Daily Social Media Post 3',
    defaultRotate: 30,
    defaultZ: 3
  }
];

export default function HeroCards() {
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
      aria-label="Design Daily Visual Artboards"
    >
      <div className="hero-cards-glow-backdrop" />
      
      {CARDS_DATA.map((card, index) => {
        const isHovered = activeCard === card.id;
        const parallaxX = mousePos.x * (index === 1 ? 14 : index === 0 ? -12 : 18);
        const parallaxY = mousePos.y * (index === 1 ? 14 : 18);
        const currentRotation = isHovered 
          ? card.defaultRotate * 0.35 
          : card.defaultRotate + mousePos.x * 5;

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
            role="img"
            aria-label={card.alt}
          >
            <div className="hero-card__inner">
              <img
                src={card.image}
                alt={card.alt}
                className="hero-card__img"
                loading="eager"
                decoding="async"
              />
              <div className="hero-card__rim" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
