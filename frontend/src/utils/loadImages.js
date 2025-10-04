export default async function loadImages(planetName) {
  if (!planetName) throw new Error('Missing planet name')
  // Prefer a backend API (use Vite env VITE_API_BASE), fall back to local assets
  const apiBase = (import.meta.env && import.meta.env.VITE_API_BASE) || '/api'
  const apiUrl = `${apiBase.replace(/\/$/, '')}/images/${planetName}`

  // try API first
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
      throw new Error(`Failed to fetch images.json for ${planetName}. Are the files present in src/assets/images/${planetName}/?`)
    }
    throw err
  }
}
