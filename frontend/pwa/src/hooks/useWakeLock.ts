import { useEffect, useRef } from 'react'

/**
 * Mantiene la pantalla encendida mientras `active` sea true.
 * El sistema suelta el wake lock cada vez que la app pasa a segundo plano,
 * así que lo volvemos a pedir cuando la app vuelve a ser visible.
 */
export function useWakeLock(active: boolean): void {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    let cancelled = false

    const acquire = async () => {
      if (!active || document.visibilityState !== 'visible') return
      if (lockRef.current && !lockRef.current.released) return
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          void lock.release()
          return
        }
        lockRef.current = lock
      } catch {
        /* p. ej. modo ahorro de batería: lo ignoramos */
      }
    }

    const release = () => {
      const lock = lockRef.current
      lockRef.current = null
      if (lock && !lock.released) void lock.release()
    }

    if (active) void acquire()
    else release()

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      release()
    }
  }, [active])
}
