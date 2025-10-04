import { useState } from 'react'

export default function ScientistsPage() {
  const [planet, setPlanet] = useState('earth')
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [markers, setMarkers] = useState([])
  const [markerForm, setMarkerForm] = useState({ x: '', y: '', title: '' })

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return setMessage('Choose a TIFF file')
    const fd = new FormData()
    fd.append('planet', planet)
    fd.append('file', file)
    setMessage('Uploading...')
    try {
      const res = await fetch('/api/images/upload-tiff', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || JSON.stringify(json))
      setMessage('Uploaded: ' + (json.title || json.id))
    } catch (err) {
      setMessage('Upload failed: ' + String(err))
    }
  }

  async function loadMarkers() {
    try {
      const res = await fetch(`/api/markers/${planet}`)
      if (!res.ok) throw new Error('Failed to load markers')
      const json = await res.json()
      setMarkers(json.markers || [])
    } catch (err) {
      setMessage(String(err))
    }
  }

  async function addMarker(e) {
    e.preventDefault()
    try {
      const body = { planet, ...markerForm }
      const res = await fetch('/api/markers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || JSON.stringify(json))
      setMessage('Marker added')
      setMarkerForm({ x: '', y: '', title: '' })
      loadMarkers()
    } catch (err) {
      setMessage(String(err))
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Scientists access</h2>

      <section style={{ marginTop: 16 }}>
        <h3>Upload TIFF (will be converted to DZI)</h3>
        <form onSubmit={handleUpload}>
          <div>
            <label>Planet: </label>
            <input value={planet} onChange={(e) => setPlanet(e.target.value)} />
          </div>
          <div style={{ marginTop: 8 }}>
            <input type="file" accept=".tif,.tiff,image/tiff" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Upload</button>
          </div>
        </form>
        <div style={{ marginTop: 8, color: '#666' }}>{message}</div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Markers</h3>
        <div style={{ marginBottom: 8 }}>
          <button onClick={loadMarkers}>Load markers for {planet}</button>
        </div>
        <form onSubmit={addMarker}>
          <input placeholder="x" value={markerForm.x} onChange={(e) => setMarkerForm({ ...markerForm, x: e.target.value })} />
          <input placeholder="y" value={markerForm.y} onChange={(e) => setMarkerForm({ ...markerForm, y: e.target.value })} />
          <input placeholder="title" value={markerForm.title} onChange={(e) => setMarkerForm({ ...markerForm, title: e.target.value })} />
          <button type="submit">Add marker</button>
        </form>

        <ul>
          {markers.map((m) => (
            <li key={m.id}>{String(m.title)} — {m.x},{m.y}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
