import { Suspense, useEffect, useMemo, useState } from 'react'
import { useGLTF, useVideoTexture } from '@react-three/drei'
import * as THREE from 'three'
import { resolveSlot } from '../lib/assets'

// Подгоняет любую модель под куб размером `size` и ставит в центр.
function GlbModel({ url, size }) {
  const { scene } = useGLTF(url)
  const obj = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const dim = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const k = size / Math.max(dim.x, dim.y, dim.z || 1)
    clone.position.sub(center)
    const g = new THREE.Group()
    g.add(clone)
    g.scale.setScalar(k)
    return g
  }, [scene, size])
  return <primitive object={obj} />
}

function VideoCard({ url, size }) {
  const tex = useVideoTexture(url, { muted: true, loop: true, start: true, playsInline: true })
  const img = tex.image
  const aspect = img && img.videoWidth ? img.videoWidth / img.videoHeight : 16 / 9
  const w = aspect >= 1 ? size : size * aspect
  const h = aspect >= 1 ? size / aspect : size
  return (
    <mesh>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/**
 * Слот под пользовательский контент.
 * Положите assets/models/<slot>.glb (или assets/video/<slot>.mp4) — и он заменит заглушку.
 */
export default function Slot({ slot, size = 2, children }) {
  const [info, setInfo] = useState({ kind: 'none' })
  useEffect(() => {
    let alive = true
    resolveSlot(slot).then((r) => alive && setInfo(r))
    return () => {
      alive = false
    }
  }, [slot])

  if (info.kind === 'glb')
    return (
      <Suspense fallback={children}>
        <GlbModel url={info.url} size={size} />
      </Suspense>
    )
  if (info.kind === 'video')
    return (
      <Suspense fallback={children}>
        <VideoCard url={info.url} size={size} />
      </Suspense>
    )
  return children
}
