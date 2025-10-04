import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Stars } from '@react-three/drei'
import { Globe, Eye, RefreshCcw, Maximize2, Tag, Minimize2, Orbit, ArrowLeft } from 'lucide-react'
import '../styles/solarControls.css'

// using Orbit icon from lucide-react
import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import ModelLoader, { loadGLTF as loadGLTFShared } from './ModelLoader'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

// reuse shared loader from ModelLoader
const loadGLTF = loadGLTFShared

// global speed multiplier (reduce to make orbits/rotations slower)
const TIME_SCALE = 0.12

// Moon orbital parameters (simulated)
const MOON_MEAN_DISTANCE = 0.6 // units relative to scene
const MOON_ECCENTRICITY = 0.0549
const MOON_INCLINATION = (5.145 * Math.PI) / 180 // radians
const MOON_ORBITAL_PERIOD = 20 // simulated seconds per orbit (tweak as needed)
const MOON_ANGULAR_SPEED = (2 * Math.PI) / MOON_ORBITAL_PERIOD

const PLANETS = [
  { name: 'mercury', color: '#b1a187', radius: 0.3, distance: 1.6, speed: 1.6 },
  { name: 'venus', color: '#e0c08c', radius: 0.36, distance: 2.2, speed: 1.2 },
  { name: 'earth', color: '#6ea8fe', radius: 0.38, distance: 3.0, speed: 1.0 },
  { name: 'mars', color: '#d96b4c', radius: 0.32, distance: 3.7, speed: 0.8 },
  { name: 'jupiter', color: '#f0c78a', radius: 0.9, distance: 5.3, speed: 0.4 },
  { name: 'saturn', color: '#ead4a0', radius: 0.78, distance: 6.8, speed: 0.32 },
  { name: 'uranus', color: '#9be0e6', radius: 0.6, distance: 8.2, speed: 0.22 },
  { name: 'neptune', color: '#6187e6', radius: 0.58, distance: 9.2, speed: 0.18 },
  { name: 'pluto', color: '#bfa3c9', radius: 0.18, distance: 10.2, speed: 0.12 },
]

import { getModelUrlFor } from '../utils/modelIndex'

function Planet({ p, index, onClick, showLabels = true, isLoading = false }) {
  const ref = useRef()

  // update orbit position every frame so React doesn't need to re-render the tree
  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() * TIME_SCALE
    const angle = t * p.speed + index * 0.3
    const x = Math.cos(angle) * p.distance
    const z = Math.sin(angle) * p.distance
    ref.current.position.set(x, 0, z)
  })

  return (
    <group ref={ref}>
      {/* use the same ClickableModel behavior used by Sun/Moon */}
      <ClickableModel name={p.name} baseScale={p.radius} onClick={() => onClick(p.name)} spin={true} />
      {showLabels && !isLoading && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none', transform: 'translateY(-1rem)' }}>
          <div style={{ color: '#fff', fontSize: 12, background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: 4 }}>{p.name}</div>
        </Html>
      )}
    </group>
  )
}

function Moon({ timeRef, onPlanetClick, isLoading = false }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const earthIndex = PLANETS.findIndex((x) => x.name === 'earth')
    if (earthIndex === -1) return
    const earth = PLANETS[earthIndex]

    // compute Earth's current position (same as Planet logic)
    const t = state.clock.getElapsedTime() * TIME_SCALE
    const earthAngle = t * earth.speed + earthIndex * 0.3
    const earthX = Math.cos(earthAngle) * earth.distance
    const earthZ = Math.sin(earthAngle) * earth.distance

    // moon mean anomaly based on simulated orbital period
    const moonPhase = state.clock.getElapsedTime() * TIME_SCALE * MOON_ANGULAR_SPEED

    // elliptical radius: a*(1 - e^2) / (1 + e*cos(theta)) approximated
    const a = MOON_MEAN_DISTANCE
    const e = MOON_ECCENTRICITY
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(moonPhase))

    // apply inclination by rotating the orbital plane around X axis
    const xOrb = r * Math.cos(moonPhase)
    const zOrb = r * Math.sin(moonPhase)
    const yOrb = Math.sin(MOON_INCLINATION) * zOrb

    // position relative to Earth
    const mx = earthX + xOrb
    const my = 0 + yOrb
    const mz = earthZ + Math.cos(MOON_INCLINATION) * zOrb

    ref.current.position.set(mx, my, mz)

    // make the moon face the Earth (approximate tidal lock)
    try {
      ref.current.lookAt(new THREE.Vector3(earthX, 0, earthZ))
    } catch (e) {}
  })

  return (
    <group ref={ref}>
      <ClickableModel name={'Moon_Earth'} baseScale={0.18} label={'Moon'} onClick={() => onPlanetClick('moon')} spin={false} isLoading={isLoading} />
    </group>
  )
}

