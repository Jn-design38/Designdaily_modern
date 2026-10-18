/**
 * DecryptedText Component — React Bits Pro (Vanilla JS + CSS)
 * Scrambles and decrypts characters into place for cyber/studio telemetry titles.
 * https://pro.reactbits.dev/docs/components
 */

(function (global) {
  'use strict';

  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~';

  class DecryptedText {
    constructor(element, options = {}) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (!element) return;

      this.element = element;
      this.originalText = element.textContent.trim();
      this.options = Object.assign(
        {
          speed: 40,
          maxIterations: 12,
          characters: CHARACTERS,
          triggerOnHover: false,
          triggerOnView: true
        },
        options
      );

      this.isDecrypting = false;
      this.init();
    }

    init() {
      if (this.options.triggerOnView && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !this.hasAnimated) {
                this.hasAnimated = true;
                this.decrypt();
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(this.element);
      }

      if (this.options.triggerOnHover) {
        this.element.addEventListener('mouseenter', () => this.decrypt());
      }
    }

    decrypt() {
      if (this.isDecrypting) return;
      this.isDecrypting = true;

      const chars = this.originalText.split('');
      const pool = this.options.characters;
      let iteration = 0;

      const interval = setInterval(() => {
        const scrambled = chars
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return this.originalText[index];
            }
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join('');

        this.element.textContent = scrambled;

        if (iteration >= chars.length) {
          clearInterval(interval);
          this.element.textContent = this.originalText;
          this.isDecrypting = false;
        }

        iteration += 1 / 2;
      }, this.options.speed);
    }
  }

  global.DecryptedText = DecryptedText;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecryptedText;
  }
})(typeof window !== 'undefined' ? window : this);
