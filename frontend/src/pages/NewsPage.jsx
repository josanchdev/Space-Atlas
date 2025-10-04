import { useEffect, useState } from 'react'
import '../styles/newsPage.css'

function ImageCard({ img }) {
  return (
    <div className="image-card">
      <div className="image-card-thumbnail">
        {img.thumbnail ? (
          <img src={img.thumbnail} alt={img.title} />
        ) : (
          <div className="placeholder">DZI Preview</div>
        )}
      </div>
      <div className="image-card-content">
        <div className="image-card-title">{img.title || img.filename}</div>
        <div className="image-card-body">{img.body || 'Unknown body'}</div>
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
          { filename: 'jupiter_001.dzi', title: 'Great Red Spot Detail', body: 'Jupiter', thumbnail: '/public/placeholder-jupiter.jpg' },
          { filename: 'saturn_001.dzi', title: 'Saturn Rings Close-up', body: 'Saturn', thumbnail: '/public/placeholder-saturn.jpg' },
        ])
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="news-page">
      <div className="news-header">
        <h2>Latest Space Discoveries</h2>
        <p>Explore the newest high-resolution images from celestial bodies, uploaded by the scientific community.</p>
      </div>
      <div className="news-grid">
        {images.length === 0 ? (
          <div className="no-images">No images found.</div>
        ) : (
          images.map((img, i) => <ImageCard key={i} img={img} />)
        )}
      </div>
    </div>
  )
}
