// Sonido generado con Web Audio: no necesitamos archivos de audio.
//
// Ojo con iOS: Safari solo deja reproducir audio si el AudioContext se creó
// o se "desbloqueó" dentro de un toque del usuario. Por eso llamamos a
// unlockAudio() cuando el usuario presiona "Iniciar".

let ctx: AudioContext | null = null

export function unlockAudio(): void {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    // Un buffer silencioso termina de desbloquear el audio en iOS viejos
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch {
    /* sin audio, no pasa nada */
  }
}

/** Campanita de tres notas */
export function playChime(): void {
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()
  const now = ctx.currentTime
  const notes = [659.25, 783.99, 1046.5] // E5, G5, C6
  notes.forEach((freq, i) => {
    const t = now + i * 0.18
    const osc = ctx!.createOscillator()
    const gain = ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1)
    osc.connect(gain).connect(ctx!.destination)
    osc.start(t)
    osc.stop(t + 1.2)
  })
}
