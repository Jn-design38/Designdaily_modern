import ScrollExpand from './ScrollExpand';
import './StudioQuoteExpand.css';

export default function StudioQuoteExpand() {
  return (
    <section id="studio-quote" className="studio-quote" aria-label="Design Daily principle">
      <ScrollExpand
        src="/scroll-expand/brand-thread-v1.webp"
        alt="A coral ribbon connecting packaging, paper, a card, fabric and a digital display in a dark studio"
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
