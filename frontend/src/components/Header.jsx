import { Link } from 'react-router-dom'
import '../styles/header.css'

export default function Header() {
  return (
    <header className="aa-header">
      <div className="aa-header-inner">
        <Link to="/" className="aa-brand" style={{ textDecoration: 'none', color: 'inherit' }} aria-label="Home">
          <div className="aa-logo" aria-hidden>
            {/* stylized orbit */}
            <svg viewBox="0 0 64 64" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="10" fill="#FFD54F" />
              <ellipse cx="32" cy="32" rx="22" ry="8" stroke="#90CAF9" strokeWidth="1.6" fill="none" opacity="0.7" />
              <circle cx="48" cy="30" r="3" fill="#90CAF9" />
            </svg>
          </div>
          <div className="aa-title">
            <div className="aa-title-main">Apollo Atlas</div>
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
