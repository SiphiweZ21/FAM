import { ArrowLeft, ArrowRight, Check, Flame, Heart, RotateCcw, Sparkles, Star, Trophy, Volume2, VolumeX, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getLearnerAccessMode, type LearnerAccessMode } from '../lib/access'
import { getMission } from '../lib/content'
import { saveLearnerProgress } from '../lib/progress'
import { getSoundEnabled, playGameSound, setSoundEnabled } from '../lib/game-audio'
import { markMemorandumAnswer, type MarkedStep } from '../lib/memorandum-marking'
import type { Mission } from '../types'

export default function QuizAdventurePage() {
  const { subjectId, topicId, missionId } = useParams()
  const navigate = useNavigate()
  const [mission, setMission] = useState<Mission>()
  const [accessMode, setAccessMode] = useState<LearnerAccessMode>('FREE')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [stepAnswers, setStepAnswers] = useState<Record<string, string>>({})
  const [markedSteps, setMarkedSteps] = useState<MarkedStep[] | null>(null)
  const [score, setScore] = useState(0)
  const [marksAttempted, setMarksAttempted] = useState(0)
  const [knowledgePoints, setKnowledgePoints] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [complete, setComplete] = useState(false)
  const [savingProgress, setSavingProgress] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)
  const [soundOn, setSoundOn] = useState(() => getSoundEnabled())

  useEffect(() => {
    if (!subjectId || !topicId || !missionId) { setNotFound(true); setLoading(false); return }
    Promise.all([getMission(subjectId, topicId, missionId), getLearnerAccessMode()])
      .then(([missionResult, accessResult]) => {
        if (!missionResult) return setNotFound(true)
        setMission(missionResult); setAccessMode(accessResult)
      })
      .catch(error => { console.error('Unable to load quiz:', error); setNotFound(true) })
      .finally(() => setLoading(false))
  }, [subjectId, topicId, missionId])

  const question = mission?.questions[index]
  const progress = useMemo(() => mission ? ((index + 1) / mission.questions.length) * 100 : 0, [index, mission])

  if (loading) return <div className="adventure-loading"><p>Loading challenge...</p></div>
  if (notFound || !mission || !subjectId || !topicId || !missionId) return <Navigate to="/subjects" replace />
  if (mission.premium && accessMode !== 'PREMIUM') return <Navigate to={`/subjects/${subjectId}/${topicId}/${missionId}`} replace />
  if (!question) return <Navigate to={`/subjects/${subjectId}`} replace />

  const currentQuestion = question
  const currentSubjectId = subjectId
  const currentTopicId = topicId
  const currentMissionId = missionId
  const currentMissionLength = mission.questions.length
  const isBoss = index === mission.questions.length - 1
  const isStepQuestion = question.type === 'MEMORANDUM_STEPS' && Boolean(question.markingPoints?.length)
  const answered = isStepQuestion ? markedSteps !== null : selected !== null
  const currentMarksEarned = isStepQuestion
    ? markedSteps?.reduce((total, step) => total + step.awardedMarks, 0) ?? 0
    : selected === question.answer ? question.totalMarks : 0
  const answeredCorrectly = currentMarksEarned === question.totalMarks

  async function finishQuestion(earnedMarks: number, possibleMarks: number, correct: boolean) {
    const nextScore = score + earnedMarks
    const nextMarksAttempted = marksAttempted + possibleMarks
    const earned = currentQuestion.knowledgePoints ?? 10
    const nextPoints = correct ? knowledgePoints + earned : knowledgePoints
    const nextStreak = correct ? streak + 1 : 0

    setScore(nextScore)
    setMarksAttempted(nextMarksAttempted)
    setKnowledgePoints(nextPoints)
    setStreak(nextStreak)
    setBestStreak(Math.max(bestStreak, nextStreak))
    if (correct) playGameSound(nextStreak >= 3 ? 'streak' : 'correct')
    else { setLives(current => Math.max(0, current - 1)); playGameSound('wrong') }

    if (isBoss) {
      setSavingProgress(true)
      try {
        const result = await saveLearnerProgress({ subjectId: currentSubjectId, topicId: currentTopicId, missionId: currentMissionId, score: nextScore, totalQuestions: nextMarksAttempted, percentage: Math.round((nextScore / nextMarksAttempted) * 100), knowledgePoints: nextPoints })
        setProgressSaved(result.saved)
      } catch (error) { console.error('Unable to save learner progress:', error) }
      finally { setSavingProgress(false) }
    }
  }

  async function choose(option: number) {
    if (selected !== null) return
    setSelected(option)
    const correct = option === currentQuestion.answer
    await finishQuestion(correct ? currentQuestion.totalMarks : 0, currentQuestion.totalMarks, correct)
  }

  async function submitSteps() {
    if (!currentQuestion.markingPoints || markedSteps) return
    const result = markMemorandumAnswer(currentQuestion.markingPoints, stepAnswers)
    setMarkedSteps(result.steps)
    await finishQuestion(result.earnedMarks, result.totalMarks, result.earnedMarks === result.totalMarks)
  }

  function next() {
    if (isBoss) { playGameSound('reward'); setComplete(true); return }
    if (index + 1 === currentMissionLength - 1) playGameSound('boss')
    setIndex(current => current + 1); setSelected(null); setStepAnswers({}); setMarkedSteps(null)
  }

  if (complete) {
    const percentage = Math.round((score / marksAttempted) * 100)
    const stars = percentage >= 80 ? 3 : percentage >= 50 ? 2 : 1
    return (
      <div className="reward-screen narrow">
        <div className="reward-rays" />
        <span className="eyebrow">MISSION COMPLETE</span>
        <div className="reward-chest"><span>★</span></div>
        <div className="result-stars">{[1, 2, 3].map(star => <Star key={star} className={star <= stars ? 'earned' : ''} fill={star <= stars ? 'currentColor' : 'none'} />)}</div>
        <h1>{percentage >= 80 ? 'Mission mastered!' : percentage >= 50 ? 'Great adventure!' : 'A brave first attempt!'}</h1>
        <p>You completed every challenge and unlocked your mission reward.</p>
        <section className="reward-card">
          <div className="reward-score"><span>{percentage}%</span><small>Mission score</small></div>
          <div className="reward-metrics"><div><Trophy size={18} /><strong>{score}/{marksAttempted}</strong><span>Marks earned</span></div><div><Sparkles size={18} /><strong>+{knowledgePoints}</strong><span>XP earned</span></div><div><Flame size={18} /><strong>{bestStreak}</strong><span>Best streak</span></div></div>
          <div className="item-unlocked"><span>🎒</span><div><small>ITEM UNLOCKED</small><strong>Explorer Backpack</strong></div></div>
        </section>
        {progressSaved && <p className="saved-message"><Check size={16} /> Progress saved to your profile</p>}
        <button className="button primary full mission-launch" onClick={() => navigate(`/subjects/${subjectId}`)}>Continue adventure <ArrowRight size={18} /></button>
        <button className="button ghost full" onClick={() => window.location.reload()}><RotateCcw size={17} /> Play again</button>
      </div>
    )
  }

  return (
    <div className="quiz-adventure narrow">
        <div className="game-hud">
        <Link to={`/subjects/${subjectId}/${topicId}/${missionId}`} aria-label="Leave mission"><ArrowLeft size={20} /></Link>
        <div className="hud-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="hud-actions"><button className="sound-toggle" type="button" aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'} onClick={() => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next); if (next) playGameSound('start') }}>{soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}</button><div className="hud-lives" aria-label={`${lives} lives`}><Heart size={18} fill="currentColor" /><strong>{lives}</strong></div></div>
      </div>
      <div className="challenge-meta">
        <span className={isBoss ? 'boss-label' : ''}>{isBoss ? '★ FINAL BOSS' : `CHALLENGE ${index + 1} OF ${mission.questions.length}`}</span>
        <span className={streak > 1 ? 'streak active' : 'streak'}><Flame size={15} /> {streak} streak</span>
      </div>
      <section className={`adventure-question-card ${isBoss ? 'boss-card' : ''}`}>
        {isBoss && <div className="boss-banner">Defeat the final challenge!</div>}
        <div className="question-orb">{isBoss ? '★' : index + 1}</div>
        <h1>{question.prompt}</h1>
        {question.source && <p className="exam-source">{[question.source.year, question.source.session, question.source.paper, question.source.questionNumber && `Question ${question.source.questionNumber}`].filter(Boolean).join(' • ')}</p>}
        <div className="question-marks">[{question.totalMarks} {question.totalMarks === 1 ? 'mark' : 'marks'}]</div>
        {!isStepQuestion && <div className="adventure-options">
          {(question.options ?? []).map((option, i) => {
            const isCorrect = selected !== null && i === question.answer
            const isWrong = selected === i && i !== question.answer
            return <button key={`${question.id}-${i}`} disabled={selected !== null} className={`adventure-option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} onClick={() => choose(i)}><span>{String.fromCharCode(65 + i)}</span><strong>{option}</strong>{isCorrect && <Check size={19} />}{isWrong && <X size={19} />}</button>
          })}
        </div>}
        {isStepQuestion && <div className="memorandum-steps">
          {question.markingPoints!.map((point, stepIndex) => <label className="memorandum-step" key={point.id}>
            <span><strong>Step {stepIndex + 1}: {point.label}</strong><small>{point.marks} {point.marks === 1 ? 'mark' : 'marks'}</small></span>
            <textarea value={stepAnswers[point.id] ?? ''} disabled={markedSteps !== null} onChange={event => setStepAnswers(current => ({ ...current, [point.id]: event.target.value }))} placeholder="Enter this step of your answer" rows={2} />
          </label>)}
          {!markedSteps && <button className="button primary full" type="button" onClick={submitSteps} disabled={question.markingPoints!.some(point => !(stepAnswers[point.id] ?? '').trim())}>Mark using memorandum <Check size={18} /></button>}
        </div>}
      </section>
      {answered && (
        <section className={`answer-drawer ${answeredCorrectly ? 'success' : 'retry'}`}>
          <div className="answer-title"><span>{answeredCorrectly ? <Check size={20} /> : <X size={20} />}</span><div><strong>{currentMarksEarned}/{question.totalMarks} marks awarded</strong><small>{answeredCorrectly ? 'Every memorandum point was correct.' : 'Review the missed memorandum points below.'}</small></div></div>
          {markedSteps && <div className="memo-results">{markedSteps.map(step => <div className={step.matched ? 'memo-point awarded' : 'memo-point missed'} key={step.id}><span>{step.matched ? <Check size={17} /> : <X size={17} />}</span><div><strong>{step.label}: {step.awardedMarks}/{step.marks}</strong><p><b>Memorandum:</b> {step.memoAnswer}</p>{!step.matched && step.feedback && <small>{step.feedback}</small>}</div></div>)}</div>}
          <p>{question.explanation}</p>
          <button className="button primary full mission-launch" onClick={next} disabled={savingProgress}>{savingProgress ? 'Saving your mission...' : isBoss ? 'Open reward chest' : 'Next challenge'} <ArrowRight size={18} /></button>
        </section>
      )}
    </div>
  )
}
