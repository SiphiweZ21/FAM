import { useEffect, useState } from 'react'
import { availableLearningVoices, preferredLearningVoice, setLearningVoice, speakLearningText } from '../lib/learning-voice'

export default function LearningVoiceSelector() {
  const [voices, setVoices] = useState(availableLearningVoices)
  const [selected, setSelected] = useState(() => preferredLearningVoice()?.voiceURI ?? '')

  useEffect(() => {
    const refresh = () => {
      const available = availableLearningVoices()
      setVoices(available)
      setSelected(preferredLearningVoice(available)?.voiceURI ?? '')
    }
    refresh()
    window.speechSynthesis?.addEventListener('voiceschanged', refresh)
    window.addEventListener('fam-learning-voice-change', refresh)
    return () => {
      window.speechSynthesis?.removeEventListener('voiceschanged', refresh)
      window.removeEventListener('fam-learning-voice-change', refresh)
    }
  }, [])

  if (!voices.length) return null
  return <div className="learning-voice-picker">
    <label htmlFor="learning-voice">Voice</label>
    <select id="learning-voice" value={selected} onChange={event => { setLearningVoice(event.target.value); setSelected(event.target.value) }}>
      {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}
    </select>
    <button type="button" onClick={() => speakLearningText('Hello! Let us learn together.')}>Preview</button>
  </div>
}
