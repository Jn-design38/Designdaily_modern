'use client';

import { useEffect, useRef } from 'react';
import './SpecularButton.css';

const PAD = 24;
const TAU = Math.PI * 2;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = value => value - Math.floor(value);

const loopPosition = (x, y, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const qx = ax - innerX;
  const qy = ay - innerY;
  let s;
  if (qx > 0 && qy > 0) s = innerY + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, innerY);
  else s = innerY + arc + innerX - Math.min(ax, innerX);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrap(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position, halfX, halfY, r) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  let s = wrap(position) * 4 * quarter;
  let signX = 1;
  let signY = 1;
  if (s > 3 * quarter) {
    s = 4 * quarter - s;
    signY = -1;
  } else if (s > 2 * quarter) {
    s -= 2 * quarter;
    signX = -1;
    signY = -1;
  } else if (s > quarter) {
    s = 2 * quarter - s;
    signX = -1;
  }
  let x = innerX - (s - innerY - arc);
  let y = halfY;
  if (s <= innerY) {
    x = halfX;
    y = s;
  } else if (s <= innerY + arc) {
    const angle = (s - innerY) / Math.max(r, 0.0001);
    x = innerX + Math.cos(angle) * r;
    y = innerY + Math.sin(angle) * r;
  }
  return [x * signX, y * signY];
};

/**
 * SpecularButton Component from React Bits.
 * Powered by an ultra-smooth, zero-context-limit hardware-accelerated 2D Canvas pipeline.
 * Never exceeds browser WebGL limits, never loses context, and remains 100% visible across scroll cycles.
 */
