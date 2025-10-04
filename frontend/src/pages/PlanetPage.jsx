import { useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import loadImages from '../utils/loadImages'
import ModelLoader from '../components/ModelLoader'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

export default function PlanetPage() {
  const { name } = useParams()
  const [imagesData, setImagesData] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h3>Images ({imagesData?.images?.length ?? 0})</h3>
        {/* Fullscreen overlay for the 3D model + left sidebar */}
        <PlanetDetailView name={name} imagesData={imagesData} error={error} onClose={() => navigate(-1)} />
      </div>
    </main>
  )
}

function PlanetDetailView({ name, imagesData, error, onClose }) {
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
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          zIndex: 10000,
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

      {/* Left sidebar */}
      <aside style={{ width: 360, maxWidth: '36vw', minWidth: 280, padding: 20, boxSizing: 'border-box', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
        <h2 style={{ marginTop: 4 }}>{name?.charAt(0).toUpperCase() + name?.slice(1)}</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Información del cuerpo celeste. Aquí puedes añadir descripción, fecha de las imágenes, fuente y coordenadas.</p>

        <div style={{ marginTop: 12 }}>
          <strong>Imágenes DZI ({entries.length})</strong>
        </div>

        {error && <p style={{ color: '#ff8b8b' }}>{error}</p>}

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
  const apiBase = (import.meta.env && import.meta.env.VITE_API_BASE) || '/api'

  const filtered = entries.filter((e) => {
    if (!e || !e.file) return false
    const filename = String(e.file).toLowerCase()
    const title = String(e.title || '').toLowerCase()
    const term = q.trim().toLowerCase()
    if (!term) return true
    return filename.includes(term) || title.includes(term)
  })

  function getDziUrl(entry) {
    // If path is absolute/URL-like, return as-is, else build from assets folder
    const file = entry.file
    if (!file) return null
    if (/^https?:\/\//i.test(file) || file.startsWith('/')) return file
    // Prefer backend serving if available (files uploaded by users will be served from API)
    const b = apiBase.replace(/\/$/, '')
    // backend expected route: /images/:planet/:filename (same as loadImages API)
    return `${b}/images/${planetName}/${file}`
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
            <li key={idx} style={{ padding: '8px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14 }}>{e.title || String(e.file)}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{String(e.file)}</div>
              </div>
              <div style={{ marginLeft: 8 }}>
                {getDziUrl(e) ? (
                  <a href={getDziUrl(e)} target="_blank" rel="noreferrer" style={{ color: '#9ad1ff', textDecoration: 'none' }}>Abrir</a>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>-</span>
                )}
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
    if (e.button !== 0) return // only left click
    dragging.current = true
    prev.current.x = e.clientX
    prev.current.y = e.clientY
    e.target.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging.current || !ref.current) return
    const dx = e.clientX - prev.current.x
    const dy = e.clientY - prev.current.y
    prev.current.x = e.clientX
    prev.current.y = e.clientY
    // rotate both axes
    ref.current.rotation.y += dx * 0.01
    ref.current.rotation.x += dy * 0.01
    // clamp X rotation a bit
    ref.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, ref.current.rotation.x))
  }

  function onPointerUp(e) {
    dragging.current = false
    try {
      e.target.releasePointerCapture(e.pointerId)
    } catch (e) {}
  }

  return (
    <group>
      <group ref={ref} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerOut={onPointerUp}>
        <ModelLoader name={name} scale={1.6} />
      </group>
    </group>
  )
}
