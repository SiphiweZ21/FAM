import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gradeOneWordPaths } from '../data/grade-previews'

export default function GradeOneWordWorldPage() {
  return <div className="word-world-page">
    <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1</Link>
    <header className="word-world-hero"><div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 1 ENGLISH HOME LANGUAGE</span><h1>Welcome to Word World</h1><p>Meet letters, hear sounds, build words, read sentences and listen to stories.</p></div><div className="word-world-art" aria-hidden="true"><span>A</span><span>B</span><span>C</span><b>🤖</b></div></header>
    <Link className="grade-back-link" to="/grades/grade-1/programmes/words/terms/1">📚 Learn step by step · English Term 1 →</Link>
      <section className="word-path-map"><div className="math-map-heading"><span>LANGUAGE PATHS</span><h2>What should we learn?</h2></div><div className="word-path-grid">{gradeOneWordPaths.map(path => <Link className={`word-path-card colour-${path.colour}`} to={`/grades/grade-1/words/practice/${path.id}`} key={path.id}><span className="word-path-icon">{path.emoji}</span><div><LearningAccessBadge access={path.access}/><small>{path.activities.length} ACTIVITIES</small><h3>{path.title}</h3><p>{path.description}</p></div><ArrowRight size={21} /></Link>)}</div></section>
  </div>
}
