import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Menu, X, Eye } from 'lucide-react'
import ModelLoader from '../components/ModelLoader'
import POIMarker from '../components/POIMarker'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import NotFoundPage from './NotFoundPage'
import { poisService } from '../services/poisService'
import { latLonToCartesian } from '../utils/coordinateConverter'
import '../styles/planetPage.css'

// Information for each celestial body
const celestialBodiesInfo = {
  sun: {
    name: 'Sun',
    description: 'The Sun is the star at the center of our Solar System and the closest star to Earth. It is an incandescent sphere of plasma with a diameter of approximately 1,392,000 km.',
    details: [
      'Type: G-type main-sequence star',
      'Age: ~4.6 billion years',
      'Surface temperature: ~5,500°C',
      'Distance from Earth: ~150 million km'
    ]
  },
  mercury: {
    name: 'Mercury',
    description: 'Mercury is the smallest planet in our Solar System and the closest to the Sun. It has no significant atmosphere and its surface is covered with craters.',
    details: [
      'Type: Terrestrial planet',
      'Diameter: 4,879 km',
      'Orbital period: 88 Earth days',
      'Temperature: -173°C to 427°C'
    ]
  },
  venus: {
    name: 'Venus',
    description: 'Venus is the second planet from the Sun and is similar in size to Earth. Its dense CO₂ atmosphere produces an extreme greenhouse effect.',
    details: [
      'Type: Terrestrial planet',
      'Diameter: 12,104 km',
      'Orbital period: 225 Earth days',
      'Surface temperature: ~462°C'
    ]
  },
  earth: {
    name: 'Earth',
    description: 'Earth is the third planet from the Sun and the only known planet to harbor life. It has an atmosphere rich in nitrogen and oxygen.',
    details: [
      'Type: Terrestrial planet',
      'Diameter: 12,742 km',
      'Orbital period: 365.25 days',
      'Average temperature: 15°C'
    ]
  },
  moon: {
    name: 'Moon',
    description: 'The Moon is Earth\'s only natural satellite. Its gravitational influence produces the oceanic tides on our planet.',
    details: [
      'Type: Natural satellite',
      'Diameter: 3,474 km',
      'Orbital period: 27.3 Earth days',
      'Distance from Earth: ~384,400 km'
    ]
  },
  mars: {
    name: 'Mars',
    description: 'Mars is the fourth planet from the Sun, known as the "Red Planet" due to iron oxide on its surface. It is a key target for space exploration.',
    details: [
      'Type: Terrestrial planet',
      'Diameter: 6,779 km',
      'Orbital period: 687 Earth days',
      'Temperature: -87°C to -5°C'
    ]
  },
  jupiter: {
    name: 'Jupiter',
    description: 'Jupiter is the largest planet in our Solar System, a gas giant with a Great Red Spot that is a massive storm larger than Earth.',
    details: [
      'Type: Gas giant',
      'Diameter: 139,820 km',
      'Orbital period: 12 Earth years',
      'Known moons: 95+'
    ]
  },
  saturn: {
    name: 'Saturn',
    description: 'Saturn is famous for its spectacular ring system composed of ice and rock. It is the second largest planet in the Solar System.',
    details: [
      'Type: Gas giant',
      'Diameter: 116,460 km',
      'Orbital period: 29 Earth years',
      'Known moons: 146+'
    ]
  },
  uranus: {
    name: 'Uranus',
    description: 'Uranus is an ice giant with a unique feature: it rotates on its side. Its atmosphere contains methane that gives it a blue-green color.',
    details: [
      'Type: Ice giant',
      'Diameter: 50,724 km',
      'Orbital period: 84 Earth years',
      'Axial tilt: 98°'
    ]
  },
  neptune: {
    name: 'Neptune',
    description: 'Neptune is the eighth and farthest planet from the Sun. It is known for its extremely fast winds and intense blue color.',
    details: [
      'Type: Ice giant',
      'Diameter: 49,244 km',
      'Orbital period: 165 Earth years',
      'Winds: up to 2,100 km/h'
    ]
  },
  pluto: {
    name: 'Pluto',
    description: 'Pluto is a dwarf planet in the Kuiper Belt. Although no longer considered a major planet, it remains a fascinating object of study.',
    details: [
      'Type: Dwarf planet',
      'Diameter: 2,376 km',
      'Orbital period: 248 Earth years',
      'Known moons: 5'
    ]
  }
}

export default function PlanetPage() {
  const { name } = useParams()
  const navigate = useNavigate()

  // Lista de planetas válidos
  const validCelestialBodies = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  
  // Si el nombre no es válido, mostrar página de error
  if (!validCelestialBodies.includes(name?.toLowerCase())) {
    return <NotFoundPage />
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>{name?.charAt(0).toUpperCase() + name?.slice(1)}</h2>
      <div>
        {/* Fullscreen overlay for the 3D model + left sidebar */}
        <PlanetDetailView name={name} onClose={() => navigate('/solar-system')} />
      </div>
    </main>
  )
}

