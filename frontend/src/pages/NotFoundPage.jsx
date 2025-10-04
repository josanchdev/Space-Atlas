import { useNavigate } from 'react-router-dom'
import '../styles/notFound.css'
import errorGif from '../assets/errorGif/gifError.gif'

function NotFoundPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    window.scrollTo(0, 0)
    navigate('/')
  }

  const handleExplore = () => {
    window.scrollTo(0, 0)
    navigate('/solar-system')
  }

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">
            <img src={errorGif} alt="Error animation" style={{ maxWidth: '100%', height: 'auto' }}/>
        </div>
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
            onClick={handleGoHome}
          >
            Go Home
          </button>
          <button 
            className="btn-explore" 
            onClick={handleExplore}
          >
            Explore Solar System
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
