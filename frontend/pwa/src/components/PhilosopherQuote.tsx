import { useEffect, useState } from 'react'
import { PHILOSOPHER_ICON } from '../lib/constants'
import { QUOTES, randomQuoteIndex } from '../lib/quotes'

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
      <img className="bust" src={PHILOSOPHER_ICON} alt="" />
    </figure>
  )
}
