import { transformPoisToImages, filterImagesByPlanet } from './imageDataHelpers'

export default async function loadImages(planetName) {
  if (!planetName) throw new Error('Missing planet name')
  
  // Prefer a backend API (use Vite env VITE_API_BASE), fall back to local assets
  const apiBase = (import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:3000/api'
  
  // Try POIs endpoint first
  try {
    const poisUrl = `${apiBase.replace(/\/$/, '')}/pois`
    const res = await fetch(poisUrl)
    
    if (res.ok) {
      const pois = await res.json()
      
      // Transform POIs to images format
      const allImages = transformPoisToImages(pois)
      
      // Filter by planet
      const planetImages = filterImagesByPlanet(allImages, planetName)
      
      console.log(`Loaded ${planetImages.length} images for ${planetName} from POIs endpoint`)
      
      // Return in expected format
      if (planetImages.length > 0) {
        return { images: planetImages }
      }
      
      // If no images for this planet, fall through to try other endpoints
      console.log(`No images found for ${planetName} in POIs, trying other endpoints...`)
    }
  } catch (err) {
    console.warn('Error fetching from POIs endpoint:', err)
    // Continue to fallback options
  }
  
  // Try legacy /api/images/:planet endpoint
  const apiUrl = `${apiBase.replace(/\/$/, '')}/images/${planetName}`
  try {
    const res = await fetch(apiUrl)
    if (res.ok) {
      const json = await res.json()
      // Normalize to { images: [...] }
      if (Array.isArray(json)) return { images: json }
      if (json && typeof json === 'object' && Array.isArray(json.images)) return json
      // if backend returns { images: [...] } nested differently, try to coerce
      if (json && typeof json === 'object') {
        const arr = json.images ?? json.items ?? json.data ?? []
        return { images: Array.isArray(arr) ? arr : [] }
      }
    }
    // if 404 or other, fall back to local
  } catch (err) {
    console.warn('Error fetching from images endpoint:', err)
    // swallow network errors for now to try local fallback
    // (could be CORS or no backend in dev)
  }

  // Fallback to local static json in src/assets/images/<planet>/images.json
  const path = `/src/assets/images/${planetName}/images.json`
  try {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`Could not load images.json for ${planetName} (status ${res.status})`)
    const json = await res.json()
    // ensure shape
    if (json && Array.isArray(json.images)) return json
    if (Array.isArray(json)) return { images: json }
    return { images: [] }
  } catch (err) {
    // Better error message when file doesn't exist
    if (err instanceof TypeError) {
      console.warn(`No local images.json found for ${planetName}`)
      // Return empty array instead of throwing
      return { images: [] }
    }
    throw err
  }
}
