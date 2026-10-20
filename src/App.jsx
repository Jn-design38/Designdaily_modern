import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import SiteHeader from './components/SiteHeader';
import ShowcaseFlow from './components/ShowcaseFlow';
import { Footer } from './components/StudioSections';
import { WorkArchive, ProjectPage, NotFound } from './components/WorkPages';
import projects from './data/projects.json';

export default function App() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const home = pathname === '/';
  const archive = pathname === '/work';
  const project = projects.find(item => pathname === `/work/${item.id}`);
  const [service, setService] = useState(new URLSearchParams(window.location.search).get('service') || '');
  useEffect(() => {
    document.title = home ? 'Design Daily — One recognisable brand. Everywhere you show up.' : archive ? 'All Work — Design Daily' : project ? `${project.title} — Design Daily` : 'Page not found — Design Daily';
    const backNavigation = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
    if (home && backNavigation) {
      try {
        const saved = JSON.parse(sessionStorage.getItem('dd-flow-return'));
        if (saved) {
          const timer = setTimeout(() => window.scrollTo({top:saved.y,behavior:'instant'}), 120);
          return () => clearTimeout(timer);
        }
      } catch { /* Native browser restoration remains available. */ }
    }
    if (window.location.hash) {
      const timer = setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({behavior:'instant'}), 100);
      return () => clearTimeout(timer);
    }
  }, [home, archive, project]);
  return (
    <div className="app-layout dark-studio" id="top">
      <SiteHeader home={home} />
      <main id="main-content">
        {home ? <><HeroSection /><ShowcaseFlow service={service} setService={setService} /></> : archive ? <WorkArchive /> : project ? <ProjectPage project={project} /> : <NotFound />}
      </main>
      <Footer />
    </div>
  );
}
