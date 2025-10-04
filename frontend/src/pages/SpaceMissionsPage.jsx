import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/spaceMissions.css'

export default function SpaceMissionsPage() {
  const [missions, setMissions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // TODO: Fetch missions from backend
    // Placeholder data for now
    const placeholderMissions = [
      {
        id: 1,
        name: 'MISIÓN ARTEMIS',
        name_en: 'artemis',
        description: 'Return humans to the Moon and establish a sustainable presence',
        image: null, // Will be loaded from backend
        year: '2024-2026'
      },
      {
        id: 2,
        name: 'MISIÓN APOLLO',
        name_en: 'apollo',
        description: 'Historic mission that first landed humans on the Moon',
        image: null,
        year: '1969-1972'
      },
      {
        id: 3,
        name: 'MISIÓN VOYAGER',
        name_en: 'voyager',
        description: 'Exploring the outer planets and beyond our solar system',
        image: null,
        year: '1977-Present'
      }
    ]
    setMissions(placeholderMissions)
    setLoading(false)
  }, [])

  const nextMission = () => {
    setCurrentIndex((prev) => (prev + 1) % missions.length)
  }

  const prevMission = () => {
    setCurrentIndex((prev) => (prev - 1 + missions.length) % missions.length)
  }

  const selectMission = () => {
    if (missions[currentIndex]) {
      navigate(`/space-mission/${missions[currentIndex].name_en}`)
    }
  }

  if (loading) {
    return (
      <div className="missions-container">
        <div className="loading">Loading missions...</div>
      </div>
    )
  }

  if (missions.length === 0) {
    return (
      <div className="missions-container">
        <div className="no-missions">No missions available</div>
      </div>
    )
  }

  const currentMission = missions[currentIndex]

  return (
    <div className="missions-container">
      <div className="missions-header">
        <h1 className="missions-title">ELIGE TU MISIÓN</h1>
      </div>

      <div className="mission-carousel">
        <button 
          className="carousel-button prev"
          onClick={prevMission}
          aria-label="Previous mission"
        >
          <ChevronLeft size={40} />
        </button>

        <div className="mission-display">
          <div className="mission-planet">
            {currentMission.image ? (
              <img src={currentMission.image} alt={currentMission.name} />
            ) : (
              <div className="placeholder-planet">
                {/* Placeholder for 3D model or image */}
                <div className="planet-circle"></div>
              </div>
            )}
          </div>
          
          <div className="mission-info">
            <h2 className="mission-name">{currentMission.name}</h2>
            <p className="mission-year">{currentMission.year}</p>
            <p className="mission-description">{currentMission.description}</p>
          </div>
        </div>

        <button 
          className="carousel-button next"
          onClick={nextMission}
          aria-label="Next mission"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <button 
        className="select-mission-button"
        onClick={selectMission}
      >
        Seleccionar misión
      </button>

      <div className="mission-indicators">
        {missions.map((_, index) => (
          <span 
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
