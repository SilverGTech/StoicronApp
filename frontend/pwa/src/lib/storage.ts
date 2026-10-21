// Pequeño wrapper sobre localStorage que nunca revienta
// (modo privado, almacenamiento lleno, JSON corrupto, etc.)

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* sin almacenamiento: la app sigue funcionando en memoria */
  }
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
