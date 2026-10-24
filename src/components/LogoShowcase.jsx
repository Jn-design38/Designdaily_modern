import LogoLoop from './LogoLoop';
import './LogoShowcase.css';

const originalMarks = [
  {
    src: '/work/tripty/02.webp',
    alt: 'Tripty restaurant identity logo',
    title: 'Tripty',
    href: '/work/tripty',
    target: '_self',
    width: 1600,
    height: 1200,
    hoverColor: '#f21351',
  },
  {
    src: '/work/norea/02.webp',
    alt: 'Noréa fashion identity logo',
    title: 'Noréa',
    href: '/work/norea',
    target: '_self',
    width: 1600,
    height: 1200,
    hoverColor: '#a6968e',
  },
  {
    src: '/work/all-organics/02.webp',
    alt: 'All Organics leaf identity logo',
    title: 'All Organics',
    href: '/work/all-organics',
    target: '_self',
    width: 1600,
    height: 900,
    hoverColor: '#86dc60',
  },
  {
    src: '/work/atuendo/02.webp',
    alt: 'Atuendo fashion identity symbol',
    title: 'Atuendo',
    href: '/work/atuendo',
    target: '_self',
    width: 1600,
    height: 1200,
    hoverColor: '#c8cc87',
  },
  {
    src: '/work/sandbox/02.webp',
    alt: 'Sandbox Lounge identity guidelines',
    title: 'Sandbox Lounge',
    href: '/work/sandbox',
    target: '_self',
    width: 1600,
    height: 900,
    hoverColor: '#d3a246',
  },
];

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
