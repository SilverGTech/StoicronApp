import { PHASE_LABEL, SETTINGS_LIMITS as L, TEXT } from '../lib/constants'
import type { Settings } from '../lib/types'

const T = TEXT.settings

interface Props {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onClose: () => void
}

function Stepper({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="row">
      <span>{label}</span>
      <div className="stepper">
        <button onClick={() => onChange(Math.max(min, value - 1))} aria-label={T.less(label)}>
          −
        </button>
        <output>
          {value}
          {unit && <small>{unit}</small>}
        </output>
        <button onClick={() => onChange(Math.min(max, value + 1))} aria-label={T.more(label)}>
          +
        </button>
      </div>
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="row toggle">
      <span>
        {label}
        {hint && <small className="hint">{hint}</small>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  )
}

export function SettingsSheet({ settings: s, onChange, onClose }: Props) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="sheet" role="dialog" aria-label={T.title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{T.title}</h2>
          <button className="link" onClick={onClose}>
            {T.done}
          </button>
        </div>

        <Stepper label={PHASE_LABEL.work} unit={T.unitMin} value={s.workMin} {...L.workMin} onChange={(v) => onChange({ workMin: v })} />
        <Stepper label={PHASE_LABEL.short} unit={T.unitMin} value={s.shortMin} {...L.shortMin} onChange={(v) => onChange({ shortMin: v })} />
        <Stepper label={PHASE_LABEL.long} unit={T.unitMin} value={s.longMin} {...L.longMin} onChange={(v) => onChange({ longMin: v })} />
        <Stepper label={T.longEvery} value={s.longEvery} {...L.longEvery} onChange={(v) => onChange({ longEvery: v })} />

        <hr />

        <Toggle label={T.autoStart} checked={s.autoStart} onChange={(v) => onChange({ autoStart: v })} />
        <Toggle
          label={T.keepAwake}
          hint={T.keepAwakeHint}
          checked={s.keepAwake}
          onChange={(v) => onChange({ keepAwake: v })}
        />
        <Toggle
          label={T.sound}
          hint={T.soundHint}
          checked={s.sound}
          onChange={(v) => onChange({ sound: v })}
        />
      </section>
    </div>
  )
}
