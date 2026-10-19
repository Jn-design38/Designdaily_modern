import React from 'react';
import Magnet from './Magnet';
import GradualBlur from './GradualBlur';

export default function TelemetryNav({ theme, onToggleTheme }) {
  const isDark = theme === 'studio';

  return (
    <>
      <GradualBlur
        position="top"
        target="page"
        height="4.5rem"
        layers={8}
        strength={1.5}
        tint={isDark ? 'rgba(9, 10, 11, 0.75)' : 'rgba(250, 248, 245, 0.75)'}
        zIndex={999}
      />
      <header className="floating-header-wrapper">
        <div className="floating-dock">
          {/* Brand Monogram */}
          <Magnet padding={40} magnetStrength={3} scale={1.03}>
            <a href="#hero" className="dock-brand" aria-label="Design Daily Home">
              <span className="dock-monogram">DD</span>
              <span className="dock-title">Design Daily</span>
            </a>
          </Magnet>

          {/* Nav Links */}
          <nav aria-label="Main navigation">
            <ul className="dock-nav">
              <li>
                <Magnet padding={30} magnetStrength={4}>
                  <a href="#hero" className="dock-link">Home</a>
                </Magnet>
              </li>
              <li>
                <Magnet padding={30} magnetStrength={4}>
                  <a href="#works" className="dock-link">Work</a>
                </Magnet>
              </li>
              <li>
                <Magnet padding={30} magnetStrength={4}>
                  <a href="#collaboration" className="dock-link">Services</a>
                </Magnet>
              </li>
              <li>
                <Magnet padding={30} magnetStrength={4}>
                  <a href="#craft" className="dock-link">Process</a>
                </Magnet>
              </li>
              <li>
                <Magnet padding={30} magnetStrength={4}>
                  <a href="#brandmarks" className="dock-link">Brandmarks</a>
                </Magnet>
              </li>
            </ul>
          </nav>

          {/* Actions: Theme Switch & CTA */}
          <div className="dock-actions">
            <Magnet padding={50} magnetStrength={2.5}>
              <div 
                className="theme-switch-pill" 
                role="radiogroup" 
                aria-label="Theme selection"
              >
                <button
                  type="button"
                  className={`theme-opt-btn ${!isDark ? 'active' : ''}`}
                  onClick={() => onToggleTheme('atelier')}
                  aria-checked={!isDark}
                  role="radio"
                >
                  <span className="dot-indicator" style={{ display: !isDark ? 'inline-block' : 'none' }}></span>
                  <span>☀ Atelier</span>
                </button>
                <button
                  type="button"
                  className={`theme-opt-btn ${isDark ? 'active' : ''}`}
                  onClick={() => onToggleTheme('studio')}
                  aria-checked={isDark}
                  role="radio"
                >
                  <span className="dot-indicator" style={{ display: isDark ? 'inline-block' : 'none' }}></span>
                  <span>☾ Studio</span>
                </button>
              </div>
            </Magnet>

            <Magnet padding={60} magnetStrength={2}>
              <a href="#contact" className="btn-primary-magnetic">
                <span>Start a Project</span>
                <span aria-hidden="true">→</span>
              </a>
            </Magnet>
          </div>
        </div>
      </header>
    </>
  );
}

