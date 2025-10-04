import { useNavigate } from 'react-router-dom'
import { Rocket, Globe } from 'lucide-react'
import '../styles/landing.css'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <h1 className="landing-title">Apollo Atlas</h1>
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
    </div>
  )
}
