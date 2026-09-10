import { ArrowLeft, ArrowRight, Check, Crown, FileText, Flag, LockKeyhole, Map, Sparkles, Star, Target, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getLearnerAccessMode, type LearnerAccessMode } from '../lib/access'
import { getSubject } from '../lib/content'
import { getSubjectAnalytics, type SubjectAnalytics } from '../lib/subject-analytics'
import type { Subject } from '../types'

const worldThemes = ['cyan', 'purple', 'gold', 'coral', 'green']
const worldIcons = ['★', '◆', '●', '✦', '▲']

export default function SubjectAdventurePage() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState<Subject>()
  const [accessMode, setAccessMode] = useState<LearnerAccessMode>('FREE')
  const [analytics, setAnalytics] = useState<SubjectAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!subjectId) { setNotFound(true); setLoading(false); return }
    Promise.all([getSubject(subjectId), getLearnerAccessMode(), getSubjectAnalytics(subjectId)])
      .then(([subjectResult, accessResult, analyticsResult]) => {
        if (!subjectResult) return setNotFound(true)
        setSubject(subjectResult); setAccessMode(accessResult); setAnalytics(analyticsResult)
      })
      .catch(error => { console.error(error); setNotFound(true) })
      .finally(() => setLoading(false))
  }, [subjectId])

  const totals = useMemo(() => {
    const total = subject?.topics.reduce((sum, topic) => sum + topic.missions.length, 0) ?? 0
    const completed = analytics?.missionsCompleted ?? 0
    return { total, completed, percentage: total ? Math.round((completed / total) * 100) : 0 }
  }, [subject, analytics])

  if (loading) return <div className="adventure-loading"><p>Drawing your subject map...</p></div>
  if (notFound || !subject || !subjectId) return <Navigate to="/subjects" replace />
  const isPremium = accessMode === 'PREMIUM'
  const nextMission = subject.topics
    .flatMap(topic => topic.missions.map(mission => ({
      key: `${topic.id}:${mission.id}`,
      accessible: !mission.premium || isPremium,
      completed: analytics?.topics
        .find(item => item.topicId === topic.id)
        ?.missions.find(item => item.missionId === mission.id)
        ?.completed ?? false
    })))
    .find(mission => mission.accessible && !mission.completed)

  return (
    <div className="math-adventure-map">
      <Link className="adventure-back" to="/subjects"><ArrowLeft size={18} /> All subjects</Link>

      <header className="map-hero">
        <div className="map-hero-stars"><span>✦</span><span>✦</span><span>✦</span></div>
        <div className="map-hero-copy">
          <span className="map-kicker"><Map size={14} /> YOUR ADVENTURE MAP</span>
          <h1>{subject.name}<br /><em>Quest</em></h1>
          <p>Travel through every topic world, master the missions and become an exam champion.</p>
        </div>
      </header>

      <section className="map-progress-card">
        <div className="map-level"><span><Trophy size={18} /></span><div><small>{subject.name.toUpperCase()} EXPLORER</small><strong>Level {Math.max(1, totals.completed + 1)}</strong></div></div>
        <div className="map-progress-copy"><span>{totals.completed} of {totals.total} missions complete</span><strong>{totals.percentage}%</strong></div>
        <div className="map-progress-track"><span style={{ width: `${totals.percentage}%` }} /></div>
      </section>

      <section className="map-side-quests exam-mode-feature">
        <div className="exam-mode-heading">
          <span className="exam-mode-icon"><FileText size={24} /></span>
          <div><span className="eyebrow">EXAM MODE</span><h2>Prepare with real past papers</h2></div>
        </div>
        <p>Attempt an official past paper, check your answers with the memorandum, and identify the topics you should revise next.</p>
        <Link to={`/subjects/${subject.id}/past-papers`} className="side-quest-card exam-mode-action"><span><FileText size={22} /></span><div><strong>Open Past Paper Vault</strong><small>{isPremium ? 'Question papers and memorandums ready' : 'Available with Premium'}</small></div>{isPremium ? <ArrowRight size={18} /> : <LockKeyhole size={18} />}</Link>
      </section>

      <div className="map-worlds-heading">
        <div><span className="eyebrow">LEARNING MISSIONS</span><h2>Strengthen your {subject.name} topics</h2></div>
        <p>Choose a topic world and build the skills you need for the exam.</p>
      </div>

      <div className="topic-worlds">
        {subject.topics.map((topic, topicIndex) => {
          const topicAnalytics = analytics?.topics.find(item => item.topicId === topic.id)
          const completedCount = topicAnalytics?.completedMissions ?? 0
          const theme = worldThemes[topicIndex % worldThemes.length]
          return (
            <section className={`topic-world world-${theme}`} key={topic.id}>
              <div className="world-cloud cloud-one" /><div className="world-cloud cloud-two" />
              <header className="world-header">
                <span className="world-number">WORLD {String(topicIndex + 1).padStart(2, '0')}</span>
                <div className="world-title"><span>{worldIcons[topicIndex % worldIcons.length]}</span><div><h2>{topic.name}</h2><p>{completedCount}/{topic.missions.length} missions mastered</p></div></div>
              </header>
              <div className="world-path">
                {topic.missions.map((mission, missionIndex) => {
                  const missionAnalytics = topicAnalytics?.missions.find(item => item.missionId === mission.id)
                  const completed = missionAnalytics?.completed ?? false
                  const locked = mission.premium && !isPremium
                  const isBoss = missionIndex === topic.missions.length - 1
                  const destination = locked ? '/account' : `/subjects/${subject.id}/${topic.id}/${mission.id}`
                  const isNext = nextMission?.key === `${topic.id}:${mission.id}`
                  return (
                    <Link to={destination} className={`map-checkpoint checkpoint-${missionIndex % 2 ? 'right' : 'left'} ${completed ? 'completed' : ''} ${locked ? 'locked' : ''} ${isBoss ? 'boss' : ''} ${isNext ? 'next-mission' : ''}`} key={mission.id} aria-label={`${locked ? 'Unlock' : completed ? 'Play again' : 'Start'} ${mission.title}`}>
                      <span className="checkpoint-node">
                        {locked ? <LockKeyhole size={22} /> : completed ? <Check size={24} /> : isBoss ? <Crown size={24} /> : <Star size={23} />}
                      </span>
                      <div className="checkpoint-label">
                        <span>{isBoss ? 'BOSS MISSION' : `MISSION ${missionIndex + 1}`}</span>
                        <strong>{mission.shortTitle || mission.title}</strong>
                        <small>{locked ? 'Premium adventure' : completed ? `${missionAnalytics?.percentage ?? 0}% mastered` : `${mission.questionCount} challenges`}</small>
                        <span className="checkpoint-action">{locked ? 'Unlock mission' : completed ? 'Play again' : 'Tap to start'} <ArrowRight size={11} /></span>
                      </div>
                    </Link>
                  )
                })}
                <div className="world-finish"><Flag size={20} /><span>World finish</span></div>
              </div>
            </section>
          )
        })}
      </div>

      {!isPremium && (
        <section className="map-premium-card"><Sparkles size={25} /><span className="eyebrow">UNLOCK THE FULL MAP</span><h2>Continue the {subject.name} Quest</h2><p>Open every topic world, boss challenge, past paper and progress insight for 12 months.</p><strong>R150 / year</strong><Link className="button primary full mission-launch" to="/account">Unlock all worlds <ArrowRight size={18} /></Link></section>
      )}
      <div className="map-end-marker"><Target size={22} /><span>Your exam goal is waiting</span></div>
    </div>
  )
}
