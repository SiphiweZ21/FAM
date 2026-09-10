import { ArrowRight, BookOpen, FileText, Flame, Sparkles, Star, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getLearnerDashboard, type LearnerDashboard } from '../lib/dashboard'

export default function DashboardAdventurePage() {
  const [dashboard, setDashboard] = useState<LearnerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [signedOut, setSignedOut] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getLearnerDashboard()
      .then(result => result ? setDashboard(result) : setSignedOut(true))
      .catch(error => { console.error(error); setError('Unable to load your progress right now.') })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="adventure-loading"><p>Preparing your progress...</p></div>
  if (signedOut) return <Navigate to="/account" replace />
  if (error) return <div className="dashboard-error narrow"><div className="fam-bot mini">F</div><h1>Let’s try that again</h1><p>{error}</p></div>
  if (!dashboard) return null

  if (dashboard.selectedSubjects === 0) {
    return <div className="welcome-setup narrow"><span className="eyebrow">WELCOME TO FAM</span><h1>Let’s build your Matric adventure.</h1><p>Choose your subjects and target marks. FAM will turn them into a personalised learning map.</p><Link to="/my-subjects" className="button primary full mission-launch">Choose my subjects <ArrowRight size={18} /></Link><small>It takes about one minute.</small></div>
  }

  const overallCoverage = dashboard.totalMissions ? Math.round((dashboard.missionsCompleted / dashboard.totalMissions) * 100) : 0

  return (
    <div className="adventure-dashboard">
      <header className="dashboard-welcome-hero">
        <div><span className="map-kicker"><Sparkles size={14} /> YOUR COMMAND CENTRE</span><h1>Welcome back,<br /><em>Explorer!</em></h1><p>One clear step at a time. FAM has worked out where you should continue.</p></div>
      </header>

      <section className="choose-study-card">
        <span className="eyebrow">CHOOSE A SUBJECT</span>
        <h2>What are you studying today?</h2>
        <p>Choose based on your exam timetable and the subject you want to work on now.</p>
        <div className="choose-subject-list">
          {dashboard.subjects.map(subject => <Link key={subject.subjectId} to={`/subjects/${subject.subjectId}`}><span>{subject.emoji}</span><strong>{subject.name}</strong><ArrowRight size={16} /></Link>)}
        </div>
      </section>

      <div className="dashboard-quick-stats">
        <article><Trophy size={19} /><strong>{dashboard.totalKnowledgePoints}</strong><span>Total XP</span></article>
        <article><BookOpen size={19} /><strong>{dashboard.missionsCompleted}</strong><span>Missions</span></article>
        <article><Flame size={19} /><strong>{overallCoverage}%</strong><span>Coverage</span></article>
      </div>

      <section className="dashboard-exam-mode">
        <span className="dashboard-exam-icon"><FileText size={22} /></span>
        <div><small>EXAM MODE</small><strong>Prepare with past papers</strong><p>Choose a subject, attempt a paper and check the memorandum.</p></div>
        <Link to="/subjects" aria-label="Open subjects for past papers"><ArrowRight size={19} /></Link>
      </section>

      <section className="my-worlds-section">
        <div className="simple-section-heading"><div><span className="eyebrow">MY SUBJECT WORLDS</span><h2>Continue your journey</h2></div><Link to="/my-subjects">Edit</Link></div>
        <div className="dashboard-world-list">
          {dashboard.subjects.map(subject => (
            <Link key={subject.subjectId} to={`/subjects/${subject.subjectId}`} className="dashboard-world-card">
              <span className="dashboard-world-emoji">{subject.emoji}</span>
              <div><strong>{subject.name}</strong><small>{subject.missionsCompleted}/{subject.totalMissions} missions · Target {subject.targetMark}%</small><div className="dashboard-world-track"><span style={{ width: `${subject.coverage}%` }} /></div></div>
              <span className="world-readiness">{subject.examReadiness === null ? 'Start' : `${subject.examReadiness}%`}<small>{subject.examReadiness === null ? '' : 'ready'}</small></span>
            </Link>
          ))}
        </div>
      </section>

      {dashboard.strongestSubject && <section className="dashboard-encouragement"><Star size={20} /><div><small>YOUR STRONGEST WORLD</small><strong>{dashboard.strongestSubject.name}</strong><p>Keep the momentum going while strengthening your other subjects.</p></div></section>}
    </div>
  )
}
