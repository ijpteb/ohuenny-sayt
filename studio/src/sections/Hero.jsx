import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'
import { scroll } from '../lib/state'
import { STUDIO_NAME } from '../content'
import LazyCanvas from '../three/LazyCanvas'
import HeroScene from '../three/HeroScene'

export default function Hero() {
  const sec = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (s) => (scroll.hero = s.progress),
        },
      })
      tl.to({}, { duration: 1 }, 0) // длина таймлайна = 1 (доли прогресса)
        .to('.hero__char', { yPercent: -130, rotate: (i) => (i % 2 ? 9 : -9), opacity: 0, stagger: 0.025, duration: 0.3, ease: 'power2.in' }, 0)
        .to('.hero__meta', { opacity: 0, y: -24, duration: 0.15 }, 0)
        .to('.hero__hint', { opacity: 0, duration: 0.08 }, 0)
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={sec} className="hero">
      <div className="stage">
        <h1 className="hero__title" aria-label={STUDIO_NAME}>
          {[...STUDIO_NAME.toUpperCase()].map((ch, i) => (
            <span key={i} className="hero__char" aria-hidden>
              {ch}
            </span>
          ))}
        </h1>
        <LazyCanvas className="canvas" camera={{ position: [0, 0, 10], fov: 35 }}>
          <HeroScene />
        </LazyCanvas>
        <div className="hero__meta">
          <span>Цифровая студия</span>
          <span>Сайты · 3D · Интерфейсы</span>
          <span>©2026</span>
        </div>
        <div className="hero__hint">Листайте ↓</div>
      </div>
    </section>
  )
}
