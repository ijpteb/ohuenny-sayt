import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'
import { scroll } from '../lib/state'
import { EMAIL } from '../content'
import LazyCanvas from '../three/LazyCanvas'
import FinalScene from '../three/FinalScene'

export default function Final() {
  const sec = useRef()
  const btn = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: 'top 80%',
          end: 'top top',
          scrub: true,
          onUpdate: (s) => (scroll.final = s.progress),
        },
      })
        .from('.final__word', { yPercent: 100, stagger: 0.15, ease: 'power3.out' }, 0)
        .from('.final__cta', { scale: 0.6, opacity: 0, ease: 'back.out(2)' }, 0.4)
      // хедер и полоса прогресса инвертируются, когда под ними чёрный фон
      gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: 'top 40px',
          end: 'bottom top',
          onToggle: (s) => document.body.classList.toggle('is-dark', s.isActive),
        },
      })
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sec} className="final">
      <div className="final__stage">
        <h2 className="final__title">
          <span className="final__mask">
            <span className="final__word">REACH</span>
          </span>
          <span className="final__mask">
            <span className="final__word">OUT</span>
          </span>
        </h2>
        <a ref={btn} className="final__cta pill pill--big" href={`mailto:${EMAIL}`}>
          {EMAIL} <span aria-hidden>↗</span>
        </a>
        <LazyCanvas className="canvas canvas--top" camera={{ position: [0, 0, 10], fov: 35 }}>
          <FinalScene buttonRef={btn} />
        </LazyCanvas>
        <footer className="final__foot">
          <span>©2026 Цифровая студия</span>
          <span>Telegram · Behance · Instagram</span>
        </footer>
      </div>
    </section>
  )
}
