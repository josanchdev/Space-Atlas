import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import '../styles/missionDetail.css'

export default function SpaceMissionDetailPage() {
  const { mission_name } = useParams()
  const navigate = useNavigate()
  const [mission, setMission] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch mission details and images from backend
    // Placeholder data
    const placeholderMission = {
      name: mission_name.toUpperCase(),
      description: `Explore the incredible ${mission_name} mission through stunning imagery and detailed information.`,
      year: '2024',
      agency: 'NASA'
    }

    const placeholderImages = [
      {
        id: 1,
        title: `${mission_name} Image 1`,
        thumbnail: null,
        description: 'Mission overview'
      },
      {
        id: 2,
        title: `${mission_name} Image 2`,
        thumbnail: null,
        description: 'Launch sequence'
      },
      {
        id: 3,
        title: `${mission_name} Image 3`,
        thumbnail: null,
        description: 'In orbit'
      }
    ]

    setMission(placeholderMission)
    setImages(placeholderImages)
    setLoading(false)
  }, [mission_name])

  if (loading) {
    return (
      <div className="mission-detail-container">
        <div className="loading">Loading mission details...</div>
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="mission-detail-container">
        <div className="error">Mission not found</div>
      </div>
    )
  }

  return (
    <div className="mission-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate('/space-missions')}
      >
        <ArrowLeft size={24} />
        <span>Back to Missions</span>
      </button>

      <div className="mission-detail-header">
        <h1 className="mission-detail-title">{mission.name}</h1>
        <div className="mission-meta">
          <span className="mission-agency">{mission.agency}</span>
          <span className="mission-separator">•</span>
          <span className="mission-year">{mission.year}</span>
        </div>
        <p className="mission-detail-description">{mission.description}</p>
      </div>

      <div className="mission-images-section">
        <h2 className="section-title">Mission Gallery</h2>
        
        {images.length === 0 ? (
          <div className="no-images">No images available for this mission</div>
        ) : (
          <div className="images-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-wrapper">
                  {image.thumbnail ? (
                    <img src={image.thumbnail} alt={image.title} />
                  ) : (
                    <div className="placeholder-image">
                      <span>Loading...</span>
                    </div>
                  )}
                </div>
                <div className="image-info">
                  <h3 className="image-title">{image.title}</h3>
                  <p className="image-description">{image.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
