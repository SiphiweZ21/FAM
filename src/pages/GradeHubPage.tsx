import { plannedSubjectsForGrade } from '../data/planned-subjects'
import { ArrowLeft, ArrowRight, BookOpen, Calculator, Camera, Cloud, CloudOff, Play, RefreshCw, Sparkles, Trophy, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getGrade, rememberGrade } from '../lib/grades'
import { getGradeOneProgress, gradeOneCompletion } from '../lib/grade-one-progress'
import { getGradeTwoProgress } from '../lib/grade-two-progress'
import { getGradeThreeProgress } from '../lib/grade-three-progress'
import { getGradeFourProgress } from '../lib/grade-four-progress'
import { getGradeFiveProgress } from '../lib/grade-five-progress'
import { getGradeSixProgress } from '../lib/grade-six-progress'
import { getGradeSevenProgress } from '../lib/grade-seven-progress'
import type { GradeOneSyncStatus } from '../lib/grade-one-sync'

export default function GradeHubPage() {
  const { gradeId } = useParams()
  const grade = getGrade(gradeId)
  const [gradeOneProgress, setGradeOneProgress] = useState(getGradeOneProgress)
  const [gradeTwoProgress, setGradeTwoProgress] = useState(getGradeTwoProgress)
  const [gradeThreeProgress, setGradeThreeProgress] = useState(getGradeThreeProgress)
  const [gradeFourProgress, setGradeFourProgress] = useState(getGradeFourProgress)
  const [gradeFiveProgress, setGradeFiveProgress] = useState(getGradeFiveProgress)
  const [gradeSixProgress, setGradeSixProgress] = useState(getGradeSixProgress)
  const [gradeSevenProgress, setGradeSevenProgress] = useState(getGradeSevenProgress)
  const [syncStatus, setSyncStatus] = useState<GradeOneSyncStatus>('local')

  useEffect(() => {
    if (grade) rememberGrade(grade.id)
  }, [grade])

  useEffect(() => {
    const refresh = () => setGradeOneProgress(getGradeOneProgress())
    window.addEventListener('fam-grade-one-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-one-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  useEffect(() => {
    const updateStatus = (event: Event) => setSyncStatus((event as CustomEvent<GradeOneSyncStatus>).detail)
    window.addEventListener('fam-grade-one-sync', updateStatus)
    return () => window.removeEventListener('fam-grade-one-sync', updateStatus)
  }, [])
  useEffect(() => {
    const refresh = () => setGradeTwoProgress(getGradeTwoProgress())
    window.addEventListener('fam-grade-two-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-two-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])
  useEffect(() => {
    const refresh = () => setGradeThreeProgress(getGradeThreeProgress())
    window.addEventListener('fam-grade-three-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-three-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  useEffect(() => {
    const refresh = () => setGradeFourProgress(getGradeFourProgress())
    window.addEventListener('fam-grade-four-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-four-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  useEffect(() => {
    const refresh = () => setGradeFiveProgress(getGradeFiveProgress())
    window.addEventListener('fam-grade-five-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-five-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  useEffect(() => {
    const refresh = () => setGradeSixProgress(getGradeSixProgress())
    window.addEventListener('fam-grade-six-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-six-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  useEffect(() => {
    const refresh = () => setGradeSevenProgress(getGradeSevenProgress())
    window.addEventListener('fam-grade-seven-progress', refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => { window.removeEventListener('fam-grade-seven-progress', refresh); window.removeEventListener('storage', refresh) }
  }, [])

  if (!grade) return <Navigate to="/" replace />

  if (grade.number === 12) return <Navigate to="/subjects" replace />

  const isGradeOne = grade.number === 1

  return (
    <div className={`grade-hub grade-stage-${grade.stage}`}>
      <Link className="grade-back-link" to="/"><ArrowLeft size={17} /> Change grade</Link>

      {grade.number <= 11 && <Link className="grade-back-link" to={`/grades/${grade.id}/programmes/mathematics/terms/1`}>📚 Explore term programmes →</Link>}
      <header className="grade-hub-hero">
        <div>
          <span className="grade-stage-pill"><Sparkles size={14} /> {grade.stageLabel}</span>
          <h1>{grade.number <= 11 ? `Welcome to Grade ${grade.number}!` : `${grade.name} is coming to FAM`}</h1>
          <p>{grade.number <= 11
            ? 'Explore learning worlds with stories, sounds and interactive activities.'
            : 'We have created your grade space. Lessons, practice and homework support will be added here.'}</p>
        </div>
        <div className="grade-mascot" aria-label="FAM learning robot">🤖<span>Let&apos;s learn!</span></div>
      </header>

      {isGradeOne ? (
        <>
          <section className="grade-one-progress-card">
            <header><div><span>MY GRADE 1 JOURNEY</span><h2>Your learning progress</h2><small className={`grade-one-sync-state status-${syncStatus}`}>{syncStatus === 'synced' ? <Cloud size={14} /> : syncStatus === 'syncing' ? <RefreshCw size={14} /> : <CloudOff size={14} />}{syncStatus === 'synced' ? 'Synced to account' : syncStatus === 'syncing' ? 'Syncing progress' : syncStatus === 'offline' ? 'Offline · saved locally' : 'Saved on this device'}</small></div><strong>{gradeOneCompletion(gradeOneProgress)}%</strong></header>
            <div className="grade-one-progress-track"><span style={{ width: `${gradeOneCompletion(gradeOneProgress)}%` }} /></div>
            <div className="grade-one-progress-stats"><div><strong>{gradeOneProgress.completedPaths.length}</strong><span>Paths complete</span></div><div><strong>{gradeOneProgress.completedPaths.length}</strong><span>Badges earned</span></div><div><strong>{gradeOneProgress.homeworkAttempts}</strong><span>Homework attempts</span></div></div>
            {gradeOneProgress.lastActivity && <Link className="grade-one-continue" to={gradeOneProgress.lastActivity.route}><Play size={18} /><span><small>CONTINUE LEARNING</small><strong>{gradeOneProgress.lastActivity.title}</strong></span><ArrowRight size={18} /></Link>}
            {gradeOneProgress.completedPaths.length > 0 && <div className="grade-one-badges"><span><Trophy size={16} /> MY BADGES</span><div>{gradeOneProgress.completedPaths.slice(-4).map(path => <div key={path.key}><b>🏅</b><small>{path.badge}</small></div>)}</div></div>}
            <Link className="grade-one-parent-link" to="/parent-dashboard"><Users size={18} /><span><small>FOR PARENTS &amp; CAREGIVERS</small><strong>View the family progress dashboard</strong></span><ArrowRight size={18} /></Link>
          </section>

          <section className="grade-section-heading">
            <span>CHOOSE A LEARNING WORLD</span>
            <h2>What would you like to learn?</h2>
          </section>

          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-1/mathematics">
              <span className="world-art" aria-hidden="true">🍎 <b>+</b> 🍎</span>
              <div><small>MATHEMATICS · 7 LEARNING PATHS</small><h3>Number World</h3><p>Count, compare, add, subtract and explore shapes, money and time.</p></div>
              <ArrowRight size={22} />
            </Link>

            <Link className="learning-world-card word-world" to="/grades/grade-1/words">
              <span className="world-art" aria-hidden="true">A B C</span>
              <div><small>ENGLISH HOME LANGUAGE · 7 LEARNING PATHS</small><h3>Word World</h3><p>See, hear, build and use new words.</p></div>
              <BookOpen size={22} />
            </Link>
            <Link className="learning-world-card word-world" to="/grades/grade-1/life-skills">
              <span className="world-art" aria-hidden="true">🌱 🎨 🤝</span>
              <div><small>LIFE SKILLS · 4 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore feelings, safety, nature, art and movement.</p></div>
              <ArrowRight size={22} />
            </Link>
            <Link className="learning-world-card number-world" to="/grades/grade-1/coding">
              <span className="world-art" aria-hidden="true">🤖 ➡️ ⭐</span>
              <div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Find patterns, give instructions and learn to use devices safely.</p></div>
              <ArrowRight size={22} />
            </Link>
          </div>

          <Link className="homework-starter-card" to="/grades/grade-1/homework">
            <div className="homework-icon"><Camera size={28} /></div>
            <div><span>FAM HOMEWORK HELPER</span><h2>Bring your homework to FAM</h2><p>Type a question or take a picture. FAM will explain it with pictures and guide you step by step.</p></div>
            <span className="coming-chip">TRY IT NOW</span>
          </Link>
        </>
      ) : grade.number === 2 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 2 learning worlds</h2>
            <p><strong>{gradeTwoProgress.completedPaths.length} of 20 paths complete</strong> · Progress saved on this device.</p>
            {gradeTwoProgress.lastPathId && <Link className="button secondary" to={gradeTwoProgress.lastPathId.startsWith('word:') ? `/grades/grade-2/words/practice/${gradeTwoProgress.lastPathId.slice(5)}` : gradeTwoProgress.lastPathId.startsWith('life:') ? `/grades/grade-2/life-skills/practice/${gradeTwoProgress.lastPathId.slice(5)}` : gradeTwoProgress.lastPathId.startsWith('coding:') ? `/grades/grade-2/coding/practice/${gradeTwoProgress.lastPathId.slice(7)}` : `/grades/grade-2/mathematics/practice/${gradeTwoProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-2/mathematics"><span className="world-art" aria-hidden="true">🔟 ➕ 📏</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Explore tens and ones, patterns, measurement, money and picture graphs.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-2/words"><span className="world-art" aria-hidden="true">SH CH TH</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Read words and sentences, build words and listen to stories.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-2/life-skills"><span className="world-art" aria-hidden="true">💧 🤝 🎨</span><div><small>LIFE SKILLS · 5 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore health, friendship, inclusion, art and movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-2/coding"><span className="world-art" aria-hidden="true">🤖 ➡️ ⭐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Debug patterns and code a route across a grid.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number === 3 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 3 learning worlds</h2>
            <p><strong>{gradeThreeProgress.completedPaths.length} of 20 paths complete</strong> · Progress saved on this device.</p>
            {gradeThreeProgress.lastPathId && <Link className="button secondary" to={gradeThreeProgress.lastPathId.startsWith('coding:') ? `/grades/grade-3/coding/practice/${gradeThreeProgress.lastPathId.slice(7)}` : gradeThreeProgress.lastPathId.startsWith('life:') ? `/grades/grade-3/life-skills/practice/${gradeThreeProgress.lastPathId.slice(5)}` : gradeThreeProgress.lastPathId.startsWith('word:') ? `/grades/grade-3/words/practice/${gradeThreeProgress.lastPathId.slice(5)}` : `/grades/grade-3/mathematics/practice/${gradeThreeProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-3/mathematics"><span className="world-art" aria-hidden="true">💯 ✖️ 🍕</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Build three-digit numbers, solve groups and explore fractions, time and data.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-3/words"><span className="world-art" aria-hidden="true">AI IGH OA</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Explore spelling, meaning, sentences and short stories.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-3/life-skills"><span className="world-art" aria-hidden="true">🌱 🌦️ 🎨</span><div><small>LIFE SKILLS · 5 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore nature, weather, health, community, art and movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-3/coding"><span className="world-art" aria-hidden="true">🤖 🪨 ⭐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Debug a route around obstacles and learn about robot systems and digital safety.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number === 4 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 4 learning worlds</h2>
            <p><strong>{gradeFourProgress.completedPaths.length} of 30 paths complete</strong> · Progress saved on this device.</p>
            {gradeFourProgress.lastPathId && <Link className="button secondary" to={gradeFourProgress.lastPathId.startsWith('coding:') ? `/grades/grade-4/coding/practice/${gradeFourProgress.lastPathId.slice(7)}` : gradeFourProgress.lastPathId.startsWith('life:') ? `/grades/grade-4/life-skills/practice/${gradeFourProgress.lastPathId.slice(5)}` : gradeFourProgress.lastPathId.startsWith('social:') ? `/grades/grade-4/social-sciences/practice/${gradeFourProgress.lastPathId.slice(7)}` : gradeFourProgress.lastPathId.startsWith('science:') ? `/grades/grade-4/science/practice/${gradeFourProgress.lastPathId.slice(8)}` : gradeFourProgress.lastPathId.startsWith('word:') ? `/grades/grade-4/words/practice/${gradeFourProgress.lastPathId.slice(5)}` : `/grades/grade-4/mathematics/practice/${gradeFourProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-4/mathematics"><span className="world-art" aria-hidden="true">🔢 ➕ 📏</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Explore place value, operations, fractions, measurement, shapes and data.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-4/words"><span className="world-art" aria-hidden="true">📚 ✍️ 👂</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Read, listen, explore grammar and build longer words.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-4/science"><span className="world-art" aria-hidden="true">🌱 🧪 🏗️</span><div><small>NATURAL SCIENCES AND TECHNOLOGY · 5 LEARNING PATHS</small><h3>Science & Technology World</h3><p>Explore nature, materials, energy, Earth and design.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-4/social-sciences"><span className="world-art" aria-hidden="true">🗺️ 🌽 🏛️</span><div><small>SOCIAL SCIENCES · 5 LEARNING PATHS</small><h3>Social Sciences World</h3><p>Explore maps, farming, water, local history and change over time.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-4/life-skills"><span className="world-art" aria-hidden="true">🤝 🎨 🏃</span><div><small>LIFE SKILLS · 5 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore well-being, safety, community, creative arts and movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-4/coding"><span className="world-art" aria-hidden="true">🤖 🔁 ⭐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Build and debug algorithms, explore robot parts and use digital tools safely.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number === 5 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 5 learning worlds</h2>
            <p><strong>{gradeFiveProgress.completedPaths.length} of 30 paths complete</strong> · Progress saved on this device.</p>
            {gradeFiveProgress.lastPathId && <Link className="button secondary" to={gradeFiveProgress.lastPathId.startsWith('coding:') ? `/grades/grade-5/coding/practice/${gradeFiveProgress.lastPathId.slice(7)}` : gradeFiveProgress.lastPathId.startsWith('life:') ? `/grades/grade-5/life-skills/practice/${gradeFiveProgress.lastPathId.slice(5)}` : gradeFiveProgress.lastPathId.startsWith('social:') ? `/grades/grade-5/social-sciences/practice/${gradeFiveProgress.lastPathId.slice(7)}` : gradeFiveProgress.lastPathId.startsWith('science:') ? `/grades/grade-5/science/practice/${gradeFiveProgress.lastPathId.slice(8)}` : gradeFiveProgress.lastPathId.startsWith('word:') ? `/grades/grade-5/words/practice/${gradeFiveProgress.lastPathId.slice(5)}` : `/grades/grade-5/mathematics/practice/${gradeFiveProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-5/mathematics"><span className="world-art" aria-hidden="true">🔢 ➗ 📊</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Explore large numbers, operations, fractions, patterns, shapes and data.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-5/words"><span className="world-art" aria-hidden="true">📚 ✍️ 👂</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Read for meaning, explore vocabulary, grammar, editing and listening.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-5/science"><span className="world-art" aria-hidden="true">🌿 ⚡ 🪨</span><div><small>NATURAL SCIENCES AND TECHNOLOGY · 5 LEARNING PATHS</small><h3>Science & Technology World</h3><p>Explore food chains, skeletons, materials, energy, rocks and fossils.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-5/social-sciences"><span className="world-art" aria-hidden="true">🗺️ ⛏️ 🏛️</span><div><small>SOCIAL SCIENCES · 5 LEARNING PATHS</small><h3>Social Sciences World</h3><p>Explore Africa, landforms, weather, resources, early communities and heritage.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-5/life-skills"><span className="world-art" aria-hidden="true">🤝 🎨 🏃</span><div><small>LIFE SKILLS · 5 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore self, fairness, health, creative arts and movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-5/coding"><span className="world-art" aria-hidden="true">🤖 🔁 ⭐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Use variables, loops and decisions, debug robot routes and practise digital skills.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number === 6 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 6 learning worlds</h2>
            <p><strong>{gradeSixProgress.completedPaths.length} of 30 paths complete</strong> · Progress saved on this device.</p>
            {gradeSixProgress.lastPathId && <Link className="button secondary" to={gradeSixProgress.lastPathId.startsWith('coding:') ? `/grades/grade-6/coding/practice/${gradeSixProgress.lastPathId.slice(7)}` : gradeSixProgress.lastPathId.startsWith('life:') ? `/grades/grade-6/life-skills/practice/${gradeSixProgress.lastPathId.slice(5)}` : gradeSixProgress.lastPathId.startsWith('social:') ? `/grades/grade-6/social-sciences/practice/${gradeSixProgress.lastPathId.slice(7)}` : gradeSixProgress.lastPathId.startsWith('science:') ? `/grades/grade-6/science/practice/${gradeSixProgress.lastPathId.slice(8)}` : gradeSixProgress.lastPathId.startsWith('word:') ? `/grades/grade-6/words/practice/${gradeSixProgress.lastPathId.slice(5)}` : `/grades/grade-6/mathematics/practice/${gradeSixProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-6/mathematics"><span className="world-art" aria-hidden="true">🔢 🍕 📐</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Explore whole numbers, percentages, decimals, patterns, geometry and data.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-6/words"><span className="world-art" aria-hidden="true">📚 ✍️ 👂</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Read critically, listen for details, plan writing and explore grammar and vocabulary.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-6/science"><span className="world-art" aria-hidden="true">🌱 💧 ⚡</span><div><small>NATURAL SCIENCES AND TECHNOLOGY · 5 LEARNING PATHS</small><h3>Science & Technology World</h3><p>Explore food webs, mixtures, circuits, space and design.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-6/social-sciences"><span className="world-art" aria-hidden="true">🗺️ 🏺 🗳️</span><div><small>SOCIAL SCIENCES · 5 LEARNING PATHS</small><h3>Social Sciences World</h3><p>Explore Geography and History through maps, evidence, trade and citizenship.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-6/life-skills"><span className="world-art" aria-hidden="true">🤝 🎨 🏃</span><div><small>LIFE SKILLS · 5 LEARNING PATHS</small><h3>Life Skills World</h3><p>Explore self-image, social responsibility, health, arts and movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-6/coding"><span className="world-art" aria-hidden="true">🤖 🔁 ⭐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Plan algorithms, debug decisions, test robot systems and practise digital skills.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number === 7 ? (
        <>
          <section className="grade-coming-card">
            <Calculator size={32} />
            <h2>Grade 7 learning worlds</h2>
            <p><strong>{gradeSevenProgress.completedPaths.length} of 45 paths complete</strong> · Progress saved on this device.</p>
            {gradeSevenProgress.lastPathId && <Link className="button secondary" to={gradeSevenProgress.lastPathId.startsWith('coding:') ? `/grades/grade-7/coding/practice/${gradeSevenProgress.lastPathId.slice(7)}` : gradeSevenProgress.lastPathId.startsWith('arts:') ? `/grades/grade-7/creative-arts/practice/${gradeSevenProgress.lastPathId.slice(5)}` : gradeSevenProgress.lastPathId.startsWith('life:') ? `/grades/grade-7/life-orientation/practice/${gradeSevenProgress.lastPathId.slice(5)}` : gradeSevenProgress.lastPathId.startsWith('ems:') ? `/grades/grade-7/ems/practice/${gradeSevenProgress.lastPathId.slice(4)}` : gradeSevenProgress.lastPathId.startsWith('technology:') ? `/grades/grade-7/technology/practice/${gradeSevenProgress.lastPathId.slice(11)}` : gradeSevenProgress.lastPathId.startsWith('social:') ? `/grades/grade-7/social-sciences/practice/${gradeSevenProgress.lastPathId.slice(7)}` : gradeSevenProgress.lastPathId.startsWith('science:') ? `/grades/grade-7/science/practice/${gradeSevenProgress.lastPathId.slice(8)}` : gradeSevenProgress.lastPathId.startsWith('word:') ? `/grades/grade-7/words/practice/${gradeSevenProgress.lastPathId.slice(5)}` : `/grades/grade-7/mathematics/practice/${gradeSevenProgress.lastPathId}`}>Continue learning</Link>}
          </section>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to="/grades/grade-7/mathematics"><span className="world-art" aria-hidden="true">🔢 ➖ 📐</span><div><small>MATHEMATICS · 5 LEARNING PATHS</small><h3>Number World</h3><p>Explore ratios, fractions, integers, exponents, equations, geometry and data.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-7/words"><span className="world-art" aria-hidden="true">📚 ✍️ 👂</span><div><small>ENGLISH HOME LANGUAGE · 5 LEARNING PATHS</small><h3>Word World</h3><p>Read for evidence, discuss ideas, plan writing and evaluate language and visuals.</p></div><BookOpen size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-7/science"><span className="world-art" aria-hidden="true">🌿 🧪 ☀️</span><div><small>NATURAL SCIENCES · 5 LEARNING PATHS</small><h3>Science World</h3><p>Explore biodiversity, reproduction, materials, energy and Earth systems.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-7/social-sciences"><span className="world-art" aria-hidden="true">🗺️ 🏛️ 📜</span><div><small>SOCIAL SCIENCES · 5 LEARNING PATHS</small><h3>Social Sciences World</h3><p>Explore Geography and History through maps, resources and historical evidence.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-7/coding"><span className="world-art" aria-hidden="true">🤖 🔁 🌐</span><div><small>CODING AND ROBOTICS · 5 LEARNING PATHS</small><h3>Robot World</h3><p>Explore algorithms, coding, robot systems, digital citizenship and data tools.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-7/creative-arts"><span className="world-art" aria-hidden="true">💃 🎭 🎨</span><div><small>CREATIVE ARTS · 5 LEARNING PATHS</small><h3>Creative Arts World</h3><p>Explore dance, drama, music, visual art and creative reflection.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-7/life-orientation"><span className="world-art" aria-hidden="true">🌱 🤝 🏃</span><div><small>LIFE ORIENTATION · 5 LEARNING PATHS</small><h3>Life Orientation World</h3><p>Explore self-image, health, rights, study skills and safe movement.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to="/grades/grade-7/ems"><span className="world-art" aria-hidden="true">💰 📊 🛍️</span><div><small>ECONOMIC AND MANAGEMENT SCIENCES · 5 LEARNING PATHS</small><h3>EMS World</h3><p>Explore money, production, inequality, budgeting and entrepreneurship.</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card number-world" to="/grades/grade-7/technology"><span className="world-art" aria-hidden="true">⚙️ 🏗️ ⚡</span><div><small>TECHNOLOGY · 5 LEARNING PATHS</small><h3>Technology World</h3><p>Investigate design, mechanical systems, structures, circuits and materials.</p></div><ArrowRight size={22} /></Link>
          </div>
        </>
      ) : grade.number >= 8 && grade.number <= 11 ? (
        <section className="grade-coming-card">
          <h2>Maths and English term programmes</h2>
          <p>Build your skills with worked lessons, guided practice and checkpoints across four terms. These are supplementary starter programmes; other subjects are being prepared.</p>
          <div className="learning-world-grid">
            <Link className="learning-world-card number-world" to={`/grades/${grade.id}/programmes/mathematics/terms/1`}><div><small>MATHEMATICS · 8 UNITS</small><h3>Maths programme</h3><p>{grade.number >= 10 ? 'Quadratics, functions, trigonometry, geometry, finance and statistics.' : 'Exponents, algebra, geometry, finance, data and probability.'}</p></div><ArrowRight size={22} /></Link>
            <Link className="learning-world-card word-world" to={`/grades/${grade.id}/programmes/words/terms/1`}><div><small>ENGLISH · 8 UNITS</small><h3>English programme</h3><p>Critical reading, literature, arguments, sources and writing.</p></div><BookOpen size={22} /></Link>
            {plannedSubjectsForGrade(grade.number).map(subject=><Link key={subject.id} className="learning-world-card word-world" to={`/grades/${grade.id}/${subject.id}`}><div><small>CONTENT BEING PREPARED</small><h3>{subject.title}</h3><p>Lessons and practice are not available yet.</p></div><ArrowRight size={22} /></Link>)}
          </div>
        </section>
      ) : (
        <section className="grade-coming-card">
          <Calculator size={32} />
          <h2>Your learning journey is being prepared</h2>
          <p>Grade 1 is our first interactive prototype. Your grade will use the same FAM engine with lessons designed for your age.</p>
          <Link className="button primary" to="/grades/grade-1">Preview Grade 1</Link>
        </section>
      )}
    </div>
  )
}
