import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'

// Canvas, который рендерит кадры только пока виден на экране — экономит GPU и батарею.
export default function LazyCanvas({ children, className, camera, style }) {
  const wrap = useRef()
  const [active, setActive] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '20% 0px' })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className={className} style={style}>
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={camera || { position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {children}
      </Canvas>
    </div>
  )
}
