import { useEffect, useState } from 'react';
import TechText from './TechText';
import GradientASCII from './GradientASCII';
import LogoLoop from './LogoLoop';
import originalMarks from '../data/originalMarks';
import { Arrow, Chevron } from './Icons';
import './HeroSection.css';

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
        <GradientASCII
          colors={['#ff4c42', '#ff8052', '#ffbd66', '#ffd778']}
          shape="horizon"
          characters=" .·•●"
          cellSize={13}
          density={1}
          glyphOpacity={0.52}
          glow={1.5}
          depthOfField={0.41}
          flicker={0.18}
          softness={0}
          scale={1.2}
          flow={0}
          speed={0}
          gradientOpacity={1}
          grain={0.06}
          variation={20}
          scrambleRadius={0.26}
        />
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
        <a className="hero-scroll-hint" href="#studio-quote"><Chevron /> A little further, a lot to see.</a>
      </div>
      <div id="original-marks" className="hero-bottom-ticker hero-bottom-ticker--logos">
        <LogoLoop
          logos={originalMarks.map(mark => ({ ...mark, loading: 'eager' }))}
          speed={38}
          direction="left"
          logoHeight={42}
          gap={60}
          pauseOnHover
          fadeOut
          fadeOutWidth={0.035}
          scaleOnHover
          layout="line"
          focus={0.04}
          magnify={0.08}
          scrollBoost={0.2}
          labels="none"
          draggable
          intro
          ariaLabel="Original Design Daily identity projects"
          className="hero-logo-loop"
        />
      </div>
    </section>
  );
}
