import { useNavigate } from 'react-router-dom'
import '../styles/notFound.css'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Houston, We Have a Problem</h1>
        <p className="error-description">
          The page you're looking for doesn't exist in our solar system.
        </p>
        <p className="error-subtitle">
          It seems you've gotten lost in space...
        </p>
        <div className="error-actions">
          <button 
            className="btn-home" 
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
          <button 
            className="btn-explore" 
            onClick={() => navigate('/solar-system')}
          >
            Explore Solar System
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
