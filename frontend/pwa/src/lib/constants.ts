import type { Phase, Settings } from './types.ts'

/* ---------- App ---------- */

export const APP = {
  name: 'Stoicron',
  shortName: 'Stoicron',
  description: 'Mi timer pomodoro estoico',
  lang: 'es',
  themeColor: '#ffffff',
} as const

/** Icono del filósofo (en /public) */
export const PHILOSOPHER_ICON = '/filosofo.svg'

/* ---------- Fases ---------- */

export const PHASES: readonly Phase[] = ['work', 'short', 'long']

export const PHASE_LABEL: Record<Phase, string> = {
  work: 'Enfoque',
  short: 'Descanso',
  long: 'Descanso largo',
}

/* ---------- Ajustes por defecto y límites ---------- */

export const DEFAULT_SETTINGS: Settings = {
  workMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
  autoStart: false,
  keepAwake: true,
  sound: true,
}

export const SETTINGS_LIMITS = {
  workMin: { min: 1, max: 120 },
  shortMin: { min: 1, max: 60 },
  longMin: { min: 1, max: 90 },
  longEvery: { min: 2, max: 8 },
} as const

/* ---------- Persistencia ---------- */

export const STORAGE_KEYS = {
  state: 'pomodoro:state',
  settings: 'pomodoro:settings',
  stats: 'pomodoro:stats',
} as const

/* ---------- Tiempos ---------- */

export const TICK_MS = 250
/** Si una fase terminó hace más de esto, asumimos que la app estaba congelada y no suena */
export const SOUND_GRACE_MS = 5000

/* ---------- Textos de la interfaz ---------- */

export const TEXT = {
  header: {
    brand: 'stoicron',
    todayAria: 'Pomodoros de hoy',
    todaySuffix: (min: number) => ` hoy · ${min} min`,
  },
  phasesAria: 'Fase',
  cycleAria: (done: number, total: number) => `Pomodoro ${done} de ${total}`,
  main: { pause: 'Pausar', resume: 'Seguir', start: 'Iniciar' },
  reset: 'Reiniciar',
  skip: 'Saltar fase',
  settingsOpen: 'Ajustes',
  tabTitle: (time: string, phaseLabel: string) => `${time} · ${phaseLabel}`,
  confirm: {
    cancel: 'Seguir aquí',
    switchPhase: {
      title: '¿Cambiar de fase?',
      message: 'El contador en curso se reiniciará y perderás el tiempo avanzado.',
      confirm: 'Sí, cambiar',
    },
    reset: {
      title: '¿Reiniciar el contador?',
      message: 'Volverá al tiempo inicial de esta fase y perderás el tiempo avanzado.',
      confirm: 'Sí, reiniciar',
    },
    skip: {
      title: '¿Saltar esta fase?',
      message: 'Se pasará a la siguiente fase y se descartará el tiempo avanzado.',
      confirm: 'Sí, saltar',
    },
  },
  settings: {
    title: 'Ajustes',
    done: 'Listo',
    unitMin: 'min',
    less: (label: string) => `Menos ${label}`,
    more: (label: string) => `Más ${label}`,
    longEvery: 'Descanso largo cada',
    autoStart: 'Arrancar siguiente fase sola',
    keepAwake: 'Mantener pantalla encendida',
    keepAwakeHint: 'Mientras corre el timer',
    sound: 'Sonido al terminar',
    soundHint: 'Solo con la app abierta',
  },
} as const
