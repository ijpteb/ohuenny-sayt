import { forwardRef } from 'react'
import { RoundedBox, Outlines } from '@react-three/drei'

const INK = '#111111'
const OL = 0.025 // толщина «мультяшной» обводки

// Заглушка: ретро-консоль из примитивов. Высота ≈ 3 единицы.
const Console = forwardRef(function Console({ bodyMat }, ref) {
  return (
    <group ref={ref}>
      {/* корпус */}
      <RoundedBox args={[1.7, 2.7, 0.5]} radius={0.2} smoothness={5}>
        <meshStandardMaterial ref={bodyMat} color="#F3EEE1" roughness={0.55} emissive="#ffffff" emissiveIntensity={0} />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      {/* картридж сверху */}
      <RoundedBox args={[1.15, 0.5, 0.28]} radius={0.06} position={[0, 1.38, -0.04]}>
        <meshStandardMaterial color={INK} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 1.5, 0.105]}>
        <planeGeometry args={[0.8, 0.22]} />
        <meshStandardMaterial color="#FFD600" />
      </mesh>
      {/* рамка экрана */}
      <RoundedBox args={[1.32, 1.08, 0.08]} radius={0.06} position={[0, 0.58, 0.25]}>
        <meshStandardMaterial color="#26252E" roughness={0.4} />
      </RoundedBox>
      {/* экран */}
      <mesh position={[0, 0.58, 0.295]}>
        <planeGeometry args={[0.95, 0.76]} />
        <meshStandardMaterial color="#A6E35F" emissive="#7BC63A" emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
      {/* «пиксели» на экране */}
      {[
        [-0.2, 0.68],
        [0, 0.68],
        [0.2, 0.68],
        [-0.1, 0.48],
        [0.1, 0.48],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.3]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshBasicMaterial color="#2F5A1A" />
        </mesh>
      ))}
      {/* крестовина */}
      <group position={[-0.45, -0.45, 0.27]}>
        <RoundedBox args={[0.52, 0.17, 0.1]} radius={0.03}>
          <meshStandardMaterial color={INK} />
        </RoundedBox>
        <RoundedBox args={[0.17, 0.52, 0.1]} radius={0.03}>
          <meshStandardMaterial color={INK} />
        </RoundedBox>
      </group>
      {/* кнопки A / B */}
      {[
        [0.32, -0.55],
        [0.6, -0.36],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 32]} />
          <meshStandardMaterial color="#FF3D2E" roughness={0.35} />
          <Outlines thickness={OL * 0.7} color={INK} />
        </mesh>
      ))}
      {/* start / select */}
      {[-0.18, 0.18].map((x, i) => (
        <mesh key={i} position={[x, -0.92, 0.26]} rotation={[0, 0, Math.PI / 2 - 0.4]}>
          <capsuleGeometry args={[0.04, 0.14, 4, 12]} />
          <meshStandardMaterial color="#8A8780" />
        </mesh>
      ))}
      {/* динамик */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.35 + i * 0.1, -1.05 + i * 0.03, 0.26]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.025, 0.22, 4, 8]} />
          <meshStandardMaterial color="#9A968C" />
        </mesh>
      ))}
    </group>
  )
})

export default Console
