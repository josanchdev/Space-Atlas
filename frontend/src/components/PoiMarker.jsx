import { MapPin } from 'lucide-react'
import '../styles/poiMarker.css'

export default function PoiMarker({ poi, onClick }) {
  return (
    <div className="poi-marker" onClick={() => onClick(poi)}>
      <MapPin className="poi-icon" size={24} />
      <div className="poi-label">{poi.title}</div>
    </div>
  )
}