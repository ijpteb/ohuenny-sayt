import { useEffect, useRef } from 'react'
import { initSmoothScroll, gsap, ScrollTrigger } from './lib/smooth'
import { scroll, smooth } from './lib/state'
import Header from './sections/Header'
import Hero from './sections/Hero'
import Manifest from './sections/Manifest'
import Gallery from './sections/Gallery'
import Final from './sections/Final'

export default function App() {
  const bar = useRef()
  const flash = useRef()

  useEffect(() => {
    const stop = initSmoothScroll()
    const onMove = (e) => {
      scroll.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      scroll.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      // полоса прогресса
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      bar.current.style.transform = `scaleX(${p})`
      // белая вспышка: нарастает в конце Hero, держится, гаснет в начале манифеста
      const o = smooth(0.76, 0.9, scroll.hero) * (1 - smooth(0.0, 0.14, scroll.manifest))
      flash.current.style.opacity = o.toFixed(3)
      flash.current.style.visibility = o > 0.001 ? 'visible' : 'hidden'
    }
    gsap.ticker.add(tick)
    // после загрузки шрифтов пересчитать позиции триггеров
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
      stop()
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifest />
        <Gallery />
        <Final />
      </main>
      <div ref={flash} className="flash" aria-hidden />
      <div className="progress" aria-hidden>
        <div ref={bar} className="progress__bar" />
      </div>
    </>
  )
}