function PlanetDetailView({ name, onClose }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  
  // POIs state
  const [pois, setPois] = useState([])
  const [loadingPois, setLoadingPois] = useState(true)
  const [poisError, setPoisError] = useState(null)
  
  // Obtener información del cuerpo celeste
  const info = celestialBodiesInfo[name.toLowerCase()] || {}
  
  // Fetch POIs from backend
  useEffect(() => {
    const fetchPois = async () => {
      try {
        setLoadingPois(true)
        setPoisError(null)
        
        // Get ALL POIs - they are general and not planet-specific
        const allPois = await poisService.getAll()
        
        console.log(`📍 Loaded ${allPois.length} general POIs (displayed on all planets)`)
        console.log('POIs details:', allPois.map(p => ({
          title: p.title,
          lat: p.lat,
          lon: p.lon,
          path: p.path
        })))
        
        // Show ALL POIs on this planet (no filtering)
        setPois(allPois)
      } catch (error) {
        console.error('Error loading POIs:', error)
        setPoisError(error.message)
        setPois([])
      } finally {
        setLoadingPois(false)
      }
    }
    
    fetchPois()
  }, [name])
  
  // Convert POIs to 3D positions
  const poiPositions = useMemo(() => {
    if (!pois || pois.length === 0) return []
    
    return pois.map((poi, index) => {
      // Validate coordinates
      const lat = parseFloat(poi.lat)
      const lon = parseFloat(poi.lon)
      
      if (isNaN(lat) || isNaN(lon)) {
        console.warn(`Invalid coordinates for POI: ${poi.title}`, poi)
        return null
      }
      
      // Convert lat/lon to 3D cartesian coordinates
      // Planet-specific radius adjustments (model scale = 1.6)
      // Mars is our reference planet for calibration
      const planetName = name.toLowerCase()
      let radius
      
      switch(planetName) {
        case 'mars':
          // Mars reference model - pegado a la superficie
          // Valores probados: 1.62 (muy separado), bajando a valores más cercanos
          radius = 0.80
          break
        default:
          // Use Mars calibration as base for other planets
          radius = 0.80
      }
      
      const position = latLonToCartesian(lat, lon, radius)
      
      console.log(`📍 ${poi.title}: lat=${lat}°, lon=${lon}° → pos=(${position.x.toFixed(3)}, ${position.y.toFixed(3)}, ${position.z.toFixed(3)})`)
      
      return {
        id: poi._id || poi.id || `poi-${index}`,
        poi,
        position,
        lat,
        lon
      }
    }).filter(Boolean) // Remove null entries
  }, [pois, name])
  
  // Log POI positions for debugging
  useEffect(() => {
    if (poiPositions.length > 0) {
      console.log(`✅ Converted ${poiPositions.length} POIs to 3D positions:`)
      poiPositions.slice(0, 3).forEach(item => {
        console.log(`  📍 ${item.poi.title}: (${item.lat}°, ${item.lon}°) → (${item.position.x.toFixed(2)}, ${item.position.y.toFixed(2)}, ${item.position.z.toFixed(2)})`)
      })
    }
  }, [poiPositions])
  
  // lock scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const handleViewPlanet = () => {
    // Navigate to image viewer with planet name only
    navigate(`/image/${name.toLowerCase()}`)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', color: '#fff' }}>
      {/* Back button */}
      <button
        onClick={onClose}
        className="planet-back-button"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Toggle sidebar button (mobile only) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="planet-menu-toggle"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        <span>{isSidebarOpen ? 'Close' : 'Info'}</span>
      </button>

      {/* Left sidebar */}
      <aside className={`planet-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: 360, maxWidth: '36vw', minWidth: 280, padding: 20, boxSizing: 'border-box', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <h2 style={{ marginTop: 4, marginBottom: 16 }}>{info.name || name.charAt(0).toUpperCase() + name.slice(1)}</h2>
        
        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontSize: '15px' }}>
            {info.description || 'Information about this celestial body.'}
          </p>
        </div>

        {/* Details */}
        {info.details && info.details.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '16px', marginBottom: 12, color: 'rgba(154, 209, 255, 0.9)' }}>Characteristics</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {info.details.map((detail, idx) => (
                <li key={idx} style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px'
                }}>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Big button to view the planet */}
        <button
          onClick={handleViewPlanet}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, rgba(154, 209, 255, 0.2) 0%, rgba(100, 149, 237, 0.2) 100%)',
            border: '2px solid rgba(154, 209, 255, 0.5)',
            borderRadius: '12px',
            color: '#9ad1ff',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px'
          }}
          onMouseEnter={(ev) => {
            ev.currentTarget.style.background = 'linear-gradient(135deg, rgba(154, 209, 255, 0.35) 0%, rgba(100, 149, 237, 0.35) 100%)'
            ev.currentTarget.style.borderColor = 'rgba(154, 209, 255, 0.8)'
            ev.currentTarget.style.transform = 'translateY(-2px)'
            ev.currentTarget.style.boxShadow = '0 8px 20px rgba(154, 209, 255, 0.3)'
          }}
          onMouseLeave={(ev) => {
            ev.currentTarget.style.background = 'linear-gradient(135deg, rgba(154, 209, 255, 0.2) 0%, rgba(100, 149, 237, 0.2) 100%)'
            ev.currentTarget.style.borderColor = 'rgba(154, 209, 255, 0.5)'
            ev.currentTarget.style.transform = 'translateY(0)'
            ev.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Eye size={24} />
          <span>View {info.name || name}</span>
        </button>

        {/* Additional information */}
        <div style={{ marginTop: 24, padding: 12, background: 'rgba(154, 209, 255, 0.05)', borderRadius: 8, border: '1px solid rgba(154, 209, 255, 0.1)' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            💡 Click "View {info.name || name}" to explore high-resolution images
          </p>
        </div>

        {/* POIs Counter */}
        <div style={{ marginTop: 16, padding: 12, background: 'rgba(255, 217, 61, 0.1)', borderRadius: 8, border: '1px solid rgba(255, 217, 61, 0.3)' }}>
          {loadingPois ? (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              ⏳ Loading POIs...
            </p>
          ) : poisError ? (
            <p style={{ fontSize: '13px', color: 'rgba(255, 100, 100, 0.9)', margin: 0 }}>
              ⚠️ Error loading POIs: {poisError}
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              📍 <strong>{poiPositions.length} Points of Interest</strong> visible on the 3D model
            </p>
          )}
        </div>
      </aside>

      {/* Right: 3D canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: '100%', height: '100vh', background: 'black' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={1} />
          <PlanetModel name={name} poiPositions={poiPositions} />
        </Canvas>
      </div>
    </div>
  )
}

function PlanetModel({ name, poiPositions = [] }) {
  const ref = useRef()
  const camRef = useRef()
  const dragging = useRef(false)
  const prev = useRef({ x: 0, y: 0 })
  const { camera } = useThree()
  const [selectedPoi, setSelectedPoi] = useState(null)
  
  // Log when POIs are received
  useEffect(() => {
    if (poiPositions.length > 0) {
      console.log(`🎯 PlanetModel received ${poiPositions.length} POI positions`)
    }
  }, [poiPositions])
  
  // Handle POI click
  const handlePoiClick = (poi) => {
    console.log('📍 POI clicked:', poi)
    setSelectedPoi(poi)
    // TODO: Open detail panel or perform action
  }

  // animate camera in
  useFrame((state, delta) => {
    if (!camera) return
    const desired = new THREE.Vector3(0, 0, 2.6)
    camera.position.lerp(desired, 0.06)
    camera.lookAt(0, 0, 0)
    // small inertia spin when not dragging
    if (ref.current && !dragging.current) {
      ref.current.rotation.y += delta * 0.08
    }
  })

  function onPointerDown(e) {
    // Allow both mouse left click (button 0) and touch events (button -1)
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragging.current = true
    // Use clientX/clientY for both mouse and touch
    prev.current.x = e.clientX || e.pageX
    prev.current.y = e.clientY || e.pageY
    e.target.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging.current || !ref.current) return
    const currentX = e.clientX || e.pageX
    const currentY = e.clientY || e.pageY
    const dx = currentX - prev.current.x
    const dy = currentY - prev.current.y
    prev.current.x = currentX
    prev.current.y = currentY
    // rotate both axes
    ref.current.rotation.y += dx * 0.01
    ref.current.rotation.x += dy * 0.01
    // clamp X rotation a bit
    ref.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, ref.current.rotation.x))
  }

  function onPointerUp(e) {
    if (!dragging.current) return
    dragging.current = false
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch (err) {
      // Silently fail if pointer capture was already released
    }
  }

  function onPointerCancel(e) {
    // Handle cuando el pointer se cancela (ej: el usuario sale de la pantalla)
    onPointerUp(e)
  }

  return (
    <group>
      <group 
        ref={ref} 
        onPointerDown={onPointerDown} 
        onPointerMove={onPointerMove} 
        onPointerUp={onPointerUp} 
        onPointerCancel={onPointerCancel}
        onPointerOut={onPointerUp}
      >
        <ModelLoader name={name} scale={1.6} />
        
        {/* Render interactive POI markers */}
        {poiPositions.map((item) => (
          <POIMarker
            key={item.id}
            position={item.position}
            poi={item.poi}
            onClick={handlePoiClick}
          />
        ))}
      </group>
    </group>
  )
}
