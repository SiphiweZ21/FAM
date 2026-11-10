import {useEffect,useState} from 'react'
import './TeachingGuide.css'

type Props={grade:number;subject:string;title:string;steps:string[];lessonId:string}
export default function TeachingGuide({grade,subject,title,steps,lessonId}:Props){
 const [step,setStep]=useState(0)
 const [playing,setPlaying]=useState(false)
 const [voice,setVoice]=useState(false)
 const [speed,setSpeed]=useState(1)
 const junior=grade<=3
 useEffect(()=>{setStep(0);setPlaying(false);setVoice(false);if(typeof window!=='undefined'&&'speechSynthesis'in window)window.speechSynthesis.cancel()},[lessonId])
 useEffect(()=>{if(!playing)return;const timer=window.setInterval(()=>setStep(s=>{if(s>=steps.length-1){setPlaying(false);return s}return s+1}),Math.round(4300/speed));return()=>window.clearInterval(timer)},[playing,steps.length,speed])
 useEffect(()=>{if(!voice||typeof window==='undefined'||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(steps[step]);utterance.rate=junior?.82:.95;utterance.lang='en-ZA';window.speechSynthesis.speak(utterance);return()=>window.speechSynthesis.cancel()},[step,voice,steps,junior])
 const stop=()=>{setPlaying(false);if('speechSynthesis'in window)window.speechSynthesis.cancel()}
 return <section className={`fam-guide ${junior?'fam-guide-junior':'fam-guide-senior'}`} aria-label="Animated teaching guide">
  <div className="fam-guide-header"><div className="fam-guide-avatar" aria-hidden="true">{junior?'🦊':'🦉'}</div><div><small>FAM Learning Guide · {junior?'Little explorers':'Curious thinkers'}</small><h2>Let's discover {title.toLowerCase()}!</h2><p>{junior?'Watch, imagine and try it yourself.':'Observe the example, then test your understanding.'}</p></div></div>
  <div className="fam-guide-screen"><div className="fam-guide-scene" key={`${lessonId}-${step}`}><div className="fam-guide-symbol" aria-hidden="true">{subject==='Mathematics'?['🔢','🧩','💡','✨'][step%4]:['📖','💬','🔎','✨'][step%4]}</div><div className="fam-guide-caption"><small>Scene {step+1} / {steps.length}</small><p aria-live="polite">{steps[step]}</p></div></div><div className="fam-guide-track" aria-label="Scene progress">{steps.map((_,i)=><button key={i} className={i===step?'active':''} aria-label={`Go to scene ${i+1}`} aria-current={i===step?'step':undefined} onClick={()=>{stop();setStep(i)}} />)}</div></div>
  <div className="fam-guide-actions"><button onClick={()=>{setStep(0);setPlaying(true)}}>▶ {playing?'Restart':'Play scenes'}</button><button onClick={stop} disabled={!playing}>Ⅱ Pause</button><button onClick={()=>{stop();setStep(s=>(s+1)%steps.length)}}>Next scene →</button><button onClick={()=>setVoice(v=>!v)} aria-pressed={voice}>{voice?'🔊 Read aloud on':'🔇 Read aloud off'}</button><label>Speed <select value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value="0.75">Slow</option><option value="1">Normal</option><option value="1.25">Fast</option></select></label></div>
  <p className="fam-guide-footnote">Animated scenes are generated in the browser. Read-aloud uses your device's available voice and may vary by browser. Continue to the hands-on discovery below.</p>
 </section>
}
