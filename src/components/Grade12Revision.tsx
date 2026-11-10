import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { grade12RevisionCatalogue } from '../data/grade12-revision-catalogue'
type Example = {questionId:string;question:string;answer:string;explanation:string}
export default function Grade12Revision({subjectId,topicId}:{subjectId:string;topicId:string}) {
 const id=`${subjectId}:${topicId}`
 const [result,setResult]=useState<{id:string;examples?:Example[];error?:string;locked?:boolean}>()
 const [retry,setRetry]=useState(0)
 const known=grade12RevisionCatalogue.some(n=>n.id===id)
 useEffect(()=>{
  if(!known)return
  let live=true;const controller=new AbortController()
  setResult(undefined)
  async function load(){try{
   const {data:{session}}=await supabase.auth.getSession()
   const response=await fetch(`/api/learning/grade12-revision?id=${encodeURIComponent(id)}`,{signal:controller.signal,headers:session?{authorization:`Bearer ${session.access_token}`}:{}})
   if(response.status===403){if(live)setResult({id,locked:true});return}
   if(!response.ok)throw new Error('Worked examples could not be loaded. Please try again.')
   const data=await response.json();if(data.id!==id||!Array.isArray(data.examples))throw new Error('Worked examples could not be loaded.')
   if(live)setResult({id,examples:data.examples})
  }catch{if(live)setResult({id,error:'Worked examples are unavailable. Please try again.'})}}
  void load();const {data:{subscription}}=supabase.auth.onAuthStateChange((event)=>{if(event!=='INITIAL_SESSION')setRetry(v=>v+1)})
  return()=>{live=false;controller.abort();subscription.unsubscribe()}
 },[id,known,retry])
 if(!known)return null
 const current=result?.id===id?result:undefined
 return <section className="lesson-concepts-card"><h2>Worked revision examples</h2><p>Read the question, try it yourself, then reveal the method. These examples use the existing FAM practice bank; educator review is pending.</p>
 {!current&&<p role="status">Loading worked examples…</p>}
 {current?.locked&&<p>These examples require Premium. <Link to={`/account?returnTo=${encodeURIComponent(`/subjects/${subjectId}/${topicId}/lesson`)}`}>View Premium options</Link></p>}
 {current?.error&&<p role="alert">{current.error} <button onClick={()=>setRetry(v=>v+1)}>Try again</button></p>}
 {current?.examples?.map((e,i)=><article key={e.questionId}><h3>Example {i+1}</h3><p>{e.question}</p><details><summary>Show answer and explanation</summary><p><strong>{e.answer}</strong></p><p>{e.explanation}</p></details></article>)}
 {current?.examples&&<p>Explain one method in your own words, then try the missions independently. Ask your teacher about any unclear explanation.</p>}
 </section>
}
