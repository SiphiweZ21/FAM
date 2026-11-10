import type { User } from '@supabase/supabase-js'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Cloud, CloudOff, Copy, KeyRound, Link2, RefreshCw, ShieldCheck, Sparkles, Target, Trophy, UserMinus, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthPanel from '../components/AuthPanel'
import { gradeOneTopics } from '../data/grade-previews'
import { gradeOneWordPaths } from '../data/grade-previews'
import { getGradeOneProgress, gradeOneCompletion, gradeOnePathTotal, type GradeOneProgress } from '../lib/grade-one-progress'
import { createGradeOneFamily, generateGradeOneFamilyCode, getGradeOneFamily, joinGradeOneFamily, removeGradeOneGuardian, type GradeOneFamily } from '../lib/grade-one-family'
import { syncGradeOneProgress, type GradeOneSyncStatus } from '../lib/grade-one-sync'
import { supabase } from '../lib/supabase'

type PathSummary = {
  key: string
  title: string
  description: string
  emoji: string
  route: string
}

const numberPaths: PathSummary[] = [
  { key: 'number:add-subtract', title: 'Add & Subtract', description: 'Move objects to make numbers bigger or smaller.', emoji: '🍎', route: '/grades/grade-1/mathematics/number-mission' },
  ...gradeOneTopics.map(topic => ({ key: `number:${topic.id}`, title: topic.title, description: topic.description, emoji: topic.emoji, route: `/grades/grade-1/mathematics/practice/${topic.id}` }))
]

const wordPaths: PathSummary[] = gradeOneWordPaths.map(path => ({
  key: `word:${path.id}`,
  title: path.title,
  description: path.description,
  emoji: path.emoji,
  route: `/grades/grade-1/words/practice/${path.id}`
}))

