import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { transformPoisToImages, sortImagesByDate, PLACEHOLDER_IMAGES } from '../utils/imageDataHelpers'
import '../styles/newsPage.css'

function ImageCard({ img, onClick }) {
  return (
    <div className="image-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="image-card-thumbnail">
        {img.thumbnail ? (
          <img src={img.thumbnail} alt={img.title} />
        ) : (
          <div className="placeholder">DZI Preview</div>
        )}
      </div>
      <div className="image-card-content">
        <div className="image-card-title" id="title-font">{img.title || img.filename}</div>
        <div className="image-card-body">{img.body || 'Unknown body'}</div>
      </div>
    </div>
  )
}

export default function NewsPage() {
  const [images, setImages] = useState([])
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
        
        // Sort by date (most recent first) for news page
        const sortedImages = sortImagesByDate(transformedImages)
        
        // Si no hay datos, usar placeholders
        if (sortedImages.length === 0) {
          console.log('No POIs found, using placeholder data')
          setImages(PLACEHOLDER_IMAGES.news)
        } else {
          console.log(`Loaded ${sortedImages.length} images from backend`)
          setImages(sortedImages)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching POIs:', error)
        if (!mounted) return
        // Fallback to placeholder data
        console.log('Using placeholder data due to error')
        setImages(PLACEHOLDER_IMAGES.news)
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleImageClick = (img) => {
    // Extract image name without .dzi extension
    const imageName = String(img.filename).replace(/\.dzi$/i, '')
    const planet = (img.body || '').toLowerCase()
    navigate(`/image/${imageName}?planet=${planet}&source=news&title=${encodeURIComponent(img.title || imageName)}`)
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h2>Latest Space Discoveries</h2>
        <p>Explore the newest high-resolution images from celestial bodies, uploaded by the scientific community.</p>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading latest discoveries...</p>
        </div>
      ) : (
        <div className="news-grid">
          {images.length === 0 ? (
            <div className="no-images">No images found.</div>
          ) : (
            images.map((img, i) => <ImageCard key={img.id || i} img={img} onClick={() => handleImageClick(img)} />)
          )}
        </div>
      )}
    </div>
  )
}
