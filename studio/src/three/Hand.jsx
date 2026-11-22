import { forwardRef } from 'react'
import { RoundedBox, Outlines } from '@react-three/drei'

// Заглушка: мультяшная перчатка из примитивов. Указательный палец смотрит вдоль +Z,
// кончик пальца на z ≈ 1.5. Центр ладони — в начале координат.
const GLOVE = '#FFFFFF'
const INK = '#111111'
const OL = 0.03
const Mat = () => <meshStandardMaterial color={GLOVE} roughness={0.6} />

function Finger({ length, ...props }) {
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, length / 2]}>
        <capsuleGeometry args={[0.14, length, 6, 16]} />
        <Mat />
        <Outlines thickness={OL} color={INK} />
      </mesh>
    </group>
  )
}

const Hand = forwardRef(function Hand(props, ref) {
  return (
    <group ref={ref} {...props}>
      {/* ладонь */}
      <RoundedBox args={[1.0, 0.45, 1.0]} radius={0.2} smoothness={5}>
        <Mat />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      {/* указательный */}
      <Finger length={0.95} position={[0.3, 0.05, 0.4]} />
      {/* согнутые пальцы */}
      {[0.03, -0.22, -0.43].map((x, i) => (
        <group key={x} position={[x, -0.02, 0.46 - i * 0.03]}>
          <Finger length={0.22} rotation={[0.2, 0, 0]} />
          <Finger length={0.2} position={[0, -0.06, 0.3]} rotation={[Math.PI * 0.75, 0, 0]} />
        </group>
      ))}
      {/* большой палец */}
      <Finger length={0.45} position={[0.45, -0.1, -0.05]} rotation={[0.1, 0.9, 0]} />
      {/* манжета */}
      <group position={[0, 0, -0.62]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.62]}>
          <cylinderGeometry args={[0.62, 0.55, 0.38, 40]} />
          <Mat />
          <Outlines thickness={OL} color={INK} />
        </mesh>
        {[-0.08, 0.08].map((z) => (
          <mesh key={z} position={[0, 0, z]} scale={[1, 0.62, 1]}>
            <torusGeometry args={[0.6, 0.025, 8, 48]} />
            <meshStandardMaterial color="#FFD600" />
          </mesh>
        ))}
      </group>
    </group>
  )
})

export default Hand
