const SIZE = 300
const STROKE = 6
const R = (SIZE - STROKE) / 2 - 10
const C = 2 * Math.PI * R
const TICKS = 60

export function Ring({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, progress))
  return (
    <svg className="ring" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
      {/* Marcas tipo reloj */}
      {Array.from({ length: TICKS }, (_, i) => {
        const a = (i / TICKS) * 2 * Math.PI
        const major = i % 5 === 0
        const r1 = SIZE / 2 - 2
        const r2 = r1 - (major ? 8 : 4)
        return (
          <line
            key={i}
            className={major ? 'tick major' : 'tick'}
            x1={SIZE / 2 + r1 * Math.sin(a)}
            y1={SIZE / 2 - r1 * Math.cos(a)}
            x2={SIZE / 2 + r2 * Math.sin(a)}
            y2={SIZE / 2 - r2 * Math.cos(a)}
          />
        )
      })}
      <circle className="track" cx={SIZE / 2} cy={SIZE / 2} r={R} strokeWidth={STROKE} />
      <circle
        className="bar"
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={R}
        strokeWidth={STROKE}
        strokeDasharray={C}
        strokeDashoffset={C * (1 - p)}
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
      />
    </svg>
  )
}
