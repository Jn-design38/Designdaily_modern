import { useEffect, useState } from 'react';
import ScrollExpand from './ScrollExpand';
import './StudioQuoteExpand.css';

export default function StudioQuoteExpand() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth < 900 : false
  ));

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <section id="studio-quote" className="studio-quote" aria-label="Design Daily principle">
      <ScrollExpand
        src="/scroll-expand/studio-brand-world-v2.webp"
        alt="Design Daily artwork brought together: Atuendo packaging, Noréa identity, Tripty food packaging, Sandbox stationery and GoodyBro illustrated apparel in a dark studio"
        title={<span>One idea.<br />Every appearance.</span>}
        scrollHint="Scroll to expand"
        startWidth={56}
        startHeight={58}
        startRadius={18}
        endRadius={0}
        mediaZoom={1.18}
        scrollDistance={1.08}
        holdDistance={0.42}
        smoothing={0.12}
        overlayScrim={0.62}
        useWindowScroll
        className="studio-quote__expand"
      >
        <div className="studio-quote__copy">
          <span className="studio-quote__label"><i aria-hidden="true" /> Design Daily principle</span>
          <blockquote>
            A brand is not built in one perfect moment.<br />
            It is built every time it shows up.
          </blockquote>
        </div>
      </ScrollExpand>
    </section>
  );
}
