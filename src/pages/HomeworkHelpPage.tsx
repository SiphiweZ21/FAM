import type { User } from '@supabase/supabase-js'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, GraduationCap, Lightbulb, LockKeyhole, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PremiumPackageCards from '../components/PremiumPackageCards'
import { getLearnerAccessMode, type LearnerAccessMode } from '../lib/access'
import { getSubjects } from '../lib/content'
import { getGrade, getRememberedGrade, grades, rememberGrade, type GradeId } from '../lib/grades'
import { startPremiumCheckout, type PremiumPackageId } from '../lib/payments'
import { supabase } from '../lib/supabase'
import { requestHomeworkHelp, type HomeworkGuidance } from '../lib/homework-service'

type SubjectChoice = { id: string; name: string; emoji?: string }
const schoolSubjects: SubjectChoice[] = [
  { id: 'mathematics', name: 'Mathematics', emoji: '➗' }, { id: 'languages', name: 'Languages', emoji: '📚' },
  { id: 'natural-sciences', name: 'Natural Sciences', emoji: '🔬' }, { id: 'social-sciences', name: 'Social Sciences', emoji: '🌍' },
  { id: 'technology', name: 'Technology', emoji: '💻' }, { id: 'life-skills', name: 'Life Skills / Orientation', emoji: '🌱' }
]

