import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Bookmark, MessageSquare, Share2 } from 'lucide-react'
import DziViewer from '../components/DziViewer'
import '../styles/imageViewer.css'

/**
 * ImageViewerPage Component
 * Universal page for viewing DZI images from any source:
 * - Landing page (recent images)
 * - Explore page
 * - News page
 * - Planet pages
 * - Bookmarks (user or scientist)
 */
export default function ImageViewerPage() {
  const { image_name } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Optional query params for additional context
  const planet = searchParams.get('planet') // e.g., "mars", "earth"
  const source = searchParams.get('source') // e.g., "landing", "explore", "news", "bookmarks"
  const title = searchParams.get('title') || image_name
  
  const [imageData, setImageData] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get API base URL from environment
  const apiBase = import.meta.env?.BACKEND_URL || 'http://localhost:3000/api'

  useEffect(() => {
    // Fetch image metadata from backend
    const fetchImageData = async () => {
      setIsLoading(true)
      try {
        // If we have planet info, use planet-specific endpoint
        const endpoint = planet 
          ? `${apiBase}/dzi/${planet}/out_dzi.dzi`
          : `${apiBase}/dzi/${image_name}/out_dzi.dzi`

        const response = await fetch(endpoint)
        if (response.ok) {
          const data = await response.json()
          setImageData(data)
        } else {
          console.warn('Image metadata not found, using defaults')
          setImageData({
            name: image_name,
            title: title,
            planet: planet,
            dziUrl: getDziUrl()
          })
        }
      } catch (error) {
        console.error('Error fetching image data:', error)
        // Fallback to constructing URL manually
        setImageData({
          name: image_name,
          title: title,
          planet: planet,
          dziUrl: getDziUrl()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchImageData()
    
    // Check if image is bookmarked (from localStorage or API)
    checkBookmarkStatus()
  }, [image_name, planet])

  // Construct DZI URL
  const getDziUrl = () => {
    if (planet) {
      return `${apiBase}/dzi/${planet}/out_dzi.dzi`
    }
    return `${apiBase}/dzi/${image_name}/out_dzi.dzi`
  }

  const checkBookmarkStatus = () => {
    // TODO: Implement with actual API/authentication
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.includes(image_name))
  }

  const handleBookmark = () => {
    // TODO: Implement with actual API/authentication
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    if (isBookmarked) {
      const filtered = bookmarks.filter(b => b !== image_name)
      localStorage.setItem('bookmarks', JSON.stringify(filtered))
      setIsBookmarked(false)
    } else {
      bookmarks.push(image_name)
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      setIsBookmarked(true)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: imageData?.title || image_name,
          text: `Check out this amazing space image: ${imageData?.title || image_name}`,
          url: url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  const handleBack = () => {
    // Navigate back to source if available, otherwise go to explore
    if (source === 'landing') {
      navigate('/')
    } else if (source === 'explore') {
      navigate('/explore')
    } else if (source === 'news') {
      navigate('/news')
    } else if (source === 'bookmarks') {
      navigate('/mybookmarks')
    } else if (planet) {
      navigate(`/${planet}`)
    } else {
      navigate(-1)
    }
  }

  const dziUrl = imageData?.dziUrl || getDziUrl()

  return (
    <div className="image-viewer-page">
      {/* Top bar with controls */}
      <div className="image-viewer-topbar">
        <button onClick={handleBack} className="back-button">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="image-title">
          <h1>{imageData?.title || title || image_name}</h1>
          {planet && <span className="planet-badge">{planet.toUpperCase()}</span>}
        </div>

        <div className="image-actions">
          <button
            onClick={handleBookmark}
            className={`action-button ${isBookmarked ? 'active' : ''}`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="action-button"
            title="Comments"
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={handleShare}
            className="action-button"
            title="Share"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Main viewer area */}
      <div className="image-viewer-container">
        {isLoading ? (
          <div className="viewer-loading">
            <div className="loading-spinner">⏳</div>
            <p>Loading viewer...</p>
          </div>
        ) : (
          <DziViewer 
            dziUrl={dziUrl} 
            imageName={image_name}
          />
        )}
      </div>

      {/* Side panel for comments (optional) */}
      {showComments && (
        <div className="comments-panel">
          <div className="comments-header">
            <h3>Comments</h3>
            <button onClick={() => setShowComments(false)} className="close-button">×</button>
          </div>
          <div className="comments-content">
            <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px' }}>
              Comments feature coming soon...
            </p>
          </div>
        </div>
      )}

      {/* Image metadata panel (bottom) */}
      {imageData && (
        <div className="image-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Image Name:</span>
            <span className="metadata-value">{image_name}</span>
          </div>
          {imageData.description && (
            <div className="metadata-item">
              <span className="metadata-label">Description:</span>
              <span className="metadata-value">{imageData.description}</span>
            </div>
          )}
          {imageData.date && (
            <div className="metadata-item">
              <span className="metadata-label">Date:</span>
              <span className="metadata-value">{imageData.date}</span>
            </div>
          )}
          {imageData.source && (
            <div className="metadata-item">
              <span className="metadata-label">Source:</span>
              <span className="metadata-value">{imageData.source}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
