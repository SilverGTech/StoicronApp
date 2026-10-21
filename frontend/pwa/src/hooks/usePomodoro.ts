import { useCallback, useEffect, useRef, useState } from 'react'
import { load, save, todayKey } from '../lib/storage'
import { playChime, unlockAudio } from '../lib/sound'
import { DEFAULT_SETTINGS, SOUND_GRACE_MS, STORAGE_KEYS, TICK_MS } from '../lib/constants'
import type { DailyStats, Phase, Settings, TimerState } from '../lib/types'


export const durationMs = (phase: Phase, s: Settings): number =>
  (phase === 'work' ? s.workMin : phase === 'short' ? s.shortMin : s.longMin) * 60_000

function nextPhase(phase: Phase, cycleCount: number, s: Settings): { phase: Phase; cycleCount: number } {
  if (phase === 'work') {
    const count = cycleCount + 1
    return { phase: count >= s.longEvery ? 'long' : 'short', cycleCount: count }
  }
  // Tras el descanso largo empieza un ciclo nuevo
  return { phase: 'work', cycleCount: phase === 'long' ? 0 : cycleCount }
}

interface Finished {
  phase: Phase
  at: number
}

/**
 * Lleva el estado al presente. Si la app estuvo congelada (iOS en segundo plano)
 * puede que hayan terminado una o varias fases: las recorremos todas.
 */
function settle(state: TimerState, s: Settings, now: number): { state: TimerState; finished: Finished[] } {
  const finished: Finished[] = []
  let st = state
  let guard = 0
  while (st.status === 'running' && st.endsAt !== null && st.endsAt <= now && guard++ < 100) {
    finished.push({ phase: st.phase, at: st.endsAt })
    const next = nextPhase(st.phase, st.cycleCount, s)
    const dur = durationMs(next.phase, s)
    st = s.autoStart
      ? { ...next, status: 'running', endsAt: st.endsAt + dur, remainingMs: dur }
      : { ...next, status: 'idle', endsAt: null, remainingMs: dur }
  }
  return { state: st, finished }
}

function initialState(s: Settings): TimerState {
  return { phase: 'work', status: 'idle', endsAt: null, remainingMs: durationMs('work', s), cycleCount: 0 }
}

function freshStats(): DailyStats {
  return { date: todayKey(), completed: 0, focusMinutes: 0 }
}

export function usePomodoro() {
  const [settings, setSettingsState] = useState<Settings>(() => load(STORAGE_KEYS.settings, DEFAULT_SETTINGS))
  const [stats, setStats] = useState<DailyStats>(() => {
    const st = load(STORAGE_KEYS.stats, freshStats())
    return st.date === todayKey() ? st : freshStats()
  })
  const [state, setState] = useState<TimerState>(() => load(STORAGE_KEYS.state, initialState(settings)))
  const [now, setNow] = useState(() => Date.now())

  // Refs para leer siempre el valor más reciente desde intervalos y listeners
  const stateRef = useRef(state)
  // Solo updateSettings cambia los ajustes, y actualiza este ref a la vez
  const settingsRef = useRef(settings)

  const commit = useCallback((next: TimerState) => {
    stateRef.current = next
    setState(next)
    save(STORAGE_KEYS.state, next)
  }, [])

  const recordFinished = useCallback((finished: Finished[]) => {
    const works = finished.filter((f) => f.phase === 'work').length
    if (works > 0) {
      setStats((prev) => {
        const base = prev.date === todayKey() ? prev : freshStats()
        const next = {
          ...base,
          completed: base.completed + works,
          focusMinutes: base.focusMinutes + works * settingsRef.current.workMin,
        }
        save(STORAGE_KEYS.stats, next)
        return next
      })
    }
    const last = finished[finished.length - 1]
    if (last && settingsRef.current.sound && Date.now() - last.at < SOUND_GRACE_MS) {
      playChime()
    }
  }, [])

  // Pone el estado al día: se llama en cada tick y al volver de segundo plano
  const sync = useCallback(() => {
    const t = Date.now()
    setNow(t)
    const { state: next, finished } = settle(stateRef.current, settingsRef.current, t)
    if (finished.length > 0) {
      commit(next)
      recordFinished(finished)
    }
  }, [commit, recordFinished])

  // Al abrir la app: ponernos al día con lo que pasó mientras estaba cerrada
  useEffect(() => {
    const id = window.setTimeout(sync, 0)
    return () => window.clearTimeout(id)
  }, [sync])

  // Tick mientras corre
  useEffect(() => {
    if (state.status !== 'running') return
    const id = window.setInterval(sync, TICK_MS)
    return () => window.clearInterval(id)
  }, [state.status, sync])

  // Al volver a la app (iOS la congela en segundo plano)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    window.addEventListener('pageshow', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      window.removeEventListener('pageshow', onVisible)
    }
  }, [sync])

  // ---- Acciones ----

  const start = useCallback(() => {
    unlockAudio() // tiene que ir dentro del toque del usuario (regla de iOS)
    const st = stateRef.current
    if (st.status === 'running') return
    const t = Date.now()
    setNow(t)
    commit({ ...st, status: 'running', endsAt: t + st.remainingMs })
  }, [commit])

  const pause = useCallback(() => {
    const st = stateRef.current
    if (st.status !== 'running' || st.endsAt === null) return
    const t = Date.now()
    setNow(t)
    commit({ ...st, status: 'paused', endsAt: null, remainingMs: Math.max(0, st.endsAt - t) })
  }, [commit])

  const reset = useCallback(() => {
    const st = stateRef.current
    commit({ ...st, status: 'idle', endsAt: null, remainingMs: durationMs(st.phase, settingsRef.current) })
  }, [commit])

  /** Saltar a la siguiente fase sin contarla como completada */
  const skip = useCallback(() => {
    const st = stateRef.current
    const s = settingsRef.current
    const next =
      st.phase === 'work'
        ? { phase: (st.cycleCount + 1 >= s.longEvery ? 'long' : 'short') as Phase, cycleCount: st.cycleCount }
        : nextPhase(st.phase, st.cycleCount, s)
    commit({ ...next, status: 'idle', endsAt: null, remainingMs: durationMs(next.phase, s) })
  }, [commit])

  const selectPhase = useCallback(
    (phase: Phase) => {
      const st = stateRef.current
      commit({ ...st, phase, status: 'idle', endsAt: null, remainingMs: durationMs(phase, settingsRef.current) })
    },
    [commit],
  )

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...settingsRef.current, ...patch }
      settingsRef.current = next
      setSettingsState(next)
      save(STORAGE_KEYS.settings, next)
      // Si el timer no ha arrancado, refleja la nueva duración de inmediato
      const st = stateRef.current
      if (st.status === 'idle') commit({ ...st, remainingMs: durationMs(st.phase, next) })
    },
    [commit],
  )

  const remainingMs =
    state.status === 'running' && state.endsAt !== null ? Math.max(0, state.endsAt - now) : state.remainingMs
  const totalMs = durationMs(state.phase, settings)

  return {
    state,
    settings,
    stats,
    remainingMs,
    totalMs,
    progress: totalMs > 0 ? 1 - remainingMs / totalMs : 0,
    start,
    pause,
    reset,
    skip,
    selectPhase,
    updateSettings,
  }
}
