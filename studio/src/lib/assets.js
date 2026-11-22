// Автоопределение своих файлов в папке assets/.
// Для слота "console" проверяется models/console.glb, затем video/console.mp4.
// Если ничего нет — показывается заглушка.
const BASE = import.meta.env.BASE_URL
const cache = new Map()

async function exists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' })
    const type = res.headers.get('content-type') || ''
    // dev-сервер на отсутствующий файл может вернуть index.html — это не модель
    return res.ok && !type.includes('text/html')
  } catch {
    return false
  }
}

export function resolveSlot(slot) {
  if (!cache.has(slot)) {
    cache.set(
      slot,
      (async () => {
        const glb = `${BASE}models/${slot}.glb`
        if (await exists(glb)) return { kind: 'glb', url: glb }
        const mp4 = `${BASE}video/${slot}.mp4`
        if (await exists(mp4)) return { kind: 'video', url: mp4 }
        return { kind: 'none' }
      })(),
    )
  }
  return cache.get(slot)
}
