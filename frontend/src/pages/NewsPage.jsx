import { useEffect, useState } from 'react'
import '../styles/header.css'

function ImageCard({ img }) {
  return (
    <div style={{ width: 260, margin: 8, background: '#0b0b0f', padding: 8, borderRadius: 8, color: '#fff' }}>
      <div style={{ height: 180, background: '#111', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* For DZI tiles you'd usually show a deep-zoom viewer; here show thumbnail or placeholder */}
        {img.thumbnail ? <img src={img.thumbnail} alt={img.title} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6 }} /> : <div style={{ color: '#777' }}>DZI preview</div>}
      </div>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>{img.title || img.filename}</div>
        <div style={{ fontSize: 12, color: '#9aa' }}>{img.body || 'Unknown body'}</div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [images, setImages] = useState([])

  useEffect(() => {
    let mounted = true
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setImages(data || [])
      })
      .catch(() => {
        // fallback sample data
        if (!mounted) return
        setImages([
          { filename: 'mars_001.dzi', title: 'Mars Region A', body: 'Mars', thumbnail: '/public/placeholder-mars.jpg' },
          { filename: 'moon_azimuth.dzi', title: 'Mare Imbrium', body: 'Moon', thumbnail: '/public/placeholder-moon.jpg' },
        ])
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div style={{ padding: 28 }}>
      <h2 style={{ color: '#fff' }}>Latest DZI images</h2>
      <p style={{ color: '#9aa' }}>Images uploaded by the scientific community.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
        {images.length === 0 ? <div style={{ color: '#9aa' }}>No images found.</div> : images.map((img, i) => <ImageCard key={i} img={img} />)}
      </div>
    </div>
  )
}
