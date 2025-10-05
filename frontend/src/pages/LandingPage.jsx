import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Rocket, Globe, Image, Telescope, Zap, Database, Share2, BookOpen, TrendingUp, Star, ArrowRight } from 'lucide-react'
import { transformPoisToImages, getRecentImages, PLACEHOLDER_IMAGES } from '../utils/imageDataHelpers'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/landing.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const [recentImages, setRecentImages] = useState(PLACEHOLDER_IMAGES.landing)
  const [isLoading, setIsLoading] = useState(true)
  const apiBase = import.meta.env?.VITE_API_BASE || 'http://localhost:3000/api'

  const handleNavigation = (path) => {
    window.scrollTo(0, 0)
    navigate(path)
  }

  useEffect(() => {
    let mounted = true
    
    // Fetch recent images from backend
    fetch(`${apiBase}/pois`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch')
        return r.json()
      })
      .then((data) => {
        if (!mounted) return
        
        // Transform POIs to image format
        const transformedImages = transformPoisToImages(data)
        
        // Get the 3 most recent images
        const recent = getRecentImages(transformedImages, 3)
        
        // Si no hay datos suficientes, usar placeholders
        if (recent.length === 0) {
          console.log('No recent images found, using placeholder data')
          setRecentImages(PLACEHOLDER_IMAGES.landing)
        } else {
          console.log(`Loaded ${recent.length} recent images from backend`)
          // Añadir imageUrl placeholder si no existe
          const imagesWithUrl = recent.map(img => ({
            ...img,
            imageUrl: img.thumbnail || img.imageUrl || PLACEHOLDER_IMAGES.landing[0].imageUrl,
            author: img.author || 'Scientific Community',
            description: img.description || 'High-resolution image from space exploration'
          }))
          setRecentImages(imagesWithUrl)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching recent images:', error)
        if (!mounted) return
        // Use placeholder data on error
        console.log('Using placeholder data due to error')
        setRecentImages(PLACEHOLDER_IMAGES.landing)
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleImageClick = (image) => {
    const imageName = String(image.filename).replace(/\.dzi$/i, '')
    navigate(`/image/${imageName}?planet=${image.planet}&source=landing&title=${encodeURIComponent(image.title)}`)
  }

  // Features del producto
  const features = [
    {
      icon: <Globe size={48} />,
      title: "Interactive 3D Models",
      description: "Explore planets and celestial bodies with stunning, realistic 3D visualizations that bring the cosmos to your screen."
    },
    {
      icon: <Database size={48} />,
      title: "Scientific Data",
      description: "Access comprehensive data from NASA, ESA, and other space agencies, all in one centralized platform."
    },
    {
      icon: <Share2 size={48} />,
      title: "Community Driven",
      description: "Share discoveries, collaborate with scientists, and contribute to the growing knowledge base."
    },
    {
      icon: <BookOpen size={48} />,
      title: "Educational Resources",
      description: "Learn about space missions, planetary science, and astronomy through curated educational content."
    }
  ]

  // Estadísticas
  const stats = [
    { number: "1000+", label: "3D Models" },
    { number: "500+", label: "Space Missions" },
    { number: "10K+", label: "Community Members" },
    { number: "50K+", label: "Images & Data" }
  ]

  return (
    <div className="landing-wrapper">
      {/* Hero Section - Full viewport height */}
      <section className="landing-hero-section">
        <div className="landing-hero">
          <h1 className="landing-title">Space Atlas</h1>
          <p className="landing-subtitle">Explore. Upload. Discover.</p>
        </div>
        
        <div className="landing-cards">
          <div 
            className="landing-card"
            onClick={() => handleNavigation('/solar-system')}
          >
            <div className="card-icon">
              <Globe size={64} />
            </div>
            <h2 className="card-title">Explore Solar System</h2>
            <p className="card-description">
              Navigate through our solar system in an interactive 3D environment
            </p>
          </div>

          <div 
            className="landing-card"
            onClick={() => handleNavigation('/space-missions')}
          >
            <div className="card-icon">
              <Rocket size={64} />
            </div>
            <h2 className="card-title">Explore Space Missions</h2>
            <p className="card-description">
              Discover historic and current space missions with stunning imagery
            </p>
          </div>
        </div>
      </section>
      
      {/* Sección de imágenes recientes de la comunidad científica */}
      <section className="recent-images-section">
        <div className="section-header">
          <Telescope size={40} className="section-icon" />
          <h2 className="section-title">Recent Scientific Discoveries</h2>
          <p className="section-subtitle">Latest images from the scientific community</p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.6)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Loading recent discoveries...</p>
          </div>
        ) : (
          <div className="recent-images-grid">
            {recentImages.map((image) => (
              <div 
                key={image.id} 
                className="image-card"
                onClick={() => handleImageClick(image)}
                style={{ cursor: 'pointer' }}
              >
                <div className="image-card-media">
                  <img src={image.imageUrl} alt={image.title} />
                  <div className="image-card-overlay">
                    <button className="view-btn">
                      <Image size={20} />
                      View Details
                    </button>
                  </div>
                </div>
                <div className="image-card-content">
                  <h3 className="image-card-title">{image.title}</h3>
                  <p className="image-card-description">{image.description}</p>
                  <div className="image-card-meta">
                    <span className="image-author">{image.author}</span>
                    <span className="image-date">{image.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <Zap size={40} className="section-icon" />
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to explore the universe</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2 className="about-title">About Space Atlas</h2>
            <p className="about-description">
              Space Atlas is your comprehensive platform for exploring the cosmos. We bring together 
              cutting-edge 3D visualization technology, scientific data from leading space agencies, 
              and a vibrant community of space enthusiasts and researchers.
            </p>
            <p className="about-description">
              Our mission is to make space exploration accessible to everyone, from students and 
              educators to professional scientists and curious minds. Whether you're studying 
              planetary orbits, researching space missions, or simply marveling at the beauty 
              of the universe, Space Atlas is your gateway to the stars.
            </p>
            <div className="about-cta">
              <button className="btn-primary" onClick={() => handleNavigation('/explore')}>
                Start Exploring
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop" 
              alt="Space Exploration" 
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>



      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <Star size={60} className="cta-icon" />
          <h2 className="cta-title">Join the Space Exploration Community</h2>
          <p className="cta-description">
            Be part of a growing community of space enthusiasts, scientists, and explorers. 
            Share your discoveries, contribute data, and help us map the universe.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => handleNavigation('/scientist-auth')}>
              For Scientists
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => handleNavigation('/explore')}>
              Start Exploring
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
