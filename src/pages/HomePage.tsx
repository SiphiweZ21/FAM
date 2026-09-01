import { ArrowRight, BookOpenCheck, FileText, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero">
        <span className="eyebrow">GRADE 12 EXAM PREP</span>
        <h1>Study smarter.<br/>Practise more.<br/>Walk into exams ready.</h1>
        <p>CAPS-aligned revision, bite-sized missions and past papers — built for your phone.</p>
        <Link className="button primary" to="/subjects">Start learning <ArrowRight size={18}/></Link>
      </section>

      <section className="stats-grid">
        <article><strong>17</strong><span>Grade 12 subjects</span></article>
        <article><strong>10</strong><span>questions per mission</span></article>
        <article><strong>1</strong><span>free mission per subject</span></article>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">ONE PLACE</span><h2>Everything you need to prepare</h2></div></div>
        <div className="feature-grid">
          <article className="feature-card"><BookOpenCheck/><h3>Learn & practise</h3><p>Work through focused topics and answer exam-style questions immediately.</p></article>
          <article className="feature-card"><FileText/><h3>Past papers</h3><p>Keep question papers and memorandums close to your revision journey.</p></article>
          <article className="feature-card"><Trophy/><h3>Track progress</h3><p>See where you are improving and which topics need another attempt.</p></article>
        </div>
      </section>
    </div>
  )
}
