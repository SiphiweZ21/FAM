import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import {stripTypeScriptTypes} from 'node:module'
import worker from '../.verification/index.js'
function load(file,name,globals={}){const s=stripTypeScriptTypes(fs.readFileSync(file,'utf8'),{mode:'transform'}).replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');const out={};vm.runInNewContext(s+`\nout.value=${name}`,{out,...globals});return out.value}
const paid=load('worker/term-units.ts','paidTermUnits'),free=load('src/data/free-term-units.ts','freeTermUnits'),catalogue=load('src/data/term-unit-catalogue.ts','unitCatalogue')
const units=[...paid,...free].filter(u=>u.contentKind==='EXISTING_PATH_REVIEW')
assert.equal(units.length,124);assert.equal(units.filter(u=>u.access==='FREE').length,25)
const programmes=new Set(units.map(u=>`${u.grade}:${u.subject}`));assert.equal(programmes.size,25)
const manifest=JSON.parse(fs.readFileSync('src/lib/grade-premium-manifest.json','utf8'))
const policy=load('src/lib/grade-premium.ts','gradePathPolicy',{manifest,unitCatalogue:catalogue})
const env={ASSETS:{fetch:()=>new Response('assets')},SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'test'}
const original=globalThis.fetch;globalThis.fetch=async url=>String(url).endsWith('/auth/v1/user')?Response.json({id:'test-user'}):Response.json([{tier:'PREMIUM',premium_expires_at:'2099-01-01T00:00:00Z'}])
try{
 for(const u of units){
  const route=`/grades/grade-${u.grade}/programmes/${u.subject}/terms/${u.term}/units/${u.id}`
  assert.equal(policy(route).premium,u.access==='PREMIUM');assert.equal(policy(route).back,route.split('/units/')[0])
  const sourcePolicy=policy(u.sourcePath);assert.equal(sourcePolicy.premium,u.access==='PREMIUM')
  const response=await worker.fetch(new Request('https://fam.test/api/learning/grade-content?path='+encodeURIComponent(u.sourcePath),{headers:{authorization:'Bearer test'}}),env);assert.equal(response.status,200);const source=await response.json();assert.equal(source.activities.length,5)
  assert.equal(u.practice.length,5);assert.equal(u.checkpoint.length,5);assert.equal(u.reviewStatus,'EDUCATOR_REVIEW_PENDING')
  for(const q of [...u.guided,...u.practice,...u.checkpoint,...u.review]){const match=source.activities.find(a=>a.prompt===q.prompt&&a.explanation===q.explanation&&a.answer===q.labels[q.count]);assert(match,'Source answer changed: '+u.id)}
  assert.equal(new Set(u.checkpoint.map(q=>q.prompt)).size,5)
 }
 for(const p of programmes){const [grade,subject]=p.split(':');for(const term of [1,2,3,4])assert(units.some(u=>u.grade===Number(grade)&&u.subject===subject&&u.term===term));assert.equal(units.filter(u=>u.grade===Number(grade)&&u.subject===subject&&u.access==='FREE').length,1)}
 assert.equal(policy('/grades/grade-7/programmes/missing/terms/1/units/missing'),null)
}finally{globalThis.fetch=original}
console.log('Other-subject checks passed: 124 source-preserving units, 25 programmes across four proposed terms, source parity and route entitlement matching.')
