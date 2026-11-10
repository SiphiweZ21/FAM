import { speakLearningText } from '../lib/learning-voice'
import { ArrowLeft, BookOpen, Calculator, CheckCircle2, Lightbulb, RotateCcw, ShieldCheck, Volume2 } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyseLanguageHomework, analyseMathsHomework, type HomeworkAnalysis } from '../lib/homework-helper'
import { recordGradeOneHomework, setLastGradeOneActivity } from '../lib/grade-one-progress'

type Subject = 'maths' | 'language'

const examples = {
  maths: ['Lebo has 4 apples and gets 2 more. How many altogether?', 'There are 7 sweets. Thandi gives away 3. How many are left?', '5 + 3'],
  language: ['Spell the word cat.', 'Which letter starts sun?', 'Build the word dog.']
}

export default function GradeOneHomeworkPage() {
  const [subject, setSubject] = useState<Subject>('maths')
  const [question, setQuestion] = useState('')
  const [analysis, setAnalysis] = useState<HomeworkAnalysis | null>(null)
  const [unsupported, setUnsupported] = useState(false)
  const [hintCount, setHintCount] = useState(0)
  const [learnerAnswer, setLearnerAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [attemptRecorded, setAttemptRecorded] = useState(false)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])
  useEffect(() => { setLastGradeOneActivity('Homework Helper', '/grades/grade-1/homework', 'homework') }, [])
  const visibleHints = useMemo(() => analysis?.hints.slice(0, hintCount) ?? [], [analysis, hintCount])
  const correct = analysis ? learnerAnswer.trim().toUpperCase() === analysis.answer.toUpperCase() : false

  function speak(text: string) { speakLearningText(text) }

  function clearResult() { setAnalysis(null); setUnsupported(false); setHintCount(0); setLearnerAnswer(''); setChecked(false); setAttemptRecorded(false) }
  function changeSubject(value: Subject) { setSubject(value); setQuestion(''); clearResult() }

  function analyse(event: FormEvent) {
    event.preventDefault()
    const result = subject === 'maths' ? analyseMathsHomework(question) : analyseLanguageHomework(question)
    setAnalysis(result)
    setUnsupported(!result)
    setHintCount(result ? 1 : 0)
    setLearnerAnswer('')
    setChecked(false)
    if (result) speak(`I found a ${result.kind === 'maths' ? result.operation : result.task} question. ${result.hints[0]}`)
  }

  function startAgain() { setQuestion(''); clearResult() }
  function checkAnswer() { setChecked(true); if (!attemptRecorded) { recordGradeOneHomework(correct); setAttemptRecorded(true) }; speak(correct ? 'Excellent! Your answer is correct.' : 'Not yet. Use another hint and try again.') }

  return <div className="homework-helper-page">
    <Link className="grade-back-link" to="/grades/grade-1"><ArrowLeft size={17} /> Grade 1</Link>
    <header className="homework-hero"><div><span className="grade-stage-pill"><Lightbulb size={14} /> FAM HOMEWORK HELPER</span><h1>Let&apos;s work it out together</h1><p>FAM gives you hints and pictures. You still do the thinking.</p></div><div className="homework-robot" aria-hidden="true">🤖<span>Ask me!</span></div></header>

    <section className="homework-workspace">
      <div className="homework-subject-tabs" role="tablist" aria-label="Homework subject"><button className={subject === 'maths' ? 'active' : ''} onClick={() => changeSubject('maths')} type="button"><Calculator size={20} /> Mathematics</button><button className={subject === 'language' ? 'active' : ''} onClick={() => changeSubject('language')} type="button"><BookOpen size={20} /> Language</button></div>
      <form className="homework-question-form" onSubmit={analyse}><label htmlFor="homework-question">Type or paste your homework question</label><textarea id="homework-question" value={question} onChange={event => { setQuestion(event.target.value); clearResult() }} placeholder={subject === 'maths' ? 'Example: I have 4 apples and get 2 more...' : 'Example: Spell the word cat...'} rows={4} /><div className="homework-form-footer"><span><ShieldCheck size={16} /> Your question stays in this browser.</span><button className="button primary" disabled={!question.trim()} type="submit">Help me understand</button></div></form>
      <div className="homework-examples"><span>TRY AN EXAMPLE</span><div>{examples[subject].map(example => <button onClick={() => { setQuestion(example); clearResult() }} type="button" key={example}>{example}</button>)}</div></div>
    </section>

    {unsupported && <section className="homework-review-needed"><span>🧑‍🏫</span><div><h2>I need an adult or teacher to check this one</h2><p>This prototype currently understands simple addition, subtraction, spelling and first-letter questions. FAM will not guess when it is unsure.</p></div><button className="math-reset" onClick={startAgain} type="button"><RotateCcw size={17} /> Try another question</button></section>}

    {analysis && <section className="homework-guidance">
      <header><div><span>FAM FOUND</span><h2>{analysis.kind === 'maths' ? `${analysis.operation === 'addition' ? 'Addition' : 'Subtraction'} question` : analysis.task === 'spell' ? 'Spelling question' : 'First-letter question'}</h2></div><button className="math-reset" onClick={() => speak(question)} type="button"><Volume2 size={17} /> Read question</button></header>
      {analysis.kind === 'maths' ? <div className="homework-maths-visual"><div className="homework-object-group"><span>Start with {analysis.first}</span><div>{Array.from({ length: analysis.first }, (_, i) => <b key={i}>{analysis.objectEmoji}</b>)}</div></div><strong>{analysis.symbol}</strong><div className="homework-object-group"><span>{analysis.operation === 'addition' ? 'Add' : 'Take away'} {analysis.second}</span><div>{Array.from({ length: analysis.second }, (_, i) => <b key={i}>{analysis.objectEmoji}</b>)}</div></div><em>= ?</em></div> : <div className="homework-language-visual"><span>{analysis.visual}</span><div><small>{analysis.task === 'spell' ? 'BUILD THE WORD' : 'LISTEN TO THE FIRST SOUND'}</small><strong>{analysis.word}</strong></div></div>}
      <div className="homework-hints"><h3><Lightbulb size={18} /> Your hints</h3>{visibleHints.map((hint, index) => <p key={hint}><span>{index + 1}</span>{hint}</p>)}{hintCount < analysis.hints.length && <button onClick={() => setHintCount(value => value + 1)} type="button">Give me another hint</button>}</div>
      <div className="homework-answer-check"><label htmlFor="learner-answer">Now enter your answer</label><div><input id="learner-answer" value={learnerAnswer} onChange={event => { setLearnerAnswer(event.target.value); setChecked(false) }} placeholder={analysis.kind === 'maths' ? 'Type a number' : 'Type a letter or word'} inputMode={analysis.kind === 'maths' ? 'numeric' : 'text'} /><button className="button primary" disabled={!learnerAnswer.trim()} onClick={checkAnswer} type="button">Check my answer</button></div>{checked && <div className={correct ? 'homework-result correct' : 'homework-result retry'}><span>{correct ? '🎉' : '💡'}</span><div><strong>{correct ? 'Excellent work!' : 'Keep trying'}</strong><p>{correct ? `Yes, the answer is ${analysis.answer}.` : 'That is not the answer yet. Read the hints and try once more.'}</p></div>{correct && <CheckCircle2 size={26} />}</div>}</div>
    </section>}
  </div>
}
