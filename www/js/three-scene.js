/**
 * Three.js Interactive 3D Background Scene
 * Enhanced particle system with literary aesthetics and technical depth
 */

(function() {
  'use strict';

  // ===== Three.js Scene Setup =====
  const ThreeScene = {
    scene: null,
    camera: null,
    renderer: null,
    particleGroups: [],
    connections: null,
    mouseX: 0,
    mouseY: 0,
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    clock: new THREE.Clock(),

    init() {
      const canvas = document.getElementById('bg-canvas');
      if (!canvas || typeof THREE === 'undefined') {
        console.warn('Three.js not available or canvas not found');
        return;
      }

      this.setupScene(canvas);
      this.createEnhancedParticles();
      this.createParticleConnections();
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
      this.camera.position.z = 40;

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    },

    createEnhancedParticles() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const isMobile = window.innerWidth < 768;

      // Performance-based particle count
      const baseCount = isMobile ? 300 : 800;

      // Color palette - literary warm tones with golden accents
      const colors = isDark ? [
        new THREE.Color(0x8a96a3), // Blue-gray
        new THREE.Color(0xb5a598), // Warm gray
        new THREE.Color(0xd4af37), // Golden
        new THREE.Color(0x9c8b7a), // Brown-gray
        new THREE.Color(0x7d6f61)  // Dark brown
      ] : [
        new THREE.Color(0x6b7785), // Primary blue-gray
        new THREE.Color(0x9c8b7a), // Secondary brown-gray
        new THREE.Color(0xc9a961), // Softer gold
        new THREE.Color(0x8a96a3), // Light blue-gray
        new THREE.Color(0xb5a598)  // Light warm gray
      ];

      // Create multiple layers for depth
      const layers = [
        { count: Math.floor(baseCount * 0.5), size: 1.5, depth: 60, opacity: 0.7 },
        { count: Math.floor(baseCount * 0.3), size: 2.5, depth: 40, opacity: 0.5 },
        { count: Math.floor(baseCount * 0.2), size: 3.5, depth: 25, opacity: 0.3 }
      ];

      layers.forEach((layer, layerIndex) => {
        const positions = new Float32Array(layer.count * 3);
        const particleColors = new Float32Array(layer.count * 3);
        const sizes = new Float32Array(layer.count);
        const velocities = new Float32Array(layer.count * 3);

        for (let i = 0; i < layer.count; i++) {
          const i3 = i * 3;

          // Position with depth layering
          positions[i3] = (Math.random() - 0.5) * 120;
          positions[i3 + 1] = (Math.random() - 0.5) * 120;
          positions[i3 + 2] = (Math.random() - 0.5) * layer.depth;

          // Color variation
          const color = colors[Math.floor(Math.random() * colors.length)];
          particleColors[i3] = color.r;
          particleColors[i3 + 1] = color.g;
          particleColors[i3 + 2] = color.b;

          // Size variation
          sizes[i] = layer.size * (0.5 + Math.random() * 0.5);

          // Gentle floating velocities
          velocities[i3] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
          size: layer.size,
          vertexColors: true,
          transparent: true,
          opacity: layer.opacity,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
          depthWrite: false
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        particles.userData.layerIndex = layerIndex;
        this.scene.add(particles);
        this.particleGroups.push(particles);
      });
    },

    createParticleConnections() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const connectionColor = isDark ? 0x6b7785 : 0x9c8b7a;

      // Create lines connecting nearby particles for technical feel
      const lineMaterial = new THREE.LineBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });

      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = [];

      // Sample particles from first layer for connections
      if (this.particleGroups[0]) {
        const positions = this.particleGroups[0].geometry.attributes.position.array;
        const maxConnections = 50;
        const maxDistance = 25;

        for (let i = 0; i < Math.min(positions.length / 3, maxConnections); i += 3) {
          const x1 = positions[i * 3];
          const y1 = positions[i * 3 + 1];
          const z1 = positions[i * 3 + 2];

          for (let j = i + 1; j < Math.min(positions.length / 3, maxConnections); j += 3) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];

            const distance = Math.sqrt(
              Math.pow(x2 - x1, 2) +
              Math.pow(y2 - y1, 2) +
              Math.pow(z2 - z1, 2)
            );

            if (distance < maxDistance) {
              linePositions.push(x1, y1, z1);
              linePositions.push(x2, y2, z2);
            }
          }
        }
      }

      if (linePositions.length > 0) {
        lineGeometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(linePositions, 3)
        );
        this.connections = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.connections);
      }
    },

    setupLights() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.3 : 0.4);
      this.scene.add(ambientLight);

      // Warm point light for literary feel
      const warmLight = new THREE.PointLight(0xffd4a3, isDark ? 0.5 : 0.3);
      warmLight.position.set(20, 20, 20);
      this.scene.add(warmLight);

      // Secondary cool light for depth
      const coolLight = new THREE.PointLight(0x9cb4cc, isDark ? 0.3 : 0.2);
      coolLight.position.set(-20, -20, 15);
      this.scene.add(coolLight);
    },

    setupEventListeners() {
      // Smooth mouse tracking
      document.addEventListener('mousemove', (e) => {
        this.mouseX = (e.clientX - this.windowHalfX) / 150;
        this.mouseY = (e.clientY - this.windowHalfY) / 150;
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Theme change - recreate scene with new colors
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            this.recreateScene();
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    },

    recreateScene() {
      // Remove old particles
      this.particleGroups.forEach(group => {
        this.scene.remove(group);
        group.geometry.dispose();
        group.material.dispose();
      });
      this.particleGroups = [];

      // Remove old connections
      if (this.connections) {
        this.scene.remove(this.connections);
        this.connections.geometry.dispose();
        this.connections.material.dispose();
      }

      // Recreate with new theme colors
      this.createEnhancedParticles();
      this.createParticleConnections();
    },

    animate() {
      requestAnimationFrame(() => this.animate());

      const time = this.clock.getElapsedTime();

      // Animate each particle group with unique motion
      this.particleGroups.forEach((group, index) => {
        const positions = group.geometry.attributes.position.array;
        const velocities = group.userData.velocities;

        // Gentle floating animation
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Breathing effect - subtle size pulsing
          const breathe = Math.sin(time * 0.5 + i * 0.01) * 0.1 + 1;

          // Boundary check with smooth wrapping
          if (Math.abs(positions[i]) > 60) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 60) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 30) velocities[i + 2] *= -1;
        }

        group.geometry.attributes.position.needsUpdate = true;

        // Layer-based rotation for depth
        const rotationSpeed = 0.0002 * (1 + index * 0.5);
        group.rotation.x += rotationSpeed;
        group.rotation.y += rotationSpeed * 0.8;

        // Mouse interaction with dampening per layer
        const mouseFactor = 0.00003 * (1 - index * 0.3);
        group.rotation.x += this.mouseY * mouseFactor;
        group.rotation.y += this.mouseX * mouseFactor;
      });

      // Gently rotate connection lines
      if (this.connections) {
        this.connections.rotation.z += 0.0001;
        // Pulse opacity for breathing effect
        this.connections.material.opacity = 0.1 + Math.sin(time * 0.3) * 0.05;
      }

      // Camera movement based on scroll with parallax
      const scrollY = window.pageYOffset;
      this.camera.position.y = Math.sin(scrollY * 0.001) * 3;
      this.camera.position.x = Math.cos(scrollY * 0.0008) * 2;

      // Subtle camera breathing
      this.camera.position.z = 40 + Math.sin(time * 0.2) * 2;

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
