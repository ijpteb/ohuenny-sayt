import { RoundedBox, Outlines } from '@react-three/drei'

// Заглушки продуктов из примитивов, каждая примерно 2×2 единицы.
const INK = '#111111'
const OL = 0.03
const M = ({ c, r = 0.5, ...p }) => <meshStandardMaterial color={c} roughness={r} {...p} />

function Cassette() {
  return (
    <group>
      <RoundedBox args={[2, 1.28, 0.28]} radius={0.08}>
        <M c="#1B1B1F" />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0.145]}>
        <planeGeometry args={[1.7, 0.8]} />
        <M c="#FFF6DA" />
      </mesh>
      <mesh position={[0, 0.4, 0.15]}>
        <planeGeometry args={[1.7, 0.14]} />
        <M c="#FF3D2E" />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.05, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 24]} />
          <M c="#1B1B1F" />
        </mesh>
      ))}
      <mesh position={[0, -0.45, 0.15]}>
        <boxGeometry args={[1.1, 0.25, 0.04]} />
        <M c="#2E2E35" />
      </mesh>
    </group>
  )
}

function Joystick() {
  return (
    <group position={[0, -0.35, 0]}>
      <RoundedBox args={[1.7, 0.45, 1.3]} radius={0.15}>
        <M c="#1B1B1F" />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      <mesh position={[0, 0.65, 0]} rotation={[0.25, 0, -0.2]}>
        <cylinderGeometry args={[0.08, 0.1, 1.1, 16]} />
        <M c="#333" r={0.3} />
      </mesh>
      <mesh position={[-0.15, 1.2, 0.14]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <M c="#FF3D2E" r={0.25} />
        <Outlines thickness={OL} color={INK} />
      </mesh>
      <mesh position={[0.55, 0.27, 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 24]} />
        <M c="#FFD600" />
      </mesh>
    </group>
  )
}

function Camera() {
  return (
    <group>
      <RoundedBox args={[1.9, 1.4, 0.8]} radius={0.15}>
        <M c="#F3EEE1" />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      <mesh position={[0, -0.05, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.48, 0.25, 40]} />
        <M c="#1B1B1F" />
      </mesh>
      <mesh position={[0, -0.05, 0.585]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 40]} />
        <M c="#3A4BFF" r={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[0.62, 0.45, 0.41]}>
        <boxGeometry args={[0.38, 0.22, 0.04]} />
        <M c="#FFFFFF" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
      {['#FF3D2E', '#FF8C1A', '#FFD600', '#62C6FF'].map((c, i) => (
        <mesh key={c} position={[-0.95 + 0.002, 0.3 - i * 0.12, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 0.1]} />
          <M c={c} side={2} />
        </mesh>
      ))}
    </group>
  )
}

function Floppy() {
  return (
    <group>
      <RoundedBox args={[1.8, 1.8, 0.14]} radius={0.04}>
        <M c="#2B2BFF" r={0.35} />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      <mesh position={[0.1, 0.62, 0.075]}>
        <boxGeometry args={[1.0, 0.56, 0.02]} />
        <M c="#C9CCD2" metalness={0.7} r={0.25} />
      </mesh>
      <mesh position={[0.3, 0.62, 0.09]}>
        <boxGeometry args={[0.22, 0.4, 0.01]} />
        <M c="#2B2BFF" />
      </mesh>
      <mesh position={[0, -0.35, 0.075]}>
        <planeGeometry args={[1.4, 0.95]} />
        <M c="#FFFFFF" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.15 - i * 0.22, 0.08]}>
          <planeGeometry args={[1.2, 0.03]} />
          <M c="#FF3D2E" />
        </mesh>
      ))}
    </group>
  )
}

function Headphones() {
  return (
    <group position={[0, -0.1, 0]}>
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.85, 0.09, 16, 48, Math.PI]} />
        <M c="#1B1B1F" />
        <Outlines thickness={OL} color={INK} />
      </mesh>
      {[-0.85, 0.85].map((x) => (
        <group key={x} position={[x, -0.15, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.35, 32]} />
            <M c="#FF8C1A" />
            <Outlines thickness={OL} color={INK} />
          </mesh>
          <mesh position={[x > 0 ? -0.2 : 0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.36, 0.36, 0.1, 32]} />
            <M c="#1B1B1F" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Speaker() {
  return (
    <group>
      <RoundedBox args={[2, 1.2, 0.6]} radius={0.12}>
        <M c="#FF3D2E" />
        <Outlines thickness={OL} color={INK} />
      </RoundedBox>
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, -0.05, 0.31]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.05, 40]} />
            <M c="#1B1B1F" />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <M c="#F3EEE1" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.25, 0.31]}>
        <boxGeometry args={[0.45, 0.25, 0.05]} />
        <M c="#1B1B1F" />
      </mesh>
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.07, 1.5, 4, 12]} />
        <M c="#1B1B1F" />
      </mesh>
    </group>
  )
}

const MAP = { cassette: Cassette, joystick: Joystick, camera: Camera, floppy: Floppy, headphones: Headphones, speaker: Speaker }
export default function Product({ kind }) {
  const C = MAP[kind] || Cassette
  return <C />
}
