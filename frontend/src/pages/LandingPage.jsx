import { useNavigate } from 'react-router-dom'
import { Rocket, Globe, Image, Users, Telescope, Github, Twitter, Mail } from 'lucide-react'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/landing.css'

export default function LandingPage() {
  const navigate = useNavigate()

  // Datos de ejemplo de imágenes recientes de la comunidad científica
  const recentImages = [
    {
      id: 1,
      title: "James Webb's Deep Field",
      description: "The deepest and sharpest infrared image of the distant universe captured by JWST",
      imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
      author: "NASA/ESA",
      date: "Oct 2025"
    },
    {
      id: 2,
      title: "Pillars of Creation",
      description: "Stunning new view of iconic stellar nursery in the Eagle Nebula",
      imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop",
      author: "NASA/JPL",
      date: "Sep 2025"
    },
    {
      id: 3,
      title: "Southern Ring Nebula",
      description: "Unprecedented detail of planetary nebula revealing dying star's final moments",
      imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=600&fit=crop",
      author: "ESO",
      date: "Sep 2025"
    }
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
            onClick={() => navigate('/solar-system')}
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
            onClick={() => navigate('/space-missions')}
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

        <div className="recent-images-grid">
          {recentImages.map((image) => (
            <div key={image.id} className="image-card">
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
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-brand-header">
                <div className="footer-logo">
                  <img 
                    src={logoSpaceAtlas} 
                    alt="Space Atlas Logo"
                  />
                </div>
                <h3 className="footer-brand-name">Space Atlas</h3>
              </div>
              <p className="footer-brand-tagline">Exploring the cosmos, one discovery at a time</p>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li><a href="/solar-system">Solar System</a></li>
              <li><a href="/space-missions">Space Missions</a></li>
              <li><a href="/news">Latest News</a></li>
              <li><a href="/explore">Discover</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Community</h4>
            <ul className="footer-links">
              <li><a href="/scientists">For Scientists</a></li>
              <li><a href="#">Upload Content</a></li>
              <li><a href="#">Contribute</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="GitHub">
                <Github size={24} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail size={24} />
              </a>
              <a href="#" className="social-link" aria-label="Community">
                <Users size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Space Atlas. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
