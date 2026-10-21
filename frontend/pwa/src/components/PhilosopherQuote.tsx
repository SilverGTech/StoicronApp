import { useEffect, useState } from 'react'
import { QUOTES, randomQuoteIndex } from '../lib/quotes'

/* Dos bustos de trazo simple; se alternan, no dependen del autor de la frase. */
function BustA() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M22 24c0-8 4-14 10-14s10 6 10 14c0 4-1 7-2 9 2 3 1 8-2 11h-12c-3-3-4-8-2-11-1-2-2-5-2-9z" />
      <path d="M26 24c2 2 4 2 6 0 2 2 4 2 6 0M28 31c2 1 6 1 8 0M28 36c2 2 6 2 8 0" />
      <path d="M12 58c0-8 6-12 14-14M52 58c0-8-6-12-14-14M26 44c2 4 10 4 12 0M20 58l8-8M44 58l-8-8" />
    </svg>
  )
}

function BustB() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M21 22c0-8 5-13 11-13s11 5 11 13v4c0 8-4 15-11 17-7-2-11-9-11-17v-4z" />
      <path d="M21 20c3-4 7-6 11-6s8 2 11 6M27 25h3M34 25h3M32 26v5M27 36c3 2 7 2 10 0" />
      <path d="M10 58c1-8 8-12 16-13M54 58c-1-8-8-12-16-13M26 45c3 3 9 3 12 0M24 58l8-9 8 9" />
    </svg>
  )
}

export function PhilosopherQuote({ seed }: { seed: unknown }) {
  const [idx, setIdx] = useState(() => randomQuoteIndex())

  // Frase nueva cada vez que cambia la fase
  useEffect(() => {
    setIdx((prev) => randomQuoteIndex(prev))
  }, [seed])

  const q = QUOTES[idx]
  return (
    <figure className="quote">
      <blockquote>
        <p>“{q.text}”</p>
        <figcaption>— {q.author}</figcaption>
      </blockquote>
      <div className="bust">{idx % 2 === 0 ? <BustA /> : <BustB />}</div>
    </figure>
  )
}
