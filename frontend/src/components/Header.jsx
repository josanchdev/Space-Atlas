import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/header.css'

export default function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (path) => {
    // Cerrar el menú móvil
    setIsMenuOpen(false)
    
    // Si ya estamos en la página actual, hacer scroll suave al top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Si navegamos a otra página, asegurar que empiece desde arriba
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="aa-header">
      <div className="aa-header-inner">
        <Link 
          to="/" 
          onClick={() => handleNavClick('/')}
          className="aa-brand" 
          style={{ textDecoration: 'none', color: 'inherit' }} 
          aria-label="Home"
        >
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

        {/* Hamburger Menu Button */}
        <button 
          className={`aa-hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`aa-nav ${isMenuOpen ? 'active' : ''}`}>
          <NavLink 
            to="/news" 
            onClick={() => handleNavClick('/news')}
            className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} 
            id="title-font"
          >
            News
          </NavLink>
          <NavLink 
            to="/explore" 
            onClick={() => handleNavClick('/explore')}
            className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} 
            id="title-font"
          >
            Explore
          </NavLink>
          <NavLink 
            to="/solar-system" 
            onClick={() => handleNavClick('/solar-system')}
            className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} 
            id="title-font"
          >
            Solar System
          </NavLink>
          <NavLink 
            to="/space-missions" 
            onClick={() => handleNavClick('/space-missions')}
            className={({ isActive }) => isActive ? "aa-nav-link aa-nav-link-active" : "aa-nav-link"} 
            id="title-font"
          >
            Space Missions
          </NavLink>
          
          {/* Actions dentro del menú móvil */}
          <div className="aa-nav-actions">
            <Link 
              to="/signin" 
              onClick={() => handleNavClick('/signin')}
              className="aa-btn-secondary"
            >
              Sign In
            </Link>
            <Link 
              to="/scientist-auth" 
              onClick={() => handleNavClick('/scientist-auth')}
              className="aa-btn"
            >
              Access for scientists
            </Link>
          </div>
        </nav>

        <div className="aa-actions aa-actions-desktop">
          <Link 
            to="/signin" 
            onClick={() => handleNavClick('/signin')}
            className="aa-btn-secondary"
          >
            Sign In
          </Link>
          <Link 
            to="/scientist-auth" 
            onClick={() => handleNavClick('/scientist-auth')}
            className="aa-btn"
          >
            Access for scientists
          </Link>
        </div>
      </div>
    </header>
  )
}