// Общее изменяемое состояние скролла: ScrollTrigger пишет, сцены three.js читают в useFrame.
// Без React-состояния — чтобы не было перерисовок на каждом кадре.
export const scroll = {
  hero: 0, // 0..1 — прогресс секции Hero (включая вспышку)
  manifest: 0,
  gallery: 0,
  final: 0, // 0..1 — появление финальной секции
  hovered: -1, // индекс продукта под курсором
  pointer: { x: 0, y: 0 }, // -1..1
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const lerp = (a, b, t) => a + (b - a) * t
