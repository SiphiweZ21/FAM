const preferenceKey = 'fam-learning-voice-v1'

export function availableLearningVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return []
  return window.speechSynthesis.getVoices().filter(voice => /^en(?:-|$)/i.test(voice.lang))
}

export function preferredLearningVoice(voices = availableLearningVoices()): SpeechSynthesisVoice | undefined {
  const saved = localStorage.getItem(preferenceKey)
  const selected = voices.find(voice => voice.voiceURI === saved)
  if (selected) return selected
  const english = voices.filter(voice => !/compact|espeak|robot/i.test(voice.name))
  const local = english.filter(voice => voice.localService)
  const pool = local.length ? local : english.length ? english : voices
  return pool.find(voice => /\b(enhanced|premium|natural|neural)\b/i.test(voice.name) && /^en(?:-|$)/i.test(voice.lang))
    ?? pool.find(voice => /^en-ZA$/i.test(voice.lang))
    ?? pool.find(voice => /^en-(GB|AU)$/i.test(voice.lang))
    ?? pool.find(voice => /^en-US$/i.test(voice.lang))
    ?? pool[0]
}

export function setLearningVoice(voiceURI: string) {
  if (voiceURI) localStorage.setItem(preferenceKey, voiceURI)
  else localStorage.removeItem(preferenceKey)
  window.dispatchEvent(new Event('fam-learning-voice-change'))
}

export function speakLearningText(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = preferredLearningVoice()
  if (voice) { utterance.voice = voice; utterance.lang = voice.lang }
  else utterance.lang = 'en-ZA'
  utterance.rate = 0.92
  utterance.pitch = 1
  window.speechSynthesis.speak(utterance)
}