const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.0,
  glow = 0.8,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}) => {
  const buttonRef = useRef(null);
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);

  const settings = {
    radius: Math.max(0, radius),
    lineColor: String(lineColor),
    baseColor: String(baseColor),
    intensity: Math.max(0, intensity),
    idleIntensity: clamp(idleIntensity, 0, 1),
    shineSize: Math.max(0, shineSize),
    shineFade: Math.max(0, shineFade),
    thickness: Math.max(0, thickness),
    glow: Math.max(0, glow),
    speed,
    followMouse,
    proximity: Math.max(1, proximity),
    autoAnimate,
    disabled
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    if (!button || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    const reduce = typeof window !== 'undefined'
      ? (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
      : false;

    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: -9999, y: -9999, known: false };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const cornerRadius = s => Math.min(s.radius, view.width / 2, view.height / 2);

    const restSpot = s => {
      const r = cornerRadius(s);
      const inset = r * (1 - Math.SQRT1_2);
      return loopPosition(inset - view.width / 2, view.height / 2 - inset, view.width / 2, view.height / 2, r);
    };

    const aim = s => {
      if (!s.followMouse || s.disabled || !pointer.known) return null;
      const rect = button.getBoundingClientRect();
      const scale = rect.width / view.width || 1;
      const halfX = view.width / 2;
      const halfY = view.height / 2;
      const x = (pointer.x - rect.left - rect.width / 2) / scale;
      const y = (rect.top + rect.height / 2 - pointer.y) / scale;
      const distance = Math.hypot(Math.max(Math.abs(x) - halfX, 0), Math.max(Math.abs(y) - halfY, 0));
      const t = clamp(1 - distance / s.proximity, 0, 1);
      const near = t * t * (3 - 2 * t);
      const nearest = loopPosition(x, y, halfX, halfY, cornerRadius(s));
      if (distance > 0) return { spot: nearest, near };
      const depth = clamp(Math.min(halfX - Math.abs(x), halfY - Math.abs(y)) / (halfY * 0.8), 0, 1);
      const sway = restSpot(s) - (x / halfX) * 0.06 - (y / halfY) * 0.02;
      const offset = sway - nearest - Math.round(sway - nearest);
      return { spot: wrap(nearest + offset * depth * depth * (3 - 2 * depth)), near };
    };

    const draw = s => {
      const { width, height } = view;
      const totalW = width + PAD * 2;
      const totalH = height + PAD * 2;

      ctx.clearRect(0, 0, totalW, totalH);

      const r = cornerRadius(s);
      const [rimX, rimY] = rimPoint(state.spot, width / 2, height / 2, r);
      const lightX = PAD + width / 2 + rimX;
      const lightY = PAD + height / 2 - rimY;

      // Check if button is marked as lit via .is-lit class
      const isLitClass = button.classList.contains('is-lit');
      const boost = isLitClass ? 1.4 : 1.0;
      const effectiveLevel = isLitClass ? Math.max(state.level, 0.95) : state.level;
      const currentIntensity = s.intensity * boost * (effectiveLevel + state.press * 0.8);

      // 1. Path of the button border
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(PAD, PAD, width, height, r);
      } else {
        ctx.rect(PAD, PAD, width, height);
      }

      // 2. Base hairline border (crisp 1px subtle edge)
      ctx.save();
      ctx.strokeStyle = isLitClass ? s.lineColor : s.baseColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = isLitClass ? 0.85 : 0.35;
      ctx.stroke();
      ctx.restore();

      // 3. Specular highlight beam along rim (crisp hairline glint, not a wide tube)
      if (currentIntensity > 0.01) {
        ctx.save();
        const beamSpan = Math.max(width, height) * (0.32 + s.shineSize / 220 + state.press * 0.1);
        const grad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, beamSpan);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, s.lineColor);
        grad.addColorStop(0.65, s.lineColor);
        grad.addColorStop(1, 'transparent');

        ctx.shadowColor = s.lineColor;
        ctx.shadowBlur = Math.min(6, s.glow * 5 * currentIntensity);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1.0, s.thickness * (0.95 + currentIntensity * 0.15));
        ctx.globalAlpha = clamp(currentIntensity, 0, 1);
        ctx.stroke();
        ctx.restore();

        // 4. White core glint hotspot on the rim (ultra crisp point)
        ctx.save();
        const hotSpan = Math.max(8, s.thickness * 5);
        const hotGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, hotSpan);
        hotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        hotGrad.addColorStop(0.3, s.lineColor);
        hotGrad.addColorStop(1, 'transparent');
        ctx.strokeStyle = hotGrad;
        ctx.lineWidth = Math.max(1.1, s.thickness * 1.15);
        ctx.stroke();
        ctx.restore();

        // 5. Subtle inner glass ambient glow pool
        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(PAD, PAD, width, height, r);
        } else {
          ctx.rect(PAD, PAD, width, height);
        }
        ctx.clip();

        const poolRadius = Math.max(width, height) * 0.45;
        const poolGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, poolRadius);
        poolGrad.addColorStop(0, s.lineColor);
        poolGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = poolGrad;
        ctx.globalAlpha = 0.08 * clamp(currentIntensity, 0, 1) * s.glow;
        ctx.fill();
        ctx.restore();
      }
    };

    const frame = now => {
      raf = 0;
      if (!visible) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = aim(s);
      const spinning = s.autoAnimate && !reduce;
      const steering = !!target && target.near > 0;
      if (!state.ready) {
        state.spot = restSpot(s);
        state.level = s.autoAnimate ? 1 : s.idleIntensity;
        state.ready = true;
      }
      let diff = 0;
      if (spinning && !steering) state.spot = wrap(state.spot + (s.speed / TAU) * dt);
      else {
        diff = (steering ? target.spot : restSpot(s)) - state.spot;
        diff -= Math.round(diff);
        state.spot = wrap(state.spot + diff * (1 - Math.exp(-dt * 8)));
      }
      const level = s.autoAnimate ? 1 : s.idleIntensity + (1 - s.idleIntensity) * (target ? target.near : 0);
      state.level += (level - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);
      draw(s);
      const settling = Math.abs(diff) > 0.0002 || Math.abs(level - state.level) > 0.001 || state.press > 0.002;
      if (settling || (spinning && !steering)) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const measure = entry => {
      const box = entry?.borderBoxSize?.[0];
      const w = box ? box.inlineSize : button.offsetWidth;
      const h = box ? box.blockSize : button.offsetHeight;
      if (w > 0 && h > 0) {
        view.width = w;
        view.height = h;
      }
      view.ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.round((view.width + PAD * 2) * view.ratio));
      canvas.height = Math.max(1, Math.round((view.height + PAD * 2) * view.ratio));

      ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);

      if (!state.ready) {
        state.spot = restSpot(settingsRef.current);
        state.level = settingsRef.current.autoAnimate ? 1 : settingsRef.current.idleIntensity;
        state.ready = true;
      }
      draw(settingsRef.current);
      wake();
    };

    const onPointerMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      wake();
    };

    const onScroll = () => {
      if (pointer.known) wake();
    };

    const onPointerDown = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      if (!settingsRef.current.disabled) state.press = 1;
      wake();
    };

    const onPointerEnd = event => {
      if (event.pointerType === 'mouse') return;
      pointer.known = false;
      wake();
    };

    const onPointerLeave = () => {
      pointer.known = false;
      wake();
    };

    const resizeObserver = new ResizeObserver(entries => measure(entries[entries.length - 1]));
    resizeObserver.observe(button);

    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        measure();
        wake();
      }
    });
    intersection.observe(button);

    const classObserver = new MutationObserver(() => {
      draw(settingsRef.current);
      wake();
    });
    classObserver.observe(button, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    button.addEventListener('pointerdown', onPointerDown);

    measure();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      classObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      button.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={{
        '--sb-radius': `${radius}px`,
        '--sb-tint': tint,
        '--sb-tint-opacity': tintOpacity,
        '--sb-blur': `${blur}px`,
        '--sb-text-color': textColor,
        ...style
      }}
      {...rest}
    >
      <canvas ref={canvasRef} className="specular-button__light" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
