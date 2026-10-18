import React from 'react';
import Magnet from './Magnet';
import OrbitImages from './OrbitImages';

export default function HeroTelemetry({ theme }) {
  const isDark = theme === 'studio';

  // Real client packaging and branding imagery
  const orbitAssets = [
    { src: './assets/tripty-cover.png', alt: 'Tripty Luxury Packaging Box' },
    { src: './assets/all-organics-cover.png', alt: 'All Organics Apothecary Bottling' },
    { src: './assets/atuendo-cover.png', alt: 'Atuendo Haute Couture Stationery' },
    { src: './assets/finn-packaging.png', alt: 'Finn Packaging Precision Geometry' },
    { src: './assets/goodybro-cover.png', alt: 'GoodyBro Vector Apparel Campaign' },
    { src: './assets/packaging-showcase.png', alt: 'Design Daily Master Packaging Suite' }
  ];

  return (
    <section className="hero-telemetry-section" id="hero" aria-labelledby="hero-headline">
      {/* Left Telemetry HUD Column */}
      <div className="telemetry-col-left" aria-label="Agency Performance Telemetry">
        <div className="telemetry-metric-block">
          <span className="telemetry-metric-val">48h</span>
          <span className="telemetry-metric-lbl">Sprint Turnaround</span>
        </div>
        <div className="telemetry-metric-block">
          <span className="telemetry-metric-val">24+</span>
          <span className="telemetry-metric-lbl">Global Brand Launches</span>
        </div>
        <div className="telemetry-metric-block">
          <span className="telemetry-metric-val">100%</span>
          <span className="telemetry-metric-lbl">Vector Precision</span>
        </div>
      </div>

      {/* Center CAD Drafting Stage */}
      <div className="hero-center-stage">
        <div className="cad-drafting-box">
          {/* 4 CAD Corner Brackets */}
          <span className="cad-bracket bracket-tl" aria-hidden="true"></span>
          <span className="cad-bracket bracket-tr" aria-hidden="true"></span>
          <span className="cad-bracket bracket-bl" aria-hidden="true"></span>
          <span className="cad-bracket bracket-br" aria-hidden="true"></span>
          <span className="cad-crosshair-center" aria-hidden="true">+</span>

          {/* Headline */}
          <h1 className="hero-main-title" id="hero-headline">
            Good design.<br />Every day.
          </h1>

          {/* Sub-headline */}
          <p className="hero-sub-statement">
            Designer Daily, an elite graphic design agency founded by Julkarnine Arabi.
          </p>

          {/* Magnetic Action Buttons */}
          <div className="hero-cta-group">
            <Magnet padding={60} magnetStrength={2} scale={1.05}>
              <a href="#works" className="btn-primary-magnetic">
                <span>Explore Work</span>
                <span aria-hidden="true">↓</span>
              </a>
            </Magnet>
            <Magnet padding={50} magnetStrength={3}>
              <a href="#collaboration" className="btn-secondary-magnetic">
                <span>View Models</span>
              </a>
            </Magnet>
          </div>
        </div>

        {/* OrbitImages 3D Spatial Presentation */}
        <div className="orbit-showcase-stage" aria-label="Interactive 3D Portfolio Orbit">
          <OrbitImages
            images={orbitAssets}
            shape="ellipse"
            radiusX={460}
            radiusY={100}
            rotation={-5}
            duration={28}
            itemSize={84}
            depth={0.65}
            itemRadius={12}
            shadow={0.35}
            showPath={true}
            pathColor={isDark ? 'rgba(255, 90, 38, 0.28)' : 'rgba(217, 83, 47, 0.28)'}
            pathWidth={1.5}
            pathDash={6}
            draggable={true}
            clickToFront={true}
            hoverScale={1.14}
            hoverSpeed={0.25}
          />
        </div>
      </div>

      {/* Right Telemetry HUD Column */}
      <div className="telemetry-col-right" aria-label="Studio Location and Status">
        <div className="telemetry-coord">
          <span>[23°42'N / 90°22'E]</span>
        </div>

        <Magnet padding={50} magnetStrength={2.5}>
          <div className="telemetry-status-badge">
            <span className="status-dot-pulse"></span>
            <span>Available for Q1/Q2</span>
          </div>
        </Magnet>

        <div className="telemetry-founder">
          <span className="telemetry-founder-name">Julkarnine Arabi —</span>
          <span className="telemetry-founder-role">Creative Director</span>
        </div>
      </div>
    </section>
  );
}
