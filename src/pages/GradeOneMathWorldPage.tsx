import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gradeOneTopics } from '../data/grade-previews'
import { gradeOneNumberMission } from '../data/grade-previews'

export default function GradeOneMathWorldPage() {
  return (
    <div className="math-world-page">
      <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1</Link>
      <header className="math-world-hero">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 1 MATHEMATICS</span><h1>Welcome to Number World</h1><p>Choose a path and learn by touching, moving, counting and playing.</p></div>
        <div className="number-world-art" aria-hidden="true"><span>1</span><span>2</span><span>3</span><b>🤖</b></div>
      </header>

      <Link className="grade-back-link" to="/grades/grade-1/programmes/mathematics/terms/1">📚 Learn step by step · Term 1 counting unit →</Link>
      <section className="math-topic-map" aria-labelledby="math-paths-title">
        <div className="math-map-heading"><span>LEARNING PATHS</span><h2 id="math-paths-title">Where should we explore?</h2></div>
        <div className="math-topic-grid">
          {gradeOneTopics.map(topic => <Link className={`math-topic-card colour-${topic.colour}`} to={`/grades/grade-1/mathematics/practice/${topic.id}`} key={topic.id}><span className="math-topic-icon">{topic.emoji}</span><div><LearningAccessBadge access={topic.access}/><small>{topic.activities.length} ACTIVITIES</small><h3>{topic.title}</h3><p>{topic.description}</p></div><ArrowRight size={21} /></Link>)}
          <Link className="math-topic-card colour-red" to="/grades/grade-1/mathematics/number-mission"><span className="math-topic-icon">🍎</span><div><LearningAccessBadge access="PREMIUM"/><small>{gradeOneNumberMission.length} ACTIVITIES</small><h3>Add & Subtract</h3><p>Move objects, choose the sign and find the answer.</p></div><ArrowRight size={21} /></Link>
        </div>
      </section>
    </div>
  )
}