export default function HomeworkHelpPage() {
  const [gradeId, setGradeId] = useState<GradeId | null>(getRememberedGrade)
  const [subject, setSubject] = useState<SubjectChoice | null>(null)
  const [subjects, setSubjects] = useState<SubjectChoice[]>(schoolSubjects)
  const [user, setUser] = useState<User | null>(null)
  const [accessMode, setAccessMode] = useState<LearnerAccessMode>('FREE')
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState<PremiumPackageId | null>(null)
  const [message, setMessage] = useState('')
  const [question, setQuestion] = useState('')
  const [guidance, setGuidance] = useState<HomeworkGuidance | null>(null)
  const [helpLoading, setHelpLoading] = useState(false)
  const [helpError, setHelpError] = useState('')

  useEffect(() => {
    Promise.all([supabase.auth.getSession(), getLearnerAccessMode()]).then(([session, mode]) => { setUser(session.data.session?.user ?? null); setAccessMode(mode) }).finally(() => setCheckingAccess(false))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); void getLearnerAccessMode().then(setAccessMode) })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (gradeId !== 'grade-12') { setSubjects(schoolSubjects); return }
    void getSubjects().then(items => setSubjects(items.map(item => ({ id: item.id, name: item.name, emoji: item.emoji })))).catch(() => setSubjects(schoolSubjects))
  }, [gradeId])

  function chooseGrade(id: GradeId) { rememberGrade(id); setGradeId(id); setSubject(null); setGuidance(null); setHelpError('') }
  async function upgrade(packageId: PremiumPackageId, paymentMethod: 'CAPITECPAY'|'CARD' = 'CAPITECPAY') { setPaymentLoading(packageId); setMessage(''); try { await startPremiumCheckout(packageId,undefined,paymentMethod) } catch (error) { setMessage(error instanceof Error ? error.message : 'Payment could not be started.'); setPaymentLoading(null) } }
  async function submitQuestion(event: FormEvent) {
    event.preventDefault()
    if (!question.trim() || !grade || !subject) return
    setHelpLoading(true)
    setHelpError('')
    setGuidance(null)
    try {
      setGuidance(await requestHomeworkHelp({ grade: grade.number, subject: subject.name, question }))
    } catch (error) {
      setHelpError(error instanceof Error ? error.message : 'FAM could not prepare guidance for this question.')
    } finally {
      setHelpLoading(false)
    }
  }
  const grade = getGrade(gradeId ?? undefined)
  const selectionComplete = Boolean(grade && subject)

  return <div className="homework-service-page">
    <header className="homework-service-hero"><div><span className="grade-stage-pill"><Lightbulb size={14} /> HOMEWORK &amp; ASSIGNMENT HELP</span><h1>Bring your question to FAM</h1><p>Choose the learner&apos;s grade and subject first. Premium learners can then open guided homework support.</p></div><div className="homework-service-bot">🤖<span>Let&apos;s solve it together</span></div></header>

    <div className="homework-flow-steps" aria-label="Homework help steps"><span className={grade ? 'done' : 'active'}><b>{grade ? '✓' : '1'}</b> Grade</span><i /><span className={subject ? 'done' : grade ? 'active' : ''}><b>{subject ? '✓' : '2'}</b> Subject</span><i /><span className={selectionComplete ? 'active' : ''}><b>3</b> Premium help</span></div>

    {!grade && <section className="homework-choice-panel"><div className="homework-choice-heading"><GraduationCap size={24} /><div><span>STEP 1</span><h2>Select a grade</h2><p>We use the grade to adjust the level and explanation.</p></div></div><div className="homework-grade-grid">{grades.map(item => <button key={item.id} type="button" onClick={() => chooseGrade(item.id)}><strong>{item.number}</strong><span>Grade {item.number}</span></button>)}</div></section>}

    {grade && !subject && <section className="homework-choice-panel"><button className="homework-change-button" type="button" onClick={() => setGradeId(null)}><ArrowLeft size={16} /> Change Grade {grade.number}</button><div className="homework-choice-heading"><BookOpen size={24} /><div><span>STEP 2 · GRADE {grade.number}</span><h2>Select the subject</h2><p>Choose where the question or assignment comes from.</p></div></div><div className="homework-subject-grid">{subjects.map(item => <button key={item.id} type="button" onClick={() => setSubject(item)}><span>{item.emoji ?? '📘'}</span><strong>{item.name}</strong><ArrowRight size={17} /></button>)}</div></section>}

    {selectionComplete && !checkingAccess && accessMode !== 'PREMIUM' && <section className="homework-premium-gate">
      <div className="homework-selection-summary"><span>{grade?.name}</span><strong>{subject?.name}</strong><button type="button" onClick={() => { setSubject(null); setGuidance(null); setHelpError('') }}>Change</button></div>
      <LockKeyhole size={32} /><span className="eyebrow">PREMIUM SERVICE</span><h2>Homework &amp; Assignment Help is available with FAM Premium</h2><p>Upgrade to receive guided, grade-appropriate support. FAM explains the method and helps learners think through the work instead of simply copying an answer.</p>
      {!user && <div className="homework-auth-actions"><Link className="button primary" to="/account">Log in</Link><Link className="button secondary" to="/account">Create free account</Link><small>Sign in or create an account before purchasing Premium.</small></div>}
      <PremiumPackageCards onSelect={user ? upgrade : undefined} loadingPackage={paymentLoading} />
      {message && <p className="form-message">{message}</p>}
    </section>}

    {selectionComplete && !checkingAccess && accessMode === 'PREMIUM' && <section className="homework-premium-workspace">
      <div className="homework-selection-summary"><span>{grade?.name}</span><strong>{subject?.name}</strong><button type="button" onClick={() => setSubject(null)}>Change</button></div>
      <div className="premium-ready"><CheckCircle2 size={21} /><div><strong>Premium access confirmed</strong><span>Your guided workspace is ready.</span></div></div>
      <form onSubmit={submitQuestion}><label htmlFor="premium-homework-question">Type or paste the homework or assignment question</label><textarea id="premium-homework-question" rows={7} maxLength={6000} value={question} onChange={event => { setQuestion(event.target.value); setGuidance(null); setHelpError('') }} placeholder={`Enter your ${subject?.name ?? ''} question and include all the information provided...`} /><div className="homework-question-count">{question.length.toLocaleString()} / 6,000 characters</div><div className="homework-workspace-footer"><span><ShieldCheck size={16} /> Do not include names, contact details or other private information.</span><button className="button primary" type="submit" disabled={question.trim().length < 10 || helpLoading}>{helpLoading ? <><RefreshCw className="homework-spinner" size={17} /> Preparing guidance...</> : <>Start guided help <ArrowRight size={17} /></>}</button></div></form>
      {helpError && <div className="homework-help-error" role="alert"><strong>We could not prepare the guidance</strong><p>{helpError}</p><button type="button" onClick={() => setHelpError('')}>Try again</button></div>}
      {guidance && <article className="homework-guidance-result" aria-live="polite">
        <header><div className="homework-guidance-icon"><Sparkles size={24} /></div><div><span>FAM GUIDED HELP</span><h2>{guidance.title}</h2></div></header>
        <section><span>1 · UNDERSTAND THE QUESTION</span><p>{guidance.understanding}</p></section>
        <section className="homework-key-concept"><span>KEY CONCEPT</span><p>{guidance.keyConcept}</p></section>
        <section><span>2 · WORK THROUGH IT</span><ol>{guidance.steps.map((step, index) => <li key={`${index}-${step}`}><b>{index + 1}</b><p>{step}</p></li>)}</ol></section>
        <section><span>3 · EXPLANATION</span><p>{guidance.workedExplanation}</p></section>
        <section className="homework-final-answer"><span>FINAL ANSWER OR RECOMMENDED OUTCOME</span><p>{guidance.finalAnswer}</p></section>
        <section className="homework-check"><span>CHECK YOUR UNDERSTANDING</span><p>{guidance.checkYourUnderstanding}</p></section>
        <footer><CheckCircle2 size={20} /><p>{guidance.encouragement}</p><button className="button secondary" type="button" onClick={() => { setQuestion(''); setGuidance(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Ask another question</button></footer>
      </article>}
    </section>}
  </div>
}
