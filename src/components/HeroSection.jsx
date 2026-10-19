import React, { useState, useEffect } from 'react';
import PillNav from './PillNav';
import WarpText from './WarpText';
import GradientASCII from './GradientASCII';
import './HeroSection.css';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Selected Works', href: '#works' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' }
];

export default function HeroSection({ onOpenProject }) {
  const [activeNav, setActiveNav] = useState('#home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (item) => {
    if (item.href) {
      setActiveNav(item.href);
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
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

      {/* Top Header — Solid Split PillNav (Circular White Logo + Navigation Pill, No Glass) */}
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
            itemStyle="pill"
            hoverEffect="fill"
            indicator="dot"
            theme="dark"
            surface="solid"
            barColor="#202930"
            textColor="#ffffff"
            highlightColor="#FF4C42"
            highlightTextColor="#FFFFFF"
            size="lg"
            bounce={0.35}
            stretch={0.45}
            collapse={isMobile ? 'always' : 'never'}
          />
        </div>
      </header>

      {/* Centered, Uncluttered Hero Stage — Cards Removed, Centered WarpText */}
      <div className="hero-container hero-container--centered">
        <div className="hero-warp-wrapper">
          <WarpText
            text={"You can relax while\nwe take care of the design."}
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            lens="bulge"
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            chromatic={0.35}
            idleDrift={0.2}
            ripple
            clickRipple
            intro
            fontSize="clamp(2.5rem, 5.5vw, 5.8rem)"
            fontWeight={800}
            style={{ height: '360px' }}
            color={null}
            letterSpacing="-0.04em"
            lineHeight="1.15"
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
