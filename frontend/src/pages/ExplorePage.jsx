import { useEffect, useState } from 'react'
import '../styles/header.css'

function ImageCard({ img }) {
  return (
    <div style={{ width: 260, margin: 8, background: '#0b0b0f', padding: 8, borderRadius: 8, color: '#fff' }}>
      <div style={{ height: 180, background: '#111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {img.thumbnail ? <img src={img.thumbnail} alt={img.title} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} /> : <div style={{ color: '#777' }}>DZI preview</div>}
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>{img.title || img.filename}</div>
        <div style={{ fontSize: 12, color: '#9aa' }}>{img.body || 'Unknown body'}</div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  const [images, setImages] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setImages(data || [])
      })
      .catch(() => {
        if (!mounted) return
        setImages([
          { filename: 'earth_001.dzi', title: 'Blue Marble', body: 'Earth', thumbnail: '/public/placeholder-earth.jpg' },
          { filename: 'jupiter_001.dzi', title: 'Great Red Spot', body: 'Jupiter', thumbnail: '/public/placeholder-jupiter.jpg' },
        ])
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = images.filter((img) => {
    if (!query) return true
    return (img.body || '').toLowerCase().includes(query.toLowerCase()) || (img.title || '').toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#fff' }}>Explore images</h2>
      <p style={{ color: '#9aa' }}>Search images uploaded by the scientific community.</p>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <input
          aria-label="Search by body"
          placeholder="Search by celestial body or title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px 12px', width: 360, borderRadius: 8, border: '1px solid #223', background: '#071019', color: '#fff' }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
        {filtered.length === 0 ? <div style={{ color: '#9aa' }}>No images match your query.</div> : filtered.map((img, i) => <ImageCard key={i} img={img} />)}
      </div>
    </div>
  )
}
