import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { UserCircle, LogOut, Bookmark, Settings } from 'lucide-react'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/header.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    // Cargar usuario desde localStorage
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
  }, [location.pathname]) // Recargar cuando cambie la ruta

  useEffect(() => {
    // Cerrar menú de usuario cuando se haga clic fuera
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  useEffect(() => {
    // Bloquear/desbloquear scroll cuando el menú móvil está abierto
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleNavClick = (path) => {
    // Cerrar el menú móvil
    setIsMenuOpen(false)
    setShowUserMenu(false)
    
    // Si ya estamos en la página actual, hacer scroll suave al top
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Si navegamos a otra página, asegurar que empiece desde arriba
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    setShowUserMenu(false)
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleOverlayClick = () => {
    setIsMenuOpen(false)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  return (
    <>
      {/* Overlay para cerrar el menú móvil */}
      {isMenuOpen && (
        <div 
          className="aa-menu-overlay" 
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
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
            {currentUser ? (
              <>
                <Link 
                  to="/myprofile" 
                  onClick={() => handleNavClick('/myprofile')}
                  className="aa-btn-secondary"
                >
                  <UserCircle size={16} />
                  My Profile
                </Link>
                <Link 
                  to={currentUser.role === 'scientist' ? '/content-manager' : '/mybookmarks'}
                  onClick={() => handleNavClick(currentUser.role === 'scientist' ? '/content-manager' : '/mybookmarks')}
                  className="aa-btn"
                >
                  {currentUser.role === 'scientist' ? (
                    <>
                      <Settings size={16} />
                      Manage Content
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} />
                      My Bookmarks
                    </>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="aa-btn-ghost"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>

        <div className="aa-actions aa-actions-desktop">
          {currentUser ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button 
                className="user-menu-button"
                onClick={toggleUserMenu}
              >
                <UserCircle size={24} />
                <span>{currentUser.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link 
                    to="/myprofile" 
                    onClick={() => handleNavClick('/myprofile')}
                    className="user-dropdown-item"
                  >
                    <UserCircle size={18} />
                    My Profile
                  </Link>
                  <Link 
                    to={currentUser.role === 'scientist' ? '/content-manager' : '/mybookmarks'}
                    onClick={() => handleNavClick(currentUser.role === 'scientist' ? '/content-manager' : '/mybookmarks')}
                    className="user-dropdown-item"
                  >
                    {currentUser.role === 'scientist' ? (
                      <>
                        <Settings size={18} />
                        Manage Content
                      </>
                    ) : (
                      <>
                        <Bookmark size={18} />
                        My Bookmarks
                      </>
                    )}
                  </Link>
                  <div className="user-dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="user-dropdown-item"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
    </>
  )
}