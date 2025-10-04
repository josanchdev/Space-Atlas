import { Suspense, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { getModelUrlFor } from '../utils/modelIndex'

// in-memory cache for loaded GLTFs: path -> { scene, normScale }
const gltfCache = new Map()

// shared GLTFLoader instance with optional DRACO support to speed up parsing
const sharedLoader = new GLTFLoader()
try {
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  sharedLoader.setDRACOLoader(draco)
} catch (e) {
  // ignore if DRACOLoader can't be used in the environment
}

export async function loadGLTF(path) {
  if (gltfCache.has(path)) return gltfCache.get(path)
  const data = await sharedLoader.loadAsync(path)
  try {
    const box = new THREE.Box3().setFromObject(data.scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x || 0, size.y || 0, size.z || 0)
    const normScale = maxDim > 0 ? 1 / maxDim : 1
    const center = box.getCenter(new THREE.Vector3())
    data.scene.position.x -= center.x
    data.scene.position.y -= center.y
    data.scene.position.z -= center.z
    const cachedScene = data.scene.clone(true)
    const entry = { scene: cachedScene, normScale }
    gltfCache.set(path, entry)
    return entry
  } catch (e) {
    const entry = { scene: data.scene, normScale: 1 }
    gltfCache.set(path, entry)
    return entry
  }
}

function GLTFModel({ path, scale = 1, onClick }) {
  const [gltf, setGltf] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [normScale, setNormScale] = useState(1)

  useEffect(() => {
    let mounted = true
    if (path && path.toLowerCase().endsWith('.usdz')) {
      // unsupported by GLTFLoader
      setLoadError(new Error('USDZ format not supported'))
      return () => {
        mounted = false
      }
    }
    loadGLTF(path)
      .then((entry) => {
        if (!mounted) return
        const instScene = entry.scene && entry.scene.clone ? entry.scene.clone(true) : entry.scene
        setGltf({ scene: instScene })
        setNormScale(entry.normScale || 1)
      })
      .catch((err) => {
        if (!mounted) return
        console.error('GLTFModel load failed for', path, err)
        setLoadError(err)
      })
    return () => {
      mounted = false
    }
  }, [path])

  if (loadError) {
    return (
      <mesh onClick={onClick} scale={[scale, scale, scale]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={'#777'} />
      </mesh>
    )
  }

  if (!gltf) return null

  const finalScale = normScale * scale
  return <primitive object={gltf.scene} scale={[finalScale, finalScale, finalScale]} onClick={onClick} />
}

export default function ModelLoader({ name, scale = 1, onClick }) {
  const viteUrl = getModelUrlFor(name)
  const path = viteUrl || `/src/assets/3D-models/${name}.glb`
  return (
    <Suspense fallback={null}>
      <GLTFModel path={path} scale={scale} onClick={onClick} />
    </Suspense>
  )
}
