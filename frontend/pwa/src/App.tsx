import { useEffect, useState } from 'react'
import { usePomodoro } from './hooks/usePomodoro'
import { useWakeLock } from './hooks/useWakeLock'
import type { Phase } from './lib/types'
import { APP, PHASE_LABEL, PHASES, TEXT } from './lib/constants'
import { SettingsSheet } from './components/SettingsSheet'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Ring } from './components/Ring'
import { PhilosopherQuote } from './components/PhilosopherQuote'

function formatTime(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const p = usePomodoro()
  const { state, settings, stats } = p
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pendingPhase, setPendingPhase] = useState<Phase | null>(null)
  const running = state.status === 'running'
  const time = formatTime(p.remainingMs)

  useWakeLock(running && settings.keepAwake)

  // Tiempo en el título de la pestaña (útil en escritorio)
  useEffect(() => {
    document.title = running ? TEXT.tabTitle(time, PHASE_LABEL[state.phase]) : APP.name
  }, [running, time, state.phase])

  // Si hay un conteo en curso o pausado, pedir confirmación antes de descartarlo
  const requestPhase = (ph: Phase) => {
    if (ph === state.phase) return
    if (state.status === 'idle') p.selectPhase(ph)
    else setPendingPhase(ph)
  }
  const confirmPhase = () => {
    if (pendingPhase) p.selectPhase(pendingPhase)
    setPendingPhase(null)
  }

  const mainLabel = running ? TEXT.main.pause : state.status === 'paused' ? TEXT.main.resume : TEXT.main.start

  return (
    <div className="app" data-phase={state.phase}>
      <header className="top">
        <span className="brand">{TEXT.header.brand}</span>
        <span className="today" aria-label={TEXT.header.todayAria}>
          <strong>{stats.completed}</strong>
          {TEXT.header.todaySuffix(stats.focusMinutes)}
        </span>
      </header>

      <PhilosopherQuote seed={state.phase} />

      <nav className="phases" aria-label={TEXT.phasesAria}>
        {PHASES.map((ph) => (
          <button
            key={ph}
            className={ph === state.phase ? 'active' : ''}
            onClick={() => requestPhase(ph)}
            aria-pressed={ph === state.phase}
          >
            {PHASE_LABEL[ph]}
          </button>
        ))}
      </nav>

      <main className="dial">
        <Ring progress={p.progress} />
        <div className="readout">
          <div className="time" role="timer" aria-live="off">
            {time}
          </div>
          <div className="cycle" aria-label={TEXT.cycleAria(state.cycleCount, settings.longEvery)}>
            {Array.from({ length: settings.longEvery }, (_, i) => (
              <span key={i} className={i < state.cycleCount ? 'dot done' : 'dot'} />
            ))}
          </div>
        </div>
      </main>

      <div className="controls">
        <button className="ghost" onClick={p.reset} aria-label={TEXT.reset}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" />
          </svg>
        </button>
        <button className="primary" onClick={running ? p.pause : p.start}>
          {mainLabel}
        </button>
        <button className="ghost" onClick={p.skip} aria-label={TEXT.skip}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5l9 7-9 7V5zM18 5v14" />
          </svg>
        </button>
      </div>

      <footer className="bottom">
        <button className="link" onClick={() => setSettingsOpen(true)}>
          {TEXT.settingsOpen}
        </button>
      </footer>

      {pendingPhase && (
        <ConfirmDialog
          title={TEXT.switchPhase.title}
          message={TEXT.switchPhase.message}
          confirmLabel={TEXT.switchPhase.confirm}
          cancelLabel={TEXT.switchPhase.cancel}
          onConfirm={confirmPhase}
          onCancel={() => setPendingPhase(null)}
        />
      )}

      {settingsOpen && (
        <SettingsSheet settings={settings} onChange={p.updateSettings} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
