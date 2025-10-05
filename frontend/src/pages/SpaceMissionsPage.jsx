import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import europaImage from '../assets/cardImages/Mision1/Europa_Cliper.webp'
import marsImage from '../assets/cardImages/Mision2/NasaMars.webp'
import artemisImage from '../assets/cardImages/Mision3/ArtemisImage.webp'
import '../styles/spaceMissions.css'

export default function SpaceMissionsPage() {
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [notified, setNotified] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const navigate = useNavigate()

  // Three missions for the carousel
  const missions = [
    {
      id: 1,
      name: 'MARS ROVERS',
      name_en: 'mars',
      description: 'Robotic explorers discovering the secrets of the Red Planet, searching for signs of ancient life and paving the way for human exploration.',
      year: '2020-Present',
      image: marsImage
    },
    {
      id: 2,
      name: 'EUROPA CLIPPER',
      name_en: 'europa',
      description: 'Explore Jupiter\'s icy moon Europa to investigate its potential habitability and search for conditions suitable for life.',
      year: '2024-2030',
      image: europaImage
    },
    
    {
      id: 3,
      name: 'ARTEMIS II',
      name_en: 'artemis',
      description: 'The first crewed mission of the Artemis program. Four astronauts will fly aboard the Orion spacecraft on a lunar flyby, paving the way for sustainable human exploration of the Moon and future crewed missions to Mars.',
      year: 'April 2026',
      image: artemisImage,
      isLocked: true // Future mission - coming soon
    }
  ]

  useEffect(() => {
    setLoading(false)
  }, [])

  const selectMission = (missionNameEn) => {
    navigate(`/space-mission/${missionNameEn}`)
  }

  const handleNotifyMe = () => {
    setNotified(true)
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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && currentSlide < missions.length - 1) {
      nextSlide()
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide()
    }

    setTouchStart(0)
    setTouchEnd(0)
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
        <div 
          className="carousel-track-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {missions.map((mission) => (
              <div key={mission.id} className="carousel-slide">
                <div className="mission-card">
                  {/* Left Side - Mission Info */}
                  <div className="mission-info">
                    <div className="mission-header">
                      <h2 className="mission-name">{mission.name}</h2>
                      {mission.isLocked && (
                        <svg 
                          className="lock-icon" 
                          width="28" 
                          height="28" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" 
                            fill="#ffa726"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="mission-year">{mission.year}</p>
                    <p className="mission-description">{mission.description}</p>
                    {mission.isLocked ? (
                      notified ? (
                        <button 
                          className="notify-me-button notified"
                          disabled
                        >
                          <svg 
                            width="18" 
                            height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: '8px' }}
                          >
                            <path 
                              d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
                              fill="currentColor"
                            />
                          </svg>
                          Notification Set
                        </button>
                      ) : (
                        <button 
                          className="notify-me-button"
                          onClick={handleNotifyMe}
                        >
                          <svg 
                            width="18" 
                            height="18" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: '8px' }}
                          >
                            <path 
                              d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" 
                              fill="currentColor"
                            />
                          </svg>
                          Notify Me
                        </button>
                      )
                    ) : (
                      <button 
                        className="select-mission-button"
                        onClick={() => selectMission(mission.name_en)}
                      >
                        Select Mission
                      </button>
                    )}
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