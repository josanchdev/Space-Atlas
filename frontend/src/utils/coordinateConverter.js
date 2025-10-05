/**
 * Coordinate Converter: Geographic (Lat/Lon) to Cartesian (X/Y/Z)
 * 
 * Converts geographic coordinates (latitude, longitude) used in 2D maps
 * to 3D cartesian coordinates (x, y, z) for rendering on a 3D sphere model.
 * 
 * @module coordinateConverter
 */

/**
 * Converts geographic coordinates to 3D cartesian coordinates
 * 
 * Mathematical conversion from spherical to cartesian coordinates:
 * - phi (φ) = polar angle from north pole = (90 - lat) in radians
 * - theta (θ) = azimuthal angle = (lon + 180) in radians
 * 
 * Cartesian formulas:
 * - x = -r * sin(φ) * cos(θ)
 * - y = r * cos(φ)
 * - z = r * sin(φ) * sin(θ)
 * 
 * @param {number} lat - Latitude in degrees (-90 to +90, South to North)
 * @param {number} lon - Longitude in degrees (-180 to +180, West to East)
 * @param {number} radius - Radius of the sphere (default: 1.6 to match model scale)
 * @returns {{x: number, y: number, z: number}} 3D cartesian coordinates
 * 
 * @example
 * // North Pole
 * latLonToCartesian(90, 0, 1.6) // → { x: 0, y: 1.6, z: 0 }
 * 
 * @example
 * // Equator, Prime Meridian
 * latLonToCartesian(0, 0, 1.6) // → { x: -1.6, y: 0, z: 0 }
 * 
 * @example
 * // South Pole
 * latLonToCartesian(-90, 0, 1.6) // → { x: 0, y: -1.6, z: 0 }
 */
export function latLonToCartesian(lat, lon, radius = 1.6) {
  // Validate input ranges
  if (lat < -90 || lat > 90) {
    console.warn(`Invalid latitude: ${lat}. Clamping to [-90, 90]`)
    lat = Math.max(-90, Math.min(90, lat))
  }
  
  if (lon < -180 || lon > 180) {
    console.warn(`Invalid longitude: ${lon}. Normalizing to [-180, 180]`)
    // Normalize longitude to [-180, 180]
    lon = ((lon + 180) % 360) - 180
  }

  // Convert degrees to radians
  const toRadians = (degrees) => degrees * (Math.PI / 180)
  
  // Calculate spherical angles
  // phi: polar angle measured from north pole (0 to π)
  const phi = toRadians(90 - lat)
  
  // theta: azimuthal angle measured from reference meridian (0 to 2π)
  const theta = toRadians(lon + 180)
  
  // Convert spherical to cartesian coordinates
  // Note: The negative sign on x aligns with Three.js coordinate system
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  
  return { x, y, z }
}

/**
 * Converts 3D cartesian coordinates back to geographic coordinates
 * (Inverse operation - useful for debugging)
 * 
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} z - Z coordinate
 * @param {number} radius - Radius of the sphere (default: 1.6)
 * @returns {{lat: number, lon: number}} Geographic coordinates in degrees
 */
export function cartesianToLatLon(x, y, z, radius = 1.6) {
  // Calculate polar angle (phi)
  const r = Math.sqrt(x * x + y * y + z * z)
  const phi = Math.acos(y / r)
  
  // Calculate azimuthal angle (theta)
  const theta = Math.atan2(z, -x)
  
  // Convert to lat/lon in degrees
  const lat = 90 - (phi * 180 / Math.PI)
  let lon = (theta * 180 / Math.PI) - 180
  
  // Normalize longitude to [-180, 180]
  if (lon > 180) lon -= 360
  if (lon < -180) lon += 360
  
  return { lat, lon }
}

/**
 * Test function to verify coordinate conversion accuracy
 * Logs known locations and their 3D coordinates
 */
export function testCoordinateConversion() {
  console.group('🧪 Coordinate Conversion Tests')
  
  const testCases = [
    { name: 'North Pole', lat: 90, lon: 0 },
    { name: 'South Pole', lat: -90, lon: 0 },
    { name: 'Equator, Prime Meridian', lat: 0, lon: 0 },
    { name: 'Equator, 90°E', lat: 0, lon: 90 },
    { name: 'Equator, 180°E', lat: 0, lon: 180 },
    { name: 'Equator, 90°W', lat: 0, lon: -90 },
    { name: 'Mid-latitude North', lat: 45, lon: 0 },
    { name: 'Mid-latitude South', lat: -45, lon: 0 },
  ]
  
  testCases.forEach(test => {
    const cartesian = latLonToCartesian(test.lat, test.lon)
    const backToGeo = cartesianToLatLon(cartesian.x, cartesian.y, cartesian.z)
    
    console.log(`📍 ${test.name}`)
    console.log(`   Input:  lat=${test.lat}°, lon=${test.lon}°`)
    console.log(`   3D:     x=${cartesian.x.toFixed(3)}, y=${cartesian.y.toFixed(3)}, z=${cartesian.z.toFixed(3)}`)
    console.log(`   Verify: lat=${backToGeo.lat.toFixed(2)}°, lon=${backToGeo.lon.toFixed(2)}°`)
    console.log('')
  })
  
  console.groupEnd()
}

// Example usage with real locations
export const EXAMPLE_LOCATIONS = {
  // Mars locations (if POIs reference Mars)
  olympusMons: { lat: 18.65, lon: -133.8, name: 'Olympus Mons' },
  vallesMarineris: { lat: -14.0, lon: -59.2, name: 'Valles Marineris' },
  
  // Earth locations (if POIs reference Earth)
  everest: { lat: 27.988, lon: 86.925, name: 'Mount Everest' },
  grandCanyon: { lat: 36.1069, lon: -112.1129, name: 'Grand Canyon' },
  
  // Moon locations
  tranquilityBase: { lat: 0.674, lon: 23.473, name: 'Tranquility Base (Apollo 11)' },
  tycho: { lat: -43.3, lon: -11.2, name: 'Tycho Crater' },
}

/**
 * Helper function to calculate distance between two points on a sphere
 * Uses the Haversine formula
 * 
 * @param {number} lat1 - Latitude of first point (degrees)
 * @param {number} lon1 - Longitude of first point (degrees)
 * @param {number} lat2 - Latitude of second point (degrees)
 * @param {number} lon2 - Longitude of second point (degrees)
 * @param {number} radius - Radius of the sphere
 * @returns {number} Distance along the sphere surface
 */
export function sphericalDistance(lat1, lon1, lat2, lon2, radius = 1.6) {
  const toRadians = (deg) => deg * (Math.PI / 180)
  
  const φ1 = toRadians(lat1)
  const φ2 = toRadians(lat2)
  const Δφ = toRadians(lat2 - lat1)
  const Δλ = toRadians(lon2 - lon1)
  
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  return radius * c
}
