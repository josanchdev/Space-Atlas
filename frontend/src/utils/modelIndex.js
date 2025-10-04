// modelIndex.js
// Use Vite's import.meta.glob to resolve asset URLs for 3D models stored under src.
// This returns real URLs that the dev server and build will serve.

const files = import.meta.glob('/src/assets/3D-models/*.{glb,gltf,usdz}', { query: '?url', import: 'default', eager: true })

// Build a simple lookup: try to associate known planet keywords to a file URL.
const KNOWN_KEYS = ['mercury','venus','earth','moon','mars','jupiter','saturn','uranus','neptune','pluto','sun']

const map = {}
for (const p of Object.keys(files)) {
  const lower = p.toLowerCase()
  for (const key of KNOWN_KEYS) {
    if (lower.includes(`/${key}`) || lower.includes(key)) {
      // Prefer first match for each key
      if (!map[key]) map[key] = files[p]
    }
  }
}

export function getModelUrlFor(key) {
  return map[key] || null
}

export const rawIndex = { files, map }
