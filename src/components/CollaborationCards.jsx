import React from 'react';
import Magnet from './Magnet';

export default function CollaborationCards() {
  const models = [
    {
      number: '01',
      title: '3-Card Collaboration Model',
      description: 'Warm stone colored cards in warm stone design with debossed borders. Focused 48-hour sprints for high-priority identity and packaging deliverables.',
      cta: 'Explore Sprints'
    },
    {
      number: '02',
      title: 'Dedicated Retainer Partnership',
      description: 'Warm stone colored cards with authentic client creating designs. Ongoing monthly brand guardianship, campaign art direction, and digital collateral.',
      cta: 'Request Retainer'
    },
    {
      number: '03',
      title: 'Bespoke Brand Architecture',
      description: 'Warm stone-colored cards with tailored typography and packaging dielines. Complete from-scratch visual identity, physical packaging, and vector guidelines.',
      cta: 'Configure Scope'
    }
  ];

  return (
    <section className="collaboration-section" id="collaboration" aria-labelledby="collaboration-title">
      <div className="section-header-row">
        <div className="section-label-group">
          <span className="section-eyebrow">Engagement Architectures</span>
          <h2 className="section-main-heading" id="collaboration-title">Collaboration Models</h2>
        </div>
        <div className="telemetry-coord">
          <span>[3-TIER SPRINT & RETAINER SPEC]</span>
        </div>
      </div>

      <div className="collaboration-grid">
        {models.map((model, idx) => (
          <div key={idx} className="debossed-stone-card">
            <div>
              <div className="card-num-badge">{model.number}</div>
              <h3 className="card-title">{model.title}</h3>
              <p className="card-desc">{model.description}</p>
            </div>
            <div>
              <Magnet padding={40} magnetStrength={3}>
                <a href="#contact" className="card-link">
                  <span>{model.cta}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </Magnet>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

