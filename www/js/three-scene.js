/**
 * Three.js Interactive 3D Background Scene
 * Enhanced particle system with literary aesthetics and technical depth
 */

;(function () {
  "use strict"

  // ===== Three.js Scene Setup =====
  const ThreeScene = {
    scene: null,
    camera: null,
    renderer: null,
    particleGroups: [],
    connections: null,
    connectionPairs: [],
    mouseX: 0,
    mouseY: 0,
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    clock: new THREE.Clock(),

    init() {
      const canvas = document.getElementById("bg-canvas")
      if (!canvas || typeof THREE === "undefined") {
        console.warn("Three.js not available or canvas not found")
        return
      }

      this.setupScene(canvas)
      this.createHandDrawnElements()
      this.createParticleConnections()
      this.setupLights()
      this.setupEventListeners()
      this.animate()
    },

    setupScene(canvas) {
      // Scene
      this.scene = new THREE.Scene()

      // Camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.camera.position.z = 40

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    },

    createHandDrawnElements() {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark"
      const isMobile = window.innerWidth < 768

      // Reduced element count for lighter composition
      const elementCount = isMobile ? 28 : 70

      const colors = isDark
        ? [
            new THREE.Color(0x6b6b83),
            new THREE.Color(0xa28c75),
            new THREE.Color(0xe2c290),
            new THREE.Color(0x8f8a9e)
          ]
        : [
            new THREE.Color(0x7b8c8f),
            new THREE.Color(0xc0a07a),
            new THREE.Color(0xf2d6a2),
            new THREE.Color(0x9da7b2)
          ]

      const group = new THREE.Group()
      group.userData.elements = []

      for (let i = 0; i < elementCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)].clone()
        const texture = this.createHandDrawnTexture(color)

        const materialConfig = {
          color,
          transparent: true,
          depthWrite: false,
          opacity: 0.9
        }
        if (texture) {
          materialConfig.map = texture
        }

        const material = new THREE.SpriteMaterial(materialConfig)

        const sprite = new THREE.Sprite(material)
        sprite.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 40
        )

        const baseScale = isMobile ? 2.2 : 3.2
        const scaleVariance = Math.random() * 1.6
        sprite.scale.setScalar(baseScale + scaleVariance)

        sprite.userData = {
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.07,
            (Math.random() - 0.5) * 0.07,
            (Math.random() - 0.5) * 0.04
          ),
          wobbleSpeed: 0.5 + Math.random() * 0.6,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleBase: sprite.position.z
        }

        group.add(sprite)
        group.userData.elements.push(sprite)
      }

      this.scene.add(group)
      this.particleGroups.push(group)
    },

    createParticleConnections() {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark"
      const connectionColor = isDark ? 0x6b7785 : 0x9c8b7a

      // Create lines connecting nearby particles for technical feel
      const lineMaterial = new THREE.LineBasicMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      })

      const lineGeometry = new THREE.BufferGeometry()
      const connectionPairs = []
      this.connectionPairs = []

      if (this.particleGroups[0]) {
        const sprites = this.particleGroups[0].userData.elements || []
        const maxConnections = 30
        const maxDistance = 28

        for (let i = 0; i < sprites.length; i++) {
          const spriteA = sprites[i]

          for (let j = i + 1; j < sprites.length; j++) {
            const spriteB = sprites[j]
            const distance = spriteA.position.distanceTo(spriteB.position)

            if (distance < maxDistance && connectionPairs.length < maxConnections) {
              connectionPairs.push([spriteA, spriteB])
            }
          }
        }
      }

      if (connectionPairs.length > 0) {
        const linePositions = new Float32Array(connectionPairs.length * 6)
        lineGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(linePositions, 3)
        )
        this.connections = new THREE.LineSegments(lineGeometry, lineMaterial)
        this.connectionPairs = connectionPairs
        this.scene.add(this.connections)
      }
    },

    createHandDrawnTexture(color) {
      const size = 128
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      ctx.clearRect(0, 0, size, size)

      const center = size / 2
      const baseRadius = size * 0.32 + (Math.random() - 0.5) * 8

      ctx.strokeStyle = `#${color.getHexString()}`
      ctx.lineWidth = 3 + Math.random() * 1.5
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.globalAlpha = 0.85

      ctx.beginPath()
      const segments = 9
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const wobble = Math.sin(angle * 3 + Math.random() * 2) * 6
        const radius = baseRadius + wobble
        const x = center + Math.cos(angle) * radius
        const y = center + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()

      ctx.globalAlpha = 0.2
      ctx.lineWidth = 1.2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const offset = (Math.random() - 0.5) * baseRadius
        ctx.moveTo(center - baseRadius + offset, center - baseRadius)
        ctx.lineTo(center + baseRadius + offset, center + baseRadius)
        ctx.stroke()
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = false
      texture.needsUpdate = true

      return texture
    },

    setupLights() {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark"

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.3 : 0.4)
      this.scene.add(ambientLight)

      // Warm point light for literary feel
      const warmLight = new THREE.PointLight(0xffd4a3, isDark ? 0.5 : 0.3)
      warmLight.position.set(20, 20, 20)
      this.scene.add(warmLight)

      // Secondary cool light for depth
      const coolLight = new THREE.PointLight(0x9cb4cc, isDark ? 0.3 : 0.2)
      coolLight.position.set(-20, -20, 15)
      this.scene.add(coolLight)
    },

    setupEventListeners() {
      // Smooth mouse tracking
      document.addEventListener("mousemove", (e) => {
        this.mouseX = (e.clientX - this.windowHalfX) / 150
        this.mouseY = (e.clientY - this.windowHalfY) / 150
      })

      // Window resize
      window.addEventListener("resize", () => {
        this.windowHalfX = window.innerWidth / 2
        this.windowHalfY = window.innerHeight / 2

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
      })

      // Theme change - recreate scene with new colors
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-theme") {
            this.recreateScene()
          }
        })
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
      })
    },

    recreateScene() {
      // Remove old particles
      this.particleGroups.forEach((group) => {
        group.userData.elements.forEach((sprite) => {
          if (sprite.material.map) sprite.material.map.dispose()
          sprite.material.dispose()
        })
        this.scene.remove(group)
      })
      this.particleGroups = []

      // Remove old connections
      if (this.connections) {
        this.scene.remove(this.connections)
        this.connections.geometry.dispose()
        this.connections.material.dispose()
        this.connections = null
      }
      this.connectionPairs = []

      // Recreate with new theme colors
      this.createHandDrawnElements()
      this.createParticleConnections()
    },

    animate() {
      requestAnimationFrame(() => this.animate())

      const time = this.clock.getElapsedTime()

      // Animate each particle group with unique motion
      this.particleGroups.forEach((group, index) => {
        group.userData.elements.forEach((sprite) => {
          const velocity = sprite.userData.velocity
          sprite.position.x += velocity.x
          sprite.position.y += velocity.y
          sprite.userData.wobbleBase += velocity.z

          const wobble = Math.sin(
            time * sprite.userData.wobbleSpeed + sprite.userData.wobbleOffset
          )
          sprite.position.z = sprite.userData.wobbleBase + wobble * 1.6

          // Boundary check with smooth rebound
          if (Math.abs(sprite.position.x) > 55) velocity.x *= -1
          if (Math.abs(sprite.position.y) > 55) velocity.y *= -1
          if (Math.abs(sprite.userData.wobbleBase) > 25) velocity.z *= -1
        })

        // Gentle rotation and mouse parallax for depth
        group.rotation.z = Math.sin(time * 0.08 + index) * 0.05
        group.rotation.x = this.mouseY * 0.0006
        group.rotation.y = this.mouseX * 0.0006
      })

      // Gently rotate connection lines
      if (this.connections) {
        const positions = this.connections.geometry.attributes.position.array
        this.connectionPairs.forEach((pair, index) => {
          const [spriteA, spriteB] = pair
          const i6 = index * 6
          positions[i6] = spriteA.position.x
          positions[i6 + 1] = spriteA.position.y
          positions[i6 + 2] = spriteA.position.z
          positions[i6 + 3] = spriteB.position.x
          positions[i6 + 4] = spriteB.position.y
          positions[i6 + 5] = spriteB.position.z
        })
        this.connections.geometry.attributes.position.needsUpdate = true
        this.connections.material.opacity = 0.08 + Math.sin(time * 0.4) * 0.03
      }

      // Camera movement based on scroll with parallax
      const scrollY = window.pageYOffset
      this.camera.position.y = Math.sin(scrollY * 0.001) * 3
      this.camera.position.x = Math.cos(scrollY * 0.0008) * 2

      // Subtle camera breathing
      this.camera.position.z = 40 + Math.sin(time * 0.2) * 2

      this.renderer.render(this.scene, this.camera)
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ThreeScene.init())
  } else {
    ThreeScene.init()
  }

  // Export for external access
  window.ThreeScene = ThreeScene
})()
