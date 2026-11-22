import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/smooth'
import { scroll } from '../lib/state'
import { PRODUCTS } from '../content'
import { galleryLayout, itemT } from '../lib/galleryLayout'
import LazyCanvas from '../three/LazyCanvas'
import GalleryScene from '../three/GalleryScene'

function useStageSize(ref) {
  const [s, set] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => set({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [ref])
  return s
}

export default function Gallery() {
  const sec = useRef()
  const stage = useRef()
  const blobs = useRef([])
  const labels = useRef([])
  const { w, h } = useStageSize(stage)
  const L = galleryLayout(w, h)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (s) => (scroll.gallery = s.progress),
        },
      })
      gsap.from('.gallery__head > *', {
        yPercent: 100,
        opacity: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: sec.current, start: 'top 70%', end: 'top 10%', scrub: true },
      })
    }, sec)
    // блобы и подписи раскрываются синхронно с вылетом объектов
    const tick = () => {
      PRODUCTS.forEach((_, i) => {
        const t = itemT(i, scroll.gallery)
        const b = blobs.current[i]
        const l = labels.current[i]
        if (b) b.style.setProperty('--t', t.toFixed(4))
        if (l) l.style.opacity = Math.max(0, (t - 0.7) / 0.3).toFixed(3)
      })
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      ctx.revert()
    }
  }, [])

  return (
    <section id="work" ref={sec} className="gallery">
      <div className="stage" ref={stage}>
        <div className="gallery__head">
          <span className="gallery__label">(02) Работы</span>
          <h2 className="gallery__title">Вещи, которые мы сделали</h2>
        </div>
        <div className="gallery__blobs" aria-hidden>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.slot}
              ref={(el) => (blobs.current[i] = el)}
              className={`blob blob--${i}`}
              style={{
                left: `${L.pos[i][0] * 100}%`,
                top: `${L.pos[i][1] * 100}%`,
                width: L.size,
                height: L.size,
                '--c': p.color,
              }}
            />
          ))}
        </div>
        <LazyCanvas className="canvas" camera={{ position: [0, 0, 10], fov: 35 }}>
          <GalleryScene />
        </LazyCanvas>
        <div className="gallery__hits">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.slot}
              className="hit"
              style={{ left: `${L.pos[i][0] * 100}%`, top: `${L.pos[i][1] * 100}%`, width: L.size, height: L.size }}
              onPointerEnter={() => (scroll.hovered = i)}
              onPointerLeave={() => scroll.hovered === i && (scroll.hovered = -1)}
              onFocus={() => (scroll.hovered = i)}
              onBlur={() => (scroll.hovered = -1)}
              onClick={() => (scroll.hovered = scroll.hovered === i ? -1 : i)}
              aria-label={`${p.title} — ${p.tag}`}
            >
              <span className="hit__label" ref={(el) => (labels.current[i] = el)}>
                <b>{p.title}</b>
                <i>{p.tag}</i>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
