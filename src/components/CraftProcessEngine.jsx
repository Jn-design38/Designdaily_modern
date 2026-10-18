import React from 'react';

export default function CraftProcessEngine() {
  const steps = [
    {
      num: '1',
      title: '4-Step Craft Engine',
      desc: 'Deep discovery, positioning audit, and initial vector sketch drafting.'
    },
    {
      num: '2',
      title: 'Milestone Lines',
      desc: 'Mathematical CAD framing, typographic hierarchy, and custom brandmarks.'
    },
    {
      num: '3',
      title: 'Terracotta Process Lines',
      desc: '3D packaging structural folding, physical material vetting, and foil stamping.'
    },
    {
      num: '4',
      title: '6-Column Optical Proof',
      desc: '100% clean vector master files, digital design system, and global asset handoff.'
    }
  ];

  return (
    <section className="craft-engine-section" id="craft" aria-labelledby="craft-title">
      <div className="section-header-row">
        <div className="section-label-group">
          <span className="section-eyebrow">Strategic Craft Journey</span>
          <h2 className="section-main-heading" id="craft-title">The Blueprint to Proof Engine</h2>
        </div>
        <div className="telemetry-coord">
          <span>[TOLERANCE: ±0.05MM / 100% VECTOR]</span>
        </div>
      </div>

      <div className="timeline-track">
        <div className="timeline-connecting-line" aria-hidden="true"></div>
        {steps.map((step, i) => (
          <div key={i} className="timeline-step-node">
            <span className="step-marker-disc">{step.num}</span>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
