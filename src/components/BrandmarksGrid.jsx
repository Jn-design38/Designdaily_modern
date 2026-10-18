import React from 'react';
import Magnet from './Magnet';

export default function BrandmarksGrid() {
  const marks = [
    {
      name: 'Design Daily DD Monogram',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M20 18h24c18 0 32 14 32 32s-14 32-32 32H20V18zm14 12v40h10c12 0 20-8 20-20s-8-20-20-20H34z" />
        </svg>
      )
    },
    {
      name: 'Geometric Starburst',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M46 15h8v24h17l-12-21 7-4 12 21 17-17 6 6-17 17 21 12-4 7-21-12v17h-24v-17l-17 12-4-7 21-12-17-17 6-6 17 17-12-21 7-4 12 21V15z" />
        </svg>
      )
    },
    {
      name: 'Precision Vector Cross',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M22 28l20 22-20 22 8 8 20-22 20 22 8-8-20-22 20-22-8-8-20 22-20-22-8 8z" />
        </svg>
      )
    },
    {
      name: 'Octagonal Architectural Token',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M35 15h30l20 20v30l-20 20H35L15 65V35l20-20zm3 10L25 38v24l13 13h24l13-13V38L62 25H38z" />
        </svg>
      )
    },
    {
      name: 'Concentric Target Emblem',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle cx="50" cy="50" r="8" />
        </svg>
      )
    },
    {
      name: 'Slanted Architectural Alpha',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M20 82L45 18h16l25 64H68l-4-12H42l-4 12H20zm26-24h14L53 38l-7 20z" />
        </svg>
      )
    },
    {
      name: 'Radial Shutter Swirl',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M50 12c21 0 38 17 38 38 0 7-2 13-5 19l-16-16c1-1 1-2 1-3 0-10-8-18-18-18-3 0-6 1-8 2L50 12zm27 50c-6 16-22 26-39 24l9-19c2 1 4 1 6 0 9-4 12-14 8-22l16 17zm-49 4C21 54 22 36 32 23l12 17c-2 2-3 4-3 7 0 9 7 16 16 16v21c-20 1-35-8-39-18z" />
        </svg>
      )
    },
    {
      name: 'Continuous Infinity Knot',
      svg: (
        <svg viewBox="0 0 100 100" className="brandmark-svg" fill="currentColor">
          <path d="M50 20c16 0 30 14 30 30s-14 30-30 30c-16 0-30-14-30-30s14-30 30-30zm0 12c-10 0-18 8-18 18s8 18 18 18 18-8 18-18-8-18-18-18z" />
        </svg>
      )
    }
  ];

  return (
    <section className="brandmarks-section" id="brandmarks" aria-labelledby="brandmarks-title">
      <div className="section-header-row">
        <div className="section-label-group">
          <span className="section-eyebrow">Precision Marks Collection</span>
          <h2 className="section-main-heading" id="brandmarks-title">Optical Brandmarks</h2>
        </div>
        <div className="telemetry-coord">
          <span>[8-COLUMN CHASSIS ALIGNMENT]</span>
        </div>
      </div>

      <div className="brandmarks-grid">
        {marks.map((mark, i) => (
          <Magnet key={i} padding={40} magnetStrength={3} scale={1.08}>
            <div className="brandmark-tile" title={mark.name} aria-label={mark.name}>
              {mark.svg}
            </div>
          </Magnet>
        ))}
      </div>
    </section>
  );
}
