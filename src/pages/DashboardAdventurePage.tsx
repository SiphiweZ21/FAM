import { ArrowRight, BookOpen, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import { getLearnerDashboard, type LearnerDashboard } from '../lib/dashboard'

export default function DashboardAdventurePage() {
  const [dashboard, setDashboard] = useState<LearnerDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [signedOut, setSignedOut] = useState(false)
  const [error, setError] = useState('')

  function loadDashboard() {
    setLoading(true); setSignedOut(false); setError('')
    getLearnerDashboard()
      .then(result => result ? setDashboard(result) : setSignedOut(true))
      .catch(error => { console.error(error); setError('Unable to load your progress right now.') })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) return <div className="adventure-loading"><p>Preparing your progress...</p></div>
  if (signedOut) return <AuthPanel onAuthenticated={loadDashboard} />
  if (error) return <div className="dashboard-error narrow"><div className="fam-bot mini">F</div><h1>Let’s try that again</h1><p>{error}</p></div>
  if (!dashboard) return null

  if (dashboard.selectedSubjects === 0) {
    return <div className="welcome-setup narrow"><span className="eyebrow">WELCOME TO FAM</span><h1>Let’s build your Matric adventure.</h1><p>Choose your subjects and target marks. FAM will turn them into a personalised learning map.</p><Link to="/my-subjects" className="button primary full mission-launch">Choose my subjects <ArrowRight size={18} /></Link><small>It takes about one minute.</small></div>
  }

  return (
    <div className="adventure-dashboard">
      <header className="dashboard-subjects-header">
        <div><span className="eyebrow">MY DASHBOARD</span><h1>My subjects</h1><p>Track your results against your targets and see how much work remains.</p></div>
        <Link to="/my-subjects" className="button secondary"><Plus size={18} /> Add or edit subjects</Link>
      </header>

      <section className="dashboard-subject-progress" aria-label="Selected subject progress">
        <div className="dashboard-progress-list">
          {dashboard.subjects.map(subject => (
            <Link key={subject.subjectId} to={`/subjects/${subject.subjectId}`} className="dashboard-progress-card">
              <header><span className="dashboard-world-emoji">{subject.emoji}</span><div><strong>{subject.name}</strong><small>{subject.missionsCompleted} of {subject.totalMissions} missions completed</small></div><ArrowRight size={19} /></header>
              <div className="dashboard-subject-metrics">
                <div><span>Average achieved</span><strong>{subject.practiceAverage === null ? '—' : `${subject.practiceAverage}%`}</strong></div>
                <div><span>Target</span><strong>{subject.targetMark}%</strong></div>
                <div><span>Topics covered</span><strong>{subject.topicsCompleted}/{subject.totalTopics}</strong></div>
                <div><span>Outstanding</span><strong>{subject.topicsRemaining}</strong></div>
              </div>
              <div className="dashboard-coverage-label"><span>Mission coverage</span><strong>{subject.coverage}%</strong></div>
              <div className="dashboard-world-track"><span style={{ width: `${subject.coverage}%` }} /></div>
            </Link>
          ))}
        </div>
      </section>

      <Link to="/subjects" className="dashboard-all-subjects"><BookOpen size={20} /><span><strong>Browse all subjects</strong><small>Explore lessons and missions</small></span><ArrowRight size={18} /></Link>
    </div>
  )
}
