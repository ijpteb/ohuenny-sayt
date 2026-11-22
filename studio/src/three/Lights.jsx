export default function Lights({ intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.9 * intensity} />
      <hemisphereLight args={['#ffffff', '#ffb000', 0.6 * intensity]} />
      <directionalLight position={[4, 6, 6]} intensity={2.2 * intensity} />
      <directionalLight position={[-6, -2, 3]} intensity={0.6 * intensity} color="#ffe6a0" />
    </>
  )
}
