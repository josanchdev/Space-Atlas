import { useEffect, useRef, useState } from 'react'
import OpenSeadragon from 'openseadragon'
import PoiMarker from './PoiMarker'
import { X } from 'lucide-react'
import '../styles/poiMarker.css'

/**
 * DziViewer Component
 * Renders a Deep Zoom Image viewer using OpenSeadragon with POI overlays
 * 
 * @param {string} dziUrl - URL to the .dzi file
 * @param {string} imageName - Name of the image for display
 * @param {Array} pois - Array of POIs to display (optional)
 */
export default function DziViewer({ dziUrl, imageName, pois = [] }) {
  const viewerRef = useRef(null)
  const viewerInstance = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPoi, setSelectedPoi] = useState(null)
  const overlaysRef = useRef([])

  useEffect(() => {
    if (!dziUrl || !viewerRef.current) return

    // Cleanup previous viewer instance
    if (viewerInstance.current) {
      viewerInstance.current.destroy()
      viewerInstance.current = null
    }

    setIsLoading(true)
    setError(null)

    try {
      // Initialize OpenSeadragon viewer
      viewerInstance.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@4.1/build/openseadragon/images/',
        tileSources: dziUrl
      })

      viewerInstance.current.addHandler('open', () => {
        setIsLoading(false)
        console.log('DZI image loaded successfully')
        
        // Añadir POIs después de que la imagen se cargue
        if (pois && pois.length > 0) {
          addPoiOverlays(pois)
        }
      })

      viewerInstance.current.addHandler('open-failed', (event) => {
        setIsLoading(false)
        setError(`Failed to load image: ${event.message || 'Unknown error'}`)
        console.error('Failed to open DZI:', event)
      })

      viewerInstance.current.addHandler('tile-load-failed', (event) => {
        console.warn('Tile load failed:', event)
      })

    } catch (err) {
      setIsLoading(false)
      setError(`Error initializing viewer: ${err.message}`)
      console.error('Error initializing OpenSeadragon:', err)
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy()
        viewerInstance.current = null
      }
    }
  }, [dziUrl])

  // Actualizar POIs cuando cambien
  useEffect(() => {
    if (viewerInstance.current && pois && pois.length > 0) {
      addPoiOverlays(pois)
    }
  }, [pois])

  /**
   * Convierte coordenadas lat/lon a coordenadas normalizadas de OpenSeadragon (0-1)
   * Basado en el sistema de coordenadas planetario estándar
   * AJUSTE: La imagen parece ocupar solo la mitad superior, así que mapeamos a [0, 0.5] en Y
   * @param {number} lat - Latitud (-90 a 90)
   * @param {number} lon - Longitud (-180 a 180)
   * @returns {Object} - { x, y } en coordenadas normalizadas
   */
  const latLonToNormalized = (lat, lon) => {
    const latMin = -90
    const latMax = 90
    const lonMin = -180
    const lonMax = 180
    
    // Offset vertical para ajuste fino (positivo = bajar, negativo = subir)
    const yOffset = 0.0 // Ajusta este valor si necesitas más o menos corrección
    
    // Normalizar longitud: lon -> x (rango completo [0, 1])
    // lonMin (-180) -> 0, lonMax (180) -> 1
    const x = (lon - lonMin) / (lonMax - lonMin)
    
    // Normalizar latitud: lat -> y (invertido y comprimido a la mitad)
    // latMax (90) -> 0 (arriba), latMin (-90) -> 0.5 (mitad de la imagen)
    const y = ((latMax - lat) / (latMax - latMin)) * 0.5 + yOffset
    
    return { x, y }
  }

  /**
   * Añade overlays de POIs sobre la imagen
   * @param {Array} poisArray - Array de POIs
   */
  const addPoiOverlays = (poisArray) => {
    if (!viewerInstance.current) return

    // Limpiar overlays anteriores
    overlaysRef.current.forEach(overlay => {
      viewerInstance.current.removeOverlay(overlay)
    })
    overlaysRef.current = []

    // Añadir nuevos overlays
    poisArray.forEach(poi => {
      const { x, y } = latLonToNormalized(poi.lat, poi.lon)
      
      // Crear elemento del marcador
      const markerElement = document.createElement('div')
      markerElement.className = 'poi-overlay-wrapper'
      
      // Crear el marcador React y renderizarlo
      const markerContainer = document.createElement('div')
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(markerContainer)
        root.render(
          <PoiMarker poi={poi} onClick={handlePoiClick} />
        )
      })
      
      markerElement.appendChild(markerContainer)
      
      // Añadir overlay a OpenSeadragon
      // Usar CENTER y ajustar con CSS transform para que la punta del icono sea el anclaje
      viewerInstance.current.addOverlay({
        element: markerElement,
        location: new OpenSeadragon.Point(x, y),
        placement: OpenSeadragon.Placement.CENTER,
        checkResize: false
      })
      
      overlaysRef.current.push(markerElement)
    })
  }

  /**
   * Maneja el click en un POI
   * @param {Object} poi - POI seleccionado
   */
  const handlePoiClick = (poi) => {
    setSelectedPoi(poi)
    
    // Hacer zoom al POI
    if (viewerInstance.current) {
      const { x, y } = latLonToNormalized(poi.lat, poi.lon)
      viewerInstance.current.viewport.panTo(
        new OpenSeadragon.Point(x, y),
        true
      )
      viewerInstance.current.viewport.zoomTo(
        viewerInstance.current.viewport.getMaxZoom() * 0.5,
        new OpenSeadragon.Point(x, y),
        true
      )
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          color: '#90CAF9',
          fontSize: '16px'
        }}>
          Loading image...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          color: '#ff6b6b',
          fontSize: '16px',
          textAlign: 'center',
          padding: '20px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          maxWidth: '80%'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* OpenSeadragon viewer container */}
      <div
        ref={viewerRef}
        style={{
          width: '100%',
          height: '100%',
          background: '#000'
        }}
      />

      {/* Panel de información del POI seleccionado */}
      {selectedPoi && (
        <div className="poi-info-panel">
          <button 
            className="poi-close-btn"
            onClick={() => setSelectedPoi(null)}
          >
            <X size={16} />
          </button>
          <h3 className="poi-title">{selectedPoi.title}</h3>
          <p className="poi-description">{selectedPoi.description}</p>
          <div className="poi-coords">
            <span>Lat: {selectedPoi.lat.toFixed(2)}°</span>
            <span>Lon: {selectedPoi.lon.toFixed(2)}°</span>
          </div>
        </div>
      )}
    </div>
  )
}
