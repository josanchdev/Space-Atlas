import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCircle, Mail, Shield, GraduationCap, Building, ArrowLeft } from 'lucide-react'
import '../styles/myProfile.css'

export default function MyProfilePage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      setCurrentUser(JSON.parse(user))
    } else {
      // Si no hay usuario logueado, redirigir al sign-in
      navigate('/signin')
    }
  }, [navigate])

  if (!currentUser) {
    return null
  }

  return (
    <div className="myprofile-wrapper">
      <div className="myprofile-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="myprofile-container">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="myprofile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <UserCircle size={80} />
            </div>
            <h1 className="profile-name">{currentUser.name}</h1>
            <div className="profile-role">
              {currentUser.role === 'scientist' ? (
                <span className="role-badge scientist">
                  <GraduationCap size={16} />
                  Scientist
                </span>
              ) : (
                <span className="role-badge user">
                  <Shield size={16} />
                  Explorer
                </span>
              )}
            </div>
          </div>

          <div className="profile-info">
            <h2 className="section-title">Profile Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <Mail size={18} />
                  Email
                </div>
                <div className="info-value">{currentUser.email}</div>
              </div>

              {currentUser.role === 'scientist' && (
                <>
                  {currentUser.orcid && (
                    <div className="info-item">
                      <div className="info-label">
                        <Shield size={18} />
                        ORCID iD
                      </div>
                      <div className="info-value">{currentUser.orcid}</div>
                    </div>
                  )}

                  {currentUser.institution && (
                    <div className="info-item">
                      <div className="info-label">
                        <Building size={18} />
                        Institution
                      </div>
                      <div className="info-value">{currentUser.institution}</div>
                    </div>
                  )}
                </>
              )}

              <div className="info-item">
                <div className="info-label">
                  <UserCircle size={18} />
                  Account Type
                </div>
                <div className="info-value">
                  {currentUser.role === 'scientist' ? 'Verified Scientist' : 'Space Explorer'}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="action-button primary"
              onClick={() => navigate(currentUser.role === 'scientist' ? '/content-manager' : '/mybookmarks')}
            >
              {currentUser.role === 'scientist' ? 'Manage Content' : 'View My Bookmarks'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
