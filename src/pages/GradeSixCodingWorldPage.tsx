import LearningAccessBadge from '../components/LearningAccessBadge'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { gradeSixCodingPaths } from '../data/grade-previews'

export default function GradeSixCodingWorldPage() {
  const [steps, setSteps] = useState<Array<'right' | 'left' | 'up' | 'down'>>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [result, setResult] = useState('')
  const arrows = { right: '➡️', left: '⬅️', up: '⬆️', down: '⬇️' }
  function addStep(step: 'right' | 'left' | 'up' | 'down') {
    setSteps(previous => previous.length < 16 ? [...previous, step] : previous)
    setPosition({ x: 0, y: 0 })
    setResult('')
  }
  function run() {
    let x = 0, y = 0
    for (const step of steps) {
      const nextX = x + (step === 'right' ? 1 : step === 'left' ? -1 : 0)
      const nextY = y + (step === 'down' ? 1 : step === 'up' ? -1 : 0)
      if (nextX < 0 || nextX > 6 || nextY < 0 || nextY > 6) {
        setPosition({ x, y })
        setResult('The robot tried to leave the grid. Remove or change a step, then run again.')
        return
      }
      if ((nextX === 1 && nextY === 0) || (nextX === 2 && nextY === 2) || (nextX === 3 && nextY === 3) || (nextX === 4 && nextY === 4) || (nextX === 5 && nextY === 4) || (nextX === 5 && nextY === 5)) {
        setPosition({ x, y })
        setResult('The robot met an obstacle. Remove or change a step, then run again.')
        return
      }
      x = nextX; y = nextY
    }
    setPosition({ x, y })
    setResult(x === 6 && y === 6 ? '🎉 The robot reached the star! Your instructions worked.' : 'The robot stopped before the star. Change the instructions and run again.')
  }
  function reset() { setSteps([]); setPosition({ x: 0, y: 0 }); setResult('') }
  return (
    <div className="math-world-page">
      <Link className="grade-back-link" to="/grades/grade-6"><ArrowLeft size={17} /> Grade 6</Link>
      <header className="math-world-hero">
        <div><span className="grade-stage-pill"><Sparkles size={14} /> GRADE 6 CODING AND ROBOTICS</span><h1>Welcome to Robot World</h1><p>Plan precise algorithms, test decisions and robot systems, and use digital tools responsibly.</p></div>
        <div className="number-world-art" aria-hidden="true"><span>🤖</span><span>➡️</span><span>⭐</span><b>🤖</b></div>
      </header>
      <section className="robot-lab" aria-labelledby="grade-six-robot-title">
        <div><span className="grade-stage-pill">TRY A ROBOT PROGRAM</span><h2 id="grade-six-robot-title">Guide the robot to the star</h2><p>Add directions in order, then run your program. The robot starts at the top left. Avoid six rocks and reach the star at the bottom right. Use Repeat last three times to add three copies of one step.</p></div>
        <div className="robot-grid grade-six-robot-grid" aria-label={`Robot at column ${position.x + 1}, row ${position.y + 1}; star at column 7, row 7; rocks at column 2, row 1, column 3, row 3, column 4, row 4, column 5, row 5, column 6, row 5, and column 6, row 6`}>
          {Array.from({ length: 49 }, (_, index) => {
            const x = index % 7, y = Math.floor(index / 7)
            return <span key={index} className={position.x === x && position.y === y ? 'active' : ''}>{position.x === x && position.y === y ? '🤖' : x === 6 && y === 6 ? '⭐' : (x === 1 && y === 0) || (x === 2 && y === 2) || (x === 3 && y === 3) || (x === 4 && y === 4) || (x === 5 && y === 4) || (x === 5 && y === 5) ? '🪨' : '⬜'}</span>
          })}
        </div>
        <div className="robot-program" aria-live="polite"><strong>My program:</strong> {steps.length ? steps.map((step, index) => <span key={index}>{arrows[step]}</span>) : <span>Add a direction</span>}</div>
        <div className="robot-controls">
          {(['right', 'down', 'left', 'up'] as const).map(step => <button key={step} className="button secondary" disabled={steps.length >= 16} type="button" onClick={() => addStep(step)}>{arrows[step]} {step}</button>)}
          <button className="button secondary" disabled={!steps.length || steps.length > 13} type="button" onClick={() => { setSteps(previous => [...previous, previous[previous.length - 1], previous[previous.length - 1], previous[previous.length - 1]]); setPosition({ x: 0, y: 0 }); setResult('') }}>Repeat last three times</button>
          <button className="button secondary" disabled={!steps.length} type="button" onClick={() => { setSteps(previous => previous.slice(0, -1)); setPosition({ x: 0, y: 0 }); setResult('') }}>Remove last</button>
          <button className="button primary" disabled={!steps.length} type="button" onClick={run}>Run</button>
          <button className="button secondary" type="button" onClick={reset}>Start again</button>
        </div>
        {result && <p className="robot-result" role="status">{result}</p>}
      </section>

      <section className="math-topic-map" aria-labelledby="math-paths-title">
        <div className="math-map-heading"><span>LEARNING PATHS</span><h2 id="math-paths-title">Where should we explore?</h2></div>
        <div className="math-topic-grid">
          {gradeSixCodingPaths.map(topic => <Link className={`math-topic-card colour-${topic.colour}`} to={`/grades/grade-6/coding/practice/${topic.id}`} key={topic.id}><span className="math-topic-icon">{topic.emoji}</span><div><LearningAccessBadge access={topic.access}/><small>{topic.activities.length} ACTIVITIES</small><h3>{topic.title}</h3><p>{topic.description}</p></div><ArrowRight size={21} /></Link>)}
        </div>
      </section>
    </div>
  )
}
