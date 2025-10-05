import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Menu, X } from 'lucide-react'
import loadImages from '../utils/loadImages'
import ModelLoader from '../components/ModelLoader'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'
import NotFoundPage from './NotFoundPage'
import '../styles/planetPage.css'

export default function PlanetPage() {
  const { name } = useParams()
  const [imagesData, setImagesData] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Lista de planetas válidos
  const validCelestialBodies = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
  
  // Si el nombre no es válido, mostrar página de error
  if (!validCelestialBodies.includes(name?.toLowerCase())) {
    return <NotFoundPage />
  }

  useEffect(() => {
    setImagesData(null)
    setError(null)
    loadImages(name)
      .then((data) => setImagesData(data))
      .catch((err) => setError(err.message || String(err)))
  }, [name])

  return (
    <main style={{ padding: 20 }}>
      <h2>{name?.charAt(0).toUpperCase() + name?.slice(1)}</h2>
      {error && <p style={{ color: 'red' }}>⚠️ Couldn't load images from the server</p>}
      <div>
        <h3>Images ({imagesData?.images?.length ?? 0})</h3>
        {/* Fullscreen overlay for the 3D model + left sidebar */}
        <PlanetDetailView name={name} imagesData={imagesData} error={error} onClose={() => navigate(-1)} />
      </div>
    </main>
  )
}

function PlanetDetailView({ name, imagesData, error, onClose }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Camera will animate from further away to a close distance, then the user can left-drag to rotate
  // lock scroll while overlay is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Simple helper to normalise different shapes of entries in images.json
  function normalizeEntries(raw) {
    if (!raw) return []
    const arr = raw.images ?? raw
    if (!Array.isArray(arr)) return []
    return arr.map((it) => {
      if (!it) return null
      if (typeof it === 'string') {
        // string may be filename like 'image1.dzi' or 'image1'
        const file = it.endsWith('.dzi') ? it : `${it}.dzi`
        return { title: it.replace(/\.dzi$/i, ''), file }
      }
      // object: common keys
      const file = it.dzi || it.file || it.url || it.path || it.name || ''
      const title = it.title || it.name || (typeof file === 'string' ? String(file).replace(/\.dzi$/i, '') : '')
      return { title, file, meta: it }
    }).filter(Boolean)
  }

  const entries = normalizeEntries(imagesData)

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
        <h2 style={{ marginTop: 4 }}>{name?.charAt(0).toUpperCase() + name?.slice(1)}</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Información del cuerpo celeste. Aquí puedes añadir descripción, fecha de las imágenes, fuente y coordenadas.</p>

        <div style={{ marginTop: 12 }}>
          <strong>Imágenes DZI ({entries.length})</strong>
        </div>

        {error && <p style={{ color: '#ff8b8b', marginTop: 12, padding: 10, background: 'rgba(255, 59, 48, 0.1)', borderRadius: 6, border: '1px solid rgba(255, 59, 48, 0.3)' }}>⚠️ Couldn't load images from the server</p>}

        <ImageSearchList entries={entries} planetName={name} />
      </aside>

      {/* Right: 3D canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ width: '100%', height: '100vh', background: 'black' }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={1} />
          <PlanetModel name={name} />
        </Canvas>
      </div>
    </div>
  )
}

function ImageSearchList({ entries, planetName }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const filtered = entries.filter((e) => {
    if (!e || !e.file) return false
    const filename = String(e.file).toLowerCase()
    const title = String(e.title || '').toLowerCase()
    const term = q.trim().toLowerCase()
    if (!term) return true
    return filename.includes(term) || title.includes(term)
  })

  const handleImageClick = (entry) => {
    // Navigate to universal image viewer
    const imageName = String(entry.file).replace(/\.dzi$/i, '')
    navigate(`/image/${imageName}?planet=${planetName}&source=planet&title=${encodeURIComponent(entry.title || imageName)}`)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <input
        placeholder="Buscar imágenes..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#fff', boxSizing: 'border-box' }}
      />

      <div style={{ marginTop: 12 }}>
        {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No se han encontrado imágenes.</p>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((e, idx) => (
            <li 
              key={idx} 
              style={{ 
                padding: '8px 6px', 
                borderBottom: '1px solid rgba(255,255,255,0.03)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(ev) => ev.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(ev) => ev.currentTarget.style.background = 'transparent'}
            >
              <div onClick={() => handleImageClick(e)} style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{e.title || String(e.file)}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{String(e.file)}</div>
              </div>
              <div style={{ marginLeft: 8 }}>
                <button
                  onClick={() => handleImageClick(e)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(154, 209, 255, 0.15)',
                    border: '1px solid rgba(154, 209, 255, 0.3)',
                    borderRadius: '4px',
                    color: '#9ad1ff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(ev) => {
                    ev.currentTarget.style.background = 'rgba(154, 209, 255, 0.25)'
                    ev.currentTarget.style.borderColor = 'rgba(154, 209, 255, 0.5)'
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.background = 'rgba(154, 209, 255, 0.15)'
                    ev.currentTarget.style.borderColor = 'rgba(154, 209, 255, 0.3)'
                  }}
                >
                  Ver
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PlanetModel({ name }) {
  const ref = useRef()
  const camRef = useRef()
  const dragging = useRef(false)
  const prev = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

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
      </group>
    </group>
  )
}
