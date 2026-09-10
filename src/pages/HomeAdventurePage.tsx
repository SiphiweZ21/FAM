import { ArrowRight, BarChart3, BookOpen, FileText, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomeAdventurePage() {
  return (
    <div className="fam-home">
      <section className="fam-home-hero">
        <div className="home-space-stars"><span>✦</span><span>✦</span><span>✦</span></div>
        <div className="home-hero-content">
          <span className="map-kicker"><Sparkles size={14} /> GRADE 12 LEARNING ADVENTURE</span>
          <h1>Learn today.<br /><em>Lead tomorrow.</em></h1>
          <p>Master your subjects through short missions, real exam practice and progress that shows you where to focus next.</p>
          <Link className="button primary mission-launch home-main-cta" to="/subjects">Start your adventure <ArrowRight size={18} /></Link>
          <Link className="home-signin-link" to="/account">Already have an account? <strong>Sign in</strong></Link>
        </div>
      </section>

      <section className="home-trust-strip">
        <span><ShieldCheck size={16} /> Built for South African Grade 12</span>
        <span><Star size={16} /> 17 subjects</span>
      </section>

      <section className="home-choice-section">
        <span className="eyebrow">CHOOSE YOUR PATH</span>
        <h2>What do you need right now?</h2>
        <div className="home-path-grid">
          <Link to="/subjects" className="home-path-card learn-path"><span><BookOpen size={24} /></span><div><small>LEARNING MISSIONS</small><strong>Strengthen a subject</strong><p>Build confidence one topic at a time.</p></div><ArrowRight size={18} /></Link>
          <Link to="/subjects" className="home-path-card exam-path"><span><FileText size={24} /></span><div><small>EXAM MODE</small><strong>Practise past papers</strong><p>Prepare with questions and memorandums.</p></div><ArrowRight size={18} /></Link>
          <Link to="/dashboard" className="home-path-card progress-path"><span><BarChart3 size={24} /></span><div><small>MY PROGRESS</small><strong>See where to focus</strong><p>Get your recommended next step.</p></div><ArrowRight size={18} /></Link>
        </div>
      </section>

      <section className="home-simple-loop">
        <div><span>1</span><strong>Choose</strong><small>Pick a subject</small></div>
        <i />
        <div><span>2</span><strong>Play</strong><small>Complete a mission</small></div>
        <i />
        <div><span>3</span><strong>Improve</strong><small>Follow your results</small></div>
      </section>
    </div>
  )
}
