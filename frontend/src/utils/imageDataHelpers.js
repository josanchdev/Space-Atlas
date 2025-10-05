/**
 * Transforma datos de POIs del backend al formato esperado por las páginas
 * @param {Array} pois - Array de POIs del backend
 * @returns {Array} Array de imágenes en formato esperado
 */
export function transformPoisToImages(pois) {
  if (!Array.isArray(pois) || pois.length === 0) {
    return []
  }

  return pois.map(poi => ({
    id: poi.id || poi._id,
    filename: poi.path ? `${poi.path}.dzi` : `poi_${poi.id}.dzi`,
    title: poi.title || 'Untitled POI',
    body: poi.planet || extractPlanetFromPath(poi.path) || 'Unknown',
    description: poi.description || '',
    thumbnail: poi.thumbnail || null,
    lat: poi.lat,
    lon: poi.lon,
    path: poi.path,
    planet: poi.planet || extractPlanetFromPath(poi.path)
  }))
}

/**
 * Intenta extraer el nombre del planeta desde el path
 * @param {string} path - Path del POI (ej: "mars/12_34")
 * @returns {string} Nombre del planeta o null
 */
function extractPlanetFromPath(path) {
  if (!path) return null
  
  // Si el path incluye el planeta, extraerlo
  const parts = String(path).split('/')
  if (parts.length > 1) {
    return parts[0].toLowerCase()
  }
  
  return null
}

/**
 * Filtra imágenes por planeta
 * @param {Array} images - Array de imágenes
 * @param {string} planetName - Nombre del planeta a filtrar
 * @returns {Array} Imágenes filtradas
 */
export function filterImagesByPlanet(images, planetName) {
  if (!planetName || !Array.isArray(images)) {
    return images
  }

  return images.filter(img => 
    img.planet?.toLowerCase() === planetName.toLowerCase() ||
    img.body?.toLowerCase() === planetName.toLowerCase()
  )
}

/**
 * Ordena imágenes por fecha (más reciente primero)
 * @param {Array} images - Array de imágenes
 * @returns {Array} Imágenes ordenadas
 */
export function sortImagesByDate(images) {
  if (!Array.isArray(images)) {
    return images
  }

  return [...images].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt || 0)
    const dateB = new Date(b.date || b.createdAt || 0)
    return dateB - dateA // Más reciente primero
  })
}

/**
 * Obtiene las N imágenes más recientes
 * @param {Array} images - Array de imágenes
 * @param {number} count - Cantidad de imágenes a obtener
 * @returns {Array} Imágenes más recientes
 */
export function getRecentImages(images, count = 3) {
  const sorted = sortImagesByDate(images)
  return sorted.slice(0, count)
}

/**
 * Datos de placeholder para cuando no hay datos del backend
 */
export const PLACEHOLDER_IMAGES = {
  explore: [
    { filename: 'earth_001.dzi', title: 'Blue Marble', body: 'Earth', planet: 'earth', thumbnail: null },
    { filename: 'jupiter_001.dzi', title: 'Great Red Spot', body: 'Jupiter', planet: 'jupiter', thumbnail: null },
    { filename: 'mars_001.dzi', title: 'Olympus Mons', body: 'Mars', planet: 'mars', thumbnail: null },
    { filename: 'venus_001.dzi', title: 'Venus Surface', body: 'Venus', planet: 'venus', thumbnail: null },
    { filename: 'saturn_001.dzi', title: 'Saturn Rings', body: 'Saturn', planet: 'saturn', thumbnail: null },
    { filename: 'neptune_001.dzi', title: 'Neptune Storm', body: 'Neptune', planet: 'neptune', thumbnail: null },
  ],
  news: [
    { filename: 'mars_001.dzi', title: 'Mars Region A', body: 'Mars', planet: 'mars', thumbnail: null },
    { filename: 'moon_azimuth.dzi', title: 'Mare Imbrium', body: 'Moon', planet: 'moon', thumbnail: null },
    { filename: 'jupiter_001.dzi', title: 'Great Red Spot Detail', body: 'Jupiter', planet: 'jupiter', thumbnail: null },
    { filename: 'saturn_001.dzi', title: 'Saturn Rings Close-up', body: 'Saturn', planet: 'saturn', thumbnail: null },
  ],
  landing: [
    {
      id: 1,
      filename: 'jwst_deep_field.dzi',
      title: "James Webb's Deep Field",
      description: "The deepest and sharpest infrared image of the distant universe captured by JWST",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0535%2F0532%2F7303%2Fproducts%2FA0001_-_JWST_Deep_Field-web.jpg%3Fv%3D1657644367&f=1",
      author: "NASA/ESA",
      date: "Oct 2025",
      planet: "deep_space"
    },
    {
      id: 2,
      filename: 'pillars_creation.dzi',
      title: "Pillars of Creation",
      description: "Stunning new view of iconic stellar nursery in the Eagle Nebula",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fscitechdaily.com%2Fimages%2FWebb-Pillars-of-Creation-scaled.jpg&f=1&nofb=1&ipt=4a014a6a24350f4f4a5012a510c237eab192b3655e852e1ca42871d555b7fa1a",
      author: "NASA/JPL",
      date: "Sep 2025",
      planet: "nebula"
    },
    {
      id: 3,
      filename: 'southern_ring.dzi',
      title: "Southern Ring Nebula",
      description: "Unprecedented detail of planetary nebula revealing dying star's final moments",
      imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.esa.int%2Fvar%2Fesa%2Fstorage%2Fimages%2Fesa_multimedia%2Fimages%2F2023%2F08%2Fwebb_captures_detailed_beauty_of_ring_nebula_nircam_image%2F25047351-1-eng-GB%2FWebb_captures_detailed_beauty_of_Ring_Nebula_NIRCam_image_pillars.jpg&f=1&nofb=1&ipt=5ef047826c1206ad5ba3e3f9f494ee4f71e2837108b27defb33a6e6f3877df8d",
      author: "ESO",
      date: "Sep 2025",
      planet: "nebula"
    }
  ]
}
