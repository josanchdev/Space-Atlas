import { useEffect, useRef, useState } from 'react'
import OpenSeadragon from 'openseadragon'
import POIMarker from './POIMarker'
import { X, Bot, Loader2 } from 'lucide-react'
import { poisService } from '../services/poisService'
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
  const [aiExplanation, setAiExplanation] = useState(null)
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [explanationError, setExplanationError] = useState(null)
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
        tileSources: dziUrl,
        // Prevenir menú contextual por defecto de OpenSeadragon
        gestureSettingsTouch: {
          clickToZoom: true
        }
      })
      
      // Prevenir el menú contextual del navegador en el visor
      viewerRef.current.addEventListener('contextmenu', (e) => {
        // Solo prevenir si no es un marcador POI
        if (!e.target.closest('.poi-marker')) {
          e.preventDefault()
        }
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
      // Prevenir el menú contextual por defecto en el contenedor
      markerContainer.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
      
      import('react-dom/client').then(({ createRoot }) => {
        const root = createRoot(markerContainer)
        root.render(
          <POIMarker poi={poi} onClick={handlePoiClick} />
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

  /**
   * Maneja el cierre del sidebar con zoom out
   */
  const handleCloseSidebar = () => {
    // Hacer zoom out completo antes de cerrar
    if (viewerInstance.current) {
      viewerInstance.current.viewport.goHome(true)
    }
    
    // Resetear explicación al cerrar
    setAiExplanation(null)
    setExplanationError(null)
    
    // Pequeño delay para que se vea la animación del zoom
    setTimeout(() => {
      setSelectedPoi(null)
    }, 300)
  }

  /**
   * Maneja el click en el botón de explicación con IA
   */
  const handleExplainClick = async () => {
    if (!selectedPoi) return

    setIsLoadingExplanation(true)
    setExplanationError(null)

    try {
      const response = await poisService.explain({
        title: selectedPoi.title,
        description: selectedPoi.description,
        path: selectedPoi.path
      })

      if (response.success) {
        setAiExplanation(response.response)
      } else {
        setExplanationError('Failed to get explanation')
      }
    } catch (error) {
      console.error('Error explaining POI:', error)
      setExplanationError('Error connecting to AI service')
    } finally {
      setIsLoadingExplanation(false)
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

      {/* Sidebar lateral con información del POI seleccionado */}
      {selectedPoi && (
        <div className="poi-sidebar">
          <div className="poi-sidebar-header">
            <h3 className="poi-sidebar-title">Point of Interest</h3>
            <button 
              className="poi-sidebar-close"
              onClick={handleCloseSidebar}
              title="Close and zoom out"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          
          <div className="poi-sidebar-content">
            <div className="poi-detail-section">
              <h4 className="poi-detail-label">Name</h4>
              <p className="poi-detail-value">{selectedPoi.title}</p>
            </div>

            <div className="poi-detail-section">
              <h4 className="poi-detail-label">Description</h4>
              <p className="poi-detail-value">{selectedPoi.description || 'No description available'}</p>
            </div>

            <div className="poi-detail-section">
              <h4 className="poi-detail-label">Coordinates</h4>
              <div className="poi-coords-grid">
                <div className="poi-coord-item">
                  <span className="poi-coord-label">Latitude</span>
                  <span className="poi-coord-value">{selectedPoi.lat.toFixed(4)}°</span>
                </div>
                <div className="poi-coord-item">
                  <span className="poi-coord-label">Longitude</span>
                  <span className="poi-coord-value">{selectedPoi.lon.toFixed(4)}°</span>
                </div>
              </div>
            </div>

            {selectedPoi.origin && (
              <div className="poi-detail-section">
                <h4 className="poi-detail-label">Origin</h4>
                <p className="poi-detail-value poi-origin-badge">{selectedPoi.origin}</p>
              </div>
            )}

            {/* Sección de explicación con IA */}
            {aiExplanation && (
              <div className="poi-detail-section poi-ai-explanation">
                <h4 className="poi-detail-label">
                  <Bot size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  AI Explanation
                </h4>
                <p className="poi-detail-value poi-explanation-text">{aiExplanation}</p>
              </div>
            )}

            {/* Error en la explicación */}
            {explanationError && (
              <div className="poi-detail-section poi-ai-error">
                <p className="poi-error-text">{explanationError}</p>
              </div>
            )}
          </div>

          {/* Botón del robot en la esquina inferior derecha del sidebar */}
          <button 
            className="robot-button-sidebar"
            onClick={handleExplainClick}
            disabled={isLoadingExplanation}
            title="Explain with IA"
          >
            {isLoadingExplanation ? (
              <Loader2 size={24} strokeWidth={2} className="spinner" />
            ) : (
              <Bot size={24} strokeWidth={2} />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
