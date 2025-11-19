/**
 * Three.js Interactive 3D Background Scene
 * Enhanced particle system with literary aesthetics and technical depth
 */

/**
 * Three.js Liquid Gradient Background
 * A smooth, premium shader-based background that resembles flowing ink or aurora.
 */

; (function () {
  "use strict"

  // ===== Shaders =====
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec2 uMouse;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Correct aspect ratio for ripple calculation
      float aspect = 1.0; // We'll assume square for simplicity or pass uniform later if needed, 
                          // but for a background noise, slight stretch is acceptable.
                          // To make it better, let's use a simple distance check.
      
      // Mouse interaction - Ripple Effect
      float dist = distance(uv, uMouse);
      float rippleStrength = 0.3; // Significantly increased strength
      
      // Create a localized wave/ripple distortion with wider reach
      // We use a sine wave that decays slower with distance
      float ripple = sin(dist * 15.0 - uTime * 3.0) * exp(-dist * 3.0) * rippleStrength;
      
      // Apply stronger ripple to UVs for distortion
      vec2 distortedUv = uv + ripple * (uv - uMouse) * 2.0;
      
      // Faster movement for better visibility
      float time = uTime * 0.4;
      
      // Create flowing noise layers using distorted UVs
      // The distortion now heavily impacts the noise patterns (color blocks)
      float n1 = snoise(distortedUv * 1.2 + vec2(time * 0.1, time * 0.15));
      float n2 = snoise(distortedUv * 2.0 - vec2(time * 0.2, time * 0.1));
      float n3 = snoise(distortedUv * 3.0 + vec2(n1, n2) * 0.4 + vec2(time * 0.05));
      
      // Mix colors based on noise with sharper transitions
      float mix1 = smoothstep(-0.6, 0.6, n1);
      float mix2 = smoothstep(-0.6, 0.6, n2);
      float mix3 = smoothstep(-0.6, 0.6, n3);
      
      vec3 color = mix(uColor1, uColor2, mix1);
      color = mix(color, uColor3, mix2 * 0.6 + mix3 * 0.2);
      
      // Add subtle grain/texture
      float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      color += grain * 0.03;
      
      // Highlight the ripple peaks
      color += vec3(0.15) * ripple * 3.0;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  // ===== Three.js Scene Setup =====
  const ThreeScene = {
    scene: null,
    camera: null,
    renderer: null,
    material: null,
    clock: new THREE.Clock(),
    mouse: new THREE.Vector2(0.5, 0.5),
    targetMouse: new THREE.Vector2(0.5, 0.5),

    init() {
      const canvas = document.getElementById("bg-canvas")
      if (!canvas || typeof THREE === "undefined") {
        console.warn("Three.js not available or canvas not found")
        return
      }

      this.setupScene(canvas)
      this.createPlane()
      this.setupEventListeners()
      this.animate()
    },

    setupScene(canvas) {
      this.scene = new THREE.Scene()
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false // Not needed for shader plane
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    },

    getThemeColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark"

      if (isDark) {
        return {
          color1: new THREE.Color(0x1a1a1a), // Dark bg
          color2: new THREE.Color(0x2d3436), // Dark gray
          color3: new THREE.Color(0x4a5563)  // Blue gray accent
        }
      } else {
        return {
          color1: new THREE.Color(0xfaf9f7), // Light bg
          color2: new THREE.Color(0xe8e6e3), // Warm gray
          color3: new THREE.Color(0xd4af37)  // Gold accent (subtle)
        }
      }
    },

    createPlane() {
      const geometry = new THREE.PlaneGeometry(2, 2)
      const colors = this.getThemeColors()

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: colors.color1 },
          uColor2: { value: colors.color2 },
          uColor3: { value: colors.color3 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) }
        }
      })

      const plane = new THREE.Mesh(geometry, this.material)
      this.scene.add(plane)
    },

    setupEventListeners() {
      document.addEventListener("mousemove", (e) => {
        this.targetMouse.x = e.clientX / window.innerWidth
        this.targetMouse.y = 1.0 - (e.clientY / window.innerHeight)
      })

      window.addEventListener("resize", () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      })

      // Theme change observer
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-theme") {
            this.updateColors()
          }
        })
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
      })
    },

    updateColors() {
      if (!this.material) return

      const colors = this.getThemeColors()

      // Smoothly transition colors using GSAP if available, otherwise instant
      if (window.gsap) {
        gsap.to(this.material.uniforms.uColor1.value, {
          r: colors.color1.r, g: colors.color1.g, b: colors.color1.b, duration: 1
        })
        gsap.to(this.material.uniforms.uColor2.value, {
          r: colors.color2.r, g: colors.color2.g, b: colors.color2.b, duration: 1
        })
        gsap.to(this.material.uniforms.uColor3.value, {
          r: colors.color3.r, g: colors.color3.g, b: colors.color3.b, duration: 1
        })
      } else {
        this.material.uniforms.uColor1.value.copy(colors.color1)
        this.material.uniforms.uColor2.value.copy(colors.color2)
        this.material.uniforms.uColor3.value.copy(colors.color3)
      }
    },

    animate() {
      requestAnimationFrame(() => this.animate())

      const time = this.clock.getElapsedTime()

      // Smooth mouse interpolation
      this.mouse.lerp(this.targetMouse, 0.05)

      if (this.material) {
        this.material.uniforms.uTime.value = time
        this.material.uniforms.uMouse.value.copy(this.mouse)
      }

      this.renderer.render(this.scene, this.camera)
    }
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ThreeScene.init())
  } else {
    ThreeScene.init()
  }

  window.ThreeScene = ThreeScene
})()
