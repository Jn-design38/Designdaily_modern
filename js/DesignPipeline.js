/**
 * DesignPipeline Component — Interactive 7-Stage Design Pipeline Visualizer
 * Market Research ➔ Brainstorming ➔ Planning ➔ Designing ➔ Draft ➔ Polish ➔ Deliver
 */

(function (global) {
  'use strict';

  const STAGES = [
    {
      id: 'research',
      number: '01',
      title: 'Market Research',
      subtitle: 'Category Audit & Positioning',
      desc: 'Dissecting direct competitors, user friction points, and commercial opportunities before sketching a vector.',
      metric: '48H Discovery Turnaround',
      icon: '🔍',
      deliverables: ['Competitive Audit', 'Category Whitespace', 'Positioning Matrix']
    },
    {
      id: 'brainstorming',
      number: '02',
      title: 'Brainstorming',
      subtitle: 'Conceptual Lateral Divergence',
      desc: 'Exploring contrasting visual metaphors, aesthetic territories, and artistic philosophies without boundaries.',
      metric: '3 Divergent Directions',
      icon: '💡',
      deliverables: ['Artistic Moodboards', 'Metaphor Sketches', 'Direction Selection']
    },
    {
      id: 'planning',
      number: '03',
      title: 'Planning',
      subtitle: 'Content & System Blueprint',
      desc: 'Mapping copywriting hierarchy, token foundations, and deliverable milestones to eliminate revision loops.',
      metric: 'Zero Scope Ambiguity',
      icon: '📐',
      deliverables: ['Copy Matrix', 'Token Hierarchy', 'Sprint Roadmap']
    },
    {
      id: 'designing',
      number: '04',
      title: 'Designing',
      subtitle: 'Precision Sub-Pixel Craft',
      desc: 'Obsessive vector geometry, mathematical proportioning, and bespoke typography constructed with surgical care.',
      metric: '100% Vector Geometry',
      icon: '✏️',
      deliverables: ['Logomark Geometry', 'Design Tokens', 'Custom Typography']
    },
    {
      id: 'draft',
      number: '05',
      title: 'Draft',
      subtitle: 'High-Fidelity Assembly',
      desc: 'Full-bleed mockups, realistic physical substrate simulations, and recorded video walkthroughs for your team.',
      metric: 'Loom Video Walkthrough',
      icon: '🖼️',
      deliverables: ['Real Packaging Views', 'Digital Flagship Mockup', 'Interactive Proofs']
    },
    {
      id: 'polish',
      number: '06',
      title: 'Polish',
      subtitle: 'Optical & Performance Tuning',
      desc: 'Optical weight balance, contrast ratio verification, fluid micro-interactions, and responsive edge-case stress testing.',
      metric: 'WCAG 2.2 AA Contrast',
      icon: '✨',
      deliverables: ['Optical Weight Pass', 'Cross-Device QA', 'Micro-Interactions']
    },
    {
      id: 'deliver',
      number: '07',
      title: 'Deliver',
      subtitle: 'Production-Ready Master Handoff',
      desc: 'Exhaustive asset directories, print-calibrated dielines, editable Figma masters, and structured brand guidelines.',
      metric: 'Zero-Friction Handoff',
      icon: '🚀',
      deliverables: ['Master AI/SVG/EPS', 'Print Dielines', 'Living Brand Guidelines']
    }
  ];

  class DesignPipeline {
    constructor(container, options = {}) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (!container) return;

      this.container = container;
      this.currentIndex = 0;
      this.autoPlay = options.autoPlay !== false;
      this.timer = null;

      this.render();
      this.bindEvents();
      if (this.autoPlay) {
        this.startAutoPlay();
      }
    }

    render() {
      this.container.innerHTML = `
        <div class="pipeline-engine-card spotlight-card">
          <div class="pipeline-header">
            <div class="pipeline-badge">
              <span class="pipeline-dot"></span>
              <span class="pipeline-tag">// SEVEN-STAGE PRODUCTION ENGINE</span>
            </div>
            <div class="pipeline-metrics-badge">
              <span id="pipeline-active-metric">${STAGES[0].metric}</span>
            </div>
          </div>

          <!-- Stage Track Navigation -->
          <div class="pipeline-track" role="tablist" aria-label="Design Pipeline Stages">
            <div class="pipeline-track-progress" id="pipeline-track-progress"></div>
            ${STAGES.map((stage, idx) => `
              <button type="button" class="pipeline-node ${idx === 0 ? 'active' : ''}" data-index="${idx}" role="tab" aria-selected="${idx === 0}">
                <span class="node-num">${stage.number}</span>
                <span class="node-label">${stage.title}</span>
              </button>
            `).join('')}
          </div>

          <!-- Active Stage Display -->
          <div class="pipeline-stage-panel" id="pipeline-panel">
            <div class="pipeline-stage-info">
              <div class="stage-kicker-row">
                <span class="stage-num-badge" id="stage-num">${STAGES[0].number} / 07</span>
                <span class="stage-subtitle" id="stage-sub">${STAGES[0].subtitle}</span>
              </div>
              <h3 class="stage-title" id="stage-title">${STAGES[0].title}</h3>
              <p class="stage-desc" id="stage-desc">${STAGES[0].desc}</p>
              
              <div class="stage-deliverables-wrap">
                <span class="stage-deliv-label">Phase Outputs:</span>
                <div class="stage-deliv-pills" id="stage-pills">
                  ${STAGES[0].deliverables.map(d => `<span class="pill">${d}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="pipeline-visual-badge">
              <div class="pipeline-visual-ring">
                <div class="ring-core" id="stage-icon">${STAGES[0].icon}</div>
              </div>
              <span class="ring-status">STAGE ACTIVE</span>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const nodes = this.container.querySelectorAll('.pipeline-node');
      nodes.forEach(node => {
        node.addEventListener('click', () => {
          const idx = parseInt(node.getAttribute('data-index'), 10);
          this.setStage(idx);
          this.stopAutoPlay();
        });
      });

      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => {
        if (this.autoPlay) this.startAutoPlay();
      });
    }

    setStage(idx) {
      if (idx < 0 || idx >= STAGES.length) return;
      this.currentIndex = idx;
      const stage = STAGES[idx];

      const nodes = this.container.querySelectorAll('.pipeline-node');
      nodes.forEach((node, i) => {
        if (i === idx) {
          node.classList.add('active');
          node.setAttribute('aria-selected', 'true');
        } else {
          node.classList.remove('active');
          node.setAttribute('aria-selected', 'false');
        }
      });

      const progress = this.container.querySelector('#pipeline-track-progress');
      if (progress) {
        progress.style.width = `${((idx + 0.5) / STAGES.length) * 100}%`;
      }

      const stageNum = this.container.querySelector('#stage-num');
      const stageSub = this.container.querySelector('#stage-sub');
      const stageTitle = this.container.querySelector('#stage-title');
      const stageDesc = this.container.querySelector('#stage-desc');
      const stagePills = this.container.querySelector('#stage-pills');
      const stageIcon = this.container.querySelector('#stage-icon');
      const activeMetric = this.container.querySelector('#pipeline-active-metric');

      if (stageNum) stageNum.textContent = `${stage.number} / 07`;
      if (stageSub) stageSub.textContent = stage.subtitle;
      if (stageTitle) stageTitle.textContent = stage.title;
      if (stageDesc) stageDesc.textContent = stage.desc;
      if (stageIcon) stageIcon.textContent = stage.icon;
      if (activeMetric) activeMetric.textContent = stage.metric;

      if (stagePills) {
        stagePills.innerHTML = stage.deliverables.map(d => `<span class="pill">${d}</span>`).join('');
      }
    }

    next() {
      const nextIndex = (this.currentIndex + 1) % STAGES.length;
      this.setStage(nextIndex);
    }

    startAutoPlay() {
      this.stopAutoPlay();
      this.timer = setInterval(() => this.next(), 4200);
    }

    stopAutoPlay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }

  global.DesignPipeline = DesignPipeline;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesignPipeline;
  }
})(typeof window !== 'undefined' ? window : this);
