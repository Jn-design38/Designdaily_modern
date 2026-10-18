/**
 * DESIGN DAILY STUDIO — MAIN JAVASCRIPT
 * Responsive Navigation, Process Synchronizer, Comparison Slider,
 * Accordion, Interactive Form Validation, and Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 0. LENIS SMOOTH SCROLL INITIALIZATION ---
  let lenis = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Main animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize anchor scrolling with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, {
            offset: -80,
            duration: 1.25,
          });
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // --- 1. HEADER SCROLL & MOBILE NAVIGATION ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && siteNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (lenis) {
        if (isOpen) lenis.stop();
        else lenis.start();
      }
    });

    // Close mobile nav when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) {
          siteNav.classList.remove('open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (siteNav.classList.contains('open') && !siteNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        siteNav.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
      }
    });
  }

  // Active navigation link tracking via IntersectionObserver
  const sections = document.querySelectorAll('main > section[id]');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --- 2. SERVICES ACCORDION EXPANSION ---
  const serviceItems = document.querySelectorAll('.service-item');
  serviceItems.forEach(item => {
    const summary = item.querySelector('.service-summary');
    const body = item.querySelector('.service-body');

    if (summary && body) {
      const toggle = () => {
        const isActive = item.classList.contains('active');

        // Close other service drawers for clarity
        serviceItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherSummary = otherItem.querySelector('.service-summary');
            const otherBody = otherItem.querySelector('.service-body');
            if (otherSummary) otherSummary.setAttribute('aria-expanded', 'false');
            if (otherBody) otherBody.hidden = true;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          summary.setAttribute('aria-expanded', 'false');
          body.hidden = true;
        } else {
          item.classList.add('active');
          summary.setAttribute('aria-expanded', 'true');
          body.hidden = false;
        }
      };

      summary.addEventListener('click', toggle);
      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    }
  });

  // --- 3. PROCESS 4-STEP SYNCHRONIZER ---
  const processSteps = [
    {
      badge: 'PHASE 01 • WEEK 1',
      timeline: 'Discovery & Competitive Strategy',
      title: 'Uncompromising discovery before drawing a single vector.',
      desc: 'We dissect your brand ambitions, study the competitors you want to leapfrog, and define the emotional positioning of your business. We synthesize our findings into an actionable strategic brief and creative moodboards.',
      artifacts: ['Strategic Brief', 'Competitive Audit', 'Visual Moodboard', 'Direction Alignment'],
      image: 'assets/agency-sketch.png',
      caption: 'Stage 1 Artifact: Initial Ideation & Concept Foundations'
    },
    {
      badge: 'PHASE 02 • WEEKS 2–3',
      timeline: 'Concept Prototyping & Grid Architecture',
      title: 'Translating strategic positioning into high-contrast visual systems.',
      desc: 'We explore multiple distinct creative directions. We construct logomarks using geometric circle grids, develop typography hierarchies, and test early marks on real-world applications before presentation.',
      artifacts: ['2–3 Design Directions', 'Mathematical Logomarks', 'Typography Scale', 'Prototype Walkthroughs'],
      image: 'assets/norea-construction.jpg',
      caption: 'Stage 2 Artifact: Geometric Construction & Grid Testing'
    },
    {
      badge: 'PHASE 03 • WEEKS 3–4',
      timeline: 'System Calibration & Asset Stress-Testing',
      title: 'Obsessive refinement of the chosen direction across every surface.',
      desc: 'Once the winning direction is selected, we obsessively fine-tune kerning, calibrate screen and print color profiles, engineer packaging dielines, and verify responsive web behavior under all viewport constraints.',
      artifacts: ['Kerning Calibration', 'Surface Patterns', 'Digital & Print Proofs', 'Dieline Engineering'],
      image: 'assets/tripty-pattern.png',
      caption: 'Stage 3 Artifact: Modular Pattern System & Collateral'
    },
    {
      badge: 'PHASE 04 • WEEK 5',
      timeline: 'Master Handoff & Launch Enablement',
      title: 'Production-grade assets packaged for effortless internal deployment.',
      desc: 'We compile comprehensive brand guidelines books, export vector packages in every required format (SVG, EPS, AI, PDF), generate ready-to-code design tokens, and remain on standby during your public launch.',
      artifacts: ['Master Vector Drive', 'Brand Guidelines Book', 'Production Dielines', 'Launch Support'],
      image: 'assets/sandbox-stationery.png',
      caption: 'Stage 4 Artifact: Production Handoff & Guidelines'
    }
  ];

  const stepTabs = document.querySelectorAll('.step-tab');
  const stepBadge = document.getElementById('step-badge');
  const stepTimeline = document.getElementById('step-timeline');
  const stepTitle = document.getElementById('step-title');
  const stepDesc = document.getElementById('step-desc');
  const stepArtifacts = document.getElementById('step-artifacts');
  const stepImage = document.getElementById('step-image');
  const stepCaption = document.getElementById('step-image-caption');

  const updateProcessStep = (index) => {
    const data = processSteps[index];
    if (!data) return;

    // Update active tab styles
    stepTabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });

    // Animate content change
    if (stepImage) {
      stepImage.style.opacity = '0.3';
      setTimeout(() => {
        stepImage.src = data.image;
        stepImage.alt = data.caption;
        stepImage.style.opacity = '1';
      }, 150);
    }

    if (stepBadge) stepBadge.textContent = data.badge;
    if (stepTimeline) stepTimeline.textContent = data.timeline;
    if (stepTitle) stepTitle.textContent = data.title;
    if (stepDesc) stepDesc.textContent = data.desc;
    if (stepCaption) stepCaption.textContent = data.caption;

    if (stepArtifacts) {
      stepArtifacts.innerHTML = data.artifacts
        .map(pill => `<span class="pill">${pill}</span>`)
        .join('');
    }
  };

  stepTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const stepIndex = parseInt(tab.getAttribute('data-step') || '0', 10);
      updateProcessStep(stepIndex);
    });

    tab.addEventListener('keydown', (e) => {
      const stepIndex = parseInt(tab.getAttribute('data-step') || '0', 10);
      let targetIndex = null;
      if (e.key === 'ArrowRight') targetIndex = (stepIndex + 1) % stepTabs.length;
      if (e.key === 'ArrowLeft') targetIndex = (stepIndex - 1 + stepTabs.length) % stepTabs.length;

      if (targetIndex !== null) {
        e.preventDefault();
        stepTabs[targetIndex].focus();
        updateProcessStep(targetIndex);
      }
    });
  });

  // --- 4. CRAFT BEFORE/AFTER COMPARISON SLIDER ---
  const comparisonViewport = document.getElementById('comparison-viewport');
  const comparisonBefore = document.getElementById('comparison-before-layer');
  const comparisonHandle = document.getElementById('comparison-handle');
  const btnShowGrid = document.getElementById('btn-show-grid');
  const btnShowSplit = document.getElementById('btn-show-split');
  const btnShowFinished = document.getElementById('btn-show-finished');

  if (comparisonViewport && comparisonBefore && comparisonHandle) {
    let isSliding = false;

    const setSliderPosition = (percentage) => {
      const clamped = Math.max(0, Math.min(100, percentage));
      comparisonBefore.style.width = `${clamped}%`;
      comparisonHandle.style.left = `${clamped}%`;
      comparisonViewport.setAttribute('aria-valuenow', Math.round(clamped));

      // Update control buttons active state
      if (btnShowGrid) btnShowGrid.classList.toggle('active', clamped >= 95);
      if (btnShowSplit) btnShowSplit.classList.toggle('active', clamped > 35 && clamped < 65);
      if (btnShowFinished) btnShowFinished.classList.toggle('active', clamped <= 5);
    };

    const handlePointerMove = (e) => {
      if (!isSliding) return;
      const rect = comparisonViewport.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX === undefined) return;
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setSliderPosition(pct);
    };

    const startSliding = (e) => {
      isSliding = true;
      handlePointerMove(e);
    };

    const stopSliding = () => {
      isSliding = false;
    };

    comparisonViewport.addEventListener('mousedown', startSliding);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', stopSliding);

    comparisonViewport.addEventListener('touchstart', startSliding, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', stopSliding);

    // Keyboard controls on comparison slider
    comparisonViewport.addEventListener('keydown', (e) => {
      const current = parseFloat(comparisonViewport.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSliderPosition(current - 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSliderPosition(current + 5);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSliderPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setSliderPosition(100);
      }
    });

    // Preset view buttons
    if (btnShowGrid) btnShowGrid.addEventListener('click', () => setSliderPosition(100));
    if (btnShowSplit) btnShowSplit.addEventListener('click', () => setSliderPosition(50));
    if (btnShowFinished) btnShowFinished.addEventListener('click', () => setSliderPosition(0));

    // Initialize at 50% split
    setSliderPosition(50);
  }

  // --- 5. FAQ ACCORDION ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    const icon = item.querySelector('.accordion-icon');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            const otherPanel = otherItem.querySelector('.accordion-panel');
            const otherIcon = otherItem.querySelector('.accordion-icon');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.hidden = true;
            if (otherIcon) otherIcon.textContent = '+';
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          panel.hidden = true;
          if (icon) icon.textContent = '+';
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  // --- 6. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION ---
  const projectForm = document.getElementById('project-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const btnResetForm = document.getElementById('btn-reset-form');

  if (projectForm && formSuccess && submitBtn) {
    const validateField = (input, isValid) => {
      input.classList.toggle('is-invalid', !isValid);
      input.setAttribute('aria-invalid', String(!isValid));
    };

    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const isNameValid = nameInput.value.trim().length > 1;
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      const isMessageValid = messageInput.value.trim().length > 5;

      validateField(nameInput, isNameValid);
      validateField(emailInput, isEmailValid);
      validateField(messageInput, isMessageValid);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Focus first invalid input
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else messageInput.focus();
        return;
      }

      // Show loading spinner
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Realistic brief delivery simulation
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        projectForm.hidden = true;
        formSuccess.hidden = false;
        showToast('Brief successfully received. We will respond within 24 hours.');
      }, 750);
    });

    if (btnResetForm) {
      btnResetForm.addEventListener('click', () => {
        projectForm.reset();
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        formSuccess.hidden = true;
        projectForm.hidden = false;
      });
    }
  }

  // --- 7. CLICK-TO-COPY EMAIL WITH TOAST FEEDBACK ---
  const btnCopyEmail = document.getElementById('btn-copy-email');
  const copyStatus = document.getElementById('copy-status');

  if (btnCopyEmail && copyStatus) {
    btnCopyEmail.addEventListener('click', async () => {
      const email = btnCopyEmail.getAttribute('data-email') || 'julkarnine.arabi@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyStatus.textContent = 'Copied!';
        showToast(`Copied to clipboard: ${email}`);
        setTimeout(() => {
          copyStatus.textContent = 'Copy';
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyStatus.textContent = 'Copied!';
        showToast(`Copied to clipboard: ${email}`);
        setTimeout(() => {
          copyStatus.textContent = 'Copy';
        }, 2500);
      }
    });
  }

  // Toast Notification Helper
  function showToast(message) {
    const container = document.getElementById('toast');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
