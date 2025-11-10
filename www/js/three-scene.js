/**
 * Three.js Interactive 3D Background Scene
 * Creates an elegant particle system with mouse interaction
 */

(function() {
  'use strict';

  // ===== Three.js Scene Setup =====
  const ThreeScene = {
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    mouseX: 0,
    mouseY: 0,
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,

    init() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas || typeof THREE === 'undefined') {
        console.warn('Three.js not available or canvas not found');
        return;
      }

      this.setupScene(canvas);
      this.createParticles();
      this.setupLights();
      this.setupEventListeners();
      this.animate();
    },

    setupScene(canvas) {
      // Scene
      this.scene = new THREE.Scene();

      // Camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 30;

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },

    createParticles() {
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Get theme colors
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const primaryColor = isDark ? new THREE.Color(0x8a96a3) : new THREE.Color(0x6b7785);
      const secondaryColor = isDark ? new THREE.Color(0xb5a598) : new THREE.Color(0x9c8b7a);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;

        // Color - alternate between primary and secondary
        const color = i % 2 === 0 ? primaryColor : secondaryColor;
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);
    },

    setupLights() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(10, 10, 10);
      this.scene.add(pointLight);
    },

    setupEventListeners() {
      // Mouse move
      document.addEventListener('mousemove', (e) => {
        this.mouseX = (e.clientX - this.windowHalfX) / 100;
        this.mouseY = (e.clientY - this.windowHalfY) / 100;
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Theme change - update particle colors
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            this.updateParticleColors();
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    },

    updateParticleColors() {
      if (!this.particles) return;

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const primaryColor = isDark ? new THREE.Color(0x8a96a3) : new THREE.Color(0x6b7785);
      const secondaryColor = isDark ? new THREE.Color(0xb5a598) : new THREE.Color(0x9c8b7a);

      const colors = this.particles.geometry.attributes.color.array;
      const particleCount = colors.length / 3;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const color = i % 2 === 0 ? primaryColor : secondaryColor;
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      this.particles.geometry.attributes.color.needsUpdate = true;
    },

    animate() {
      requestAnimationFrame(() => this.animate());

      // Rotate particles
      if (this.particles) {
        this.particles.rotation.x += 0.0005;
        this.particles.rotation.y += 0.0005;

        // Mouse interaction
        this.particles.rotation.x += this.mouseY * 0.00005;
        this.particles.rotation.y += this.mouseX * 0.00005;
      }

      // Gentle camera movement based on scroll
      const scrollY = window.pageYOffset;
      if (this.camera) {
        this.camera.position.y = scrollY * 0.002;
      }

      this.renderer.render(this.scene, this.camera);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThreeScene.init());
  } else {
    ThreeScene.init();
  }

  // Export for external access
  window.ThreeScene = ThreeScene;
})();
