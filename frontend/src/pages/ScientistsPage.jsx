import { useState, useEffect } from 'react'
import '../styles/scientistsPage.css'

export default function ScientistsPage() {
  const [planet, setPlanet] = useState('earth')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [markers, setMarkers] = useState([])
  const [images, setImages] = useState([])
  const [markerForm, setMarkerForm] = useState({ x: '', y: '', title: '', imageId: '' })
  const [isUploading, setIsUploading] = useState(false)

  const planets = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'other']

  useEffect(() => {
    loadImages()
    loadMarkers()
  }, [planet])

  async function loadImages() {
    try {
      const res = await fetch(`/api/images/${planet}`)
      if (!res.ok) throw new Error('Failed to load images')
      const json = await res.json()
      setImages(json.images || [])
    } catch (err) {
      console.error('Error loading images:', err)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) {
      showMessage('Please select a TIFF file', 'error')
      return
    }
    
    setIsUploading(true)
    const fd = new FormData()
    fd.append('planet', planet)
    fd.append('file', file)
    showMessage('Uploading image...', 'info')
    
    try {
      const res = await fetch('/api/images/upload-tiff', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || JSON.stringify(json))
      showMessage(`Image uploaded successfully: ${json.title || json.id}`, 'success')
      setFile(null)
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
      loadImages()
    } catch (err) {
      showMessage('Upload failed: ' + String(err), 'error')
    } finally {
      setIsUploading(false)
    }
  }

  async function loadMarkers() {
    try {
      const res = await fetch(`/api/markers/${planet}`)
      if (!res.ok) throw new Error('Failed to load markers')
      const json = await res.json()
      setMarkers(json.markers || [])
    } catch (err) {
      console.error('Error loading markers:', err)
    }
  }

  async function addMarker(e) {
    e.preventDefault()
    if (!markerForm.x || !markerForm.y || !markerForm.title) {
      showMessage('Please fill all marker fields', 'error')
      return
    }
    
    try {
      const body = { planet, ...markerForm }
      const res = await fetch('/api/markers', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || JSON.stringify(json))
      showMessage('Marker added successfully', 'success')
      setMarkerForm({ x: '', y: '', title: '', imageId: '' })
      loadMarkers()
    } catch (err) {
      showMessage('Failed to add marker: ' + String(err), 'error')
    }
  }

  function showMessage(msg, type = 'info') {
    setMessage(msg)
    setMessageType(type)
  }

  function getImageNameById(imageId) {
    const image = images.find(img => img.id === imageId)
    return image ? image.title || image.filename : 'Unknown image'
  }

  return (
    <main className="scientists-page">
      <div className="scientists-content">
        <header className="scientists-header">
          <h2>Scientists Portal</h2>
          <p>Upload high-resolution TIFF images and create markers for planetary exploration</p>
        </header>

        {/* Upload Section */}
        <section className="upload-section">
          <h3>Upload TIFF Image</h3>
          <form className="upload-form" onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="planet-select">Select Planet</label>
              <select 
                id="planet-select"
                value={planet} 
                onChange={(e) => setPlanet(e.target.value)}
                className="planet-selector"
              >
                {planets.map(p => (
                  <option key={p} value={p}>
                    {p === 'other' ? 'Other images' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Image File (.tiff format)</label>
              <div className="file-input-wrapper">
                <input 
                  id="file-input"
                  type="file" 
                  accept=".tif,.tiff,image/tiff" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <label 
                  htmlFor="file-input" 
                  className={`file-input-label ${file ? 'has-file' : ''}`}
                >
                  <span>{file ? `📄 ${file.name}` : '📁 Choose a TIFF file'}</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="upload-button"
              disabled={isUploading || !file}
            >
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>

          {message && (
            <div className={`status-message ${messageType}`}>
              {message}
            </div>
          )}
        </section>

        {/* Images and Markers Grid */}
        <div className="data-grid">
          {/* Uploaded Images Section */}
          <section className="data-section">
            <h3>
              <span>
                <span className="section-icon">🖼️</span> Uploaded Images
              </span>
              <button onClick={loadImages} className="refresh-button">
                🔄 Refresh
              </button>
            </h3>
            
            <div className="images-list">
              {images.length === 0 ? (
                <div className="empty-state">
                  No images uploaded yet
                </div>
              ) : (
                images.map((img) => (
                  <div key={img.id} className="image-item">
                    <div className="image-item-title">
                      {img.title || img.filename || `Image ${img.id}`}
                    </div>
                    <div className="image-item-meta">
                      <span className="image-item-planet">{planet}</span>
                      {img.uploadedAt && (
                        <span>{new Date(img.uploadedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Markers Section */}
          <section className="data-section">
            <h3>
              <span>
                <span className="section-icon">📍</span> Markers
              </span>
              <button onClick={loadMarkers} className="refresh-button">
                🔄 Refresh
              </button>
            </h3>

            <div className="add-marker-form">
              <h4>Add New Marker</h4>
              <form onSubmit={addMarker}>
                <div className="marker-inputs">
                  <input 
                    type="number"
                    step="any"
                    placeholder="X coordinate" 
                    value={markerForm.x} 
                    onChange={(e) => setMarkerForm({ ...markerForm, x: e.target.value })}
                    className="marker-input"
                  />
                  <input 
                    type="number"
                    step="any"
                    placeholder="Y coordinate" 
                    value={markerForm.y} 
                    onChange={(e) => setMarkerForm({ ...markerForm, y: e.target.value })}
                    className="marker-input"
                  />
                  <input 
                    type="text"
                    placeholder="Marker title" 
                    value={markerForm.title} 
                    onChange={(e) => setMarkerForm({ ...markerForm, title: e.target.value })}
                    className="marker-input"
                  />
                  <button type="submit" className="add-marker-button">
                    + Add
                  </button>
                </div>
              </form>
            </div>
            
            <div className="markers-list">
              {markers.length === 0 ? (
                <div className="empty-state">
                  No markers created yet
                </div>
              ) : (
                markers.map((m) => (
                  <div key={m.id} className="marker-item">
                    <div className="marker-item-title">
                      {m.title}
                    </div>
                    <div className="marker-item-coords">
                      X: {m.x}, Y: {m.y}
                    </div>
                    {m.imageId && (
                      <div className="marker-item-image">
                        Image: {getImageNameById(m.imageId)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
