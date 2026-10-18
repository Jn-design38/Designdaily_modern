/**
 * LightRays Component — React Bits Pro (Vanilla JS Canvas + CSS)
 * Renders volumetric light rays through dark studio atmosphere.
 * https://pro.reactbits.dev/docs/components
 */

(function (global) {
  'use strict';

  class LightRays {
    constructor(canvas, options = {}) {
      if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas);
      }
      if (!canvas) return;

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.options = Object.assign(
        {
          rayCount: 8,
          baseColor: 'rgba(255, 76, 66, 0.05)',
          highlightColor: 'rgba(255, 179, 138, 0.08)',
          angle: -0.35,
          speed: 0.0015
        },
        options
      );

      this.time = 0;
      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
      this.animate();
    }

    resize() {
      const parent = this.canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;
      this.canvas.width = width;
      this.canvas.height = height;
    }

    animate() {
      this.time += this.options.speed;
      const { width, height } = this.canvas;
      const ctx = this.ctx;

      ctx.clearRect(0, 0, width, height);

      const originX = width * 0.45;
      const originY = -50;

      for (let i = 0; i < this.options.rayCount; i++) {
        const spread = (i - this.options.rayCount / 2) * 0.18;
        const currentAngle = this.options.angle + spread + Math.sin(this.time + i) * 0.04;
        const rayWidth = 140 + Math.sin(this.time * 2 + i) * 40;

        const endX = originX + Math.sin(currentAngle) * height * 1.5;
        const endY = height + 100;

        const grad = ctx.createLinearGradient(originX, originY, endX, endY);
        grad.addColorStop(0, i % 2 === 0 ? this.options.highlightColor : this.options.baseColor);
        grad.addColorStop(0.5, 'rgba(255, 76, 66, 0.03)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(originX - rayWidth / 4, originY);
        ctx.lineTo(originX + rayWidth / 4, originY);
        ctx.lineTo(endX + rayWidth, endY);
        ctx.lineTo(endX - rayWidth, endY);
        ctx.closePath();
        ctx.fill();
      }

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    }
  }

  global.LightRays = LightRays;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LightRays;
  }
})(typeof window !== 'undefined' ? window : this);
