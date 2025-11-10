/**
 * Enhanced JavaScript for Pick Quote Landing Page
 * Integrates Three.js and GSAP for advanced interactions
 */

(function() {
  'use strict';

  // ===== Three.js Scene Setup =====
  const ThreeJsScene = {
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },

    init() {
      const canvas = document.getElementById('three-canvas');
      if (!canvas) return;

      // Scene setup
      this.scene = new THREE.Scene();

      // Camera setup
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 50;

      // Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create particle system
      this.createParticles();

      // Add ambient lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      // Event listeners
      window.addEventListener('resize', () => this.onResize());
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));

      // Start animation
      this.animate();
    },

    createParticles() {
      const particleCount = 800;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Color palette based on theme
      const color1 = new THREE.Color(0x6b7785); // Primary color
      const color2 = new THREE.Color(0x9c8b7a); // Secondary color

      for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        // Color (mix between two theme colors)
        const mixColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    },

    onMouseMove(event) {
      this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },

    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    animate() {
      requestAnimationFrame(() => this.animate());

      // Smooth mouse following
      this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
      this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

      // Rotate particles
      if (this.particles) {
        this.particles.rotation.y += 0.001;
        this.particles.rotation.x = this.mouse.y * 0.3;
        this.particles.rotation.y += this.mouse.x * 0.005;
      }

      // Update particle positions for wave effect
      const positions = this.particles.geometry.attributes.position.array;
      const time = Date.now() * 0.001;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = Math.sin(x * 0.1 + time) * 2 + Math.cos(y * 0.1 + time) * 2;
      }

      this.particles.geometry.attributes.position.needsUpdate = true;

      this.renderer.render(this.scene, this.camera);
    }
  };

  // ===== GSAP Animations =====
  const GSAPAnimations = {
    init() {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger);

      // Hero section animations
      this.animateHero();

      // Features section animations
      this.animateFeatures();

      // Steps section animations
      this.animateSteps();

      // Download section animations
      this.animateDownload();

      // Floating cards animations
      this.animateFloatingCards();

      // Navbar animations
      this.animateNavbar();
    },

    animateHero() {
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

      timeline
        .from('.hero-brand-icon', {
          y: -100,
          opacity: 0,
          duration: 1,
          ease: 'bounce.out'
        })
        .from('.hero-title', {
          y: 50,
          opacity: 0,
          duration: 0.8
        }, '-=0.5')
        .from('.hero-subtitle', {
          y: 30,
          opacity: 0,
          duration: 0.8
        }, '-=0.5')
        .from('.hero-actions .btn', {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2
        }, '-=0.4')
        .from('.hero-stats .stat-item', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15
        }, '-=0.4');

      // Parallax effect on hero
      gsap.to('.hero-bg', {
        y: 300,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    },

    animateFeatures() {
      const featureCards = gsap.utils.toArray('.feature-card');

      featureCards.forEach((card, index) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
          }
        });

        // Hover animation
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -15,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Section title animation
      gsap.from('.features .section-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.features',
          start: 'top 80%'
        }
      });
    },

    animateSteps() {
      const stepItems = gsap.utils.toArray('.step-item');

      stepItems.forEach((step, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });

        timeline
          .from(step.querySelector('.step-number'), {
            scale: 0,
            rotation: 360,
            duration: 0.6,
            ease: 'back.out(1.7)'
          })
          .from(step.querySelector('.step-content'), {
            x: -50,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
          }, '-=0.3');
      });
    },

    animateDownload() {
      gsap.from('.download-card', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.download',
          start: 'top 70%'
        }
      });

      // Extension preview animation
      gsap.from('.extension-preview', {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.download',
          start: 'top 70%'
        }
      });
    },

    animateFloatingCards() {
      const cards = gsap.utils.toArray('.floating-card');

      cards.forEach((card, index) => {
        // Enhanced floating animation with GSAP
        gsap.to(card, {
          y: '-=30',
          duration: 2 + index * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.3
        });

        // Rotation animation
        gsap.to(card, {
          rotation: index % 2 === 0 ? 5 : -5,
          duration: 3 + index * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });

        // Mouse parallax effect
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            x: x * 0.1,
            y: y * 0.1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      });
    },

    animateNavbar() {
      // Navbar scroll animation
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'navbar-scrolled', targets: '.navbar' }
      });

      // Nav links hover animation
      const navLinks = gsap.utils.toArray('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        link.addEventListener('mouseleave', () => {
          gsap.to(link, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });
    }
  };

  // ===== Button Interactions =====
  const ButtonInteractions = {
    init() {
      const buttons = gsap.utils.toArray('.btn');

      buttons.forEach(btn => {
        // Enhanced hover effect
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        });

        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'elastic.out(1, 0.5)'
          });
        });

        // Click animation
        btn.addEventListener('click', (e) => {
          // Create ripple effect
          const ripple = document.createElement('span');
          ripple.style.position = 'absolute';
          ripple.style.borderRadius = '50%';
          ripple.style.background = 'rgba(255, 255, 255, 0.6)';
          ripple.style.width = '0';
          ripple.style.height = '0';
          ripple.style.pointerEvents = 'none';

          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.left = x + 'px';
          ripple.style.top = y + 'px';

          btn.style.position = 'relative';
          btn.style.overflow = 'hidden';
          btn.appendChild(ripple);

          gsap.to(ripple, {
            width: size,
            height: size,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          });
        });
      });
    }
  };

  // ===== Smooth Page Transitions =====
  const PageTransitions = {
    init() {
      // Fade in page on load
      gsap.from('body', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Smooth scroll to sections
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));

          if (target) {
            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: target,
                offsetY: 70
              },
              ease: 'power3.inOut'
            });
          }
        });
      });
    }
  };

  // ===== Cursor Effect =====
  const CursorEffect = {
    cursor: null,
    cursorFollower: null,

    init() {
      // Only on desktop
      if (window.innerWidth < 768) return;

      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursor.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--primary-color);
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.15s ease;
      `;
      document.body.appendChild(this.cursor);

      this.cursorFollower = document.createElement('div');
      this.cursorFollower.className = 'custom-cursor-follower';
      this.cursorFollower.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
        pointer-events: none;
        z-index: 9998;
        mix-blend-mode: difference;
        transition: transform 0.2s ease;
      `;
      document.body.appendChild(this.cursorFollower);

      window.addEventListener('mousemove', (e) => {
        gsap.to(this.cursor, {
          x: e.clientX - 5,
          y: e.clientY - 5,
          duration: 0.1
        });

        gsap.to(this.cursorFollower, {
          x: e.clientX - 15,
          y: e.clientY - 15,
          duration: 0.3
        });
      });

      // Expand cursor on hover over interactive elements
      const interactiveElements = document.querySelectorAll('a, button, .btn, .feature-card');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(this.cursor, { scale: 2, duration: 0.3 });
          gsap.to(this.cursorFollower, { scale: 1.5, duration: 0.3 });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(this.cursor, { scale: 1, duration: 0.3 });
          gsap.to(this.cursorFollower, { scale: 1, duration: 0.3 });
        });
      });
    }
  };

  // ===== Theme Management (Enhanced) =====
  const ThemeManager = {
    init() {
      this.root = document.documentElement;
      this.storageKey = 'pickquote-theme';
      this.loadTheme();

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.storageKey)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    },

    getPreferredTheme() {
      const savedTheme = localStorage.getItem(this.storageKey);
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    setTheme(theme, saveToStorage = false) {
      this.root.setAttribute('data-theme', theme);
      if (saveToStorage) {
        localStorage.setItem(this.storageKey, theme);
      }

      // Update Three.js scene based on theme
      if (ThreeJsScene.particles) {
        const opacity = theme === 'dark' ? 0.4 : 0.6;
        gsap.to(ThreeJsScene.particles.material, {
          opacity: opacity,
          duration: 0.5
        });
      }
    },

    loadTheme() {
      const theme = this.getPreferredTheme();
      const hasUserPreference = localStorage.getItem(this.storageKey);
      this.setTheme(theme, hasUserPreference);
    }
  };

  // ===== Performance Monitor =====
  const PerformanceMonitor = {
    init() {
      // Reduce animations on low-performance devices
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        console.log('Low performance device detected, reducing animations');
        // Reduce particle count
        if (ThreeJsScene.particles) {
          ThreeJsScene.particles.material.opacity *= 0.5;
        }
      }

      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          console.log(`Page load time: ${loadTime}ms`);
        }
      });
    }
  };

  // ===== Initialize All Enhanced Features =====
  const init = () => {
    try {
      console.log('Initializing enhanced Pick Quote landing page...');

      // Core features
      ThemeManager.init();

      // Three.js scene
      ThreeJsScene.init();

      // GSAP animations
      GSAPAnimations.init();

      // Enhanced interactions
      ButtonInteractions.init();
      PageTransitions.init();
      CursorEffect.init();

      // Performance monitoring
      PerformanceMonitor.init();

      // Update current year
      const yearElement = document.getElementById('currentYear');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }

      console.log('Enhanced features initialized successfully!');
    } catch (error) {
      console.error('Error initializing enhanced features:', error);
    }
  };

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  if (typeof window !== 'undefined') {
    window.PickQuoteEnhanced = {
      ThreeJsScene,
      GSAPAnimations,
      ThemeManager
    };
  }
})();
