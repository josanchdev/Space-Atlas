import { useEffect, useRef, useState } from 'react'
import OpenSeadragon from 'openseadragon'

/**
 * DziViewer Component
 * Renders a Deep Zoom Image viewer using OpenSeadragon
 * 
 * @param {string} dziUrl - URL to the .dzi file
 * @param {string} imageName - Name of the image for display
 */
export default function DziViewer({ dziUrl, imageName }) {
  const viewerRef = useRef(null)
  const viewerInstance = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
        showNavigationControl: true,
        showNavigator: true,
        navigatorPosition: 'BOTTOM_RIGHT',
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: false,
        maxZoomPixelRatio: 2,
        minZoomLevel: 0.8,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        timeout: 120000,
        
        // Event handlers
        loadTilesWithAjax: true,
        ajaxWithCredentials: false,
        
        // Performance settings
        immediateRender: false,
        preload: true,
        
        // UI customization
        showFullPageControl: true,
        showHomeControl: true,
        showZoomControl: true,
        showRotationControl: true,
        
        // Gesture settings for touch devices
        gestureSettingsMouse: {
          clickToZoom: false,
          dblClickToZoom: true,
          flickEnabled: true,
          pinchToZoom: true
        },
        gestureSettingsTouch: {
          clickToZoom: false,
          dblClickToZoom: true,
          flickEnabled: true,
          pinchToZoom: true
        }
      })

      // Event listeners
      viewerInstance.current.addHandler('open', () => {
        setIsLoading(false)
        console.log('DZI image loaded successfully:', imageName)
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

    // Cleanup on unmount
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy()
        viewerInstance.current = null
      }
    }
  }, [dziUrl, imageName])

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
          color: '#fff',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          <div className="loading-spinner" style={{ marginBottom: '12px' }}>⏳</div>
          <div>Loading image...</div>
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
    </div>
  )
}
