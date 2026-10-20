import { useEffect, useState } from 'react';
import gsap from 'gsap';
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

  // Initialize Lenis momentum smooth scrolling for buttery fluid flow
  useEffect(() => {
    let lenisInstance = null;
    let tickerHandler = null;

    const initLenis = () => {
      if (typeof window === 'undefined' || !window.Lenis || lenisInstance) return;

      const lenis = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        infinite: false,
      });

      lenisInstance = lenis;
      window.__lenis = lenis;

      tickerHandler = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerHandler);
      gsap.ticker.lagSmoothing(0);

      window.dispatchEvent(new CustomEvent('lenis-ready', { detail: lenis }));
    };

    if (typeof window !== 'undefined' && window.Lenis) {
      initLenis();
    } else if (typeof window !== 'undefined') {
      const checkInterval = setInterval(() => {
        if (window.Lenis) {
          clearInterval(checkInterval);
          initLenis();
        }
      }, 50);
      const timer = setTimeout(() => clearInterval(checkInterval), 3000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timer);
        if (lenisInstance) {
          if (tickerHandler) gsap.ticker.remove(tickerHandler);
          lenisInstance.destroy();
          delete window.__lenis;
        }
      };
    }

    return () => {
      if (lenisInstance) {
        if (tickerHandler) gsap.ticker.remove(tickerHandler);
        lenisInstance.destroy();
        delete window.__lenis;
      }
    };
  }, []);

  useEffect(() => {
    document.title = home
      ? 'Design Daily — One recognisable brand. Everywhere you show up.'
      : archive
      ? 'All Work — Design Daily'
      : project
      ? `${project.title} — Design Daily`
      : 'Page not found — Design Daily';

    const backNavigation = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
    if (home && backNavigation) {
      try {
        const saved = JSON.parse(sessionStorage.getItem('dd-flow-return'));
        if (saved) {
          const timer = setTimeout(() => window.scrollTo({ top: saved.y, behavior: 'instant' }), 120);
          return () => clearTimeout(timer);
        }
      } catch {
        /* Native browser restoration remains available. */
      }
    }
    if (window.location.hash) {
      const timer = setTimeout(
        () => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }),
        100
      );
      return () => clearTimeout(timer);
    }
  }, [home, archive, project]);

  return (
    <div className="app-layout" id="top">
      <SiteHeader home={home} />
      <main id="main-content">
        {home ? (
          <>
            <HeroSection />
            <ShowcaseFlow service={service} setService={setService} />
          </>
        ) : archive ? (
          <WorkArchive />
        ) : project ? (
          <ProjectPage project={project} />
        ) : (
          <NotFound />
        )}
      </main>
      <Footer />
    </div>
  );
}
