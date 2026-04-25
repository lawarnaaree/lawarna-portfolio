import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleField() {
  const meshRef = useRef()
  const count = 1500

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const accentColor = new THREE.Color('#e8572a')
    const dimColor = new THREE.Color('#333333')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Distribute in a sphere
      const radius = 4 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = radius * Math.cos(phi)

      // 15% accent, rest dim
      const color = Math.random() < 0.15 ? accentColor : dimColor
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b
    }
    return [pos, col]
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.03
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function FloatingTorus() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[2, 0.02, 32, 100]} />
      <meshBasicMaterial color="#e8572a" transparent opacity={0.3} />
    </mesh>
  )
}

function InnerRing() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.2, 0.015, 32, 80]} />
      <meshBasicMaterial color="#555555" transparent opacity={0.2} />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <FloatingTorus />
        <InnerRing />
      </Canvas>
    </div>
  )
}
