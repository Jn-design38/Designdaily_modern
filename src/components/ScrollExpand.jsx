'use client';

import { useCallback, useEffect, useRef } from 'react';

import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const ScrollExpand = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    if (stageRef.current) {
      stageRef.current.style.setProperty('--se-card-left', `${ix}%`);
      stageRef.current.style.setProperty('--se-card-top', `${iy}%`);
      stageRef.current.style.setProperty('--se-card-width', `${w}%`);
      stageRef.current.style.setProperty('--se-card-height', `${h}%`);
      stageRef.current.style.setProperty('--se-card-radius', `${r}px`);
    }

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.28, 0.58, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-16 * out}px, 0)`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.62, 0.92, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    let measuredWidth = 0;
    let measuredHeight = 0;
    const measure = (force = false) => {
      const c = propsRef.current;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
      const nextWidth = root.clientWidth;
      const widthChanged = Math.abs(nextWidth - measuredWidth) > 1;

      // On mobile, ignore resize events caused only by toolbar expanding/collapsing (height changes only)
      if (!force && isMobile && !widthChanged) return false;

      let nextHeight;
      if (isMobile) {
        stage.style.removeProperty('height');
        nextHeight = stage.offsetHeight || (c.useWindowScroll ? window.innerHeight : root.clientHeight);
      } else {
        nextHeight = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      }

      const majorHeightChange = !measuredHeight || Math.abs(nextHeight - measuredHeight) / measuredHeight > 0.25;
      if (!force && !isMobile && c.useWindowScroll && !widthChanged && !majorHeightChange) return false;

      measuredWidth = nextWidth;
      measuredHeight = nextHeight;
      stageH = nextHeight;
      if (stageH <= 0) return false;

      if (!isMobile) {
        stage.style.height = `${stageH}px`;
      }
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = nextWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);

      const initW = c.startWidth;
      const initH = c.startHeight;
      const initIx = Math.max(0, (100 - initW) / 2);
      const initIy = Math.max(0, (100 - initH) / 2);
      stage.style.setProperty('--se-card-left', `${initIx}%`);
      stage.style.setProperty('--se-card-top', `${initIy}%`);
      stage.style.setProperty('--se-card-width', `${initW}%`);
      stage.style.setProperty('--se-card-height', `${initH}%`);
      stage.style.setProperty('--se-card-radius', `${c.startRadius}px`);
      return true;
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      if (!measure()) return;
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure(true);
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} loading="eager" fetchPriority="high" decoding="async" draggable={false} />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
