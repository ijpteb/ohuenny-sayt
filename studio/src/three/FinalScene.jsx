import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Hand from './Hand'
import Slot from './Slot'
import Lights from './Lights'
import { scroll, lerp } from '../lib/state'

const target = new THREE.Vector3()
const dir = new THREE.Vector3()
const pos = new THREE.Vector3()

// Рука следит за кнопкой контакта (её DOM-позиция пересчитывается в мировые координаты)
export default function FinalScene({ buttonRef }) {
  const hand = useRef()
  const { viewport, size, gl } = useThree()

  useFrame((state, dt) => {
    const btn = buttonRef.current
    if (!btn || !hand.current) return
    const r = btn.getBoundingClientRect()
    const c = gl.domElement.getBoundingClientRect()
    // точка чуть левее центра кнопки — туда «тыкает» палец
    const bx = r.left + r.width * (size.width > size.height ? 0.15 : 0.5)
    const by = size.width > size.height ? r.top + r.height * 0.5 : r.bottom + 4
    const nx = (bx - c.left) / c.width - 0.5
    const ny = 0.5 - (by - c.top) / c.height
    target.set(nx * viewport.width, ny * viewport.height, 0)

    const wide = size.width > size.height
    // откуда тянется рука: слева-сверху на ноутбуке, снизу на телефоне
    if (wide) dir.set(-1, 0.42, 0.55)
    else dir.set(-0.25, -1, 0.5)
    dir.normalize()

    const s = Math.min(viewport.width, viewport.height) * (wide ? 0.16 : 0.17)
    const t = scroll.final
    const time = state.clock.elapsedTime
    const poke = (Math.sin(time * 4) * 0.5 + 0.5) * s * 0.35
    const dist = s * 1.55 + s * 0.15 + poke + (1 - t) * viewport.width * 0.9

    pos.copy(target).addScaledVector(dir, dist)
    pos.x += scroll.pointer.x * s * 0.08
    hand.current.position.lerp(pos, 1 - Math.exp(-12 * dt))
    hand.current.scale.setScalar(s)
    hand.current.up.set(0, 1, 0)
    hand.current.lookAt(target)
    hand.current.rotateZ(Math.sin(time * 1.3) * 0.08 + lerp(-0.6, 0, t))
  })

  return (
    <>
      <Lights intensity={1.1} />
      <pointLight position={[0, 0, 5]} intensity={25} color="#FFD600" distance={30} />
      <group ref={hand}>
        <Slot slot="hand" size={3}>
          <Hand />
        </Slot>
      </group>
    </>
  )
}
