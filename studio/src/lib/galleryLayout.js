import { smooth } from './state'

// Общая раскладка блобов для DOM и для 3D-сцены (доли ширины/высоты экрана).
export function galleryLayout(w, h) {
  const wide = w / h > 0.9
  if (wide) {
    const size = Math.min(w * 0.19, h * 0.3)
    return {
      size,
      pos: [
        [0.22, 0.47],
        [0.5, 0.4],
        [0.78, 0.46],
        [0.22, 0.8],
        [0.5, 0.75],
        [0.78, 0.8],
      ],
    }
  }
  const size = Math.min(w * 0.4, h * 0.21)
  return {
    size,
    pos: [
      [0.28, 0.31],
      [0.72, 0.35],
      [0.28, 0.56],
      [0.72, 0.6],
      [0.28, 0.81],
      [0.72, 0.85],
    ],
  }
}

// Насколько «вылетел» i-й объект при прогрессе p
export const itemT = (i, p) => {
  const start = 0.04 + i * 0.07
  return smooth(start, start + 0.32, p)
}
