import { useEffect, useState } from 'react'
import '../styles/explorePage.css'

function ImageCard({ img }) {
  return (
    <div className="explore-card">
      <div className="explore-card-thumbnail">
        {img.thumbnail ? (
          <img src={img.thumbnail} alt={img.title} />
        ) : (
          <div className="placeholder">DZI Preview</div>
        )}
      </div>
      <div className="explore-card-content">
        <div className="explore-card-title" id="title-font">{img.title || img.filename}</div>
        <div className="explore-card-body">{img.body || 'Unknown body'}</div>
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
          { filename: 'mars_001.dzi', title: 'Olympus Mons', body: 'Mars', thumbnail: '/public/placeholder-mars.jpg' },
          { filename: 'venus_001.dzi', title: 'Venus Surface', body: 'Venus', thumbnail: '/public/placeholder-venus.jpg' },
          { filename: 'saturn_001.dzi', title: 'Saturn Rings', body: 'Saturn', thumbnail: '/public/placeholder-saturn.jpg' },
          { filename: 'neptune_001.dzi', title: 'Neptune Storm', body: 'Neptune', thumbnail: '/public/placeholder-neptune.jpg' },
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
    <div className="explore-page">
      <div className="explore-header">
        <h2>Explore the Cosmos</h2>
        <p>Search and discover high-resolution images from across the solar system and beyond.</p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            aria-label="Search by body"
            placeholder="Search by celestial body or title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explore-grid">
        {filtered.length === 0 ? (
          <div className="no-results">No images match your search. Try a different query.</div>
        ) : (
          filtered.map((img, i) => <ImageCard key={i} img={img} />)
        )}
      </div>
    </div>
  )
}
