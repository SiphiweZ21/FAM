import {useGradeContent} from '../lib/use-grade-content'
import type {ObjectMathActivity} from '../data/grade-one-math'
import LearningVoiceSelector from '../components/LearningVoiceSelector'
import { speakLearningText } from '../lib/learning-voice'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { activityAnswer, answerChoices } from '../lib/number-mission-helpers'
import { completeGradeOnePath, setLastGradeOneActivity } from '../lib/grade-one-progress'

type Operator = '+' | '-'

export default function GradeOneMathPage() {
 const {data,loading,error}=useGradeContent<{activities:ObjectMathActivity[]}>()
 if(loading)return <div role="status">Preparing your mission...</div>
 if(error||!data)return <div role="alert">{error||"Mission unavailable"}<button onClick={()=>window.location.reload()}>Try again</button></div>
 return <NumberMission gradeOneNumberMission={data.activities}/>
}
function NumberMission({gradeOneNumberMission}:{gradeOneNumberMission:ObjectMathActivity[]}) {
  const [activityIndex, setActivityIndex] = useState(0)
  const [moved, setMoved] = useState(0)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [completed, setCompleted] = useState<string[]>([])
  const [showReward, setShowReward] = useState(false)
  const activity = gradeOneNumberMission[activityIndex]
  const answer = activityAnswer(activity)
  const complete = moved === activity.changeQuantity
  const expectedOperator: Operator = activity.operation === 'addition' ? '+' : '-'
  const correct = complete && operator === expectedOperator && selectedAnswer === answer
  const visibleQuantity = activity.operation === 'addition' ? activity.startingQuantity + moved : activity.startingQuantity - moved
  const sourceQuantity = activity.changeQuantity - moved
  const progress = useMemo(() => Math.round((completed.length / gradeOneNumberMission.length) * 100), [completed])

  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => { setLastGradeOneActivity('Add & Subtract', '/grades/grade-1/mathematics/number-mission', 'number') }, [])

  function pluralise(quantity: number) {
    return quantity === 1 ? activity.object.singular : activity.object.plural
  }

  function speak(text: string) { speakLearningText(text) }

  function moveObject() {
    if (moved >= activity.changeQuantity) return
    const nextMoved = moved + 1
    setMoved(nextMoved)
    setChecked(false)
    speak(String(activity.operation === 'addition' ? activity.startingQuantity + nextMoved : activity.startingQuantity - nextMoved))
  }

  function returnObject() {
    if (moved <= 0) return
    setMoved(value => value - 1)
    setChecked(false)
  }

  function resetActivity() {
    window.speechSynthesis?.cancel()
    setMoved(0)
    setOperator(null)
    setSelectedAnswer(null)
    setChecked(false)
  }

  function checkAnswer() {
    setChecked(true)
    if (correct) speak(`Brilliant! ${activity.startingQuantity} ${expectedOperator === '+' ? 'plus' : 'minus'} ${activity.changeQuantity} equals ${answer}.`)
    else speak(operator !== expectedOperator ? 'The group became bigger or smaller. Choose the matching sign.' : 'Count the objects in the group once more.')
  }

  function nextActivity() {
    const nextCompleted = completed.includes(activity.id) ? completed : [...completed, activity.id]
    setCompleted(nextCompleted)
    if (activityIndex === gradeOneNumberMission.length - 1) {
      completeGradeOnePath('number', 'add-subtract', 'Add & Subtract', 'Number Mover')
      setShowReward(true)
      speak('Mission complete! You are a Number World star!')
      return
    }
    setActivityIndex(index => index + 1)
    setMoved(0)
    setOperator(null)
    setSelectedAnswer(null)
    setChecked(false)
  }

  function restartMission() {
    setActivityIndex(0)
    setMoved(0)
    setOperator(null)
    setSelectedAnswer(null)
    setChecked(false)
    setCompleted([])
    setShowReward(false)
  }

  if (showReward) {
    return (
      <div className="number-mission-reward">
        <div className="reward-stars" aria-hidden="true">⭐ 🌟 ⭐</div>
        <div className="reward-robot" aria-hidden="true">🤖</div>
        <span className="grade-stage-pill"><Sparkles size={14} /> MISSION COMPLETE</span>
        <h1>You are a Number World star!</h1>
        <p>You completed {gradeOneNumberMission.length} activities and showed that you can add and subtract by moving objects.</p>
        <div className="reward-badge"><span>🏅</span><strong>NUMBER MOVER</strong><small>Grade 1 Mathematics</small></div>
        <div className="reward-actions">
          <button className="button primary" onClick={restartMission} type="button"><RotateCcw size={17} /> Play again</button>
          <Link className="button" to="/grades/grade-1">Back to Grade 1</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="object-math-page">
      <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Number World</Link>

      <div className="mission-progress" aria-label={`${completed.length} of ${gradeOneNumberMission.length} activities complete`}>
        <div><span>NUMBER MISSION</span><strong>{activityIndex + 1} of {gradeOneNumberMission.length}</strong></div>
        <div className="mission-progress-track"><span style={{ width: `${Math.max(progress, (activityIndex / gradeOneNumberMission.length) * 100)}%` }} /></div>
      </div>

      <header className="object-math-header">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> ACTIVITY {activityIndex + 1}</span><h1>{activity.title}</h1><p>{activity.story}</p></div>
        <div className="math-header-actions">
          <button className="math-reset" onClick={() => speak(`${activity.story} ${activity.instruction}`)} type="button"><Volume2 size={17} /> Read to me</button><LearningVoiceSelector />
          <button className="math-reset" onClick={resetActivity} type="button"><RotateCcw size={17} /> Start again</button>
        </div>
      </header>

      <div className="fam-instruction"><span aria-hidden="true">🤖</span><p>{complete ? 'Great moving! Now choose the sign that shows what happened.' : activity.instruction}</p></div>

      <section className={`object-workspace operation-${activity.operation}`} aria-label={`Interactive ${activity.operation} activity`}>
        <div className={`object-home ${complete ? 'is-complete' : ''}`} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (activity.operation === 'addition' && event.dataTransfer.getData('text/plain') === `${activity.id}:source`) moveObject() }}>
          <span className="workspace-label">{activity.destinationLabel}</span>
          <div className="learning-object-group">
            {Array.from({ length: visibleQuantity }, (_, index) => {
              const canMoveAway = activity.operation === 'subtraction' && moved < activity.changeQuantity
              const canReturn = activity.operation === 'addition' && index >= activity.startingQuantity
              return <button className={`learning-object ${canMoveAway ? 'can-move' : ''} ${canReturn ? 'moved-object' : ''}`} draggable={canMoveAway} onDragStart={event => event.dataTransfer.setData('text/plain', `${activity.id}:home`)} onClick={canMoveAway ? moveObject : canReturn ? returnObject : undefined} key={`${activity.id}-home-${index}`} type="button" aria-label={canMoveAway ? `Move ${activity.object.singular} away` : activity.object.singular}>{activity.object.emoji}</button>
            })}
          </div>
          <strong>{visibleQuantity} {pluralise(visibleQuantity)}</strong>
        </div>

        <div className="object-change-zone" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (activity.operation === 'subtraction' && event.dataTransfer.getData('text/plain') === `${activity.id}:home`) moveObject() }}>
          <span className="workspace-label">{activity.operation === 'addition' ? 'Move these' : 'Moved away'}</span>
          <div className="learning-object-group">
            {activity.operation === 'addition' && Array.from({ length: sourceQuantity }, (_, index) => <button className="learning-object can-move" draggable onDragStart={event => event.dataTransfer.setData('text/plain', `${activity.id}:source`)} onClick={moveObject} key={`${activity.id}-source-${index}`} type="button" aria-label={`Move ${activity.object.singular} into ${activity.destinationLabel}`}>{activity.object.emoji}</button>)}
            {activity.operation === 'subtraction' && Array.from({ length: moved }, (_, index) => <button className="learning-object moved-object" onClick={returnObject} key={`${activity.id}-away-${index}`} type="button" aria-label={`Return ${activity.object.singular}`}>{activity.object.emoji}</button>)}
            {((activity.operation === 'addition' && sourceQuantity === 0) || (activity.operation === 'subtraction' && moved === 0)) && <span className="zone-message">{complete ? 'All moved! ✨' : 'Move objects here'}</span>}
          </div>
          <strong>{activity.operation === 'addition' ? sourceQuantity : moved} {pluralise(activity.operation === 'addition' ? sourceQuantity : moved)}</strong>
        </div>
      </section>

      <section className={`operator-step ${complete ? 'is-ready' : ''}`} aria-disabled={!complete}>
        <h2>Which sign shows what happened?</h2>
        <div className="operator-options">
          <button disabled={!complete} className={operator === '+' ? 'selected' : ''} onClick={() => { setOperator('+'); setChecked(false) }} type="button"><strong>+</strong><span>Add</span></button>
          <button disabled={!complete} className={operator === '-' ? 'selected' : ''} onClick={() => { setOperator('-'); setChecked(false) }} type="button"><strong>−</strong><span>Subtract</span></button>
        </div>
        <h2>How many {activity.object.plural} are left in the group?</h2>
        <div className="operator-options number-answer-options">
          {answerChoices(activity).map(choice => <button key={choice} disabled={!complete} aria-pressed={selectedAnswer === choice} className={selectedAnswer === choice ? 'selected' : ''} onClick={() => { setSelectedAnswer(choice); setChecked(false) }} type="button"><strong>{choice}</strong></button>)}
        </div>
        {!checked && <button className="button primary check-math" disabled={!complete || !operator || selectedAnswer === null} onClick={checkAnswer} type="button">Check my answer</button>}

        {checked && <div className={correct ? 'math-feedback correct' : 'math-feedback try-again'} role="status">
          {correct ? <><span>🎉</span><div><strong>Brilliant!</strong><p>You {activity.operation === 'addition' ? 'added' : 'took away'} {activity.changeQuantity} {pluralise(activity.changeQuantity)}.</p><b>{activity.startingQuantity} {expectedOperator} {activity.changeQuantity} = {answer}</b></div><button className="math-next" onClick={nextActivity} type="button">{activityIndex === gradeOneNumberMission.length - 1 ? 'Get my reward' : 'Next activity'} <ArrowRight size={17} /></button></> : <><span>💡</span><div><strong>Let&apos;s think again.</strong><p>{operator !== expectedOperator ? `The group became ${activity.operation === 'addition' ? 'bigger' : 'smaller'}. Did you add or take away?` : 'Count the objects in the group once more.'}</p></div></>}
        </div>}
      </section>
    </div>
  )
}
