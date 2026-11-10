import lessonRelease from '../data/fam-lesson-release.json'
import FractionLessonQuality from './FractionLessonQuality'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2 } from 'lucide-react'

const challenges = [
  { parts: 4, target: 1, label: 'one quarter', hint: 'A quarter means one of four equal pieces.' },
  { parts: 8, target: 3, label: 'three eighths', hint: 'The denominator is eight. Count three pieces for the numerator.' },
  { parts: 6, target: 3, label: 'one half', hint: 'Three of six equal pieces is half of the whole.' },
]
const teaching = [
  { title: 'Start with one whole', description: 'This pizza is one whole. A fraction describes a part of this whole.', parts: 1, selected: 1 },
  { title: 'Divide into equal parts', description: 'Watch the pizza become four equal slices. Equal-sized parts are essential.', parts: 4, selected: 0 },
  { title: 'Choose one quarter', description: 'One slice out of four equal slices is one quarter, written 1/4.', parts: 4, selected: 1 },
  { title: 'Build three quarters', description: 'Three slices out of four equal slices is three quarters, written 3/4.', parts: 4, selected: 3 },
]
function Pizza({parts, selected, chosen, onToggle}: {parts:number;selected:number;chosen?:number[];onToggle?:(index:number)=>void}) {
  return <svg className="fam-pizza" viewBox="0 0 300 300" role="group" aria-label={`${selected} of ${parts} equal pizza slices selected`}>
    {Array.from({length:parts},(_,i)=>{
      const start=-Math.PI/2+i*2*Math.PI/parts
      const end=-Math.PI/2+(i+1)*2*Math.PI/parts
      const point=(angle:number)=>`${150+126*Math.cos(angle)} ${150+126*Math.sin(angle)}`
      const active=chosen?chosen.includes(i):i<selected
      return <path key={`${parts}-${i}`} className="fam-animated-slice" role={onToggle?'button':undefined} tabIndex={onToggle?0:undefined} aria-label={`Slice ${i+1}, ${active?'selected':'not selected'}`} aria-pressed={onToggle?active:undefined} d={`M 150 150 L ${point(start)} A 126 126 0 ${parts===1?1:0} 1 ${point(end)} Z`} fill={active?'#ed9b37':'#ffe3a3'} stroke="#96551f" strokeWidth="3" onClick={()=>onToggle?.(i)} onKeyDown={event=>{if(onToggle&&(event.key==='Enter'||event.key===' ')){event.preventDefault();onToggle(i)}}}/>
    })}
    {parts===1&&<circle cx="150" cy="150" r="126" fill="#ed9b37" stroke="#96551f" strokeWidth="3"/>}
    <circle cx="150" cy="150" r="8" fill="#b4532d" pointerEvents="none"/>
  </svg>
}
type LabMode = 'build' | 'compare' | 'line'
function FractionLab(){
  const [mode,setMode]=useState<LabMode>('build')
  const [parts,setParts]=useState(4)
  const [picked,setPicked]=useState(2)
  const [otherParts,setOtherParts]=useState(8)
  const [otherPicked,setOtherPicked]=useState(4)
  const [lineGuess,setLineGuess]=useState<number|null>(null)
  const [lineQuestion,setLineQuestion]=useState(0)
  const targets=[{n:1,d:4},{n:3,d:4},{n:2,d:3},{n:5,d:6}]
  const target=targets[lineQuestion%targets.length]
  const same=picked*otherParts===otherPicked*parts
  const ratio=picked/parts
  return <section className="fam-interactive-panel fam-lab" aria-labelledby="fam-lab-title">
    <div className="fam-step">Batch 3 · Explore, compare and experiment</div>
    <h2 id="fam-lab-title">Fraction discovery laboratory 🔬</h2>
    <p>Try different ideas. Nothing breaks when you experiment — change the numbers and see what happens.</p>
    <div className="fam-lab-tabs" role="group" aria-label="Choose a fraction activity">
      <button className={mode==='build'?'active':''} aria-pressed={mode==='build'} onClick={()=>setMode('build')}>Build fractions</button>
      <button className={mode==='compare'?'active':''} aria-pressed={mode==='compare'} onClick={()=>setMode('compare')}>Equivalent fractions</button>
      <button className={mode==='line'?'active':''} aria-pressed={mode==='line'} onClick={()=>setMode('line')}>Number line</button>
    </div>
    {mode!=='line'?<>
      <div className="fam-lab-controls">
        <label>Equal pieces <select value={parts} onChange={e=>{const n=Number(e.target.value);setParts(n);setPicked(v=>Math.min(v,n))}}>{[2,3,4,5,6,8,10,12].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
        <label>Shaded pieces <input type="range" min="0" max={parts} value={picked} onChange={e=>setPicked(Number(e.target.value))}/><strong>{picked}</strong></label>
      </div>
      <div className="fam-strip" role="img" aria-label={`${picked} of ${parts} parts shaded`}>{Array.from({length:parts},(_,i)=><span key={i} className={i<picked?'filled':''}/>)}</div>
      <div className="fam-lab-equation"><strong>{picked}/{parts}</strong><span>{Math.round(ratio*100)}% of one whole</span></div>
      {mode==='compare'&&<>
        <div className="fam-lab-controls">
          <label>Second strip pieces <select value={otherParts} onChange={e=>{const n=Number(e.target.value);setOtherParts(n);setOtherPicked(v=>Math.min(v,n))}}>{[2,3,4,5,6,8,10,12].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
          <label>Second shaded pieces <input type="range" min="0" max={otherParts} value={otherPicked} onChange={e=>setOtherPicked(Number(e.target.value))}/><strong>{otherPicked}</strong></label>
        </div>
        <div className="fam-strip" role="img" aria-label={`${otherPicked} of ${otherParts} parts shaded`}>{Array.from({length:otherParts},(_,i)=><span key={i} className={i<otherPicked?'filled':''}/>)}</div>
        <div className={`fam-feedback ${same?'fam-success':''}`} role="status">{same?`Yes! ${picked}/${parts} and ${otherPicked}/${otherParts} cover the same amount.`:`${picked}/${parts} and ${otherPicked}/${otherParts} are different amounts. Move the sliders to make the shaded lengths match.`}</div>
      </>}
      {mode==='build'&&<p className="fam-note">Discovery: the bottom number tells how many equal parts make a whole. The top number tells how many are shaded. Try changing the number of pieces while keeping half shaded.</p>}
    </>:<>
      <h3>Where does {target.n}/{target.d} belong between 0 and 1?</h3>
      <p>Select the position you think is correct. Each marker represents one {target.d===4?'quarter':target.d===3?'third':'sixth'}.</p>
      <div className="fam-number-line" role="group" aria-label="Number line answer choices">
        {Array.from({length:target.d+1},(_,i)=><button key={i} aria-label={`${i} out of ${target.d}`} aria-pressed={lineGuess===i} className={lineGuess===i?'selected':''} onClick={()=>setLineGuess(i)}><span className="fam-line-dot"/><span>{i===0?'0':i===target.d?'1':`${i}/${target.d}`}</span></button>)}
      </div>
      {lineGuess!==null&&<div className={`fam-feedback ${lineGuess===target.n?'fam-success':''}`} role="status">{lineGuess===target.n?`Correct! ${target.n}/${target.d} is ${target.n} step(s) from zero.`:`Not quite. Divide the line into ${target.d} equal spaces and count ${target.n} from zero.`}</div>}
      <button className="fam-next" onClick={()=>{setLineQuestion(v=>v+1);setLineGuess(null)}}>Try another fraction <ArrowRight size={17}/></button>
    </>}
  </section>
}
type Skill = 'parts' | 'equivalent' | 'compare'
type AdaptiveQuestion = { id:string; skill:Skill; level:1|2|3; prompt:string; choices:string[]; answer:number; explanation:string; wrong:Record<number,string> }
const adaptiveQuestions:AdaptiveQuestion[] = [
 {id:'p1',skill:'parts',level:1,prompt:'A pizza has 8 equal slices. You eat 3. What fraction did you eat?',choices:['8/3','3/8','3/5'],answer:1,explanation:'Three slices out of eight equal slices means 3/8.',wrong:{0:'The denominator tells us all the equal pieces, not the pieces eaten.',2:'Five is the number left over, but the whole pizza has eight slices.'}},
 {id:'p2',skill:'parts',level:1,prompt:'In the fraction 2/6, what does 6 tell us?',choices:['Six equal pieces in the whole','Six pieces selected','Two wholes'],answer:0,explanation:'The denominator 6 counts all six equal parts of one whole.',wrong:{1:'The numerator 2 counts the selected pieces.',2:'The denominator counts equal pieces, not the number of wholes.'}},
 {id:'p3',skill:'parts',level:2,prompt:'Four of ten equal blocks are shaded. Which fraction matches?',choices:['10/4','4/6','4/10'],answer:2,explanation:'Four shaded blocks out of ten equal blocks is 4/10.',wrong:{0:'Remember: shaded count goes on top.',1:'Six blocks are unshaded, but ten blocks form the whole.'}},
 {id:'p4',skill:'parts',level:3,prompt:'Which fraction describes the unshaded part if 3/8 is shaded?',choices:['5/8','3/5','8/5'],answer:0,explanation:'Eight equal pieces minus three shaded pieces leaves five unshaded: 5/8.',wrong:{1:'The whole still has eight equal pieces.',2:'Five unshaded parts is the numerator, not the denominator.'}},
 {id:'e1',skill:'equivalent',level:1,prompt:'Which fraction shows the same amount as 1/2?',choices:['1/3','2/4','2/3'],answer:1,explanation:'Two out of four equal pieces cover half the whole.',wrong:{0:'One third is smaller than one half.',2:'Two thirds is greater than one half.'}},
 {id:'e2',skill:'equivalent',level:2,prompt:'Fill in the missing number: 2/3 = ?/6',choices:['3','4','5'],answer:1,explanation:'Multiply both the numerator and denominator by two: 2/3 = 4/6.',wrong:{0:'When the denominator doubles, the numerator must double too.',2:'Try making two thirds using six equal pieces.'}},
 {id:'e3',skill:'equivalent',level:3,prompt:'Which pair is equivalent?',choices:['3/4 and 6/8','2/3 and 3/5','1/2 and 3/5'],answer:0,explanation:'Multiplying both parts of 3/4 by two gives 6/8.',wrong:{1:'Cross-multiply: 2×5 is not equal to 3×3.',2:'Half is 5/10, while 3/5 is 6/10.'}},
 {id:'c1',skill:'compare',level:1,prompt:'Which is larger?',choices:['1/4','1/2','They are equal'],answer:1,explanation:'One half is larger than one quarter of the same whole.',wrong:{0:'Dividing a whole into more equal pieces makes each piece smaller.',2:'One half covers more of the same whole than one quarter.'}},
 {id:'c2',skill:'compare',level:2,prompt:'Which fraction is closer to one whole?',choices:['3/8','7/8','1/8'],answer:1,explanation:'7/8 is just one eighth away from a whole.',wrong:{0:'Three eighths leaves five eighths missing.',2:'One eighth leaves seven eighths missing.'}},
 {id:'c3',skill:'compare',level:3,prompt:'Which is greater?',choices:['3/4','5/8','They are equal'],answer:0,explanation:'3/4 = 6/8, and 6/8 is greater than 5/8.',wrong:{1:'Convert quarters to eighths: 3/4 = 6/8.',2:'Six eighths and five eighths are not equal.'}},
]
type SkillProgress = {correct:number; attempts:number; streak:number; level:1|2|3; mastered:boolean; nextReview:string|null}
type AdaptiveProgress = Record<Skill,SkillProgress>
const skillNames:Record<Skill,string> = {parts:'Fraction parts',equivalent:'Equivalent fractions',compare:'Compare fractions'}
const blankSkill=():SkillProgress=>({correct:0,attempts:0,streak:0,level:1,mastered:false,nextReview:null})
const blankProgress=():AdaptiveProgress=>({parts:blankSkill(),equivalent:blankSkill(),compare:blankSkill()})
const progressKey='fam-interactive-fractions-adaptive-v1'
function loadAdaptiveProgress():AdaptiveProgress {
 try { const raw=localStorage.getItem(progressKey);if(!raw)return blankProgress();const value=JSON.parse(raw) as Partial<AdaptiveProgress>;const empty=blankProgress();for(const skill of Object.keys(empty) as Skill[]){const v=value[skill];if(v&&typeof v.correct==='number'&&typeof v.attempts==='number'&&typeof v.streak==='number'&&[1,2,3].includes(v.level))empty[skill]={...empty[skill],...v,mastered:Boolean(v.mastered)}}return empty }catch{return blankProgress()}
}
function AdaptiveLearning(){
 const [progress,setProgress]=useState<AdaptiveProgress>(loadAdaptiveProgress)
 const [skill,setSkill]=useState<Skill>('parts')
 const [questionId,setQuestionId]=useState('p1')
 const [answer,setAnswer]=useState<number|null>(null)
 const [submitted,setSubmitted]=useState(false)
 const [sessionAnswers,setSessionAnswers]=useState<Record<string,number>>({})
 const [sessionMistakes,setSessionMistakes]=useState<Skill[]>([])
 const current=adaptiveQuestions.find(q=>q.id===questionId) || adaptiveQuestions[0]
 const state=progress[skill]
 const totalMastered=(Object.keys(progress) as Skill[]).filter(s=>progress[s].mastered).length
 useEffect(()=>{try{localStorage.setItem(progressKey,JSON.stringify(progress))}catch{/* Private browsing or storage disabled */}},[progress])
 function chooseQuestion(targetSkill:Skill, level:1|2|3, history:Record<string,number>){
   const questions=adaptiveQuestions.filter(q=>q.skill===targetSkill&&q.level<=level)
   return (questions.find(q=>!history[q.id])||questions.sort((a,b)=>(history[a.id]||0)-(history[b.id]||0))[0]||adaptiveQuestions[0]).id
 }
 function switchSkill(next:Skill){setSkill(next);setQuestionId(chooseQuestion(next,progress[next].level,sessionAnswers));setAnswer(null);setSubmitted(false)}
 function submit(){
   if(answer===null||submitted)return
   const success=answer===current.answer
   setSubmitted(true)
   setSessionAnswers(old=>({...old,[current.id]:(old[current.id]||0)+1}))
   if(!success)setSessionMistakes(old=>[...old,current.skill])
   setProgress(old=>{
     const prev=old[current.skill],streak=success?prev.streak+1:0
     const level:1|2|3=success&&streak>=2?Math.min(3,prev.level+1) as 1|2|3:success?prev.level:Math.max(1,prev.level-1) as 1|2|3
     const mastered=prev.mastered||(success&&prev.level===3&&streak>=3)
     const nextReview=mastered?new Date(Date.now()+3*24*60*60*1000).toISOString():null
     return {...old,[current.skill]:{correct:prev.correct+(success?1:0),attempts:prev.attempts+1,streak,level,mastered,nextReview}}
   })
 }
 function next(){setQuestionId(chooseQuestion(skill,progress[skill].level,sessionAnswers));setAnswer(null);setSubmitted(false)}
 function reset(){if(!window.confirm('Reset adaptive fraction progress on this device?'))return;setProgress(blankProgress());setSessionAnswers({});setSessionMistakes([]);setSkill('parts');setQuestionId('p1');setAnswer(null);setSubmitted(false)}
 const due=(Object.keys(progress) as Skill[]).filter(s=>progress[s].nextReview&&Date.parse(progress[s].nextReview!)<=Date.now())
 return <section className="fam-interactive-panel fam-adaptive" aria-labelledby="fam-adaptive-title">
   <div className="fam-step">Batch 4 · Practice that responds to you</div>
   <h2 id="fam-adaptive-title">Your adaptive learning journey 🧠</h2>
   <p>Answer questions, receive specific explanations, and build mastery one concept at a time. Questions get harder after successful answers and easier when you need more practice.</p>
   <div className="fam-adaptive-summary"><strong>{totalMastered}/3 concepts mastered</strong><span>{Object.values(progress).reduce((n,p)=>n+p.correct,0)} correct answers across {Object.values(progress).reduce((n,p)=>n+p.attempts,0)} attempts</span></div>
   <div className="fam-lab-tabs" role="group" aria-label="Choose adaptive practice skill">{(Object.keys(skillNames) as Skill[]).map(s=><button key={s} className={skill===s?'active':''} aria-pressed={skill===s} onClick={()=>switchSkill(s)}>{skillNames[s]} {progress[s].mastered?'✓':''}</button>)}</div>
   <div className="fam-adaptive-status"><span>Level {state.level} of 3</span><span>Correct streak: {state.streak}</span><span>{state.mastered?'Mastered ✓':'Learning in progress'}</span></div>
   {due.includes(skill)&&<p className="fam-feedback">Revision time! Revisit this concept to keep it fresh.</p>}
   <h3>{current.prompt}</h3>
   <div className="fam-adaptive-choices" role="group" aria-label="Answer choices">{current.choices.map((choice,i)=><button key={choice} disabled={submitted} aria-pressed={answer===i} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{choice}</button>)}</div>
   {!submitted?<button className="fam-next" disabled={answer===null} onClick={submit}>Check and learn <ArrowRight size={17}/></button>:<div className={`fam-feedback ${answer===current.answer?'fam-success':''}`} role="status"><strong>{answer===current.answer?'Well done!':'Let’s work through that.'}</strong><p>{answer===current.answer?current.explanation:(current.wrong[answer!]||current.explanation)}</p>{answer!==current.answer&&<p><strong>Worked explanation:</strong> {current.explanation} Try the next question to practise this concept again.</p>}<button className="fam-next" onClick={next}>Continue learning <ArrowRight size={17}/></button></div>}
   {sessionMistakes.length>0&&<p className="fam-note">Suggested focus: {skillNames[sessionMistakes[sessionMistakes.length-1]]}. Revisit the fraction laboratory above to explore it visually.</p>}
   <p className="fam-note">Progress is stored only in this browser on this device, not synced to a learner account. Mastery is an initial rule-based estimate, not a validated assessment. Review prompts appear when you return to this page.</p>
   <button className="fam-adaptive-reset" onClick={reset}>Reset my practice progress</button>
 </section>
}
type JourneyState = { completed: string[]; celebrations: number; lastVisit: string }
const journeyKey = 'fam-interactive-fractions-journey-v1'
const journeySteps = [
 {id:'watch',title:'See fractions in action',detail:'Explore the animated teaching demonstration.',anchor:'fam-teaching-title'},
 {id:'try',title:'Build a fraction pizza',detail:'Complete a hands-on pizza discovery.',anchor:'fam-challenge-title'},
 {id:'explore',title:'Visit the discovery lab',detail:'Try a visual experiment with fraction strips or number lines.',anchor:'fam-lab-title'},
 {id:'practice',title:'Grow your fraction skills',detail:'Answer adaptive practice questions and learn from feedback.',anchor:'fam-adaptive-title'},
]
function readJourney():JourneyState {
 try { const v=JSON.parse(localStorage.getItem(journeyKey)||'{}');return {completed:Array.isArray(v.completed)?v.completed.filter((x:unknown)=>typeof x==='string'):[],celebrations:Number.isFinite(v.celebrations)?v.celebrations:0,lastVisit:typeof v.lastVisit==='string'?v.lastVisit:''} }catch{return {completed:[],celebrations:0,lastVisit:''}}
}
function LearnerJourney({journey,onNavigate}:{journey:JourneyState;onNavigate:(id:string)=>void}){
 const count=journeySteps.filter(x=>journey.completed.includes(x.id)).length
 const next=journeySteps.find(x=>!journey.completed.includes(x.id))
 return <section className="fam-interactive-panel fam-journey" aria-labelledby="fam-journey-title">
  <div className="fam-step">Batch 5 · Your learning adventure</div>
  <h2 id="fam-journey-title">Your fractions journey 🌟</h2>
  <p>Learn at your own pace. Explore each activity, celebrate small wins, and return whenever you like.</p>
  <div className="fam-journey-score"><strong>{count} of {journeySteps.length} adventures completed</strong><span>{count===journeySteps.length?'All adventures explored! 🎉':`Next: ${next?.title}`}</span></div>
  <div className="fam-journey-meter" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={journeySteps.length} aria-label="Learning journey completion"><span style={{width:`${count/journeySteps.length*100}%`}}/></div>
  <div className="fam-journey-grid">{journeySteps.map((item,i)=><div className="fam-journey-card" key={item.id}><div className="fam-journey-symbol" aria-hidden="true">{journey.completed.includes(item.id)?'⭐':['🎬','🍕','🔬','🧠'][i]}</div><div><strong>{item.title}</strong><p>{item.detail}</p><small>{journey.completed.includes(item.id)?'Explored ✓':'Ready to explore'}</small></div><button onClick={()=>onNavigate(item.anchor)}>{journey.completed.includes(item.id)?'Revisit':'Explore'}</button></div>)}</div>
  {count===journeySteps.length&&<div className="fam-journey-celebration" role="status"><strong>🎊 Fraction explorer!</strong><p>You have explored all four activities. Keep practising to strengthen your understanding.</p></div>}
  <p className="fam-note">Journey stars reward participation, not mathematical mastery. Practice mastery is measured separately. Journey progress is saved in this browser only.</p>
 </section>
}
export default function InteractiveFractionsPage(){
  const videoRef=useRef<HTMLVideoElement>(null)
  const [videoCheckpoint,setVideoCheckpoint]=useState<number|null>(null)
  const [answeredCheckpoints,setAnsweredCheckpoints]=useState<number[]>([])
  const [checkpointChoice,setCheckpointChoice]=useState<number|null>(null)
  const videoQuestions=[
    {at:16,prompt:'What must be true about the pieces of a fraction?',options:['They must be equal in size','They can be any size'],answer:0,explanation:'Fractions describe equal parts of one whole.'},
    {at:34,prompt:'What does the top number in 3/4 tell us?',options:['There are four equal parts','Three parts are selected'],answer:1,explanation:'The numerator counts selected parts; the denominator counts all equal parts.'}
  ]
  function videoTimeUpdate(){
    const t=videoRef.current?.currentTime??0
    const index=videoQuestions.findIndex((q,i)=>t>=q.at&&t<q.at+3&&!answeredCheckpoints.includes(i))
    if(index>=0&&videoCheckpoint===null){videoRef.current?.pause();setVideoCheckpoint(index);setCheckpointChoice(null)}
  }
  function resumeVideo(){
    if(videoCheckpoint===null)return
    setAnsweredCheckpoints(old=>old.includes(videoCheckpoint)?old:[...old,videoCheckpoint])
    setVideoCheckpoint(null);setCheckpointChoice(null)
    void videoRef.current?.play().catch(()=>{})
  }

  const [journey,setJourney]=useState<JourneyState>(readJourney)
  function markJourney(id:string){setJourney(old=>old.completed.includes(id)?old:{...old,completed:[...old.completed,id],lastVisit:new Date().toISOString()})}
  useEffect(()=>{try{localStorage.setItem(journeyKey,JSON.stringify(journey))}catch{/* Storage may be disabled */}},[journey])
  function jumpTo(id:string){document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
  const [step,setStep]=useState(0)
  const [playing,setPlaying]=useState(false)
  const [stage,setStage]=useState(0)
  const [chosen,setChosen]=useState<number[]>([])
  const [checked,setChecked]=useState(false)
  const [attempts,setAttempts]=useState(0)
  const lesson=teaching[step]
  const challenge=challenges[stage]
  const correct=chosen.length===challenge.target
  useEffect(()=>{if(!playing)return;const id=window.setInterval(()=>setStep(old=>{if(old===teaching.length-1){setPlaying(false);return old}return old+1}),4500);return()=>window.clearInterval(id)},[playing])
  function speak(){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(`${lesson.title}. ${lesson.description}`);utterance.lang='en-ZA';utterance.rate=.9;window.speechSynthesis.speak(utterance)}
  function advance(){markJourney('try');setStage(old=>(old+1)%challenges.length);setChosen([]);setChecked(false);setAttempts(0)}
  function toggle(i:number){setChosen(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i]);setChecked(false)}
  if(import.meta.env.PROD && !lessonRelease.publicReleaseApproved){
    return <main className="fam-interactive"><section className="fam-interactive-panel" role="status"><h1>Lesson currently under quality review</h1><p>This interactive lesson has not passed the FAM AI-first publishing quality gate. It is available for local pilot testing only.</p><Link to="/interactive-learning">Return to interactive learning</Link></section></main>
  }
  return <main className="fam-interactive">
    <section className="fam-interactive-panel" aria-label="Guided fractions video">
      <div className="fam-step">Batch 12 · Narrated animated lesson</div>
      <h2>Fractions: Watch, predict, and explore</h2>
      <p>Watch the 45-second narrated lesson. It pauses twice to check your understanding. You can replay or turn captions on.</p>
      <video ref={videoRef} controls playsInline preload="metadata" onTimeUpdate={videoTimeUpdate} onSeeked={videoTimeUpdate} onEnded={()=>markJourney('watch')} style={{width:"100%",maxWidth:780,borderRadius:12,background:"#142c45"}} aria-label="Narrated fractions lesson">
        <source src="/learning-videos/grade4-fractions-guided.mp4" type="video/mp4"/>
        <track kind="captions" src="/learning-videos/grade4-fractions-guided.vtt" srcLang="en" label="English captions" default/>
        Your browser does not support video playback.
      </video>
      {videoCheckpoint!==null&&<div className="fam-feedback" role="group" aria-label="Video learning checkpoint">
        <h3>Pause and predict</h3><p>{videoQuestions[videoCheckpoint].prompt}</p>
        <div className="fam-interactive-actions">{videoQuestions[videoCheckpoint].options.map((option,i)=><button key={i} className={checkpointChoice===i?'':'fam-quiet'} onClick={()=>setCheckpointChoice(i)} aria-pressed={checkpointChoice===i}>{option}</button>)}</div>
        {checkpointChoice!==null&&<p role="status">{checkpointChoice===videoQuestions[videoCheckpoint].answer?'Correct! ':'Try again. '}{videoQuestions[videoCheckpoint].explanation}</p>}
        <button disabled={checkpointChoice!==videoQuestions[videoCheckpoint].answer} onClick={resumeVideo}>Continue video <ArrowRight size={16}/></button>
      </div>}
      <details><summary>Read the lesson transcript</summary><ol><li>A fraction describes equal parts of one whole.</li><li>When we divide a pizza into four equal slices, each slice is one quarter.</li><li>The bottom number tells us how many equal parts make the whole.</li><li>The top number tells us how many parts we choose. Three slices are three quarters.</li><li>Now explore the pizza yourself, and see if you can show a fraction.</li></ol></details>
      <p className="fam-note">Mastery is measured in the adaptive practice section below, not by watching the video alone. Narration uses a synthetic English voice.</p>
    </section>
    <Link to="/grades/grade-4/mathematics" className="grade-back-link"><ArrowLeft size={18}/> Back to Mathematics</Link>
    <header className="fam-interactive-hero"><span>FAM INTERACTIVE LEARNING · GRADE 4</span><h1>Fractions you can explore 🍕</h1><p>Watch a visual demonstration, control the steps, then try it yourself. Learn by doing!</p></header>
    <LearnerJourney journey={journey} onNavigate={jumpTo}/>
    <section className="fam-interactive-panel" aria-labelledby="fam-teaching-title">
      <div className="fam-step">Animated teaching · Step {step+1} of {teaching.length}</div>
      <h2 id="fam-teaching-title">{lesson.title}</h2><p aria-live="polite">{lesson.description}</p>
      <div className="fam-pizza-wrap fam-demo-stage"><Pizza parts={lesson.parts} selected={lesson.selected}/></div>
      <div className="fam-fraction-readout"><strong>{lesson.selected}/{lesson.parts}</strong><span>Selected equal parts</span></div>
      <div className="fam-demo-progress" aria-label="Teaching steps">{teaching.map((_,i)=><button key={i} aria-label={`Show teaching step ${i+1}`} aria-current={i===step?'step':undefined} className={i===step?'active':''} onClick={()=>{setPlaying(false);setStep(i)}}/>)}</div>
      <div className="fam-interactive-actions">
        <button onClick={()=>{markJourney('watch');if(step===teaching.length-1){setStep(0);setPlaying(true)}else setPlaying(old=>!old)}}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'Pause animation':step===teaching.length-1?'Replay animation':'Play animation'}</button>
        <button className="fam-quiet" onClick={()=>{setPlaying(false);setStep(old=>{if(old>=teaching.length-2)markJourney('watch');return Math.min(old+1,teaching.length-1)})}}>Next step <ArrowRight size={16}/></button>
        <button className="fam-quiet" onClick={speak}><Volume2 size={16}/> Read aloud</button>
      </div>
      <p className="fam-note">Lightweight in-app animation. Read aloud uses your device's available speech voice; no video download or external service is required.</p>
    </section>
    <section className="fam-interactive-panel" aria-labelledby="fam-challenge-title">
      <div className="fam-step">Your turn · Discovery {stage+1} of {challenges.length}</div>
      <h2 id="fam-challenge-title">Can you show {challenge.label}?</h2>
      <p>Tap exactly {challenge.target} of {challenge.parts} equal pizza slices.</p>
      <div className="fam-pizza-wrap"><Pizza parts={challenge.parts} selected={chosen.length} chosen={chosen} onToggle={toggle}/></div>
      <div className="fam-fraction-readout"><strong>{chosen.length}/{challenge.parts}</strong><span>{chosen.length} selected out of {challenge.parts}</span></div>
      <div className="fam-interactive-actions"><button onClick={()=>{setChecked(true);if(!correct)setAttempts(old=>old+1)}}>Check my answer</button><button className="fam-quiet" onClick={()=>{setChosen([]);setChecked(false)}}><RotateCcw size={16}/> Reset</button></div>
      {checked&&<div className={`fam-feedback ${correct?'fam-success':''}`} role="status">{correct?`Great work! ${chosen.length}/${challenge.parts} shows ${challenge.label}. ${stage===2?'You completed all three discoveries!':''}`:chosen.length>challenge.target?`You selected too many slices. ${challenge.hint} Remove ${chosen.length-challenge.target} slice(s).`:`You need ${challenge.target-chosen.length} more slice(s). ${challenge.hint}`}{!correct&&attempts>=2&&<p>Helpful tip: the top number counts the selected slices. The bottom number counts all equal slices.</p>}</div>}
      {checked&&correct&&<button className="fam-next" onClick={advance}>{stage===challenges.length-1?'Play again':'Next discovery'} <ArrowRight size={17}/></button>}
    </section>
    <div onPointerDown={()=>markJourney('explore')} onKeyDown={()=>markJourney('explore')}><FractionLab/></div>
    <div onPointerDown={()=>markJourney('practice')} onKeyDown={()=>markJourney('practice')}><AdaptiveLearning/></div>
    <FractionLessonQuality/>
    <section className="fam-interactive-panel fam-explain"><h2>Remember the fraction rule</h2><p><strong>Numerator (top):</strong> how many parts are selected. <strong>Denominator (bottom):</strong> how many equal parts make the whole.</p><p className="fam-note">Batch 4 introduces rule-based adaptive practice and local mastery estimates. Account-synced progress and validated adaptive assessment are not yet implemented. This pilot must pass educator and accessibility review before publication.</p></section>
  </main>
}
