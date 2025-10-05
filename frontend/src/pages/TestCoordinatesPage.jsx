import { useEffect } from 'react'
import { 
  latLonToCartesian, 
  cartesianToLatLon, 
  testCoordinateConversion,
  EXAMPLE_LOCATIONS,
  sphericalDistance
} from '../utils/coordinateConverter'

/**
 * Test component to verify coordinate conversion
 * Run this by navigating to /test-coordinates
 */
export default function TestCoordinatesPage() {
  useEffect(() => {
    console.clear()
    console.log('🚀 Starting Coordinate Conversion Tests...\n')
    
    // Run automated tests
    testCoordinateConversion()
    
    // Test with real POI-like data
    console.group('🌍 Real POI Examples')
    
    const testPOIs = [
      { title: 'Olympus Mons (Mars)', lat: 18.65, lon: -133.8 },
      { title: 'Valles Marineris (Mars)', lat: -14.0, lon: -59.2 },
      { title: 'Mount Everest (Earth)', lat: 27.988, lon: 86.925 },
      { title: 'Tycho Crater (Moon)', lat: -43.3, lon: -11.2 },
      { title: 'North Pole', lat: 90, lon: 0 },
      { title: 'South Pole', lat: -90, lon: 0 },
    ]
    
    testPOIs.forEach(poi => {
      const pos = latLonToCartesian(poi.lat, poi.lon, 1.6)
      console.log(`📍 ${poi.title}`)
      console.log(`   Lat/Lon: (${poi.lat}°, ${poi.lon}°)`)
      console.log(`   3D Position: (${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)})`)
      
      // Verify reverse conversion
      const verify = cartesianToLatLon(pos.x, pos.y, pos.z, 1.6)
      const latError = Math.abs(verify.lat - poi.lat)
      const lonError = Math.abs(verify.lon - poi.lon)
      
      if (latError < 0.01 && lonError < 0.01) {
        console.log(`   ✅ Verification passed!`)
      } else {
        console.log(`   ⚠️ Verification: lat=${verify.lat.toFixed(3)}°, lon=${verify.lon.toFixed(3)}°`)
      }
      console.log('')
    })
    
    console.groupEnd()
    
    // Test distance calculation
    console.group('📏 Distance Calculations')
    const northPole = { lat: 90, lon: 0 }
    const equator = { lat: 0, lon: 0 }
    const dist = sphericalDistance(northPole.lat, northPole.lon, equator.lat, equator.lon, 1.6)
    console.log(`Distance from North Pole to Equator: ${dist.toFixed(3)} units`)
    console.log(`(Should be approximately π/2 × radius = ${(Math.PI / 2 * 1.6).toFixed(3)})`)
    console.groupEnd()
    
    // Visual test - log coordinates in a table
    console.group('📊 Coordinate Table')
    const tableData = testPOIs.map(poi => {
      const pos = latLonToCartesian(poi.lat, poi.lon, 1.6)
      return {
        Location: poi.title,
        'Lat (°)': poi.lat,
        'Lon (°)': poi.lon,
        'X': pos.x.toFixed(3),
        'Y': pos.y.toFixed(3),
        'Z': pos.z.toFixed(3)
      }
    })
    console.table(tableData)
    console.groupEnd()
    
    console.log('✅ All tests completed! Check the results above.')
  }, [])
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%)',
      color: 'white',
      padding: '40px',
      fontFamily: 'monospace'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(144, 202, 249, 0.3)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          marginBottom: '20px',
          color: '#90CAF9'
        }}>
          🧪 Coordinate Conversion Test Page
        </h1>
        
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 217, 61, 0.3)'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#ffd93d' }}>
            📊 Test Results
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8' }}>
            ✅ Open the <strong>browser console</strong> (F12 → Console tab) to see detailed test results.
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.8' }}>
            The tests verify the conversion of geographic coordinates (latitude, longitude) 
            to 3D cartesian coordinates (x, y, z) for rendering POIs on planet models.
          </p>
        </div>
        
        <div style={{
          background: 'rgba(144, 202, 249, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid rgba(144, 202, 249, 0.3)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#90CAF9' }}>
            🧮 Conversion Formula
          </h3>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '15px',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '13px',
            color: '#b3d9ff'
          }}>
{`// Spherical to Cartesian Conversion
phi = (90 - lat) × π/180
theta = (lon + 180) × π/180

x = -radius × sin(φ) × cos(θ)
y = radius × cos(φ)
z = radius × sin(φ) × sin(θ)`}
          </pre>
        </div>
        
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#4CAF50' }}>
            ✅ Test Coverage
          </h3>
          <ul style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>North/South Poles conversion</li>
            <li>Equator at different longitudes</li>
            <li>Mid-latitude points</li>
            <li>Real locations (Mars, Earth, Moon)</li>
            <li>Reverse conversion verification</li>
            <li>Distance calculations</li>
          </ul>
        </div>
        
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '12px 24px',
              background: 'rgba(144, 202, 249, 0.2)',
              border: '2px solid rgba(144, 202, 249, 0.5)',
              borderRadius: '8px',
              color: '#90CAF9',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