function SystemInner({ onPlanetClick, timeRef, showLabels, isLoading }) {
  // Sun
  return (
    <>
      {/* Sun model (replace fallback sphere) */}
      <group>
        {/* ClickableModel will handle hover + click animation and invoke onPlanetClick('sun') */}
        <ClickableModel name={'Sun'} baseScale={2.0} label={'Sun'} onClick={() => onPlanetClick('sun')} spin={true} isLoading={isLoading} />
      </group>

      {PLANETS.map((p, i) => (
        <Planet key={p.name} p={p} index={i} onClick={(name) => onPlanetClick(name)} showLabels={showLabels} isLoading={isLoading} />
      ))}

      {/* Moon orbiting the Earth (uses Moon_Earth.glb in assets) */}
      <Moon timeRef={timeRef} onPlanetClick={onPlanetClick} isLoading={isLoading} />
    </>
  )
}

// Reusable clickable 3D model that handles hover (scale) and a click "pulse" animation
function ClickableModel({ name, baseScale = 1, label, onClick, spin = false, isLoading = false }) {
  const ref = useRef()
  const animRef = useRef(0)
  const timeoutRef = useRef()
  const [hover, setHover] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state, delta) => {
    if (!ref.current) return
    animRef.current += delta
    // base target from hover
    let target = baseScale * (hover ? 1.25 : 1)

    // if clicked, create a short pulse (scale up then back) over 0.5s
    if (clicked) {
      const t = animRef.current
      const duration = 0.5
      if (t < duration) {
        // simple ease: up then down
        const p = t / duration
        const pulse = 1 + 0.6 * (1 - Math.abs(2 * p - 1))
        target = baseScale * pulse
      } else {
        // end click animation
        setClicked(false)
        animRef.current = 0
        target = baseScale * (hover ? 1.25 : 1)
      }
    }

    // smooth scale lerp
    const current = ref.current.scale
    current.x += (target - current.x) * Math.min(1, delta * 8)
    current.y = current.x
    current.z = current.x
    // self rotation (planet spin) scaled by TIME_SCALE
    if (spin) {
      try {
        ref.current.rotation.y += delta * 0.5 * TIME_SCALE
      } catch (e) {
        // ignore
      }
    }
  })

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <group
      ref={ref}
      scale={[baseScale, baseScale, baseScale]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        try {
          document.body.style.cursor = 'pointer'
        } catch (e) {
          /* ignore in non-browser env */
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHover(false)
        try {
          document.body.style.cursor = ''
        } catch (e) {
          /* ignore */
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        // play pulse animation then navigate after a short delay
        setClicked(true)
        animRef.current = 0
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          onClick && onClick()
        }, 300)
      }}
    >
      <ModelLoader name={name} scale={1} />
      {label && !isLoading && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none', transform: 'translateY(-0.8rem)' }}>
          <div style={{ color: '#fff', fontSize: label === 'Sun' ? 13 : 11, background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 6 }}>{label}</div>
        </Html>
      )}
    </group>
  )
}



