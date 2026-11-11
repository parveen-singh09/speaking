let ctx: AudioContext | null = null
let timer: ReturnType<typeof setInterval> | null = null
let playing = false

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) {
        return null
      }
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch {
    return null
  }
}

const CHIME_NOTES = [587.33, 739.99, 987.77, 1174.66]

function pluck(ac: AudioContext, freq: number, at: number) {
  const gain = ac.createGain()
  gain.connect(ac.destination)
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(0.16, at + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0008, at + 0.6)

  const osc = ac.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = freq

  const partial = ac.createOscillator()
  partial.type = 'sine'
  partial.frequency.value = freq * 2
  const pGain = ac.createGain()
  pGain.gain.setValueAtTime(0.04, at)
  pGain.gain.exponentialRampToValueAtTime(0.0005, at + 0.35)
  partial.connect(pGain)
  pGain.connect(ac.destination)

  osc.connect(gain)
  osc.start(at)
  partial.start(at)
  osc.stop(at + 0.65)
  partial.stop(at + 0.4)
}

function playRing() {
  const ac = ensureCtx()
  if (!ac) {
    return
  }
  const now = ac.currentTime
  CHIME_NOTES.forEach((freq, i) => {
    pluck(ac, freq, now + i * 0.16)
  })
}

export function startRingtone() {
  if (playing) {
    return
  }
  playing = true
  playRing()
  timer = setInterval(playRing, 3000)
}

export function stopRingtone() {
  playing = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
