import LearningVoiceSelector from '../components/LearningVoiceSelector'
import { speakLearningText } from '../lib/learning-voice'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { getGradeOneTopic } from '../data/grade-one-topics'
import { useGradeContent } from '../lib/use-grade-content'
import { completeGradeOnePath, setLastGradeOneActivity } from '../lib/grade-one-progress'

export default function GradeOnePracticePage() {
  const { topicId } = useParams()
  const {data: topic, loading: contentLoading, error: contentError} = useGradeContent<NonNullable<ReturnType<typeof getGradeOneTopic>>>()
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [counted, setCounted] = useState<number[]>([])

  useEffect(() => { setIndex(0); setSelected(null); setChecked(false); setFinished(false); setCounted([]) }, [topicId])
  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => {
    if (topic) setLastGradeOneActivity(topic.title, `/grades/grade-1/mathematics/practice/${topic.id}`, 'number')
  }, [topic])

  if (contentLoading) return <div className="adventure-loading" role="status">Preparing your learning path...</div>
  if (contentError) return <div role="alert"><p>{contentError}</p><button onClick={() => window.location.reload()}>Try again</button></div>
  if (!topic) return <Navigate to="/grades/grade-1/mathematics" replace />
  const currentTopic = topic
  const activity = currentTopic.activities[index]
  const correct = selected === activity.answer

  function speak(text: string) { speakLearningText(text) }

  function check() {
    setChecked(true)
    speak(selected === activity.answer ? `Well done! ${activity.explanation}` : `Let's try again. ${activity.helper}`)
  }

  function next() {
    if (index === currentTopic.activities.length - 1) { completeGradeOnePath('number', currentTopic.id, currentTopic.title, `${currentTopic.shortTitle} Star`); setFinished(true); speak(`You completed ${currentTopic.title}!`) }
    else { setIndex(value => value + 1); setSelected(null); setChecked(false); setCounted([]) }
  }

  function restart() { setIndex(0); setSelected(null); setChecked(false); setFinished(false); setCounted([]) }

  if (finished) return <div className="topic-reward"><div className="topic-reward-emoji">{currentTopic.emoji}</div><span className="grade-stage-pill"><Sparkles size={14} /> PATH COMPLETE</span><h1>Fantastic work!</h1><p>You completed <strong>{currentTopic.title}</strong>.</p><div className="reward-actions"><button className="button primary" onClick={restart} type="button"><RotateCcw size={17} /> Play again</button><Link className="button" to="/grades/grade-1/mathematics">Choose another path</Link></div></div>

  return (
    <div className="grade-one-practice">
      <Link className="grade-back-link" to="/grades/grade-1/mathematics"><ArrowLeft size={17} /> Number World</Link>
      <div className="mission-progress"><div><span>{currentTopic.shortTitle.toUpperCase()}</span><strong>{index + 1} of {currentTopic.activities.length}</strong></div><div className="mission-progress-track"><span style={{ width: `${(index / currentTopic.activities.length) * 100}%` }} /></div></div>
      <header className="practice-heading"><div><span className="practice-topic-icon">{currentTopic.emoji}</span><h1>{activity.prompt}</h1></div><button className="math-reset" onClick={() => speak(`${activity.prompt} ${activity.helper}`)} type="button"><Volume2 size={17} /> Read to me</button><LearningVoiceSelector /></header>
      <section className="practice-visual" aria-label="Question picture"><div>{activity.countItems ? <div className="counting-items">{activity.countItems.map((item, itemIndex) => <button key={itemIndex} className={counted.includes(itemIndex) ? 'counted' : ''} type="button" aria-label={`Count item ${itemIndex + 1}`} aria-pressed={counted.includes(itemIndex)} onClick={() => setCounted(previous => previous.includes(itemIndex) ? previous.filter(value => value !== itemIndex) : [...previous, itemIndex])}>{item}</button>)}</div> : activity.visual}</div>{activity.countItems && <strong className="counting-total" aria-live="polite">I counted {counted.length}</strong>}<p><span>🤖</span>{activity.helper}</p></section>
      <section className="picture-answer-panel"><h2>Choose your answer</h2><div className="picture-answer-grid">{activity.options.map(option => <button className={selected === option ? 'selected' : ''} onClick={() => { setSelected(option); setChecked(false) }} key={option} type="button">{option}</button>)}</div>{!checked && <button className="button primary" disabled={!selected} onClick={check} type="button">Check my answer</button>}{checked && <div className={correct ? 'choice-feedback correct' : 'choice-feedback try-again'} role="status"><span>{correct ? '🎉' : '💡'}</span><div><strong>{correct ? 'Well done!' : 'Try once more'}</strong><p>{correct ? activity.explanation : activity.helper}</p></div>{correct && <button className="math-next" onClick={next} type="button">{index === currentTopic.activities.length - 1 ? 'Finish path' : 'Next activity'} <ArrowRight size={17} /></button>}</div>}</section>
    </div>
  )
}
