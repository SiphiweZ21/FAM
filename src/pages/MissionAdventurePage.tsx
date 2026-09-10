import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, Flame, LockKeyhole, Shield, Sparkles, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getLearnerAccessMode, type LearnerAccessMode } from '../lib/access'
import { getMission } from '../lib/content'
import { playGameSound } from '../lib/game-audio'
import type { Mission } from '../types'

export default function MissionAdventurePage() {
  const { subjectId, topicId, missionId } = useParams()
  const [mission, setMission] = useState<Mission>()
  const [accessMode, setAccessMode] = useState<LearnerAccessMode>('FREE')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!subjectId || !topicId || !missionId) {
      setNotFound(true)
      setLoading(false)
      return
    }
    Promise.all([getMission(subjectId, topicId, missionId), getLearnerAccessMode()])
      .then(([missionResult, accessResult]) => {
        if (!missionResult) return setNotFound(true)
        setMission(missionResult)
        setAccessMode(accessResult)
      })
      .catch(error => { console.error(error); setNotFound(true) })
      .finally(() => setLoading(false))
  }, [subjectId, topicId, missionId])

  if (loading) return <div className="adventure-loading"><p>Preparing your mission...</p></div>
  if (notFound || !mission || !subjectId || !topicId || !missionId) return <Navigate to="/subjects" replace />

  const missionIsLocked = mission.premium && accessMode !== 'PREMIUM'
  const maximumPoints = mission.questions.reduce((total, question) => total + (question.knowledgePoints ?? 10), 0)

  return (
    <div className="mission-adventure narrow">
      <Link className="adventure-back" to={`/subjects/${subjectId}`}><ArrowLeft size={18} /> Back to map</Link>
      <section className="mission-world-card">
        <div className="mission-sky">
          <span className="mission-star star-one">✦</span><span className="mission-star star-two">✦</span>
          <span className="mission-planet">{mission.emoji || '🎯'}</span>
        </div>
        <div className="mission-world-copy">
          <div className="mission-tag-row"><span className="world-pill"><Sparkles size={13} /> New mission</span><span className={mission.premium ? 'premium-pill' : 'free-pill'}>{mission.premium ? 'PREMIUM' : 'FREE'}</span></div>
          <span className="eyebrow">GRADE 12 ADVENTURE</span><h1>{mission.title}</h1><p>{mission.description}</p>
        </div>
      </section>
      <div className="mission-stat-grid">
        <article><Shield size={19} /><strong>{mission.questions.length}</strong><span>Challenges</span></article>
        <article><Clock3 size={19} /><strong>~5</strong><span>Minutes</span></article>
        <article><Star size={19} /><strong>{maximumPoints}</strong><span>XP available</span></article>
      </div>
      <section className="mission-route-preview">
        <div className="route-heading"><div><span className="eyebrow">MISSION ROUTE</span><h2>What awaits you</h2></div><Flame size={23} /></div>
        <div className="route-steps">
          <div><span>1</span><p><strong>Warm-up</strong><small>Build confidence</small></p></div>
          <div><span>2</span><p><strong>Skill zone</strong><small>Apply what you know</small></p></div>
          <div className="boss-step"><span>★</span><p><strong>Mastery challenge</strong><small>Apply your knowledge and finish strong</small></p></div>
        </div>
      </section>
      {missionIsLocked ? (
        <section className="premium-card adventure-lock"><LockKeyhole size={30} /><div><span className="eyebrow">PREMIUM MISSION</span><h2>Unlock this adventure</h2><p>Premium opens every mission, past paper and personalised progress insight for 12 months.</p></div><strong className="premium-price">R150 / year</strong><Link className="button primary full" to="/account">Unlock Premium</Link></section>
      ) : (
        <div className="mission-launch-panel"><div><CheckCircle2 size={18} /><span>Your progress will be saved</span></div><Link className="button primary full mission-launch" to={`/quiz/${subjectId}/${topicId}/${missionId}`} onClick={() => playGameSound('start')}>Start adventure <ArrowRight size={19} /></Link></div>
      )}
    </div>
  )
}
