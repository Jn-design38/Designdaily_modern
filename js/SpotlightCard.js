/**
 * SpotlightCard Component — React Bits Pro (Vanilla JS + CSS)
 * Adds a cursor-following radial spotlight highlight over dark glass cards.
 * https://pro.reactbits.dev/docs/components
 */

(function (global) {
  'use strict';

  class SpotlightCard {
    constructor(element, options = {}) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (!element) return;

      this.element = element;
      this.options = Object.assign(
        {
          spotlightColor: 'rgba(255, 76, 66, 0.18)',
          spotlightSize: 320
        },
        options
      );

      this.init();
    }

    init() {
      const el = this.element;
      el.classList.add('spotlight-card');
      el.style.setProperty('--spotlight-color', this.options.spotlightColor);
      el.style.setProperty('--spotlight-size', `${this.options.spotlightSize}px`);

      this.handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
        el.style.setProperty('--spotlight-opacity', '1');
      };

      this.handleMouseLeave = () => {
        el.style.setProperty('--spotlight-opacity', '0');
      };

      el.addEventListener('mousemove', this.handleMouseMove);
      el.addEventListener('mouseleave', this.handleMouseLeave);
    }

    destroy() {
      if (this.element && this.handleMouseMove) {
        this.element.removeEventListener('mousemove', this.handleMouseMove);
        this.element.removeEventListener('mouseleave', this.handleMouseLeave);
      }
    }

    static initAll(selector = '.spotlight-card', options = {}) {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements).map(el => new SpotlightCard(el, options));
    }
  }

  global.SpotlightCard = SpotlightCard;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpotlightCard;
  }
})(typeof window !== 'undefined' ? window : this);
