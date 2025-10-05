import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

/**
 * MarkerSphere Component
 * Interactive 3D sphere marker for Points of Interest on planet surfaces (3D models)
 * 
 * @param {Object} position - 3D cartesian coordinates {x, y, z}
 * @param {Object} poi - POI data object with title, description, lat, lon
 * @param {Function} onClick - Callback when marker is clicked
 */
export default function MarkerSphere({ position, poi, onClick }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Subtle pulsing animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle scale pulsing (only when not hovered)
      if (!hovered) {
        const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.08
        groupRef.current.scale.setScalar(scale)
      }
    }
  })
  
  const handleClick = (e) => {
    e.stopPropagation() // Prevent rotation when clicking POI
    if (onClick) {
      onClick(poi)
    }
  }
  
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }
  
  return (
    <group 
      ref={groupRef}
      position={[position.x, position.y, position.z]}
    >
      {/* Main marker sphere */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? '#ff6b35' : '#ffd93d'} 
          transparent
          opacity={1}
        />
      </mesh>
      
      {/* Glow effect - middle layer */}
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? '#ff8c61' : '#ffed4e'}
          transparent
          opacity={hovered ? 0.6 : 0.4}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? '#ffaa88' : '#fff9cc'}
          transparent
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Tooltip on hover */}
      {hovered && (
        <Html
          distanceFactor={4}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            transform: 'translateY(-12px)'
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 5px',
            borderRadius: '2px',
            fontSize: '8px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 217, 61, 0.4)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            {poi.title}
          </div>
        </Html>
      )}
    </group>
  )
}
