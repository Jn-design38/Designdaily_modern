import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import SiteHeader from './components/SiteHeader';
import { BrandWork, PhysicalWork, SocialWork } from './components/Portfolio';
import { Services, Process, Packages, ScaleBenefit, FAQ, Contact, Footer } from './components/StudioSections';
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
    if (window.location.hash) {
      const timer = setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({behavior:'instant'}), 100);
      return () => clearTimeout(timer);
    }
  }, [home, archive, project]);
  return (
    <div className="app-layout" id="top">
      <SiteHeader home={home} />
      <main id="main-content">
        {home ? <><HeroSection /><div className="hero-to-paper" aria-hidden="true" /><BrandWork /><PhysicalWork /><SocialWork /><Services /><Process /><Packages onChoose={setService} /><ScaleBenefit onChoose={setService} /><FAQ /><Contact service={service} setService={setService} /></> : archive ? <WorkArchive /> : project ? <ProjectPage project={project} /> : <NotFound />}
      </main>
      <Footer />
    </div>
  );
}
