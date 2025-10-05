import { useEffect, useState } from 'react'
import { poisService } from '../services/poisService'

export default function TestPoisPage() {
  const [pois, setPois] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    testGetAllPois()
  }, [])

  async function testGetAllPois() {
    console.log('🔍 Testing GET /api/pois...')
    console.log('API Base URL:', import.meta.env.VITE_API_URL)
    
    try {
      setLoading(true)
      setError(null)
      
      const data = await poisService.getAll()
      
      console.log('✅ POIs obtenidos exitosamente:')
      console.log('📊 Total de POIs:', data.length)
      console.log('📦 Datos completos:', data)
      
      setPois(data)
    } catch (err) {
      console.error('❌ Error al obtener POIs:', err.message)
      console.error('📍 Error completo:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function testCreatePoi() {
    console.log('🔍 Testing POST /api/pois...')
    
    const newPoi = {
      title: "Test POI - Olympus Mons",
      description: "The tallest volcano in the solar system",
      lat: 18.65,
      lon: -133.8,
      path: "mars"
    }
    
    console.log('📤 Enviando POI:', newPoi)
    
    try {
      const createdPoi = await poisService.create(newPoi)
      console.log('✅ POI creado exitosamente:', createdPoi)
      
      // Recargar la lista
      testGetAllPois()
    } catch (err) {
      console.error('❌ Error al crear POI:', err.message)
      console.error('📍 Error completo:', err)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>🧪 Test de POIs Endpoint</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'No configurada'}</p>
        <p><strong>Endpoint:</strong> GET /api/pois</p>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={testGetAllPois}
          style={{ padding: '0.75rem 1.5rem', background: '#4a9eff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          🔄 Recargar POIs
        </button>
        
        <button 
          onClick={testCreatePoi}
          style={{ padding: '0.75rem 1.5rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          ➕ Crear POI de Prueba
        </button>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
          ⏳ Cargando POIs...
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#fee', border: '2px solid #f88', borderRadius: '8px', color: '#c00' }}>
          <h3>❌ Error:</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            Verifica que el backend esté corriendo en <code>http://localhost:3000</code>
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <h2 style={{ marginBottom: '1rem' }}>
            📋 POIs encontrados: {pois.length}
          </h2>

          {pois.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
              <p>No hay POIs en la base de datos. Haz clic en "Crear POI de Prueba" para agregar uno.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {pois.map((poi) => (
                <div 
                  key={poi._id || poi.id} 
                  style={{ 
                    padding: '1.5rem', 
                    background: 'white', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>
                    {poi.title || 'Sin título'}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {poi.description || 'Sin descripción'}
                  </p>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>
                    <p>
                        <strong>Coordenadas:</strong> {poi.lat}, {poi.lon}
                    </p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#aaa' }}>
                      PATH: {poi.path}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
