import { Link } from 'react-router-dom'

const PLANETS = [
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
]

export default function PlanetList() {
  return (
    <main style={{ padding: 20 }}>
      <h2>Planets</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {PLANETS.map((p) => (
          <Link key={p} to={`/${p}`} style={{ padding: 12, border: '1px solid #ccc', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
            <strong>{p.charAt(0).toUpperCase() + p.slice(1)}</strong>
            <p style={{ marginTop: 8 }}>Ver imágenes DZI & hotspots</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
