import { useState } from 'react'
import { Search, Image } from 'lucide-react'
import '../styles/explorePage.css'

export default function ExplorePage() {
  const [query, setQuery] = useState('')

  // Datos de imágenes científicas (los mismos de la landing)
  const images = [
    {
      id: 1,
      title: "James Webb's Deep Field",
      description: "The deepest and sharpest infrared image of the distant universe captured by JWST",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0535%2F0532%2F7303%2Fproducts%2FA0001_-_JWST_Deep_Field-web.jpg%3Fv%3D1657644367&f=1",
      author: "NASA/ESA",
      date: "Oct 2025",
      body: "Deep Space"
    },
    {
      id: 2,
      title: "Pillars of Creation",
      description: "Stunning new view of iconic stellar nursery in the Eagle Nebula",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fscitechdaily.com%2Fimages%2FWebb-Pillars-of-Creation-scaled.jpg&f=1&nofb=1&ipt=4a014a6a24350f4f4a5012a510c237eab192b3655e852e1ca42871d555b7fa1a",
      author: "NASA/JPL",
      date: "Sep 2025",
      body: "Eagle Nebula"
    },
    {
      id: 3,
      title: "Southern Ring Nebula",
      description: "Unprecedented detail of planetary nebula revealing dying star's final moments",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.esa.int%2Fvar%2Fesa%2Fstorage%2Fimages%2Fesa_multimedia%2Fimages%2F2023%2F08%2Fwebb_captures_detailed_beauty_of_ring_nebula_nircam_image%2F25047351-1-eng-GB%2FWebb_captures_detailed_beauty_of_Ring_Nebula_NIRCam_image_pillars.jpg&f=1&nofb=1&ipt=5ef047826c1206ad5ba3e3f9f494ee4f71e2837108b27defb33a6e6f3877df8d",
      author: "ESO",
      date: "Sep 2025",
      body: "Planetary Nebula"
    }
  ]

  const filtered = images.filter((img) => {
    if (!query) return true
    return (
      (img.body || '').toLowerCase().includes(query.toLowerCase()) || 
      (img.title || '').toLowerCase().includes(query.toLowerCase()) ||
      (img.description || '').toLowerCase().includes(query.toLowerCase())
    )
  })

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h2>Explore the Cosmos</h2>
        <p>Search and discover high-resolution images from across the solar system and beyond.</p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">
            <Search size={20} />
          </span>
          <input
            className="search-input"
            aria-label="Search by body"
            placeholder="Search by celestial body or title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explore-grid">
        {filtered.length === 0 ? (
          <div className="no-results">No images match your search. Try a different query.</div>
        ) : (
          filtered.map((image) => (
            <div key={image.id} className="image-card">
              <div className="image-card-media">
                <img src={image.imageUrl} alt={image.title} />
                <div className="image-card-overlay">
                  <button className="view-btn">
                    <Image size={20} />
                    View Details
                  </button>
                </div>
              </div>
              <div className="image-card-content">
                <h3 className="image-card-title">{image.title}</h3>
                <p className="image-card-description">{image.description}</p>
                <div className="image-card-meta">
                  <span className="image-author">{image.author}</span>
                  <span className="image-date">{image.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}