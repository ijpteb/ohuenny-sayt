import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

// Lenis даёт инерционный скролл, GSAP-тикер крутит его в одном кадре со ScrollTrigger.
export function initSmoothScroll() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  lenis = new Lenis({ lerp: reduced ? 1 : 0.09, wheelMultiplier: 1, smoothWheel: !reduced })
  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis
export function scrollToEl(selector) {
  if (lenis) lenis.scrollTo(selector, { duration: 1.6 })
  else document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}
export { gsap, ScrollTrigger }
