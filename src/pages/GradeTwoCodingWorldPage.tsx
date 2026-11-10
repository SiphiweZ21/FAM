import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { gradeTwoCodingPaths } from '../data/grade-previews'

export default function GradeTwoCodingWorldPage() {
  const [steps, setSteps] = useState<Array<'right' | 'left' | 'up' | 'down'>>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [result, setResult] = useState('')
  const arrows = { right: '➡️', left: '⬅️', up: '⬆️', down: '⬇️' }
  function addStep(step: 'right' | 'left' | 'up' | 'down') {
    setSteps(previous => previous.length < 5 ? [...previous, step] : previous)
    setPosition({ x: 0, y: 0 })
    setResult('')
  }
  function run() {
    let x = 0, y = 0
    for (const step of steps) {
      const nextX = x + (step === 'right' ? 1 : step === 'left' ? -1 : 0)
      const nextY = y + (step === 'down' ? 1 : step === 'up' ? -1 : 0)
      if (nextX < 0 || nextX > 2 || nextY < 0 || nextY > 2) {
        setPosition({ x, y })
        setResult('The robot tried to leave the grid. Remove or change a step, then run again.')
        return
      }
      x = nextX; y = nextY
    }
    setPosition({ x, y })
    setResult(x === 2 && y === 1 ? '🎉 The robot reached the star! Your instructions worked.' : 'The robot stopped before the star. Change the instructions and run again.')
  }
  function reset() { setSteps([]); setPosition({ x: 0, y: 0 }); setResult('') }
  return (
    <div className="math-world-page">
      <Link className="grade-back-link" to="/grades/grade-2"><ArrowLeft size={17} /> Grade 2</Link>
      <header className="math-world-hero">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 2 CODING AND ROBOTICS</span><h1>Welcome to Robot World</h1><p>Find and debug patterns, plan a route and learn about robot parts and digital safety.</p></div>
        <div className="number-world-art" aria-hidden="true"><span>🤖</span><span>➡️</span><span>⭐</span><b>🤖</b></div>
      </header>
      <section className="robot-lab" aria-labelledby="grade-two-robot-title">
        <div><span className="grade-stage-pill">TRY A ROBOT PROGRAM</span><h2 id="grade-two-robot-title">Guide the robot to the star</h2><p>Add directions in order, then run your program. The robot starts at the top left.</p></div>
        <div className="robot-grid" aria-label={`Robot at column ${position.x + 1}, row ${position.y + 1}; star at column 3, row 2`}>
          {Array.from({ length: 9 }, (_, index) => {
            const x = index % 3, y = Math.floor(index / 3)
            return <span key={index} className={position.x === x && position.y === y ? 'active' : ''}>{position.x === x && position.y === y ? '🤖' : x === 2 && y === 1 ? '⭐' : '⬜'}</span>
          })}
        </div>
        <div className="robot-program" aria-live="polite"><strong>My program:</strong> {steps.length ? steps.map((step, index) => <span key={index}>{arrows[step]}</span>) : <span>Add a direction</span>}</div>
        <div className="robot-controls">
          {(['right', 'down', 'left', 'up'] as const).map(step => <button key={step} className="button secondary" disabled={steps.length >= 5} type="button" onClick={() => addStep(step)}>{arrows[step]} {step}</button>)}
          <button className="button secondary" disabled={!steps.length} type="button" onClick={() => { setSteps(previous => previous.slice(0, -1)); setPosition({ x: 0, y: 0 }); setResult('') }}>Remove last</button>
          <button className="button primary" disabled={!steps.length} type="button" onClick={run}>Run</button>
          <button className="button secondary" type="button" onClick={reset}>Start again</button>
        </div>
        {result && <p className="robot-result" role="status">{result}</p>}
      </section>

      <section className="math-topic-map" aria-labelledby="math-paths-title">
        <div className="math-map-heading"><span>LEARNING PATHS</span><h2 id="math-paths-title">Where should we explore?</h2></div>
        <div className="math-topic-grid">
          {gradeTwoCodingPaths.map(topic => <Link className={`math-topic-card colour-${topic.colour}`} to={`/grades/grade-2/coding/practice/${topic.id}`} key={topic.id}><span className="math-topic-icon">{topic.emoji}</span><div><LearningAccessBadge access={topic.access}/><small>{topic.activities.length} ACTIVITIES</small><h3>{topic.title}</h3><p>{topic.description}</p></div><ArrowRight size={21} /></Link>)}
        </div>
      </section>
    </div>
  )
}
