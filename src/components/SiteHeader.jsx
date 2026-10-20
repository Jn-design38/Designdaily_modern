import { useEffect, useState } from 'react';
import PillNav from './PillNav';

const sections = [
  ['Work', 'works'],
  ['Approach', 'approach'],
  ['Packages', 'packages'],
  ['Contact', 'contact']
];

export default function SiteHeader({ home = false }) {
  const [active, setActive] = useState(home ? 'home' : 'works');
  const [compact, setCompact] = useState(window.innerWidth < 850);

  useEffect(() => {
    const resize = () => setCompact(window.innerWidth < 850);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    if (!home) return;
    const track = () => {
      let current = 'home';
      for (const id of ['works', 'approach', 'packages', 'contact']) {
        if (document.getElementById(id)?.getBoundingClientRect().top <= 200) current = id;
      }
      setActive(current);
    };
    track();
    window.addEventListener('scroll', track, { passive: true });
    return () => window.removeEventListener('scroll', track);
  }, [home]);

  const prefix = home ? '' : '/';
  const items = [
    { label: 'Home', href: `${prefix}#home` },
    ...sections.map(([label, id]) => ({ label, href: `${prefix}#${id}` }))
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header" data-light="false">
        <PillNav
          logo="/design-daily-icon-white.svg"
          logoAlt="Design Daily home"
          logoHref="/#home"
          items={items}
          activeHref={`${prefix}#${active}`}
          layout="split"
          itemStyle="text"
          hoverEffect="none"
          indicator="none"
          theme="dark"
          surface="glass"
          size="lg"
          collapse={compact ? 'always' : 'never'}
        />
      </header>
    </>
  );
}
