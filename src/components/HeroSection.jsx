import React, { useState, useEffect } from 'react';
import PillNav from './PillNav';
import TechText from './TechText';
import GradientASCII from './GradientASCII';
import BounceCards from './BounceCards';
import './HeroSection.css';

// Direct asset imports for zero-latency bundled client social posts
import card1 from '../assets/social-cards/card-1.png';
import card2 from '../assets/social-cards/card-2.png';
import card3 from '../assets/social-cards/card-3.png';
import card4 from '../assets/social-cards/card-4.png';
import card5 from '../assets/social-cards/card-5.png';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Selected Works', href: '#works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' }
];

// 5 selected 1080x1080 uncropped social media post artworks from Designdaily Assets
const BOUNCE_CARDS_IMAGES = [
  { src: card1, alt: 'Seor Leathercraft Clutch Bag' },
  { src: card2, alt: 'Seor Baby Feeding Set Minimalist Packaging' },
  { src: card3, alt: 'Luxury Silk Sleepmask Product Direction' },
  { src: card4, alt: 'Saegis Bold Brand Identity' },
  { src: card5, alt: 'Editorial Leathercraft Detail' }
];

export default function HeroSection({ onOpenProject }) {
  const [activeNav, setActiveNav] = useState('#home');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const handleNavClick = (item) => {
    if (item.href) {
      setActiveNav(item.href);
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCardClick = (index) => {
    if (typeof onOpenProject === 'function') {
      onOpenProject(index);
    } else {
      const target = document.querySelector('#works');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Responsive configuration for BounceCards
  const bounceConfig = isMobile
    ? {
        containerWidth: Math.min(290, windowWidth - 32),
        containerHeight: 140,
        cardSize: 84,
        spread: 32,
        pushDistance: 45,
        borderWidth: 2,
        radius: 10
      }
    : isTablet
    ? {
        containerWidth: 560,
        containerHeight: 220,
        cardSize: 150,
        spread: 76,
        pushDistance: 115,
        borderWidth: 3,
        radius: 16
      }
    : {
        containerWidth: 760,
        containerHeight: 280,
        cardSize: 195,
        spread: 112,
        pushDistance: 155,
        borderWidth: 3.5,
        radius: 20
      };

  return (
    <section id="home" className="hero-section" aria-label="Design Daily Studio Hero">
      {/* Interactive Gradient ASCII Background */}
      <div className="hero-ascii-bg" aria-hidden="true">
        <GradientASCII
          colors={['#ff4c42', '#f4c64e', '#ff8a50', '#eab308']}
          shape="horizon"
          characters=" =+xX0S8#@"
          cellSize={18}
          density={0.82}
          glyphOpacity={0.85}
          gradientOpacity={0.75}
          glow={0.3}
          mouseInteraction={true}
          clickEffect="wave"
          speed={0.8}
        />
        <div className="hero-ascii-vignette" />
      </div>

      {/* Top Header — Glassy Split PillNav (Circular White Logo + Navigation Pill, Boxed ONLY on Selected Item) */}
      <header className="hero-header">
        <div className="hero-nav-wrapper">
          <PillNav
            logo="/design-daily-icon-white.svg"
            logoAlt="Design Daily Studio"
            logoHref="#home"
            items={NAV_ITEMS}
            activeHref={activeNav}
            onItemClick={handleNavClick}
            layout="split"
            itemStyle="text"
            hoverEffect="none"
            indicator="none"
            theme="dark"
            surface="glass"
            textColor="#ffffff"
            size="lg"
            bounce={0.35}
            stretch={0.45}
            collapse={isMobile ? 'always' : 'never'}
          />
        </div>
      </header>

      {/* Hero Stage — Elevated Title, Magnetic CTA, and Interactive BounceCards Fan in the Dark Region */}
      <div className="hero-container hero-container--centered">
        {/* Title Stack: Shifted Upper with Distinct Hierarchy */}
        <div className="hero-tech-text-group">
          {/* Line 1: Small size, Poppins regular */}
          <div className="hero-tech-line hero-tech-line--small">
            <TechText
              text="you can relax while"
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize={isMobile ? 19 : isTablet ? 32 : 42}
              color="rgba(244, 244, 247, 0.85)"
              accentColor="#f4c64e"
              reveal="letter"
              dashLength={3}
              dashGap={2}
              strokeWidth={1.2}
              specks={10}
              clickKick={true}
              draggable={false}
              guides={false}
            />
          </div>

          {/* Line 2: Monumental display bold */}
          <div className="hero-tech-line hero-tech-line--large">
            <TechText
              text="we take care of the design."
              fontFamily="'Poppins', sans-serif"
              fontWeight={800}
              fontSize={isMobile ? 21 : isTablet ? 64 : 96}
              color="#ffffff"
              accentColor="#ff4c42"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              strokeWidth={1.6}
              specks={16}
              clickKick={true}
              draggable={false}
              guides={false}
            />
          </div>
        </div>

        {/* Dynamic Call to Action Buttons */}
        <div className="hero-cta-group">
          <a href="#contact" className="hero-cta-btn hero-cta-btn--primary">
            <span>Start a Project</span>
            <svg
              className="hero-cta-arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.333 8h9.334M8.667 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#works" className="hero-cta-btn hero-cta-btn--secondary">
            <span>Explore Works</span>
          </a>
        </div>

        {/* Bounce Cards Fan: Uncropped Real Social Media Posts in the Dark Lower Region */}
        <div className="hero-bounce-cards-wrapper" aria-label="Featured Social Media Design Showcase">
          <BounceCards
            images={BOUNCE_CARDS_IMAGES}
            containerWidth={bounceConfig.containerWidth}
            containerHeight={bounceConfig.containerHeight}
            cardSize={bounceConfig.cardSize}
            spread={bounceConfig.spread}
            rotation={8}
            arc={-6}
            pushDistance={bounceConfig.pushDistance}
            hoverScale={1.1}
            bounciness={0.5}
            animationDelay={0.05}
            animationStagger={0.04}
            borderWidth={bounceConfig.borderWidth}
            borderColor="#ffffff"
            radius={bounceConfig.radius}
            shadow={true}
            enableHover={true}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      {/* Bottom Architectural Solid Ticker Bar */}
      <div className="hero-bottom-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          <span className="hero-ticker-item">✦ BRAND IDENTITY SYSTEMS</span>
          <span className="hero-ticker-item">✦ EDITORIAL PACKAGING</span>
          <span className="hero-ticker-item">✦ SOCIAL CAMPAIGNS IN MOTION</span>
          <span className="hero-ticker-item">✦ 3D VISUALIZATION</span>
          <span className="hero-ticker-item">✦ BESPOKE TYPOGRAPHY</span>
          <span className="hero-ticker-item">✦ BRAND IDENTITY SYSTEMS</span>
          <span className="hero-ticker-item">✦ EDITORIAL PACKAGING</span>
          <span className="hero-ticker-item">✦ SOCIAL CAMPAIGNS IN MOTION</span>
        </div>
      </div>
    </section>
  );
}
