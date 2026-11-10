import LearningVoiceSelector from '../components/LearningVoiceSelector'
import { speakLearningText } from '../lib/learning-voice'
import { ArrowLeft, ArrowRight, Delete, RotateCcw, Sparkles, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { getGradeSixWordPath } from '../data/grade-six-words'
import { useGradeContent } from '../lib/use-grade-content'
import { completeGradeSixPath, visitGradeSixPath } from '../lib/grade-six-progress'

export default function GradeSixWordPracticePage() {
  const { pathId } = useParams()
  const {data: path, loading: contentLoading, error: contentError} = useGradeContent<NonNullable<ReturnType<typeof getGradeSixWordPath>>>()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [letterIndexes, setLetterIndexes] = useState<number[]>([])
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => { setIndex(0); setSelected(null); setLetterIndexes([]); setChecked(false); setFinished(false) }, [pathId])
  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => {
    if (path) visitGradeSixPath(`word:${path.id}`)
  }, [path])
  if (contentLoading) return <div className="adventure-loading" role="status">Preparing your learning path...</div>
  if (contentError) return <div role="alert"><p>{contentError}</p><button onClick={() => window.location.reload()}>Try again</button></div>
  if (!path) return <Navigate to="/grades/grade-6/words" replace />
  const currentPath = path
  const activity = currentPath.activities[index]
  const builtWord = activity.type === 'build' ? letterIndexes.map(i => activity.letters[i]).join('') : ''
  const correct = activity.type === 'choice' ? selected === activity.answer : builtWord === activity.answer

  function speak(text: string) { speakLearningText(text) }
  function resetAnswer() { setSelected(null); setLetterIndexes([]); setChecked(false) }
  function check() { setChecked(true); speak(correct ? `Well done! ${activity.explanation}` : `Let's try again. ${activity.helper}`) }
  function next() { if (index === currentPath.activities.length - 1) { completeGradeSixPath(`word:${currentPath.id}`, currentPath.title); setFinished(true); speak(`You completed ${currentPath.title}!`) } else { setIndex(value => value + 1); resetAnswer() } }
  function restart() { setIndex(0); resetAnswer(); setFinished(false) }

  if (finished) return <div className="word-reward"><div className="word-reward-emoji">{currentPath.emoji}</div><span className="grade-stage-pill"><Sparkles size={14} /> WORD PATH COMPLETE</span><h1>Wonderful work!</h1><p>You completed <strong>{currentPath.title}</strong>.</p><div className="reward-actions"><button className="button primary" onClick={restart} type="button"><RotateCcw size={17} /> Play again</button><Link className="button" to="/grades/grade-6/words">Choose another path</Link></div></div>

  const hasAnswer = activity.type === 'choice' ? Boolean(selected) : builtWord.length === activity.answer.length
  return <div className="word-practice-page">
    <Link className="grade-back-link" to="/grades/grade-6/words"><ArrowLeft size={17} /> Word World</Link>
    <div className="mission-progress"><div><span>{currentPath.shortTitle.toUpperCase()}</span><strong>{index + 1} of {currentPath.activities.length}</strong></div><div className="mission-progress-track word-progress"><span style={{ width: `${(index / currentPath.activities.length) * 100}%` }} /></div></div>
    <header className="practice-heading"><div><span className="practice-topic-icon">{currentPath.emoji}</span><h1>{activity.prompt}</h1></div><button className="math-reset" onClick={() => speak(activity.type === 'choice' && activity.audioText ? `${activity.audioText} ${activity.prompt}` : `${activity.prompt} ${activity.helper}`)} type="button"><Volume2 size={17} /> {activity.type === 'choice' && activity.audioText ? 'Read story' : 'Read to me'}</button></header>
    <section className="word-visual"><div>{activity.visual}</div><p><span>🤖</span>{activity.helper}</p>{activity.type === 'choice' && activity.audioText && <details><summary>Show story text</summary><p>{activity.audioText}</p></details>}</section>
    <section className="word-answer-panel"><h2>{activity.type === 'build' ? 'Tap the letters in order' : 'Choose your answer'}</h2>
      {activity.type === 'choice' ? <div className="word-choice-grid">{activity.options.map(option => <button className={selected === option ? 'selected' : ''} onClick={() => { setSelected(option); setChecked(false); speak(option) }} key={option} type="button">{option}</button>)}</div> : <div className="word-builder"><div className="built-word" aria-label={`Built word: ${builtWord || 'empty'}`}>{activity.answer.split('').map((_, i) => <span key={i}>{builtWord[i] || '_'}</span>)}</div><div className="letter-bank">{activity.letters.map((letter, i) => <button disabled={letterIndexes.includes(i)} onClick={() => { setLetterIndexes(value => [...value, i]); setChecked(false); speak(letter) }} key={`${letter}-${i}`} type="button">{letter}</button>)}</div><button className="builder-delete" disabled={!letterIndexes.length} onClick={() => { setLetterIndexes(value => value.slice(0, -1)); setChecked(false) }} type="button"><Delete size={17} /> Remove last letter</button></div>}
      {!checked && <button className="button primary" disabled={!hasAnswer} onClick={check} type="button">Check my answer</button>}
      {checked && <div className={correct ? 'choice-feedback correct' : 'choice-feedback try-again'} role="status"><span>{correct ? '🎉' : '💡'}</span><div><strong>{correct ? 'Well done!' : 'Try once more'}</strong><p>{correct ? activity.explanation : activity.helper}</p></div>{correct && <button className="math-next" onClick={next} type="button">{index === currentPath.activities.length - 1 ? 'Finish path' : 'Next activity'} <ArrowRight size={17} /></button>}</div>}
    </section>
  </div>
}
