import { Link } from 'react-router-dom'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/header.css'

export default function Header() {
  return (
    <header className="aa-header">
      <div className="aa-header-inner">
        <Link to="/" className="aa-brand" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Home">
          <div className="aa-logo">
            <img 
              src={logoSpaceAtlas} 
              alt="Space Atlas Logo"
            />
          </div>
          <div className="aa-title">
            <div className="aa-title-main">Space Atlas</div>
            <div className="aa-title-sub">Explore. Upload. Discover.</div>
          </div>
        </Link>

        <nav className="aa-nav">
          <Link to="/news" className="aa-nav-link">News</Link>
          <Link to="/explore" className="aa-nav-link">Explore</Link>
          <Link to="/solar-system" className="aa-nav-link">Solar System</Link>
        </nav>

        <div className="aa-actions">
          <Link to="/scientists" className="aa-btn">Access for scientists</Link>
        </div>
      </div>
    </header>
  )
}
