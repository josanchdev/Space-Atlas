import { MapPin } from 'lucide-react'
import '../styles/poiMarker.css'

/**
 * POIMarker Component
 * 2D marker for Points of Interest on images (ImageViewer)
 * 
 * @param {Object} poi - POI data object with title, description, lat, lon
 * @param {Function} onClick - Callback when marker is clicked
 */
export default function POIMarker({ poi, onClick }) {
  const handleContextMenu = (e) => {
    // Prevenir el menú contextual por defecto del navegador
    e.preventDefault()
    e.stopPropagation()
    
    if (onClick) {
      onClick(poi)
    }
  }

  return (
    <div 
      className="poi-marker" 
      onContextMenu={handleContextMenu}
      title="Right click to see details"
    >
      <MapPin className="poi-icon" size={24} />
      <div className="poi-label">{poi.title}</div>
    </div>
  )
}
