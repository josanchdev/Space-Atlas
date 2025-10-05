import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { transformPoisToImages, PLACEHOLDER_IMAGES } from '../utils/imageDataHelpers'
import '../styles/explorePage.css'

function ImageCard({ img, onClick }) {
  return (
    <div className="explore-card" onClick={onClick} style={{ cursor: 'pointer' }}>
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
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const apiBase = import.meta.env?.VITE_API_BASE || 'http://localhost:3000/api'

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    
    // Fetch POIs from backend
    fetch(`${apiBase}/pois`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        
        // Transform POIs to image format
        const transformedImages = transformPoisToImages(data)
        
        // Si no hay datos, usar placeholders
        if (transformedImages.length === 0) {
          console.log('No POIs found, using placeholder data')
          setImages(PLACEHOLDER_IMAGES.explore)
        } else {
          console.log(`Loaded ${transformedImages.length} images from backend`)
          setImages(transformedImages)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching POIs:', error)
        if (!mounted) return
        // Fallback a datos de ejemplo si falla la petición
        console.log('Using placeholder data due to error')
        setImages(PLACEHOLDER_IMAGES.explore)
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = images.filter((img) => {
    if (!query) return true
    return (img.body || '').toLowerCase().includes(query.toLowerCase()) || (img.title || '').toLowerCase().includes(query.toLowerCase())
  })

  const handleImageClick = (img) => {
    // Extract image name without .dzi extension
    const imageName = String(img.filename).replace(/\.dzi$/i, '')
    const planet = (img.body || '').toLowerCase()
    navigate(`/image/${imageName}?planet=${planet}&source=explore&title=${encodeURIComponent(img.title || imageName)}`)
  }

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2>Explore the Cosmos</h2>
        <p>Search and discover high-resolution images from across the solar system and beyond.</p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <Search size={20} />
          </span>
          <input
            className="search-input"
            aria-label="Search by body"
            placeholder="Search by celestial body or title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading images...</p>
        </div>
      ) : (
        <div className="explore-grid">
          {filtered.length === 0 ? (
            <div className="no-results">No images match your search. Try a different query.</div>
          ) : (
            filtered.map((img, i) => <ImageCard key={img.id || i} img={img} onClick={() => handleImageClick(img)} />)
          )}
        </div>
      )}
    </div>
  )
}

