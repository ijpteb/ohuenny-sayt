import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/smooth'
import { scroll } from '../lib/state'
import { MANIFEST } from '../content'

export default function Manifest() {
  const sec = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (s) => (scroll.manifest = s.progress),
        },
      })
      tl.to({}, { duration: 1 }, 0)
        .from('.manifest__line > span', { yPercent: 110, rotate: 3, duration: 0.16, stagger: 0.12, ease: 'power3.out' }, 0.14)
        .from('.manifest__label', { opacity: 0, duration: 0.1 }, 0.1)
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sec} className="manifest">
      <div className="stage stage--center">
        <div className="manifest__label">(01) Манифест</div>
        <p className="manifest__text">
          {MANIFEST.map((line, i) => (
            <span key={i} className="manifest__line">
              <span>{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
