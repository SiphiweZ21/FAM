import { ArrowRight, BookOpen, Gauge, Sparkles, UserRound, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getRememberedGrade, grades, rememberGrade, type Grade } from '../lib/grades'

export default function HomeAdventurePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [rememberedGrade, setRememberedGrade] = useState(getRememberedGrade)

  function selectGrade(grade: Grade) {
    rememberGrade(grade.id)
    setRememberedGrade(grade.id)
    navigate(grade.number === 12 ? '/subjects' : `/grades/${grade.id}`)
  }

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => setUser(data.session?.user ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="fam-home">
      <section className="fam-home-hero">
        <div className="home-space-stars"><span>✦</span><span>✦</span><span>✦</span></div>
        <div className="home-hero-content">
          <span className="map-kicker"><Sparkles size={14} /> YOUR LEARNING JOURNEY STARTS HERE</span>
          <h1>Learn today.<br /><em>Lead tomorrow.</em></h1>
          <p>Choose your grade and learn through short missions, video lessons, exam practice and guided homework support.</p>
          <div className="hero-grade-picker" aria-labelledby="hero-grade-title">
            <div><span>CHOOSE YOUR GRADE</span><strong id="hero-grade-title">Where should we begin?</strong></div>
            <div>{grades.map(grade => <button className={rememberedGrade === grade.id ? 'active' : ''} key={grade.id} onClick={() => selectGrade(grade)} type="button"><b>{grade.number}</b><span>Grade {grade.number}</span></button>)}</div>
          </div>
          {user && rememberedGrade && <Link className="button primary mission-launch home-main-cta" to={rememberedGrade !== 'grade-12' ? `/grades/${rememberedGrade}` : '/dashboard'}>Continue Grade {rememberedGrade.replace('grade-', '')} <ArrowRight size={18} /></Link>}
        </div>
      </section>

      {user && (
        <section className="home-app-navigation" aria-labelledby="home-navigation-title">
          <div><span className="eyebrow">CONTINUE LEARNING</span><h2 id="home-navigation-title">Where would you like to go?</h2></div>
          <nav aria-label="App shortcuts">
            <Link to="/dashboard"><Gauge size={22} /><span><strong>Dashboard</strong><small>View subject progress</small></span><ArrowRight size={18} /></Link>
            <Link to="/subjects"><BookOpen size={22} /><span><strong>Subjects</strong><small>Choose a learning mission</small></span><ArrowRight size={18} /></Link>
            <Link to="/parent-dashboard"><Users size={22} /><span><strong>Parent Dashboard</strong><small>Monitor all your children</small></span><ArrowRight size={18} /></Link>
            <Link to="/account"><UserRound size={22} /><span><strong>Account</strong><small>Manage your profile and access</small></span><ArrowRight size={18} /></Link>
          </nav>
        </section>
      )}
    </div>
  )
}
