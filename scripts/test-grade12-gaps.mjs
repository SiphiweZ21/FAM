import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import {stripTypeScriptTypes} from 'node:module'
import worker from '../.verification/index.js'
function load(path,name,globals={}){let s=fs.readFileSync(path,'utf8').replace(/import\.meta\.env\.VITE_CONTENT_BASE_URL/g,'undefined');s=stripTypeScriptTypes(s,{mode:'transform'}).replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');const out={};vm.runInNewContext(s+`\nout.value=${name}`,{out,...globals});return out.value}
const notes=load('worker/grade12-revision.ts','grade12Revision'),catalogue=load('src/data/past-paper-catalogue.ts','pastPaperCatalogue')
assert.equal(notes.length,164);assert.equal(new Set(notes.map(n=>n.id)).size,164)
for(const n of notes){assert.equal(n.examples.length,3);assert.equal(n.reviewStatus,'EDUCATOR_REVIEW_PENDING');for(const e of n.examples)assert(e.question&&e.answer&&e.explanation)}
assert.equal(catalogue.length,33)
for(const p of catalogue){assert(p.documents.some(d=>d.type==='QUESTION'));for(const d of p.documents)assert.equal(new URL(d.url).hostname,'www.education.gov.za')}
const getLesson=load('src/lib/topic-lessons.ts','getTopicLesson')
assert.equal(getLesson('accounting','vat').videoUrl,getLesson('accounting','value-added-tax').videoUrl)
const fallback=getLesson('history','unknown','Test topic');assert(!fallback.videoUrl);assert.equal(fallback.durationMinutes,undefined);assert(!fallback.description.includes('complete FAM video'))
for(const response of [new Response('',{status:404}),Response.json({wrong:[]}),new Response(''),Response.json([{subjectId:'mathematics',year:2025,questionUrl:'javascript:alert(1)'}])]){
 const get=load('src/lib/past-papers.ts','getPastPapers',{AbortSignal,pastPaperCatalogue:catalogue,fetch:async()=>response});const result=await get();assert.equal(result.length,33);assert(!result.some(p=>p.documents.some(d=>d.url.startsWith('javascript:'))))
}
const env={ASSETS:{fetch:()=>new Response('assets')},SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'test'}
const original=globalThis.fetch;let mode='FREE';globalThis.fetch=async url=>String(url).endsWith('/auth/v1/user')?Response.json({id:'test-user'}):Response.json([{tier:mode==='FREE'?'FREE':'PREMIUM',premium_expires_at:mode==='EXPIRED'?'2000-01-01T00:00:00Z':'2099-01-01T00:00:00Z'}])
const req=(id,token)=>new Request('https://fam.test/api/learning/grade12-revision?id='+encodeURIComponent(id),{headers:token?{authorization:'Bearer test'}:{}})
try{
 for(const n of notes){if(n.access==='PREMIUM'){assert.equal((await worker.fetch(req(n.id),env)).status,403);for(const m of ['FREE','EXPIRED']){mode=m;assert.equal((await worker.fetch(req(n.id,true),env)).status,403)}mode='PREMIUM'}const r=await worker.fetch(req(n.id,n.access==='PREMIUM'),env);assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal((await r.json()).examples.length,3)}
 assert.equal((await worker.fetch(req('missing'),env)).status,404)
 const bundles=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n')
 for(const n of notes.filter(n=>n.access==='PREMIUM'))for(const e of n.examples)assert(!bundles.includes(JSON.stringify(e.questionId)),'Paid revision leaked')
}finally{globalThis.fetch=original}
console.log('Grade 12 checks passed: 164 revision topics, access protection, public bundle isolation, VAT alias, accurate video fallback, official catalogue and safe document URLs.')
