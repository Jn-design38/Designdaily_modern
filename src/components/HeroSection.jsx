import React, { useState } from 'react';
import PillNav from './PillNav';
import GlassSurface from './GlassSurface';
import HeroCards from './HeroCards';
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
  const [selectedCardModal, setSelectedCardModal] = useState(null);

  const handleNavClick = (item) => {
    if (item.href) {
      setActiveNav(item.href);
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCardModal(card);
    onOpenProject?.(card);
  };

  return (
    <section id="home" className="hero-section" aria-label="Design Daily Studio Hero">
      {/* Ambient Atmospheric Lighting */}
      <div className="hero-bg-atmosphere" aria-hidden="true">
        <div className="hero-mesh-blob hero-mesh-blob--coral" />
        <div className="hero-mesh-blob hero-mesh-blob--gold" />
        <div className="hero-mesh-blob hero-mesh-blob--slate" />
        <div className="hero-grid-overlay" />
      </div>

      {/* Top Header with GlassSurface + PillNav Integration */}
      <header className="hero-header">
        <div className="hero-nav-wrapper">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            distortionScale={-110}
            blur={10}
            brightness={52}
            opacity={0.88}
            backgroundOpacity={0.12}
            displace={0.4}
            saturation={1.3}
            className="hero-nav-glass"
          >
            <PillNav
              logo="/agency-icon.svg"
              logoAlt="Design Daily Studio Logo"
              logoHref="#home"
              items={NAV_ITEMS}
              activeHref={activeNav}
              onItemClick={handleNavClick}
              layout="split"
              itemStyle="pill"
              hoverEffect="fill"
              indicator="dot"
              theme="dark"
              surface="none"
              highlightColor="#FF4C42"
              highlightTextColor="#FFFFFF"
              size="md"
              bounce={0.35}
              stretch={0.45}
            />
          </GlassSurface>
        </div>
      </header>

      {/* Main Hero Content Layout — Matching SVG ViewBox 1920x984 */}
      <div className="hero-container">
        <div className="hero-split-grid">
          {/* Left Column: Typography & CTAs */}
          <div className="hero-content">
            {/* Studio Badge Pill */}
            <div className="hero-eyebrow-pill" data-aos="fade-down">
              <span className="hero-eyebrow-live-indicator" />
              <span className="hero-eyebrow-text">DESIGN DAILY STUDIO — EST. 2026</span>
              <span className="hero-eyebrow-separator">•</span>
              <span className="hero-eyebrow-status">AVAILABLE FOR Q4 / Q1 SPRINTS</span>
            </div>

            {/* Main Headline Reconstructed from Preference SVG */}
            <div className="hero-headline-group">
              <h1 className="hero-headline">
                <span className="hero-line hero-line--subtle">
                  YOU CAN <span className="hero-word-accent">RELAX</span> WHILE
                </span>
                <span className="hero-line hero-line--strong">
                  WE TAKE CARE OF YOUR
                </span>
                <span className="hero-line hero-line--monumental">
                  <span className="hero-gradient-punch">CREATIVES</span>
                  <span className="hero-dot-coral">.</span>
                </span>
              </h1>
            </div>

            {/* Refined Subtitle */}
            <p className="hero-description">
              Bespoke visual identities, luxury packaging systems, and high-conversion social campaigns
              for visionary brands — delivered with obsessive craft, direct principal collaboration, and sprint speed.
            </p>

            {/* Action Group */}
            <div className="hero-actions">
              <a href="#works" className="hero-btn hero-btn--primary">
                <span>Explore Selected Works</span>
                <span className="hero-btn-arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </a>

              <a href="#contact" className="hero-btn hero-btn--glass">
                <span className="hero-btn-pulse-dot" />
                <span>Book Discovery Call</span>
              </a>
            </div>

            {/* Proof & Metrics Band */}
            <div className="hero-metrics-strip">
              <div className="hero-metric-item">
                <span className="hero-metric-number">40+</span>
                <span className="hero-metric-label">Identities Crafted</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-number">100%</span>
                <span className="hero-metric-label">Bespoke Vector Craft</span>
              </div>
              <div className="hero-metric-divider" />
              <div className="hero-metric-item">
                <span className="hero-metric-number">7-Day</span>
                <span className="hero-metric-label">Sprint Turnaround</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Squircle Cards Stack (SVG Preference-01-02 Layout) */}
          <div className="hero-visual">
            <HeroCards onSelectCard={handleCardSelect} />
          </div>
        </div>
      </div>

      {/* Bottom Architectural Ticker Bar (Matching Rect in SVG line 56) */}
      <div className="hero-bottom-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          <span className="hero-ticker-item">✦ BRAND IDENTITY SYSTEMS</span>
          <span className="hero-ticker-item">✦ EDITORIAL PACKAGING</span>
          <span className="hero-ticker-item">✦ SOCIAL CAMPAIGNS IN MOTION</span>
          <span className="hero-ticker-item">✦ 3D VISUALIZATION</span>
          <span className="hero-ticker-item">✦ LUXURY RETAIL ART DIRECTION</span>
          <span className="hero-ticker-item">✦ BRAND IDENTITY SYSTEMS</span>
          <span className="hero-ticker-item">✦ EDITORIAL PACKAGING</span>
          <span className="hero-ticker-item">✦ SOCIAL CAMPAIGNS IN MOTION</span>
        </div>
      </div>

      {/* Quick Showcase Modal when clicking a card */}
      {selectedCardModal && (
        <div
          className="hero-modal-backdrop"
          onClick={() => setSelectedCardModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hero-modal-close"
              onClick={() => setSelectedCardModal(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="hero-modal-media">
              <img src={selectedCardModal.image} alt={selectedCardModal.title} />
            </div>
            <div className="hero-modal-info">
              <span className="hero-modal-badge">{selectedCardModal.badge}</span>
              <h2>{selectedCardModal.title}</h2>
              <p>{selectedCardModal.category}</p>
              <span className="hero-modal-client">{selectedCardModal.client} • {selectedCardModal.year}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
