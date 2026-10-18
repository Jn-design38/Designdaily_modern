/**
 * TiltedCard Component — React Bits Pro (Vanilla JS + CSS)
 * Adds realistic 3D perspective tilting with smooth physics on hover.
 * https://pro.reactbits.dev/docs/components
 */

(function (global) {
  'use strict';

  class TiltedCard {
    constructor(element, options = {}) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (!element) return;

      this.element = element;
      this.options = Object.assign(
        {
          maxTilt: 12,
          perspective: 1000,
          scale: 1.02,
          speed: 400,
          glare: true,
          maxGlare: 0.25
        },
        options
      );

      this.init();
    }

    init() {
      const el = this.element;
      el.classList.add('tilted-card');
      el.style.transformStyle = 'preserve-3d';
      el.style.perspective = `${this.options.perspective}px`;

      let inner = el.querySelector('.tilted-card-inner');
      if (!inner) {
        inner = el;
      }

      this.handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width - 0.5) * 2;
        const yPct = (mouseY / height - 0.5) * 2;

        const rotateY = xPct * this.options.maxTilt;
        const rotateX = -yPct * this.options.maxTilt;

        inner.style.transition = 'transform 80ms ease-out';
        inner.style.transform = `perspective(${this.options.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.options.scale}, ${this.options.scale}, 1)`;
      };

      this.handleMouseLeave = () => {
        inner.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
        inner.style.transform = `perspective(${this.options.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      };

      el.addEventListener('mousemove', this.handleMouseMove);
      el.addEventListener('mouseleave', this.handleMouseLeave);
    }

    static initAll(selector = '.tilted-card', options = {}) {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).map(el => new TiltedCard(el, options));
    }
  }

  global.TiltedCard = TiltedCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TiltedCard;
  }
})(typeof window !== 'undefined' ? window : this);
