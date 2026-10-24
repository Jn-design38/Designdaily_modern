import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import './StudioSignature.css';

const ModelViewer = lazy(() => import('./reactbits/ModelViewer'));
const FINISHES = [
  { name: 'Original', swatch: '#ff4c42', color: null, roughness: null, metalness: null },
  { name: 'Chalk', swatch: '#eee9df', color: '#eee9df', roughness: 0.35, metalness: 0.08 },
  { name: 'Graphite', swatch: '#555b6b', color: '#555b6b', roughness: 0.25, metalness: 0.42 },
];

// Also catch a failed lazy chunk, which happens before ModelViewer can mount.
class SignatureBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { this.props.onError(error); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function ControlIcon({ reset = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {reset ? <><path d="M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6" /></> : <><path d="M16 4l4 4-4 4M20 8H9a5 5 0 0 0 0 10h7" /><path d="M12 14l4 4-4 4" /></>}
    </svg>
  );
}

/** A self-contained section. Import once and render <StudioSignature />. */
export default function StudioSignature({
  modelUrl = '/agency-logo-web.glb',
  fallbackSrc = '/agency-logo-color.png',
  contactHref = '#contact',
  className = '',
}) {
  const sectionRef = useRef(null);
  const viewerRef = useRef(null);
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [finish, setFinish] = useState(0);
  const [rotating, setRotating] = useState(false);
  const material = FINISHES[finish];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!('IntersectionObserver' in window)) {
      setNearby(true);
      setVisible(true);
      return undefined;
    }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearby(true);
        preload.disconnect();
      }
    }, { rootMargin: '180px 0px' });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    preload.observe(section);
    visibility.observe(section);
    return () => { preload.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!visible || reducedMotion) {
      section.style.setProperty('--signature-tilt', '0deg');
      section.style.setProperty('--signature-lift', '0px');
      return undefined;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight));
      section.style.setProperty('--signature-tilt', `${(progress * -9).toFixed(2)}deg`);
      section.style.setProperty('--signature-lift', `${(progress * 28).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [visible, reducedMotion]);

  const onLoaded = useCallback(() => { setReady(true); setFailed(false); }, []);
  const onError = useCallback(() => { setReady(false); setFailed(true); }, []);
  const reset = () => { setRotating(false); viewerRef.current?.reset(); };
  const staticLogo = <img src={fallbackSrc} alt="Design Daily logo" width="360" height="360" loading="lazy" decoding="async" />;

  return (
    <section id="studio-signature" ref={sectionRef} className={`studio-signature ${className}`} aria-labelledby="studio-signature-heading">
      <div className="studio-signature__inner">
        <div className="studio-signature__copy">
          <p className="studio-signature__eyebrow"><span aria-hidden="true" /> The people behind the pixels</p>
          <h2 id="studio-signature-heading">Your brand.<br /><span>In good hands.</span></h2>
          <p className="studio-signature__description">Good design starts with someone who cares. I’m Julkarnine Arabi, founder of Design Daily. From our studio in Dhaka, we turn big ambitions into brands that feel unmistakably yours.</p>
          <a className="studio-signature__link" href={contactHref}>Let’s make something matter <span aria-hidden="true">↗</span></a>
          <div className="studio-signature__byline">
            <span className="studio-signature__monogram" aria-hidden="true">ja.</span>
            <p><strong>Julkarnine Arabi</strong><span>Founder & creative partner</span></p>
            <span className="studio-signature__location">Dhaka, BD<br />Working everywhere.</span>
          </div>
        </div>

        <div className="studio-signature__object">
          <div className="studio-signature__object-heading"><span>A little perspective changes everything.</span><span aria-hidden="true">DD / 01</span></div>
          <div className="studio-signature__perspective">
            <div className="studio-signature__stage" aria-label="Interactive Design Daily logo">
              <div className="studio-signature__orbit" aria-hidden="true" />
              <span className="studio-signature__axis studio-signature__axis--top" aria-hidden="true">+</span>
              <span className="studio-signature__axis studio-signature__axis--bottom" aria-hidden="true">+</span>
              <div className="studio-signature__viewer">
                {nearby ? (
                  <SignatureBoundary key={modelUrl} onError={onError} fallback={<div className="studio-signature__fallback">{staticLogo}</div>}>
                  <Suspense fallback={<div className="studio-signature__fallback">{staticLogo}</div>}>
                    <ModelViewer
                      ref={viewerRef}
                      url={modelUrl}
                      width="100%"
                      height="100%"
                      environment="none"
                      exposure={1.1}
                      dpr={[1, 1.35]}
                      active={visible}
                      autoRotate={rotating}
                      autoRotateSpeed={0.3}
                      autoRotateDelay={0}
                      dragRotate
                      turntable={false}
                      zoom={false}
                      float={0}
                      shadow={false}
                      hoverTilt={reducedMotion ? 0 : 0.045}
                      intro={reducedMotion ? 'none' : 'rise'}
                      startAngle={-18}
                      tilt={7}
                      fit={1.04}
                      materialColor={material.color}
                      materialRoughness={material.roughness}
                      materialMetalness={material.metalness}
                      fallback={<div className="studio-signature__fallback">{staticLogo}</div>}
                      loadingFallback={<div className="studio-signature__fallback studio-signature__fallback--loading">{staticLogo}</div>}
                      onModelLoaded={onLoaded}
                      onError={onError}
                    />
                  </Suspense>
                  </SignatureBoundary>
                ) : <div className="studio-signature__fallback">{staticLogo}</div>}
              </div>
            </div>
          </div>
          <p className="studio-signature__hint" role="status" aria-live="polite">
            {failed ? 'Our mark, in its simplest form.' : ready ? 'Drag to explore. Make it your own.' : nearby ? 'Bringing our mark into perspective…' : 'A different dimension of Design Daily.'}
          </p>
          <div className="studio-signature__controls">
            <div className="studio-signature__finishes" role="group" aria-label="Logo material">
              {FINISHES.map((item, index) => (
                <button key={item.name} type="button" aria-pressed={finish === index} aria-label={`${item.name} material`} title={`${item.name} material`} disabled={!ready || failed} onClick={() => setFinish(index)}>
                  <span style={{ backgroundColor: item.swatch }} aria-hidden="true" />
                  <span className="studio-signature__sr-only">{item.name}</span>
                </button>
              ))}
              <span className="studio-signature__finish-name" aria-hidden="true">{material.name}</span>
            </div>
            <div className="studio-signature__actions">
              <button type="button" disabled={!ready || failed} aria-label="Rotate logo 45 degrees" title="Rotate logo 45 degrees" onClick={() => { setRotating(false); viewerRef.current?.rotate(45); }}><ControlIcon /></button>
              {!reducedMotion && <button type="button" disabled={!ready || failed} aria-pressed={rotating} onClick={() => setRotating(value => !value)}>{rotating ? 'Pause' : 'Spin'}</button>}
              <button type="button" disabled={!ready || failed} aria-label="Reset logo view" title="Reset logo view" onClick={reset}><ControlIcon reset /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
