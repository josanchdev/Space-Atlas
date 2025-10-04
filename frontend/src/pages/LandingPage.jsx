import { useNavigate } from 'react-router-dom'
import { Rocket, Globe, Image, Telescope, Zap, Database, Share2, BookOpen, TrendingUp, Star, ArrowRight } from 'lucide-react'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/landing.css'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    window.scrollTo(0, 0)
    navigate(path)
  }

  // Datos de ejemplo de imágenes recientes de la comunidad científica
  const recentImages = [
    {
      id: 1,
      title: "James Webb's Deep Field",
      description: "The deepest and sharpest infrared image of the distant universe captured by JWST",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0535%2F0532%2F7303%2Fproducts%2FA0001_-_JWST_Deep_Field-web.jpg%3Fv%3D1657644367&f=1?w=800&h=600&fit=crop",
      author: "NASA/ESA",
      date: "Oct 2025"
    },
    {
      id: 2,
      title: "Pillars of Creation",
      description: "Stunning new view of iconic stellar nursery in the Eagle Nebula",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fscitechdaily.com%2Fimages%2FWebb-Pillars-of-Creation-scaled.jpg&f=1&nofb=1&ipt=4a014a6a24350f4f4a5012a510c237eab192b3655e852e1ca42871d555b7fa1a?w=800&h=600&fit=crop",
      author: "NASA/JPL",
      date: "Sep 2025"
    },
    {
      id: 3,
      title: "Southern Ring Nebula",
      description: "Unprecedented detail of planetary nebula revealing dying star's final moments",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.esa.int%2Fvar%2Fesa%2Fstorage%2Fimages%2Fesa_multimedia%2Fimages%2F2023%2F08%2Fwebb_captures_detailed_beauty_of_ring_nebula_nircam_image%2F25047351-1-eng-GB%2FWebb_captures_detailed_beauty_of_Ring_Nebula_NIRCam_image_pillars.jpg&f=1&nofb=1&ipt=5ef047826c1206ad5ba3e3f9f494ee4f71e2837108b27defb33a6e6f3877df8d?w=800&h=600&fit=crop",
      author: "ESO",
      date: "Sep 2025"
    }
  ]

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
