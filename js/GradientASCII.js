/**
 * GradientASCII Component — React Bits (Vanilla JS Canvas + CSS Engine)
 * Renders soft gradient glows drawn in animated ASCII characters that scramble and react under the cursor.
 * https://reactbits.dev/backgrounds/gradient-ascii
 */

(function (global) {
  'use strict';

  // Helper: Hex color to RGB
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Helper: Linear interpolate RGB colors
  function lerpColor(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    };
  }

  // Helper: Multi-stop color interpolation
  function getMultiColor(colorsRgb, t) {
    t = Math.max(0, Math.min(1, t));
    const n = colorsRgb.length - 1;
    const p = t * n;
    const index = Math.floor(p);
    const frac = p - index;
    if (index >= n) return colorsRgb[n];
    return lerpColor(colorsRgb[index], colorsRgb[index + 1], frac);
  }

  class GradientASCII {
    constructor(canvas, options = {}) {
      if (typeof canvas === 'string') {
        canvas = document.querySelector(canvas);
      }
      if (!canvas) return;

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });

      this.options = Object.assign(
        {
          colors: ['#ef4444', '#ffbd00', '#eab308', '#f97316'],
          shape: 'horizon',
          characters: ' =+xX0S8#@',
          cellSize: 18,
          density: 0.8,
          speed: 0.02,
          interactive: true,
          fontFamily: 'monospace'
        },
        options
      );

      this.colorsRgb = this.options.colors.map(hexToRgb);
      this.time = 0;
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.targetMouseX = -1000;
      this.targetMouseY = -1000;
      this.isInteracting = false;
      this.animationFrame = null;

      this.init();
    }

    init() {
      this.resize();
      this.bindEvents();
      this.animate();
    }

    resize() {
      const parent = this.canvas.parentElement;
      const width = parent ? parent.clientWidth : window.innerWidth;
      const height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;

      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.displayWidth = width;
      this.displayHeight = height;

      this.cols = Math.ceil(width / this.options.cellSize);
      this.rows = Math.ceil(height / this.options.cellSize);
    }

    bindEvents() {
      this.resizeHandler = () => this.resize();
      window.addEventListener('resize', this.resizeHandler, { passive: true });

      if (this.options.interactive) {
        this.mouseMoveHandler = (e) => {
          if (!this.canvas) return;
          const rect = this.canvas.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            this.targetMouseX = e.clientX - rect.left;
            this.targetMouseY = e.clientY - rect.top;
            this.isInteracting = true;
          } else {
            this.targetMouseX = -1000;
            this.targetMouseY = -1000;
            this.isInteracting = false;
          }
        };

        this.mouseLeaveHandler = () => {
          this.targetMouseX = -1000;
          this.targetMouseY = -1000;
          this.isInteracting = false;
        };

        window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
        document.addEventListener('mouseleave', this.mouseLeaveHandler, { passive: true });
      }
    }

    calculateIntensity(u, v, time) {
      const shape = this.options.shape;
      let intensity = 0;

      switch (shape) {
        case 'horizon': {
          // Curved glowing horizon arc undulating across space
          const curveY = 0.52 + Math.sin(u * Math.PI) * 0.18 + Math.sin(u * 5 + time) * 0.04;
          const dist = Math.abs(v - curveY);
          intensity = Math.exp(-dist * 4.2);
          const ripple = Math.sin(u * 8 - time * 1.5) * 0.08;
          intensity = Math.max(0, Math.min(1, intensity + ripple));
          break;
        }

        case 'pinch': {
          // Band of light squeezed in the center
          const pinchCurve = 0.5 + Math.pow(u - 0.5, 2) * 0.45;
          const dist = Math.abs(v - pinchCurve);
          intensity = Math.exp(-dist * 5.0) + Math.cos(time + u * 4) * 0.06;
          break;
        }

        case 'rise': {
          // Glows upward from the bottom
          const verticalGlow = Math.pow(1 - v, 1.8);
          intensity = verticalGlow + Math.sin(u * 6 + time) * 0.1;
          break;
        }

        case 'eclipse': {
          // Rings a dark celestial center disk
          const cx = u - 0.5;
          const cy = v - 0.5;
          const radius = Math.hypot(cx, cy);
          const ringDist = Math.abs(radius - 0.28);
          intensity = Math.exp(-ringDist * 8.0) + Math.sin(time + radius * 10) * 0.05;
          break;
        }

        default: {
          const d = Math.abs(v - 0.5);
          intensity = Math.exp(-d * 3.5);
        }
      }

      return Math.max(0, Math.min(1, intensity));
    }

    animate() {
      this.time += this.options.speed;

      // Mouse lerp for organic cursor tracking
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

      const { displayWidth, displayHeight, cols, rows, options, ctx } = this;
      if (!ctx || !displayWidth || !displayHeight) return;

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const cell = options.cellSize;
      const chars = options.characters;
      const charCount = chars.length;
      const density = options.density;

      ctx.font = `600 ${Math.floor(cell * 0.85)}px ${options.fontFamily}, 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const cursorRadius = cell * 6.5;

      for (let r = 0; r < rows; r++) {
        const y = r * cell + cell / 2;
        const v = r / rows;

        for (let c = 0; c < cols; c++) {
          const x = c * cell + cell / 2;
          const u = c / cols;

          let intensity = this.calculateIntensity(u, v, this.time);

          // Cursor interactive influence
          if (this.isInteracting) {
            const dx = x - this.mouseX;
            const dy = y - this.mouseY;
            const dist = Math.hypot(dx, dy);
            if (dist < cursorRadius) {
              const boost = (1 - dist / cursorRadius) * 0.55;
              intensity = Math.min(1, intensity + boost);
            }
          }

          // Density gating: skip cells based on density & intensity
          const cellSeed = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453;
          const cellRand = cellSeed - Math.floor(cellSeed);
          if (cellRand > density && intensity < 0.85) {
            continue;
          }

          if (intensity <= 0.02) continue;

          // Select ASCII character based on brightness
          let charIndex = Math.floor(intensity * (charCount - 1));
          charIndex = Math.max(0, Math.min(charCount - 1, charIndex));
          let char = chars[charIndex];

          // Jitter character scramble near cursor
          if (this.isInteracting && Math.hypot(x - this.mouseX, y - this.mouseY) < cell * 3.5) {
            if (Math.random() < 0.25) {
              char = chars[Math.floor(Math.random() * charCount)];
            }
          }

          if (char === ' ') continue;

          // Determine color across horizontal spectrum and intensity
          const colorT = (u * 0.75 + intensity * 0.25 + Math.sin(this.time * 0.5) * 0.1 + 0.1) % 1;
          const rgb = getMultiColor(this.colorsRgb, colorT);

          // Alpha glow with soft falloff
          const alpha = Math.min(0.95, intensity * 1.15);

          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx.fillText(char, x, y);
        }
      }

      this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      window.removeEventListener('resize', this.resizeHandler);
      if (this.mouseMoveHandler) {
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseleave', this.mouseLeaveHandler);
      }
    }
  }

  // Export globally
  global.GradientASCII = GradientASCII;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GradientASCII;
  }
})(typeof window !== 'undefined' ? window : this);
