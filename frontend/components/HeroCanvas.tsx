'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 8

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x6356f5, 15, 30)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x7b6cf7, 10, 30)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // Objects
    // 1. Icosahedron (wireframe, geometric)
    const icosahedronGeo = new THREE.IcosahedronGeometry(2, 0)
    const icosahedronMat = new THREE.MeshPhongMaterial({
      color: 0x6356f5,
      emissive: 0x1a1552,
      wireframe: true,
      flatShading: true,
    })
    const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat)
    icosahedron.position.set(0, 0, 0)
    scene.add(icosahedron)

    // 2. Torus (outer ring)
    const torusGeo = new THREE.TorusGeometry(3.5, 0.15, 16, 100)
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0x7b6cf7,
      emissive: 0x0C0C0E,
      wireframe: true,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(0, 0, -1)
    torus.rotation.x = Math.PI / 2
    scene.add(torus)

    // 3. Octahedron (floating diamond)
    const octahedronGeo = new THREE.OctahedronGeometry(0.8, 0)
    const octahedronMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      flatShading: true,
    })
    const octahedron = new THREE.Mesh(octahedronGeo, octahedronMat)
    octahedron.position.set(-4, 2.5, 1)
    scene.add(octahedron)

    // 4. Small details - Floating spheres
    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16)
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x6356f5 })
    const spheres: THREE.Mesh[] = []
    for (let i = 0; i < 15; i++) {
      const s = new THREE.Mesh(sphereGeo, sphereMat)
      s.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      )
      scene.add(s)
      spheres.push(s)
    }

    // Particles (stars)
    const particlesCount = 200
    const positions = new Float32Array(particlesCount * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 15
      positions[i + 2] = (Math.random() - 0.5) * 10
    }
    const particlesGeo = new THREE.BufferGeometry()
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    // Mouse movement interaction
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100
      mouseY = (event.clientY - window.innerHeight / 2) / 100
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    let clock = new THREE.Clock()
    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Rotate objects
      icosahedron.rotation.x = elapsedTime * 0.1
      icosahedron.rotation.y = elapsedTime * 0.15

      torus.rotation.z = elapsedTime * 0.05
      torus.rotation.x = Math.PI / 2 + Math.sin(elapsedTime * 0.2) * 0.2

      octahedron.rotation.x = -elapsedTime * 0.2
      octahedron.rotation.y = elapsedTime * 0.3
      // Octahedron floating
      octahedron.position.y = 2.5 + Math.sin(elapsedTime * 0.5) * 0.4

      // Spheres floating
      spheres.forEach((s, idx) => {
        s.position.y += Math.sin(elapsedTime + idx) * 0.005
      })

      // Parallax camera movement
      targetX = mouseX * 0.3
      targetY = -mouseY * 0.3
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  )
}
