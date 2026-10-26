import { useEffect } from 'react';
import originalMarks from './data/originalMarks';
import { volumeItems } from './components/StudioPrelude';

const criticalSources = [
  '/scroll-expand/studio-brand-world-v2.webp',
  ...originalMarks.map(item => item.src)
];

const warmSources = [
  ...volumeItems.map(item => item.image),
  '/optimized/covers/social-tripty-campaign.webp',
  '/optimized/covers/brand-identity-norea.webp',
  '/optimized/covers/brand-identity-atuendo.webp',
  '/optimized/covers/brand-identity-sandbox-lounge.webp',
  '/optimized/covers/packaging-finn-gift-box.webp',
  '/optimized/covers/tshirt-zaro-activewear.webp',
  '/optimized/covers/tshirt-goodybro-create-goodness.webp',
  '/optimized/covers/social-aves-real-estate.webp',
  '/optimized/covers/seor.webp',
  '/optimized/covers/social-applegears-campaign.webp',
  '/optimized/home/all-organics-outdoor-advertising.webp',
  '/optimized/home/artboard-1-dd-social.webp',
  '/optimized/home/tripty-logo-sketch.webp',
  '/optimized/home/artboard-1-aves-social.webp',
  '/optimized/home/tripty-detail-b.webp'
];

function prepareImage(src, priority = 'auto') {
  return new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.fetchPriority = priority;
    image.onload = async () => {
      try {
        await image.decode?.();
      } catch {
        // A successful load is sufficient when a browser declines explicit decode.
      }
      resolve();
    };
    image.onerror = resolve;
    image.src = src;
  });
}

function releaseStartupGate() {
  clearTimeout(window.__ddStartupFallback);
  document.documentElement.classList.remove('dd-startup-pending');
  document.documentElement.dataset.siteReady = 'true';
  window.dispatchEvent(new CustomEvent('dd-site-ready'));
  if (window.location.hash) {
    requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
  }
}

async function prepareInBatches(sources, concurrency = 4) {
  const queue = [...new Set(sources)];
  const worker = async () => {
    while (queue.length) await prepareImage(queue.shift(), 'low');
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
}

export default function useSiteReadiness(enabled) {
  useEffect(() => {
    if (!enabled) {
      releaseStartupGate();
      return undefined;
    }

    let cancelled = false;
    const maximumWait = new Promise(resolve => setTimeout(resolve, 5500));
    const fontsReady = document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve();
    const essentialsReady = Promise.all([
      fontsReady,
      ...[...new Set(criticalSources)].map(src => prepareImage(src, 'high'))
    ]);

    Promise.race([essentialsReady, maximumWait]).then(() => {
      if (cancelled) return;
      releaseStartupGate();
      const warm = () => {
        const renderedSources = [...document.images].map(image => image.currentSrc || image.src).filter(Boolean);
        prepareInBatches([...warmSources, ...renderedSources]);
      };
      if ('requestIdleCallback' in window) window.requestIdleCallback(warm, { timeout: 1200 });
      else setTimeout(warm, 150);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
