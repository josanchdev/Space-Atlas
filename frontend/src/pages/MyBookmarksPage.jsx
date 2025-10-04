import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, ArrowLeft, Image as ImageIcon, Calendar, MapPin } from 'lucide-react'
import '../styles/myBookmarks.css'

export default function MyBookmarksPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const userData = JSON.parse(user)
      setCurrentUser(userData)
      
      // Cargar bookmarks del usuario desde localStorage
      const userBookmarks = localStorage.getItem(`bookmarks_${userData.email}`)
      if (userBookmarks) {
        setBookmarks(JSON.parse(userBookmarks))
      } else {
        // Bookmarks de ejemplo para demostración
        setBookmarks([
          {
            id: 1,
            title: "James Webb Deep Field",
            description: "The deepest infrared image of the universe",
            imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0535%2F0532%2F7303%2Fproducts%2FA0001_-_JWST_Deep_Field-web.jpg%3Fv%3D1657644367&f=1",
            location: "Deep Space",
            date: "2024-10-01"
          },
          {
            id: 2,
            title: "Pillars of Creation",
            description: "Stellar nursery in the Eagle Nebula",
            imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fscitechdaily.com%2Fimages%2FWebb-Pillars-of-Creation-scaled.jpg&f=1&nofb=1&ipt=4a014a6a24350f4f4a5012a510c237eab192b3655e852e1ca42871d555b7fa1a",
            location: "Eagle Nebula",
            date: "2024-09-15"
          }
        ])
      }
    } else {
      navigate('/signin')
    }
  }, [navigate])

  const handleViewImage = (bookmark) => {
    // Aquí se podría abrir un modal o navegar a una vista detallada
    console.log('Viewing bookmark:', bookmark)
    // Por ahora, simplemente abre la imagen en una nueva pestaña
    window.open(bookmark.imageUrl, '_blank')
  }

  const handleRemoveBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId)
    setBookmarks(updatedBookmarks)
    
    if (currentUser) {
      localStorage.setItem(`bookmarks_${currentUser.email}`, JSON.stringify(updatedBookmarks))
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="mybookmarks-wrapper">
      <div className="mybookmarks-background">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="mybookmarks-container">
        <div className="mybookmarks-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="header-content">
            <Bookmark size={40} className="header-icon" />
            <h1 className="page-title">My Bookmarks</h1>
            <p className="page-subtitle">
              {bookmarks.length} saved {bookmarks.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={64} className="empty-icon" />
            <h2>No bookmarks yet</h2>
            <p>Start exploring and save your favorite discoveries!</p>
            <button 
              className="explore-button"
              onClick={() => navigate('/explore')}
            >
              Explore Now
            </button>
          </div>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark-card">
                <div className="bookmark-image">
                  <img src={bookmark.imageUrl} alt={bookmark.title} />
                  <div className="bookmark-overlay">
                    <button 
                      className="view-button"
                      onClick={() => handleViewImage(bookmark)}
                    >
                      <ImageIcon size={20} />
                      View Image
                    </button>
                  </div>
                </div>

                <div className="bookmark-content">
                  <h3 className="bookmark-title">{bookmark.title}</h3>
                  <p className="bookmark-description">{bookmark.description}</p>

                  <div className="bookmark-meta">
                    <div className="meta-item">
                      <MapPin size={14} />
                      <span>{bookmark.location}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{bookmark.date}</span>
                    </div>
                  </div>

                  <div className="bookmark-actions">
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveBookmark(bookmark.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
