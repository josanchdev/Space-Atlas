import { Link, NavLink } from 'react-router-dom'
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
          <NavLink to="/news" className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} id="title-font">News</NavLink>
          <NavLink to="/explore" className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} id="title-font">Explore</NavLink>
          <NavLink to="/solar-system" className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} id="title-font">Solar System</NavLink>
          <NavLink to="/space-missions" className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} id="title-font">Space Missions</NavLink>
        </nav>

        <div className="aa-actions">
          <Link to="/login" className="aa-btn-secondary" id="title-font">Sign In</Link>
          <Link to="/scientists" className="aa-btn" id="title-font">Access for scientists</Link>
        </div>
      </div>
    </header>
  )
}
