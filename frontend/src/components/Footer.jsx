import { Github, Mail, Instagram } from 'lucide-react'
import logoSpaceAtlas from '../assets/logo/LogoSpaceAtlas.webp'
import '../styles/landing.css'

export default function Footer() {
  return (
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
            <a href="https://github.com/josanchdev/Space-Atlas" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="X (Twitter)">
              <svg width="24" height="22" viewBox="0 0 300 271" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"/>
              </svg>
            </a>
            <a href="mailto:contact@spaceatlas.earth" className="social-link" aria-label="Email">
              <Mail size={24} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <Instagram size={24} />
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
  )
}
