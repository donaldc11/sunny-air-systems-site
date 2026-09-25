import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const HEIGHT = (x: number, z: number) =>
  Math.sin(x * 0.32) * Math.cos(z * 0.27) * 1.6 +
  Math.sin(x * 0.11 + 2.1) * Math.cos(z * 0.14) * 2.6 +
  Math.sin((x + z) * 0.06) * 1.2

function glowTexture(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.35, outer)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

function Terrain() {
  const mesh = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(70, 70, 96, 96)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, HEIGHT(pos.getX(i), pos.getZ(i)))
    }
    g.computeVertexNormals()
    return g
  }, [])
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = -3.4 + Math.sin(state.clock.elapsedTime * 0.18) * 0.12
    }
  })
  return (
    <mesh ref={mesh} geometry={geo} position={[0, -3.4, 0]}>
      <meshBasicMaterial color="#f5a524" wireframe transparent opacity={0.14} />
    </mesh>
  )
}

function Embers({ count = 130 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const tex = useMemo(() => glowTexture('rgba(255,190,80,1)', 'rgba(245,140,30,0.55)'), [])
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 46
      positions[i * 3 + 1] = Math.random() * 16 - 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 34
      seeds[i * 2] = Math.random() * Math.PI * 2
      seeds[i * 2 + 1] = 0.35 + Math.random() * 0.85
    }
    return { positions, seeds }
  }, [count])
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const speed = seeds[i * 2 + 1]
      let y = pos.getY(i) + speed * 0.012
      if (y > 13) y = -4.5
      pos.setY(i, y)
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.7 + seeds[i * 2]) * 0.004)
    }
    pos.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.55} map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} color="#ffc766" sizeAttenuation />
    </points>
  )
}

function Drone() {
  const group = useRef<THREE.Group>(null)
  const trailRef = useRef<THREE.Line>(null)
  const tex = useMemo(() => glowTexture('rgba(255,220,150,1)', 'rgba(245,165,36,0.6)'), [])
  const trail = useMemo(() => new Float32Array(90 * 3), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.16
    const x = Math.sin(t) * 13
    const z = Math.cos(t * 0.8) * 9 - 2
    const y = HEIGHT(x, z) - 1.2 + Math.sin(t * 3.1) * 0.25
    if (group.current) {
      group.current.position.set(x, y, z)
      group.current.rotation.y = -t * 0.9
    }
    trail.copyWithin(0, 3)
    trail[87 * 3] = x; trail[87 * 3 + 1] = y; trail[87 * 3 + 2] = z
    if (trailRef.current) {
      const attr = trailRef.current.geometry.attributes.position as THREE.BufferAttribute
      attr.array.set(trail)
      attr.needsUpdate = true
    }
  })
  return (
    <>
      <group ref={group}>
        <sprite scale={[1.6, 1.6, 1]}>
          <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <mesh>
          <octahedronGeometry args={[0.22, 0]} />
          <meshBasicMaterial color="#ffe9c4" />
        </mesh>
      </group>
      <line ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trail, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#f5a524" transparent opacity={0.35} />
      </line>
    </>
  )
}

function Rig() {
  const target = useRef({ x: 0, y: 0 })
  useFrame(({ camera, pointer }) => {
    target.current.x = pointer.x * 1.4
    target.current.y = pointer.y * 0.8
    camera.position.x += (target.current.x - camera.position.x) * 0.04
    camera.position.y += (6.4 + target.current.y - camera.position.y) * 0.04
    camera.lookAt(0, -1.2, 0)
  })
  return null
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 6.4, 15], fov: 52 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#060605', 11, 34]} />
        <Terrain />
        <Embers />
        <Drone />
        <Rig />
      </Canvas>
    </div>
  )
}
