import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import artemisImage from '../assets/cardImages/Mision1/ArtemisImage.webp'
import marsImage from '../assets/cardImages/Mision2/NasaMars.webp'
import '../styles/spaceMissions.css'

export default function SpaceMissionsPage() {
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  // Tres misiones para el carrusel
  const missions = [
    {
      id: 1,
      name: 'MISIÓN ARTEMIS',
      name_en: 'artemis',
      description: 'Return humans to the Moon and establish a sustainable presence for exploration and science.',
      year: '2024-2026',
      image: artemisImage
    },
    {
      id: 2,
      name: 'SONDA VOYAGER  ',
      name_en: 'mars',
      description: 'Pioneer the future of human spaceflight and establish the first colony on the Red Planet.',
      year: '2030-2035',
      image: marsImage // Placeholder para imagen futura
    },
    {
      id: 3,
      name: 'GATEWAY STATION',
      name_en: 'gateway',
      description: 'Build a lunar orbiting outpost to support deep space exploration and scientific research.',
      year: '2027-2029',
      image: null // Placeholder para imagen futura
    }
  ]

  useEffect(() => {
    setLoading(false)
  }, [])

  const selectMission = (missionNameEn) => {
    navigate(`/space-mission/${missionNameEn}`)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % missions.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + missions.length) % missions.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="missions-container">
        <div className="loading">Loading missions...</div>
      </div>
    )
  }

  return (
    <div className="missions-container">
      <div className="carousel-container">
        {/* Navigation Arrows */}
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Carousel Track */}
        <div className="carousel-track-container">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {missions.map((mission) => (
              <div key={mission.id} className="carousel-slide">
                <div className="mission-card">
                  {/* Left Side - Mission Info */}
                  <div className="mission-info">
                    <h2 className="mission-name">{mission.name}</h2>
                    <p className="mission-year">{mission.year}</p>
                    <p className="mission-description">{mission.description}</p>
                    <button 
                      className="select-mission-button"
                      onClick={() => selectMission(mission.name_en)}
                    >
                      Seleccionar misión
                    </button>
                  </div>

                  {/* Right Side - Image Placeholder */}
                  <div className="mission-image-container">
                    {mission.image ? (
                      <img 
                        src={mission.image} 
                        alt={mission.name}
                        className="mission-image"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor" opacity="0.3"/>
                        </svg>
                        <p>Image coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="carousel-dots">
          {missions.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
