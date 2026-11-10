import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { gradeOneCodingPaths } from '../data/grade-previews'

export default function GradeOneCodingWorldPage() {
  const [steps, setSteps] = useState<number[]>([])
  const [position, setPosition] = useState(0)
  const [ran, setRan] = useState(false)
  function run() { setPosition(Math.min(steps.length, 2)); setRan(true) }
  function reset() { setSteps([]); setPosition(0); setRan(false) }
  return (
    <div className="math-world-page">
      <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1</Link>
      <header className="math-world-hero">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 1 CODING AND ROBOTICS</span><h1>Welcome to Robot World</h1><p>Explore patterns, instructions, robot parts, online safety and devices.</p></div>
        <div className="number-world-art" aria-hidden="true"><span>🤖</span><span>➡️</span><span>⭐</span><b>🤖</b></div>
      </header>
      <section className="robot-lab" aria-labelledby="robot-lab-title">
        <div><span className="grade-stage-pill">TRY A ROBOT PROGRAM</span><h2 id="robot-lab-title">Help the robot reach the star</h2><p>Add forward steps, then press Run. How many steps will it take?</p></div>
        <div className="robot-track" aria-label={`Robot at space ${position + 1} of 3`}>{[0, 1, 2].map(cell => <span key={cell} className={position === cell ? 'active' : ''}>{position === cell ? '🤖' : cell === 2 ? '⭐' : '⬜'}</span>)}</div>
        <div className="robot-program" aria-live="polite"><strong>My program:</strong> {steps.length ? steps.map((_, i) => <span key={i}>➡️</span>) : <span>Choose a step below</span>}</div>
        <div className="robot-controls">
          <button className="button secondary" type="button" disabled={steps.length >= 3} onClick={() => { setSteps(previous => [...previous, 1]); setPosition(0); setRan(false) }}>+ Forward</button>
          <button className="button secondary" type="button" disabled={!steps.length} onClick={() => { setSteps(previous => previous.slice(0, -1)); setPosition(0); setRan(false) }}>Remove step</button>
          <button className="button primary" type="button" disabled={!steps.length} onClick={run}>Run</button>
          <button className="button secondary" type="button" onClick={reset}>Start again</button>
        </div>
        {ran && <p className="robot-result" role="status">{steps.length === 2 ? '🎉 The robot reached the star! Two forward steps worked.' : steps.length < 2 ? 'The robot needs one more forward step. Add it and run again.' : 'The robot reached the star, then tried an extra step. Remove one step and try again.'}</p>}
      </section>

      <section className="math-topic-map" aria-labelledby="math-paths-title">
        <div className="math-map-heading"><span>LEARNING PATHS</span><h2 id="math-paths-title">Where should we explore?</h2></div>
        <div className="math-topic-grid">
          {gradeOneCodingPaths.map(topic => <Link className={`math-topic-card colour-${topic.colour}`} to={`/grades/grade-1/coding/practice/${topic.id}`} key={topic.id}><span className="math-topic-icon">{topic.emoji}</span><div><LearningAccessBadge access={topic.access}/><small>{topic.activities.length} ACTIVITIES</small><h3>{topic.title}</h3><p>{topic.description}</p></div><ArrowRight size={21} /></Link>)}
        </div>
      </section>
    </div>
  )
}
