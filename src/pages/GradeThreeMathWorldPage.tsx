import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gradeThreeMathPaths } from '../data/grade-previews'

export default function GradeThreeMathWorldPage() {
  return (
    <div className="math-world-page">
      <Link className="grade-back-link" to="/grades/grade-3"><ArrowLeft size={17} /> Grade 3</Link>
      <header className="math-world-hero">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 3 MATHEMATICS</span><h1>Welcome to Number World</h1><p>Explore three-digit numbers, groups, fractions, time, shapes and data.</p></div>
        <div className="number-world-art" aria-hidden="true"><span>💯</span><span>✖️</span><span>🍕</span><b>🤖</b></div>
      </header>

      <Link className="grade-back-link" to="/grades/grade-3/programmes/mathematics/terms/1">📚 Learn step by step · Term programmes →</Link>
      <section className="math-topic-map" aria-labelledby="math-paths-title">
        <div className="math-map-heading"><span>LEARNING PATHS</span><h2 id="math-paths-title">Where should we explore?</h2></div>
        <div className="math-topic-grid">
          {gradeThreeMathPaths.map(topic => <Link className={`math-topic-card colour-${topic.colour}`} to={`/grades/grade-3/mathematics/practice/${topic.id}`} key={topic.id}><span className="math-topic-icon">{topic.emoji}</span><div><LearningAccessBadge access={topic.access}/><small>{topic.activities.length} ACTIVITIES</small><h3>{topic.title}</h3><p>{topic.description}</p></div><ArrowRight size={21} /></Link>)}
        </div>
      </section>
    </div>
  )
}
