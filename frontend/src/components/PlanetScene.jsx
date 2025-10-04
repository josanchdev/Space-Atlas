import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'

function Hotspot({ pos, label }) {
  const ref = useRef()
  const [hover, setHover] = useState(false)

  return (
    <mesh
      ref={ref}
      position={[pos.x, pos.y, pos.z]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={hover ? 'orange' : 'yellow'} />
      <Html distanceFactor={10} style={{ pointerEvents: 'none', transform: 'translateY(-1rem)' }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{label}</div>
      </Html>
    </mesh>
  )
}

function SphereModel({ images }) {
  const ref = useRef()
  // rotate slowly
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05
  })

  // create hotspot positions from images.position3D or random on unit sphere
  const hotspots = useMemo(() => {
    return images.map((img, i) => {
      if (img.position3D) return { x: img.position3D.x, y: img.position3D.y, z: img.position3D.z, label: img.id }
      // random fallback: place evenly using golden spiral
      const phi = Math.acos(1 - 2 * ((i + 0.5) / images.length))
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)
      return { x, y, z, label: img.id }
    })
  }, [images])

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#334" metalness={0.1} roughness={0.8} />
      </mesh>

      {hotspots.map((h) => (
        <Hotspot key={h.label} pos={h} label={h.label} />
      ))}
    </group>
  )
}

export default function PlanetScene({ planet, images }) {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <SphereModel images={images} />
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}
