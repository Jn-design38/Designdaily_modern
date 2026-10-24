import { useEffect, useState } from 'react';
import TechText from './TechText';
import GradientASCII from './GradientASCII';
import { Arrow, Chevron } from './Icons';
import './HeroSection.css';

const disciplines = ['Brand identity', 'Merchandise', 'Stationery', 'Posters & billboards', 'Static social creatives'];

export default function HeroSection() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);
  const small = width < 768;
  return (
    <section id="home" className="hero-section" aria-label="Design Daily Studio">
      <div className="hero-ascii-bg" aria-hidden="true">
        <GradientASCII colors={['#ff4c42', '#f4c64e', '#ff8a50', '#eab308']} shape="horizon" characters=" " cellSize={18} density={0} glyphOpacity={0} gradientOpacity={0.75} glow={0} mouseInteraction clickEffect="wave" speed={0.8} />
        <div className="hero-ascii-vignette" />
      </div>
      <div className="hero-container hero-container--centered">
        <h1 className="sr-only">You can relax while we take care of the design.</h1>
        <div className="hero-tech-text-group" aria-hidden="true">
          <div className="hero-tech-line hero-tech-line--small">
            <TechText text="you can relax while" fontFamily="'Poppins', sans-serif" fontWeight={400} fontSize={small ? 21 : width < 1024 ? 32 : 44} color="rgba(244,244,247,.85)" accentColor="#f4c64e" align="center" reveal="letter" strokeWidth={1.2} specks={10} clickKick />
          </div>
          <div className="hero-tech-line hero-tech-line--large">
            <TechText text="we take care of the design." fontFamily="'Poppins', sans-serif" fontWeight={800} fontSize={small ? Math.min(31, width * .069) : width < 1024 ? 60 : 96} color="#ffffff" accentColor="#ff4c42" align="center" reveal="letter" strokeWidth={1.6} specks={16} clickKick />
          </div>
        </div>
        <div className="hero-cta-group">
          <a href="#contact" className="hero-cta-btn hero-cta-btn--primary">Start a Project <Arrow diagonal /></a>
          <a href="#works" className="hero-cta-btn hero-cta-btn--secondary">Explore Works</a>
        </div>
        <a className="hero-scroll-hint" href="#studio-system"><Chevron /> A little further, a lot to see.</a>
      </div>
      <div className="hero-bottom-ticker" aria-label="Our design disciplines">
        <div className="hero-ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{disciplines.map(item => <span className="hero-ticker-item" key={item}><i aria-hidden="true" /> {item}</span>)}</div>)}</div>
      </div>
    </section>
  );
}
