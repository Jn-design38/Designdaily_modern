import React, { useState, useEffect } from 'react';
import TelemetryNav from './components/TelemetryNav';
import HeroTelemetry from './components/HeroTelemetry';
import CollaborationCards from './components/CollaborationCards';
import WorksShowcase from './components/WorksShowcase';
import CampaignsBounceSection from './components/CampaignsBounceSection';
import CraftProcessEngine from './components/CraftProcessEngine';
import BrandmarksGrid from './components/BrandmarksGrid';
import FooterContact from './components/FooterContact';

export default function App() {
  const [theme, setTheme] = useState('atelier');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <>
      {/* 7-Rail Chassis Architectural Grid Lines Overlay */}
      <div className="chassis-grid-overlay" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx} className="chassis-rail">
            <span className="chassis-crosshair crosshair-top">+</span>
            <span className="chassis-crosshair crosshair-hero-top">+</span>
            <span className="chassis-crosshair crosshair-hero-mid">+</span>
            <span className="chassis-crosshair crosshair-hero-bot">+</span>
            <span className="chassis-crosshair crosshair-brandmarks">+</span>
          </div>
        ))}
      </div>

      <div className="app-container">
        {/* Floating Dock Nav with Theme Switch & GradualBlur Top */}
        <TelemetryNav theme={theme} onToggleTheme={toggleTheme} />

        {/* Hero Section with Telemetry HUD, CAD Frame & OrbitImages */}
        <HeroTelemetry theme={theme} />

        {/* 3-Card Collaboration Model */}
        <CollaborationCards />

        {/* Curated Works Showcase with FlexCarousel (WebGL Liquid Lens) */}
        <WorksShowcase />

        {/* Commercial & Social Campaigns in Motion with React Bits BounceCards */}
        <CampaignsBounceSection />

        {/* 4-Step Craft Engine (Terracotta Timeline) */}
        <CraftProcessEngine />

        {/* 8-Column Optical Brandmarks Grid */}
        <BrandmarksGrid />

        {/* Contact Footer with Magnet CTAs & GradualBlur Bottom */}
        <FooterContact theme={theme} />
      </div>
    </>
  );
}

