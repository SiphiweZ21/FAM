import {useEffect,useState} from 'react'
import {useLocation} from 'react-router-dom'
import {supabase} from './supabase'
import {gradePathPolicy} from './grade-premium'
const unavailable='The learning service is unavailable. Start npm run dev:api in a second terminal, then try again.'
async function freeIntroduction<T>(pathname:string):Promise<T|undefined>{
 if(gradePathPolicy(pathname)?.premium!==false)return undefined
 const module=await import('../data/free-grade-content.json')
 const records=module.default as Record<string,unknown>
 return records[pathname.replace(/\/$/,'')] as T|undefined
}
export function useGradeContent<T>() {
 const {pathname}=useLocation()
 const [result,setResult]=useState<{path:string;data?:T;error?:string}|null>(null)
 useEffect(()=>{
  let active=true
  const controller=new AbortController()
  void (async()=>{
   try{
    // Free introductions work with Vite alone, including on phones on the LAN.
    // Only the first free path per subject is included in this public file.
    const introduction=await freeIntroduction<T>(pathname)
    if(introduction){if(active)setResult({path:pathname,data:introduction});return}
    const {data:{session}}=await supabase.auth.getSession()
    const response=await fetch(`/api/learning/grade-content?path=${encodeURIComponent(pathname)}`,{signal:controller.signal,headers:session?{authorization:`Bearer ${session.access_token}`}:{}})
    const body=await response.text()
    let data: {error?:string;activities?:unknown[]}
    try{data=JSON.parse(body)}catch{throw new Error(unavailable)}
    if(!response.ok)throw new Error(data.error||unavailable)
    if(!Array.isArray(data.activities)||!data.activities.length)throw new Error('This learning path could not be loaded. Please try again.')
    if(active)setResult({path:pathname,data:data as T})
   }catch(error){if(active)setResult({path:pathname,error:error instanceof Error?error.message:unavailable})}
  })()
  return()=>{active=false;controller.abort()}
 },[pathname])
 return {data:result?.path===pathname?result.data:undefined,loading:result?.path!==pathname,error:result?.path===pathname?result.error:undefined}
}
