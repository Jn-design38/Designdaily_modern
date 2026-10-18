/**
 * ScrollFloat Component — from React Bits (JavaScript + GSAP / ScrollTrigger Engine)
 * Kinetic text splitting and spatial card floating with stretch, wave, flip, scatter & blur effects.
 */

(function (global) {
  'use strict';

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const clampToScroll = position =>
    typeof position === 'string' && !position.startsWith('clamp(') ? `clamp(${position})` : position;

  const clamp01 = value => Math.min(Math.max(value, 0), 1);

  const smoothstep = (from, to, value) => {
    const k = clamp01((value - from) / (to - from));
    return k * k * (3 - 2 * k);
  };

  const random = (index, salt) => {
    const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const getDelays = (count, order, stagger) => {
    const middle = (count - 1) / 2;
    const ranks = Array.from({ length: count }, (_, index) => {
      if (order === 'end') return count - 1 - index;
      if (order === 'center') return Math.abs(index - middle);
      if (order === 'edges') return middle - Math.abs(index - middle);
      return index;
    });
    if (order === 'random') {
      const shuffled = ranks.map((_, index) => index).sort((a, b) => random(a, 9) - random(b, 9));
      shuffled.forEach((target, rank) => {
        ranks[target] = rank;
      });
    }
    const first = Math.min(...ranks);
    return ranks.map(rank => (rank - first) * Math.max(0, stagger));
  };

  class ScrollFloat {
    constructor(element, options = {}) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      if (!element) return;

      this.element = element;
      this.options = Object.assign(
        {
          effect: 'float',
          splitBy: 'chars',
          direction: 'up',
          order: 'start',
          fromColor: 'currentColor',
          animationDuration: 1,
          ease: 'back.inOut(2)',
          scrollStart: 'top bottom-=10%',
          scrollEnd: 'center center',
          stagger: 0.03,
          distance: 120,
          stretch: 2.3,
          smoothing: 0,
          scrollContainer: null
        },
        options
      );

      this.init();
    }

    init() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('ScrollFloat requires GSAP and ScrollTrigger');
        return;
      }

      const {
        effect,
        splitBy,
        direction,
        order,
        fromColor,
        animationDuration,
        ease,
        scrollStart,
        scrollEnd,
        stagger,
        distance,
        stretch,
        smoothing,
        scrollContainer
      } = this.options;

      const el = this.element;
      el.classList.add('scroll-float');
      if (effect !== 'float') {
        el.classList.add('scroll-float--open');
      }

      // Check if element already has split pieces, or split its text
      let pieces = el.querySelectorAll(splitBy === 'words' ? '.scroll-float-word' : '.scroll-float-char');
      if (pieces.length === 0) {
        const rawText = el.textContent.trim();
        el.innerHTML = '';

        // Screen reader accessible label
        const srSpan = document.createElement('span');
        srSpan.className = 'scroll-float-sr';
        srSpan.textContent = rawText;
        el.appendChild(srSpan);

        // Visible kinetic text container
        const textWrapper = document.createElement('span');
        textWrapper.className = 'scroll-float-text';
        textWrapper.setAttribute('aria-hidden', 'true');

        const shiftColor = fromColor && fromColor !== 'currentColor' ? fromColor : null;
        if (shiftColor) {
          textWrapper.style.color = `color-mix(in oklab, ${shiftColor} calc(var(--scroll-float-mix, 0) * 100%), currentColor)`;
        }

        const words = rawText.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            textWrapper.appendChild(document.createTextNode(word));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'scroll-float-word';
            if (splitBy === 'words') {
              wordSpan.textContent = word;
            } else {
              Array.from(word).forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'scroll-float-char';
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
              });
            }
            textWrapper.appendChild(wordSpan);
          }
        });

        el.appendChild(textWrapper);
        pieces = el.querySelectorAll(splitBy === 'words' ? '.scroll-float-word' : '.scroll-float-char');
      }

      const targets = pieces.length ? Array.from(pieces) : [el];
      const scroller = scrollContainer || window;
      const indexOf = new Map(targets.map((target, index) => [target, index]));
      const at = fn => (_, target) => fn(indexOf.get(target) ?? 0);
      const middle = (targets.length - 1) / 2;
      const edge = index => (middle > 0 ? (index - middle) / middle : 0);
      const delays = getDelays(targets.length, order, stagger);
      const sign = direction === 'down' ? -1 : 1;
      const reach = Math.max(0, Number(distance) || 0) / 120;
      const squeeze = stretch > 0 ? Math.pow(stretch, -0.43) : 1;
      const baseEase = gsap.parseEase(ease) || (p => p);
      const timing = p => clamp01(baseEase(p));
      const size = () => parseFloat(getComputedStyle(el).fontSize) || 24;

      const swell = p => {
        const t = timing(p);
        return 1 - Math.cos(t * Math.PI * 2.5) * Math.pow(1 - t, 2.6);
      };
      const sway = p => {
        const t = timing(p);
        return Math.sin(t * Math.PI * 2.5) * Math.pow(1 - t, 2.6);
      };

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            scroller,
            start: scrollStart,
            end: clampToScroll(scrollEnd),
            scrub: smoothing > 0 ? smoothing : true,
            invalidateOnRefresh: true
          }
        });

        const add = (fromVars, toVars) => {
          gsap.set(targets, { willChange: 'opacity, transform', ...fromVars });
          return timeline.fromTo(
            targets,
            { willChange: 'opacity, transform', ...fromVars },
            { duration: animationDuration, stagger: index => delays[index] || 0, ...toVars },
            0
          );
        };

        if (effect === 'flip') {
          add(
            {
              rotationX: -90 * sign,
              transformPerspective: () => size() * 4,
              transformOrigin: () => `50% 50% ${(-size() * 0.55 * reach).toFixed(2)}`,
              backfaceVisibility: 'hidden'
            },
            { ease, rotationX: 0 }
          );
          add({ opacity: 0 }, { ease: p => smoothstep(0.05, 0.55, timing(p)), opacity: 1 });
        } else if (effect === 'scatter') {
          add(
            {
              x: at(index => ((random(index, 1) * 2 - 1) * 1.3 - edge(index) * 0.9) * size() * reach),
              y: at(index => sign * (0.35 + random(index, 2)) * size() * 1.1 * reach),
              rotation: at(index => (random(index, 3) < 0.5 ? -1 : 1) * (40 + random(index, 4) * 120)),
              scale: at(index => 0.35 + random(index, 5) * 0.9),
              transformOrigin: '50% 50%'
            },
            { ease, x: 0, y: 0, rotation: 0, scale: 1 }
          );
          add({ opacity: 0 }, { ease: p => smoothstep(0, 0.4, timing(p)), opacity: 1 });
        } else if (effect === 'blur') {
          add(
            {
              willChange: 'opacity, transform, filter',
              opacity: 0,
              y: () => sign * size() * 0.3 * reach,
              scale: 1.45,
              filter: () => `blur(${(size() * 0.2).toFixed(2)}px)`,
              transformOrigin: '50% 50%'
            },
            { ease, opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
          );
        } else if (effect === 'wave') {
          add(
            {
              yPercent: 120 * reach * sign,
              scaleY: stretch,
              scaleX: squeeze,
              transformOrigin: sign > 0 ? '50% 100%' : '50% 0%'
            },
            { ease: swell, yPercent: 0, scaleY: 1, scaleX: 1 }
          );
          add({ rotation: 0 }, { ease: sway, rotation: -16 * sign });
          add({ opacity: 0 }, { ease: p => clamp01(timing(p) * 2.5), opacity: 1 });
        } else {
          // Default: 'float'
          add(
            {
              opacity: 0,
              yPercent: 120 * reach * sign,
              scaleY: stretch,
              scaleX: squeeze,
              transformOrigin: sign > 0 ? '50% 0%' : '50% 100%'
            },
            { ease, opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1 }
          );
        }

        if (fromColor && fromColor !== 'currentColor') {
          add({ '--scroll-float-mix': 1 }, { ease: p => smoothstep(0.5, 1, timing(p)), '--scroll-float-mix': 0 });
        }
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(targets, { opacity: 1, transform: 'none' });
      });

      this._cleanup = () => mm.revert();
    }

    destroy() {
      if (this._cleanup) this._cleanup();
    }

    /**
     * Helper to apply ScrollFloat kinetics to interactive cards
     */
    static animateCards(cards, options = {}) {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

      const opts = Object.assign(
        {
          trigger: '#services',
          scrollStart: 'top top',
          scrollEnd: '+=200%',
          pin: true,
          scrub: 0.8
        },
        options
      );

      return opts;
    }
  }

  // Export globally
  global.ScrollFloat = ScrollFloat;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollFloat;
  }
})(typeof window !== 'undefined' ? window : this);
