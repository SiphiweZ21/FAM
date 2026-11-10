import { programmeSubjectName } from '../lib/programme-subjects'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { unitStorageKey } from '../lib/unit-progress'
import { Link, useParams } from 'react-router-dom'
import { countingUnit, unitCatalogue } from '../data/term-programmes'
import { getGrade } from '../lib/grades'
import '../styles/term-programmes.css'
export default function TermProgrammePage() {
 const [userId,setUserId]=useState<string|null>(null)
 useEffect(()=>{let active=true,changed=false;const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{changed=true;if(active)setUserId(s?.user.id||null)});void supabase.auth.getSession().then(({data})=>{if(active&&!changed)setUserId(data.session?.user.id||null)}).catch(()=>{});return()=>{active=false;subscription.unsubscribe()}},[])
 const {gradeId,subjectId='mathematics',termId='1'}=useParams(); const grade=getGrade(gradeId);const term=Number(termId)
 const subjects=Array.from(new Set([countingUnit,...unitCatalogue].filter(u=>u.grade===grade?.number).map(u=>u.subject)))
 if(!grade||grade.number>11||!subjects.some(s=>s===subjectId)||![1,2,3,4].includes(term))  return <div className="term-page"><h1>Programme not found</h1><Link to="/">Choose a grade</Link></div>
 const units=[countingUnit,...unitCatalogue].filter(u=>u.grade===grade.number&&u.subject===subjectId&&u.term===term&&u.status==='available')
 const status=(u:typeof units[number])=>{if(!userId)return 'New unit';try{const key=unitStorageKey(userId,localStorage.getItem('fam-active-learner-id'),u);const p=JSON.parse(localStorage.getItem(key)||'null');if(!p||p.version!==u.version)return 'New unit';return p.completedAt?'Completed':p.phase?'In progress':'New unit'}catch{return 'New unit'}}
 const next=units.find(u=>status(u)==='In progress')||units.find(u=>status(u)!=='Completed')

 return <div className="term-page"><Link to={`/grades/${grade.id}`}>← {grade.name}</Link><header><span className="grade-stage-pill">LEARN STEP BY STEP</span><h1>{grade.name} term programmes</h1><p>Short learning units with explanations, practice and a checkpoint.</p></header>
 <nav className="term-tabs" aria-label="Programme subject">{subjects.map(s=><Link aria-current={subjectId===s?'page':undefined} key={s} to={`/grades/${grade.id}/programmes/${s}/terms/${term}`}>{programmeSubjectName(s)}</Link>)}</nav>
 <nav className="term-tabs" aria-label="School term">{[1,2,3,4].map(t=><Link key={t} aria-current={t===term?'page':undefined} to={`/grades/${grade.id}/programmes/${subjectId}/terms/${t}`}>Term {t}</Link>)}</nav>
 <h2>{programmeSubjectName(subjectId)} · Term {term}</h2><p>Supplementary learning. Available units are listed below; this is not a complete term curriculum.</p>
 {next&&<p><Link className="term-button" to={`/grades/${grade.id}/programmes/${subjectId}/terms/${term}/units/${next.id}`}>Continue learning: {next.title} →</Link></p>}
 {units.map(u=><article className="term-card" key={u.id}><span>{u.access==='FREE'?'FREE INTRODUCTORY UNIT':'PREMIUM UNIT'} · {status(u)}</span><h3>{u.title}</h3>{u.contentKind==='EXISTING_PATH_REVIEW'&&<p>Structured revision of existing activities. Proposed term placement awaits educator review.</p>}<ul>{u.objectives.map(o=><li key={o}>{o}</li>)}</ul><Link className="term-button" to={`/grades/${grade.id}/programmes/${subjectId}/terms/${term}/units/${u.id}`}>Start or continue →</Link></article>)}
 {!units.length&&<article className="term-card"><h3>More units are being prepared</h3><p>You can keep learning with the available practice paths while we build this programme.</p></article>}
 <Link to={`/grades/${grade.id}/${subjectId}`}>Explore existing practice paths →</Link></div>
}
