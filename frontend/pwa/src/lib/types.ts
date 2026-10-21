export type Phase = 'work' | 'short' | 'long'
export type Status = 'idle' | 'running' | 'paused'

export interface Settings {
  workMin: number
  shortMin: number
  longMin: number
  /** Cada cuántos pomodoros de trabajo toca descanso largo */
  longEvery: number
  /** Arrancar la siguiente fase automáticamente */
  autoStart: boolean
  /** Pedir al sistema que no apague la pantalla mientras corre el timer */
  keepAwake: boolean
  sound: boolean
}

export interface TimerState {
  phase: Phase
  status: Status
  /**
   * Momento (ms epoch) en que termina la fase actual. Solo cuando status === 'running'.
   * La clave de todo: NO llevamos un contador, guardamos cuándo termina.
   * Si iOS congela la app, al volver basta con comparar contra Date.now().
   */
  endsAt: number | null
  /** Tiempo restante cuando está pausado o sin arrancar */
  remainingMs: number
  /** Pomodoros de trabajo completados en el ciclo actual (para saber cuándo toca descanso largo) */
  cycleCount: number
}

export interface DailyStats {
  /** YYYY-MM-DD */
  date: string
  completed: number
  focusMinutes: number
}
