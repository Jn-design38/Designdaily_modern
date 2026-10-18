/**
 * Design Daily — Main JavaScript Engine (Dark Glass Studio Edition)
 * Integrates React Bits Pro modules, GSAP, Three.js 3D Mark, Pipeline, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. GLOBAL HEADER & NAVIGATION ---
  const siteHeader = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const siteNav = document.getElementById('site-nav');

  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (mobileToggle && siteNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav on click of link
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. REACT BITS: AMBIENT LIGHT RAYS ---
  const lightRaysCanvas = document.getElementById('light-rays-canvas');
  if (lightRaysCanvas && typeof LightRays !== 'undefined') {
    new LightRays(lightRaysCanvas, {
      rayCount: 8,
      baseColor: 'rgba(255, 76, 66, 0.05)',
      highlightColor: 'rgba(255, 179, 138, 0.07)'
    });
  }

  // --- 3. REACT BITS: SPOTLIGHT CARDS & TILTED CARDS ---
  if (typeof SpotlightCard !== 'undefined') {
    SpotlightCard.initAll('.spotlight-card');
  }

  if (typeof TiltedCard !== 'undefined') {
    TiltedCard.initAll('.tilted-card');
  }

  // --- 4. REACT BITS: DECRYPTED TEXT TELEMETRY ---
  if (typeof DecryptedText !== 'undefined') {
    const decryptElements = document.querySelectorAll('[data-decrypt="true"]');
    decryptElements.forEach(el => new DecryptedText(el, { speed: 35, triggerOnView: true }));
  }

  // --- 5. REACT BITS: SCROLLFLOAT KINETIC TYPOGRAPHY ---
  if (typeof ScrollFloat !== 'undefined') {
    const floatHeadings = document.querySelectorAll('.scroll-float');
    floatHeadings.forEach(heading => {
      new ScrollFloat(heading, {
        effect: 'float',
        splitBy: 'chars',
        direction: 'up',
        ease: 'back.inOut(2)',
        distance: 60,
        stretch: 1.6,
        stagger: 0.02,
        scrollStart: 'top 88%',
        scrollEnd: 'top 50%'
      });
    });

    // Animate spatial cards if present
    const spatialCards = document.querySelectorAll('.service-spatial-card');
    spatialCards.forEach(card => {
      ScrollFloat.animateCard(card, {
        distance: 80,
        stretch: 1.12,
        ease: 'back.out(1.8)'
      });
    });
  }

  // --- 6. INTERACTIVE 7-STAGE DESIGN PIPELINE ---
  const pipelineContainer = document.getElementById('design-pipeline-container');
  if (pipelineContainer && typeof DesignPipeline !== 'undefined') {
    new DesignPipeline(pipelineContainer, { autoPlay: true });
  }

  // --- 7. THREE.JS 3D STUDIO MARK (PROGRESSIVE ENHANCEMENT) ---
  const heroCanvas = document.getElementById('hero-3d-canvas');
  if (heroCanvas && typeof THREE !== 'undefined') {
    let renderer, scene, camera, modelGroup;
    let isVisible = true;
    let targetRotationY = 0;
    let currentRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const initHero3D = () => {
      const container = heroCanvas.parentElement;
      const width = container ? container.clientWidth : 280;
      const height = container ? container.clientHeight : 280;

      renderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      modelGroup = new THREE.Group();
      scene.add(modelGroup);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(6, 8, 7);
      scene.add(keyLight);

      const coralRim = new THREE.DirectionalLight(0xff4c42, 3.2);
      coralRim.position.set(-6, -4, -6);
      scene.add(coralRim);

      // Load 3D GLB
      if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        loader.load(
          'assets/agency-logo-3d.glb',
          (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetScale = 4.2 / (maxDim || 1);

            model.position.x = -center.x * targetScale;
            model.position.y = -center.y * targetScale;
            model.position.z = -center.z * targetScale;
            model.scale.set(targetScale, targetScale, targetScale);

            modelGroup.add(model);
          },
          undefined,
          (err) => console.log('3D GLB fallback to SVG icon')
        );
      }

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      });

      const animate = () => {
        requestAnimationFrame(animate);
        if (!isVisible || !renderer || !scene || !camera) return;

        targetRotationY += 0.01;
        currentRotationY += (targetRotationY - currentRotationY) * 0.08;

        if (modelGroup) {
          modelGroup.rotation.y = currentRotationY + mouseX;
          modelGroup.rotation.x = mouseY;
        }

        renderer.render(scene, camera);
      };
      animate();
    };

    initHero3D();
  }

  // --- 8. WORK PAGE CATEGORY FILTER TABS ---
  const filterChips = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.work-project-card');

  if (filterChips.length > 0 && projectCards.length > 0) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const category = chip.getAttribute('data-filter');
        projectCards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 9. CONTACT / ORDER FORM VALIDATION & CONFIRMATION ---
  const contactForm = document.getElementById('project-brief-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const messageInput = document.getElementById('client-overview');
      const successBanner = document.getElementById('form-success');

      // Simple validation
      [nameInput, emailInput, messageInput].forEach(input => {
        if (!input) return;
        const errorMsg = input.parentElement.querySelector('.form-error-msg');
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          if (errorMsg) errorMsg.classList.add('visible');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          if (errorMsg) errorMsg.classList.remove('visible');
        }
      });

      if (emailInput && emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        const errorMsg = emailInput.parentElement.querySelector('.form-error-msg');
        if (errorMsg) errorMsg.classList.add('visible');
        isValid = false;
      }

      if (isValid) {
        if (successBanner) {
          successBanner.classList.add('visible');
          contactForm.reset();
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
});
