import LogoLoop from './LogoLoop';
import originalMarks from '../data/originalMarks';
import './LogoShowcase.css';

export default function LogoShowcase() {
  return (
    <section id="original-marks" className="logo-showcase" aria-labelledby="logo-showcase-title">
      <div className="logo-showcase__rail">
        <div className="logo-showcase__heading">
          <span aria-hidden="true" />
          <p id="logo-showcase-title">Original identity work</p>
        </div>
        <p className="logo-showcase__instruction">Drag to explore · Select a mark</p>
      </div>

      <LogoLoop
        logos={originalMarks}
        speed={42}
        direction="left"
        logoHeight={230}
        gap={18}
        pauseOnHover
        fadeOut
        fadeOutWidth={0.055}
        scaleOnHover
        layout="line"
        focus={0.08}
        magnify={0.12}
        scrollBoost={0.4}
        labels="none"
        draggable
        intro
        ariaLabel="Selected original Design Daily identity projects"
        className="logo-showcase__loop"
      />
    </section>
  );
}
