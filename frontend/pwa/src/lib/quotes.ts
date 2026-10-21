export interface Quote {
  text: string
  author: string
}

export const QUOTES: Quote[] = [
  { text: 'La felicidad de tu vida depende de la calidad de tus pensamientos.', author: 'Marco Aurelio' },
  { text: 'El alma se tiñe del color de sus pensamientos.', author: 'Marco Aurelio' },
  { text: 'Si algo externo te perturba, no es la cosa en sí, sino tu juicio sobre ella.', author: 'Marco Aurelio' },
  { text: 'El obstáculo del camino se convierte en el camino.', author: 'Marco Aurelio' },
  { text: 'Quien es valiente es libre.', author: 'Séneca' },
  { text: 'Sufrimos más en la imaginación que en la realidad.', author: 'Séneca' },
  { text: 'No es que tengamos poco tiempo, sino que perdemos mucho.', author: 'Séneca' },
  { text: 'Mientras aplazamos la vida, ella se va.', author: 'Séneca' },
  { text: 'No son las cosas las que nos perturban, sino la opinión que tenemos de ellas.', author: 'Epicteto' },
  { text: 'Primero dite a ti mismo lo que quieres ser; después haz lo que tengas que hacer.', author: 'Epicteto' },
  { text: 'La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.', author: 'Epicteto' },
  { text: 'Hay cosas que dependen de nosotros y cosas que no dependen de nosotros.', author: 'Epicteto' },
]

export function randomQuoteIndex(exclude?: number): number {
  let i = Math.floor(Math.random() * QUOTES.length)
  if (i === exclude) i = (i + 1) % QUOTES.length
  return i
}