export default function SolarSystem() {
  const navigate = useNavigate()
  const timeRef = useRef(0)
  const controlsRef = useRef()
  const containerRef = useRef()
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const spinRef = useRef(null)

  // Preload a small set of models on mount to make first interactions snappier
  useEffect(() => {
    const toPreload = ['Sun', 'Moon_Earth', 'earth', 'jupiter']
    let loaded = 0
    const total = toPreload.length
    
    toPreload.forEach((name) => {
      const viteUrl = getModelUrlFor(name)
      const path = viteUrl || `/src/assets/3D-models/${name}.glb`
      loadGLTF(path)
        .then(() => {
          loaded++
          if (loaded === total) {
            // All models preloaded, hide loader instantly
            setIsLoading(false)
          }
        })
        .catch(() => {
          loaded++
          if (loaded === total) {
            setIsLoading(false)
          }
        })
    })
  }, [])

  function Inner() {
    useFrame((state, delta) => {
      timeRef.current += delta * TIME_SCALE
    })
    return <SystemInner onPlanetClick={(name) => navigate(`/${name}`)} timeRef={timeRef} showLabels={showLabels} isLoading={isLoading} />
  }

  // simple orbit rings using lines
  const rings = useMemo(() => {
    return PLANETS.map((p) => {
      const points = []
      const segments = 64
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(a) * p.distance, 0, Math.sin(a) * p.distance))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      return { geom }
    })
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100vh', zIndex: 0, background: '#000' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          opacity: 1
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            padding: '40px 50px',
            background: 'rgba(6, 8, 12, 0.95)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(144, 202, 249, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)'
          }}>
            <div className="solar-loader"></div>
            <div style={{
              color: '#90CAF9',
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '1.5px',
              textAlign: 'center'
            }}>
              Loading Solar System...
            </div>
            <div style={{
              color: '#B0BEC5',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Preparing 3D models
            </div>
          </div>
        </div>
      )}

      <Canvas style={{ width: '100%', height: '100%', background: '#000' }} camera={{ position: [0, 5, 14], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        {/* starfield background */}
        <Stars radius={100} depth={50} count={6000} factor={4} fade speed={1} />

        {/* Render the solar system from the start so it loads in the background */}
        <Inner />

        {showOrbits &&
          rings.map((r, i) => (
            <line key={i} geometry={r.geom}>
              <lineBasicMaterial color={'#444'} transparent opacity={0.6} linewidth={1} />
            </line>
          ))}

        <OrbitControls 
          ref={controlsRef} 
          target={[0, 0, 0]} 
          enablePan={true} 
          enableZoom={true}
          minDistance={3}
          maxDistance={50}
        />
      </Canvas>

      {/* Back button - top left */}
      <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 1001 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 20px',
            background: 'rgba(6, 8, 12, 0.7)',
            border: '1px solid rgba(144, 202, 249, 0.3)',
            borderRadius: 12,
            color: '#90CAF9',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(144, 202, 249, 0.15)'
            e.currentTarget.style.borderColor = '#90CAF9'
            e.currentTarget.style.transform = 'translateX(-3px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(6, 8, 12, 0.7)'
            e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.3)'
            e.currentTarget.style.transform = 'translateX(0)'
          }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Control buttons - top right */}
      <div style={{ position: 'absolute', right: 20, top: 20, zIndex: 1001 }}>
        <div style={{ 
          display: 'flex', 
          gap: 10, 
          alignItems: 'center', 
          background: 'rgba(6, 8, 12, 0.7)', 
          padding: 12, 
          borderRadius: 14, 
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)', 
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(144, 202, 249, 0.2)'
        }}>

          {/* Orbits toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button
              title={showOrbits ? 'Hide Orbits' : 'Show Orbits'}
              aria-pressed={showOrbits}
              onClick={() => setShowOrbits((v) => !v)}
              style={{ 
                width: 54, 
                height: 54, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 10, 
                border: showOrbits ? '2px solid rgba(144, 202, 249, 0.6)' : '1px solid rgba(144, 202, 249, 0.2)', 
                cursor: 'pointer', 
                background: showOrbits ? 'linear-gradient(135deg, rgba(110, 198, 255, 0.25), rgba(142, 123, 255, 0.25))' : 'rgba(6, 8, 12, 0.4)',
                transition: 'all 0.2s ease',
                boxShadow: showOrbits ? '0 2px 8px rgba(110, 198, 255, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!showOrbits) {
                  e.currentTarget.style.background = 'rgba(144, 202, 249, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showOrbits) {
                  e.currentTarget.style.background = 'rgba(6, 8, 12, 0.4)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.2)'
                }
              }}
            >
              <Orbit size={24} style={{ color: showOrbits ? '#90CAF9' : '#6B7280' }} />
            </button>
            <span style={{ fontSize: 11, color: showOrbits ? '#90CAF9' : '#6B7280', fontWeight: 500 }}>Orbits</span>
          </div>

          {/* Labels toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button
              title={showLabels ? 'Hide Labels' : 'Show Labels'}
              aria-pressed={showLabels}
              onClick={() => setShowLabels((v) => !v)}
              style={{ 
                width: 54, 
                height: 54, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 10, 
                border: showLabels ? '2px solid rgba(144, 202, 249, 0.6)' : '1px solid rgba(144, 202, 249, 0.2)', 
                cursor: 'pointer', 
                background: showLabels ? 'linear-gradient(135deg, rgba(110, 198, 255, 0.25), rgba(142, 123, 255, 0.25))' : 'rgba(6, 8, 12, 0.4)',
                transition: 'all 0.2s ease',
                boxShadow: showLabels ? '0 2px 8px rgba(110, 198, 255, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!showLabels) {
                  e.currentTarget.style.background = 'rgba(144, 202, 249, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showLabels) {
                  e.currentTarget.style.background = 'rgba(6, 8, 12, 0.4)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.2)'
                }
              }}
            >
              <Tag size={24} color={showLabels ? '#90CAF9' : '#6B7280'} />
            </button>
            <span style={{ fontSize: 11, color: showLabels ? '#90CAF9' : '#6B7280', fontWeight: 500 }}>Labels</span>
          </div>

          {/* Reset view */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button
              title="Reset View"
              onClick={() => {
                if (spinRef.current) {
                  try {
                    spinRef.current.classList.remove('spin')
                    spinRef.current.offsetWidth
                    spinRef.current.classList.add('spin')
                  } catch (e) {}
                }
                if (controlsRef.current) {
                  try {
                    controlsRef.current.reset()
                    controlsRef.current.update()
                  } catch (e) {}
                }
              }}
              style={{ 
                width: 54, 
                height: 54, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 10, 
                border: '1px solid rgba(144, 202, 249, 0.2)', 
                cursor: 'pointer', 
                background: 'rgba(6, 8, 12, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(144, 202, 249, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(6, 8, 12, 0.4)'
                e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.2)'
              }}
            >
              <div ref={spinRef} className={'control-spin'} style={{ display: 'flex' }}>
                <RefreshCcw size={24} color="#90CAF9" />
              </div>
            </button>
            <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>Reset</span>
          </div>

          {/* Fullscreen toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <button
              title="Toggle Fullscreen"
              onClick={async () => {
                if (!document.fullscreenElement && containerRef.current) {
                  try {
                    await containerRef.current.requestFullscreen()
                  } catch (e) {}
                  setIsFullscreen(true)
                } else if (document.fullscreenElement) {
                  await document.exitFullscreen()
                  setIsFullscreen(false)
                }
              }}
              style={{ 
                width: 54, 
                height: 54, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                borderRadius: 10, 
                border: isFullscreen ? '2px solid rgba(144, 202, 249, 0.6)' : '1px solid rgba(144, 202, 249, 0.2)', 
                cursor: 'pointer', 
                background: isFullscreen ? 'linear-gradient(135deg, rgba(110, 198, 255, 0.25), rgba(142, 123, 255, 0.25))' : 'rgba(6, 8, 12, 0.4)',
                transition: 'all 0.2s ease',
                boxShadow: isFullscreen ? '0 2px 8px rgba(110, 198, 255, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isFullscreen) {
                  e.currentTarget.style.background = 'rgba(144, 202, 249, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isFullscreen) {
                  e.currentTarget.style.background = 'rgba(6, 8, 12, 0.4)'
                  e.currentTarget.style.borderColor = 'rgba(144, 202, 249, 0.2)'
                }
              }}
            >
              {isFullscreen ? <Minimize2 size={24} color="#90CAF9" /> : <Maximize2 size={24} color="#90CAF9" />}
            </button>
            <span style={{ fontSize: 11, color: isFullscreen ? '#90CAF9' : '#6B7280', fontWeight: 500 }}>
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
