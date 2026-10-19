import React, { useState, useEffect } from 'react';
import PillNav from './PillNav';
import TechText from './TechText';
import GradientASCII from './GradientASCII';
import FlexCarousel from './FlexCarousel';
import './HeroSection.css';

// Direct 7 asset imports specified by user for FlexCarousel
import item1 from '../assets/carousel/carousel-1-aves-1.png';
import item2 from '../assets/carousel/carousel-2-aves-2.png';
import item3 from '../assets/carousel/carousel-3-tripty.png';
import item4 from '../assets/carousel/carousel-4-norea.png';
import item5 from '../assets/carousel/carousel-5-aves-3.png';
import item6 from '../assets/carousel/carousel-6-aves-4.png';
import item7 from '../assets/carousel/carousel-7-all-organics.png';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Selected Works', href: '#works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' }
];

const CAROUSEL_ITEMS = [
  {
    src: item1,
    alt: 'Aves Streetwear Campaign Artboard 1',
    title: 'Aves — Urban Movement',
    subtitle: 'Campaign & Social Direction'
  },
  {
    src: item2,
    alt: 'Aves Editorial Packaging Artboard 2',
    title: 'Aves — Editorial Motion',
    subtitle: 'Brand System'
  },
  {
    src: item3,
    alt: 'Tripty Heritage Tea Brand Identity',
    title: 'Tripty — Organic Teas',
    subtitle: 'Brand Identity & Packaging'
  },
  {
    src: item4,
    alt: 'Norea Architectural Construction Identity',
    title: 'Norea — Structural Elegance',
    subtitle: 'Corporate Identity Program'
  },
  {
    src: item5,
    alt: 'Aves Lifestyle Artboard 3',
    title: 'Aves — Monogram Series',
    subtitle: 'Digital Art Direction'
  },
  {
    src: item6,
    alt: 'Aves Lookbook Artboard 4',
    title: 'Aves — Studio Lookbook',
    subtitle: 'Social Identity'
  },
  {
    src: item7,
    alt: 'All Organics Sustainable Identity',
    title: 'All Organics — Pure Botanicals',
    subtitle: 'Packaging & Art Direction'
  }
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

  const handleSelectCard = (index, item) => {
    if (typeof onOpenProject === 'function') {
      onOpenProject(index, item);
    }
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

      {/* Hero Stage — Re-aligned Title, Magnetic CTA, and React Bits FlexCarousel */}
      <div className="hero-container hero-container--centered">
        {/* Title Stack: Precisely Re-aligned Center with Clear Typographic Hierarchy */}
        <div className="hero-tech-text-group">
          {/* Line 1: Small display size, Poppins regular */}
          <div className="hero-tech-line hero-tech-line--small">
            <TechText
              text="you can relax while"
              fontFamily="'Poppins', sans-serif"
              fontWeight={400}
              fontSize={isMobile ? 18 : isTablet ? 30 : 40}
              color="rgba(244, 244, 247, 0.85)"
              accentColor="#f4c64e"
              align="center"
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
              fontSize={isMobile ? 24 : isTablet ? 60 : 88}
              color="#ffffff"
              accentColor="#ff4c42"
              align="center"
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

        {/* FlexCarousel: Fluid Lens 3D Perspective Carousel */}
        <div className="hero-carousel-wrapper">
          <FlexCarousel
            items={CAROUSEL_ITEMS}
            preset="liquid"
            intro="none"
            cardHeight={isMobile ? 0.65 : 0.58}
            gap={isMobile ? 10 : 16}
            radius={14}
            squeeze={0.2}
            focusOnClick={true}
            captions={true}
            captureWheel={true}
            onSelect={handleSelectCard}
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