function useGradeOneProgress() {
  const [progress, setProgress] = useState<GradeOneProgress>(getGradeOneProgress)

  useEffect(() => {
    const refresh = () => setProgress(getGradeOneProgress())
    window.addEventListener('fam-grade-one-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => {
      window.removeEventListener('fam-grade-one-progress', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return progress
}

function formatActivityDate(value?: string) {
  if (!value) return 'No activity yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently'
  return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function PathList({ title, paths, progress }: { title: string; paths: PathSummary[]; progress: GradeOneProgress }) {
  const completed = new Set(progress.completedPaths.map(path => path.key))
  const completedCount = paths.filter(path => completed.has(path.key)).length

  return (
    <section className="parent-path-panel">
      <header>
        <div><span>{title}</span><strong>{completedCount} of {paths.length} complete</strong></div>
        <b>{Math.round((completedCount / paths.length) * 100)}%</b>
      </header>
      <div className="parent-mini-track"><span style={{ width: `${(completedCount / paths.length) * 100}%` }} /></div>
      <div className="parent-path-list">
        {paths.map(path => {
          const isComplete = completed.has(path.key)
          return <Link to={path.route} key={path.key} className={isComplete ? 'is-complete' : ''}>
            <span className="parent-path-emoji">{path.emoji}</span>
            <div><strong>{path.title}</strong><small>{isComplete ? 'Completed' : 'Ready to learn'}</small></div>
            {isComplete ? <span className="parent-path-check"><Check size={15} /></span> : <ChevronRight size={18} />}
          </Link>
        })}
      </div>
    </section>
  )
}

function FamilySetup({ onComplete }: { onComplete: () => Promise<void> }) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [parentName, setParentName] = useState('')
  const [childName, setChildName] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!parentName.trim()) return setMessage('Enter your name.')
    if (mode === 'create' && !childName.trim()) return setMessage("Enter your child's first name.")
    if (mode === 'join' && code.replace(/[^a-z0-9]/gi, '').length !== 8) return setMessage('Enter the 8-character family code.')
    setSubmitting(true); setMessage('')
    try {
      if (mode === 'create') await createGradeOneFamily(childName, parentName)
      else await joinGradeOneFamily(code, parentName)
      await onComplete()
      await syncGradeOneProgress()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not complete the family setup.')
    } finally { setSubmitting(false) }
  }

  return <div className="parent-dashboard-page">
    <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1 learning hub</Link>
    <header className="parent-dashboard-hero family-welcome-hero"><div><span className="grade-stage-pill"><ShieldCheck size={14} /> SECURE FAMILY ACCESS</span><h1>Connect your family to one learner profile</h1><p>Each parent uses a separate FAM account while sharing the same child progress.</p></div><div className="family-hero-art">👨‍👩‍👧</div></header>
    <section className="family-setup-card">
      <div className="family-mode-tabs" role="tablist">
        <button type="button" className={mode === 'create' ? 'active' : ''} onClick={() => { setMode('create'); setMessage('') }}><Users size={18} /> Create child profile</button>
        <button type="button" className={mode === 'join' ? 'active' : ''} onClick={() => { setMode('join'); setMessage('') }}><KeyRound size={18} /> Use family code</button>
      </div>
      <div className="family-setup-body">
        <div><span className="eyebrow">{mode === 'create' ? 'PRIMARY PARENT' : 'SECOND PARENT'}</span><h2>{mode === 'create' ? 'Create the shared learner profile' : 'Connect to your child'}</h2><p>{mode === 'create' ? 'You will be able to generate a secure code for the second parent after setup.' : 'Ask the primary parent for the current 8-character family code.'}</p></div>
        <div className="family-form">
          <label><span>Your name</span><input value={parentName} onChange={event => setParentName(event.target.value)} placeholder="Parent or caregiver name" autoComplete="name" maxLength={60} /></label>
          {mode === 'create'
            ? <label><span>Child&apos;s first name</span><input value={childName} onChange={event => setChildName(event.target.value)} placeholder="Learner first name" maxLength={50} /></label>
            : <label><span>Family access code</span><input className="family-code-input" value={code} onChange={event => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))} placeholder="ABCD2345" autoCapitalize="characters" autoComplete="one-time-code" /></label>}
          <button type="button" className="button primary" onClick={submit} disabled={submitting}>{submitting ? 'Please wait...' : mode === 'create' ? 'Create learner profile' : 'Connect to learner'} <ArrowRight size={17} /></button>
          {message && <p className="family-form-message" role="status">{message}</p>}
        </div>
      </div>
      <div className="family-security-note"><ShieldCheck size={20} /><p><strong>Private by design.</strong> A code expires after 24 hours, works once and never replaces either parent&apos;s password.</p></div>
    </section>
  </div>
}

