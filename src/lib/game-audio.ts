export type GameSound = 'start' | 'correct' | 'wrong' | 'streak' | 'boss' | 'reward'

const soundPatterns: Record<GameSound, Array<[number, number, number, OscillatorType]>> = {
  start: [[392, 0, .08, 'sine'], [523, .08, .1, 'sine'], [659, .18, .14, 'sine']],
  correct: [[523, 0, .08, 'sine'], [659, .08, .08, 'sine'], [784, .16, .14, 'sine']],
  wrong: [[210, 0, .12, 'square'], [165, .1, .18, 'square']],
  streak: [[659, 0, .06, 'triangle'], [784, .06, .06, 'triangle'], [988, .12, .13, 'triangle']],
  boss: [[147, 0, .16, 'sawtooth'], [196, .16, .16, 'sawtooth'], [247, .32, .28, 'sawtooth']],
  reward: [[392, 0, .1, 'triangle'], [523, .1, .1, 'triangle'], [659, .2, .1, 'triangle'], [784, .3, .22, 'triangle']]
}

export function getSoundEnabled() {
  return localStorage.getItem('fam-sound-enabled') !== 'false'
}

export function setSoundEnabled(enabled: boolean) {
  localStorage.setItem('fam-sound-enabled', String(enabled))
}

export function playGameSound(sound: GameSound) {
  if (!getSoundEnabled()) return
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const master = context.createGain()
  master.gain.setValueAtTime(.13, context.currentTime)
  master.connect(context.destination)

  soundPatterns[sound].forEach(([frequency, delay, duration, type]) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const start = context.currentTime + delay
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(.001, start)
    gain.gain.exponentialRampToValueAtTime(1, start + .015)
    gain.gain.exponentialRampToValueAtTime(.001, start + duration)
    oscillator.connect(gain)
    gain.connect(master)
    oscillator.start(start)
    oscillator.stop(start + duration + .02)
  })

  const end = Math.max(...soundPatterns[sound].map(([, delay, duration]) => delay + duration))
  window.setTimeout(() => void context.close(), (end + .1) * 1000)
}
