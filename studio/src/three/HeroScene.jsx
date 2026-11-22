import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import Console from './Console'
import Slot from './Slot'
import Lights from './Lights'
import { scroll, smooth, lerp } from '../lib/state'

export default function HeroScene() {
  const group = useRef()
  const bodyMat = useRef()
  const flashLight = useRef()
  const { viewport } = useThree()
  // базовый размер: консоль занимает ~55% высоты экрана, но не шире 70% ширины
  const portrait = viewport.width < viewport.height
  const base = Math.min(viewport.height * (portrait ? 0.4 : 0.55), viewport.width * (portrait ? 0.5 : 0.7) * (3 / 1.7)) / 3

  useFrame((state, dt) => {
    const p = scroll.hero
    const t = smooth(0, 0.72, p) // вращение + уменьшение
    const f = smooth(0.7, 0.88, p) // вспышка
    const g = group.current
    const time = state.clock.elapsedTime

    const targetRotY = t * Math.PI * 2.5 + scroll.pointer.x * 0.35 + Math.sin(time * 0.6) * 0.08 * (1 - t)
    const targetRotX = -scroll.pointer.y * 0.2 + t * 0.35
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 8, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 8, dt)
    g.rotation.z = lerp(-0.12, 0.2, t)

    const s = base * lerp(1, 0.38, t) * (1 + f * 1.6)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 10, dt))
    g.position.y = lerp(0, viewport.height * 0.04, t)

    if (bodyMat.current) bodyMat.current.emissiveIntensity = f * 3
    if (flashLight.current) flashLight.current.intensity = f * 80
  })

  return (
    <>
      <Lights />
      <pointLight ref={flashLight} position={[0, 0, 3]} intensity={0} color="#ffffff" distance={20} />
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={group}>
          <Slot slot="console" size={3}>
            <Console bodyMat={bodyMat} />
          </Slot>
        </group>
      </Float>
    </>
  )
}
