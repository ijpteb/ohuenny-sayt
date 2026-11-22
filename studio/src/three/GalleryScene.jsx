import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Product from './Products'
import Slot from './Slot'
import Lights from './Lights'
import { PRODUCTS } from '../content'
import { scroll, lerp } from '../lib/state'
import { galleryLayout, itemT } from '../lib/galleryLayout'

function Item({ i, kind, slot }) {
  const outer = useRef()
  const inner = useRef()
  const hov = useRef(0)
  const { viewport, size } = useThree()

  useFrame((state, dt) => {
    const L = galleryLayout(size.width, size.height)
    const [fx, fy] = L.pos[i]
    const blob = (L.size / size.width) * viewport.width
    const tx = (fx - 0.5) * viewport.width
    const ty = (0.5 - fy) * viewport.height
    const t = itemT(i, scroll.gallery)
    const time = state.clock.elapsedTime

    hov.current = THREE.MathUtils.damp(hov.current, scroll.hovered === i ? 1 : 0, 9, dt)
    const h = hov.current

    // вылет из центра по дуге
    const o = outer.current
    o.position.set(lerp(0, tx, t), lerp(-viewport.height * 0.05, ty, t) + h * blob * 0.12, Math.sin(t * Math.PI) * 2.5)
    const s = (blob / 2) * 0.62 * lerp(0.15, 1, t) * (1 + h * 0.08)
    o.scale.setScalar(s)
    o.visible = t > 0.001

    const n = inner.current
    n.rotation.y = (1 - t) * Math.PI * 3 + Math.sin(time * 0.5 + i) * 0.35 + h * 0.6
    n.rotation.x = 0.25 + Math.sin(time * 0.7 + i * 2) * 0.06 - h * 0.15
    n.rotation.z = (1 - t) * (i % 2 ? 1 : -1) * 1.2 + h * 0.18 * (i % 2 ? -1 : 1)
    n.position.y = Math.sin(time * 1.2 + i) * 0.06
  })

  return (
    <group ref={outer}>
      <group ref={inner}>
        <Slot slot={slot} size={2}>
          <Product kind={kind} />
        </Slot>
      </group>
    </group>
  )
}

export default function GalleryScene() {
  return (
    <>
      <Lights />
      {PRODUCTS.map((p, i) => (
        <Item key={p.slot} i={i} kind={p.kind} slot={p.slot} />
      ))}
    </>
  )
}