export default function GradeOneParentDashboardPage() {
  const progress = useGradeOneProgress()
  const [syncStatus, setSyncStatus] = useState<GradeOneSyncStatus>('local')
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [family, setFamily] = useState<GradeOneFamily | null>(null)
  const [familyLoading, setFamilyLoading] = useState(false)
  const [familyMessage, setFamilyMessage] = useState('')
  const [invite, setInvite] = useState<{ code: string; expiresAt: string } | null>(null)

  async function loadFamily() {
    setFamilyLoading(true); setFamilyMessage('')
    try { setFamily(await getGradeOneFamily()) }
    catch (error) { setFamilyMessage(error instanceof Error ? error.message : 'Family access is temporarily unavailable.') }
    finally { setFamilyLoading(false) }
  }

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setAuthLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setAuthLoading(false) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) void loadFamily(); else setFamily(null) }, [user?.id])

  useEffect(() => {
    const updateStatus = (event: Event) => setSyncStatus((event as CustomEvent<GradeOneSyncStatus>).detail)
    window.addEventListener('fam-grade-one-sync', updateStatus)
    return () => window.removeEventListener('fam-grade-one-sync', updateStatus)
  }, [])

  const completeKeys = useMemo(() => new Set(progress.completedPaths.map(path => path.key)), [progress.completedPaths])
  const nextPath = [...numberPaths, ...wordPaths].find(path => !completeKeys.has(path.key))
  const completion = gradeOneCompletion(progress)
  const homeworkAccuracy = progress.homeworkAttempts ? Math.round((progress.homeworkCorrect / progress.homeworkAttempts) * 100) : 0
  const latestDate = progress.lastActivity?.updatedAt ?? progress.completedPaths.at(-1)?.completedAt

  async function createInvite() {
    if (!family) return
    setFamilyMessage('')
    try {
      const result = await generateGradeOneFamilyCode(family.childId)
      setInvite({ code: result.access_code, expiresAt: result.expires_at })
    } catch (error) { setFamilyMessage(error instanceof Error ? error.message : 'The code could not be generated.') }
  }

  async function copyInvite() {
    if (!invite) return
    await navigator.clipboard.writeText(invite.code)
    setFamilyMessage('Family code copied.')
  }

  async function removeParent(userId: string) {
    if (!family || !window.confirm('Remove this parent’s access to the child dashboard?')) return
    setFamilyMessage('')
    try { await removeGradeOneGuardian(family.childId, userId); setInvite(null); await loadFamily() }
    catch (error) { setFamilyMessage(error instanceof Error ? error.message : 'Parent access could not be removed.') }
  }

  if (authLoading) return <div className="adventure-loading" role="status"><p>Loading family dashboard...</p></div>
  if (!user) return <AuthPanel onAuthenticated={() => void loadFamily()} eyebrow="GRADE 1 FAMILY" heading="Parent dashboard access" description="Parents use separate secure accounts to view the same child progress." title="Sign in or create a parent account" formEyebrow="PARENT ACCESS" signInLabel="Sign in to parent dashboard" signUpLabel="Create parent account" emailPlaceholder="parent@example.com" footerTitle="Two parents, one learner profile" footerDescription="After registering, create your child profile or connect using a secure family code." />
  if (familyLoading && !family) return <div className="adventure-loading" role="status"><p>Loading family profile...</p></div>
  if (!family) return familyMessage
    ? <div className="parent-dashboard-page"><Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1 learning hub</Link><section className="family-error-card"><ShieldCheck size={28} /><h2>Family setup needs attention</h2><p>{familyMessage}</p><p>Apply the latest Supabase family-access migration, then try again.</p><button className="button secondary" type="button" onClick={() => void loadFamily()}>Try again</button></section></div>
    : <FamilySetup onComplete={loadFamily} />

  return (
    <div className="parent-dashboard-page">
      <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1 learning hub</Link>

      <header className="parent-dashboard-hero">
        <div><span className="grade-stage-pill"><Users size={14} /> {family.childName.toUpperCase()}&apos;S PARENT DASHBOARD</span><h1>See how {family.childName} is growing</h1><p>A simple view of completed activities, practice and the best next step.</p></div>
        <div className="parent-dashboard-ring" style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}><strong>{completion}%</strong><span>overall</span></div>
      </header>

      <div className={`parent-sync-banner status-${syncStatus}`}>
        {syncStatus === 'synced' ? <Cloud size={17} /> : syncStatus === 'syncing' ? <RefreshCw size={17} /> : <CloudOff size={17} />}
        <span><strong>{syncStatus === 'synced' ? 'Progress is synced' : syncStatus === 'syncing' ? 'Updating progress' : syncStatus === 'offline' ? 'Working offline' : 'Progress saved on this device'}</strong><small>{syncStatus === 'synced' ? 'The latest activity is available on this account.' : 'Learning can continue and will sync when available.'}</small></span>
      </div>

      <section className="family-access-panel">
        <header><div><span>FAMILY ACCESS</span><h2>Parents connected to {family.childName}</h2><p>Each parent signs in with their own FAM account.</p></div><span className="family-count"><Users size={17} /> {family.guardians.length}/2</span></header>
        <div className="family-guardian-list">
          {family.guardians.map(guardian => <article key={guardian.user_id}><span className="guardian-avatar">{guardian.guardian_name.charAt(0).toUpperCase()}</span><div><strong>{guardian.guardian_name}{guardian.user_id === user.id ? ' · You' : ''}</strong><small>{guardian.role === 'owner' ? 'Primary parent' : 'Connected parent'}</small></div>{family.role === 'owner' && guardian.role === 'parent' && <button type="button" className="guardian-remove" onClick={() => void removeParent(guardian.user_id)} aria-label={`Remove ${guardian.guardian_name}`}><UserMinus size={17} /> Remove</button>}</article>)}
        </div>
        {family.role === 'owner' && family.guardians.length < 2 && <div className="family-invite-area">
          {!invite ? <div><div><KeyRound size={22} /><span><strong>Connect the second parent</strong><small>Generate a single-use code valid for 24 hours.</small></span></div><button type="button" className="button secondary" onClick={() => void createInvite()}>Generate family code</button></div>
          : <div className="family-code-result"><div><span>FAMILY CODE</span><strong>{invite.code.slice(0, 4)} {invite.code.slice(4)}</strong><small>Expires {new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(invite.expiresAt))}</small></div><button type="button" className="button secondary" onClick={() => void copyInvite()}><Copy size={17} /> Copy code</button><button type="button" className="family-refresh-code" onClick={() => void createInvite()}><RefreshCw size={15} /> Replace code</button></div>}
        </div>}
        {family.role === 'parent' && <div className="family-connected-note"><Link2 size={19} /><p>You are securely connected to this learner profile. Only the primary parent can create or remove family access.</p></div>}
        {familyMessage && <p className="family-form-message" role="status">{familyMessage}</p>}
      </section>

      <section className="parent-stat-grid" aria-label="Learning overview">
        <article><span className="stat-icon mint"><Target size={21} /></span><div><strong>{progress.completedPaths.length}<small>/{gradeOnePathTotal}</small></strong><span>Paths completed</span></div></article>
        <article><span className="stat-icon gold"><Trophy size={21} /></span><div><strong>{progress.completedPaths.length}</strong><span>Badges earned</span></div></article>
        <article><span className="stat-icon blue"><BookOpen size={21} /></span><div><strong>{progress.homeworkAttempts}</strong><span>Homework attempts</span></div></article>
        <article><span className="stat-icon purple"><Sparkles size={21} /></span><div><strong>{homeworkAccuracy}%</strong><span>Homework accuracy</span></div></article>
      </section>
      <p className="parent-progress-note">A completed path means the learner answered its activities and earned a badge. It does not measure mastery or reading level. Homework accuracy covers homework answers only; practise a path together to see where help is needed.</p>

      <section className="parent-recommendation">
        <div className="recommendation-icon">🤖</div>
        <div><span>RECOMMENDED NEXT STEP</span><h2>{nextPath ? nextPath.title : 'Keep practising!'}</h2><p>{nextPath ? nextPath.description : 'All learning paths are complete. Revisit a favourite path to build confidence.'}</p><small>Last active: {formatActivityDate(latestDate)}</small></div>
        <Link className="button primary" to={nextPath?.route ?? '/grades/grade-1'}>{nextPath ? 'Start activity' : 'Choose a path'} <ArrowRight size={17} /></Link>
      </section>

      <div className="parent-path-grid">
        <PathList title="NUMBER WORLD" paths={numberPaths} progress={progress} />
        <PathList title="WORD WORLD" paths={wordPaths} progress={progress} />
      </div>

      <section className="parent-badge-section">
        <header><div><span>ACHIEVEMENTS</span><h2>Badges earned</h2></div><strong>{progress.completedPaths.length}</strong></header>
        {progress.completedPaths.length ? <div className="parent-badge-grid">{progress.completedPaths.map(path => <article key={path.key}><span>🏅</span><div><strong>{path.badge}</strong><small>{path.title} · {formatActivityDate(path.completedAt)}</small></div></article>)}</div> : <div className="parent-empty-state"><span>🌱</span><div><strong>The learning journey is ready to begin</strong><p>A badge will appear here after the first path is completed.</p></div></div>}
      </section>
    </div>
  )
}
