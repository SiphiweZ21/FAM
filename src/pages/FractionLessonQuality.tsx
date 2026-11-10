import { useState } from 'react'
import release from '../data/fam-lesson-release.json'

type Response = {clarity:number;engagement:number;independent:number;notes:string;timestamp:string;lessonVersion:string}
const key='fam-g4-fractions-pilot-feedback-v13'
export default function FractionLessonQuality(){
 const [clarity,setClarity]=useState(3)
 const [engagement,setEngagement]=useState(3)
 const [independent,setIndependent]=useState(3)
 const [notes,setNotes]=useState('')
 const [saved,setSaved]=useState(false)
 function save(){
  try {
   const old=JSON.parse(localStorage.getItem(key)||'[]') as Response[]
   old.push({clarity,engagement,independent,notes:notes.trim().slice(0,500),timestamp:new Date().toISOString(),lessonVersion:release.version})
   localStorage.setItem(key,JSON.stringify(old))
   setSaved(true);setNotes('')
  }catch{setSaved(false)}
 }
 function exportFeedback(){
  const data=localStorage.getItem(key)||'[]'
  const url=URL.createObjectURL(new Blob([data],{type:'application/json'}))
  const link=document.createElement('a');link.href=url;link.download='fam-fractions-pilot-feedback.json';link.click();URL.revokeObjectURL(url)
 }
 return <section className="fam-interactive-panel" aria-labelledby="fam-pilot-quality-title">
   <div className="fam-step">Batch 13 · Learning experience quality</div>
   <h2 id="fam-pilot-quality-title">Help us improve this lesson</h2>
   <p>This lesson is an AI-quality-review pilot, not approved production curriculum. A parent, educator, or facilitator can record anonymous observations after a supervised learner session.</p>
   <p><strong>Review status:</strong> {release.publicationStatus.replace('_',' ')} · <strong>Release approved:</strong> {release.publicReleaseApproved ? "Yes" : "No"}</p>
   <div className="fam-lab-controls">
     <label>Explanation clarity (1–5) <input type="range" min="1" max="5" value={clarity} onChange={e=>setClarity(Number(e.target.value))}/><strong>{clarity}</strong></label>
     <label>Learner engagement (1–5) <input type="range" min="1" max="5" value={engagement} onChange={e=>setEngagement(Number(e.target.value))}/><strong>{engagement}</strong></label>
     <label>Independent completion (1–5) <input type="range" min="1" max="5" value={independent} onChange={e=>setIndependent(Number(e.target.value))}/><strong>{independent}</strong></label>
   </div>
   <label htmlFor="fam-observation-notes">Optional observations (no learner names or identifying details)</label>
   <textarea id="fam-observation-notes" value={notes} maxLength={500} onChange={e=>setNotes(e.target.value)} rows={3} style={{width:'100%',display:'block',marginBlock:10}} placeholder="Which concept was confusing? What worked well?"/>
   <div className="fam-interactive-actions"><button onClick={save}>Save feedback on this device</button><button className="fam-quiet" onClick={exportFeedback}>Export feedback JSON</button></div>
   {saved&&<p role="status">Feedback saved on this device. Export the JSON file if you want to share it with the content team.</p>}
   <p className="fam-note">Feedback is stored only in this browser; no personal information is requested or sent to a server.</p>
 </section>
}
