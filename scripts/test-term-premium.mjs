import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import {stripTypeScriptTypes} from 'node:module'
import worker from '../.verification/index.js'
function load(file,name){const source=stripTypeScriptTypes(fs.readFileSync(file,'utf8'),{mode:'transform'}).replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');const out={};vm.runInNewContext(source+`\nout.value=${name}`,{out});return out.value}
const paid=load('worker/term-units.ts','paidTermUnits'),free=load('src/data/free-term-units.ts','freeTermUnits')
assert.equal(paid.length,267);assert.equal(free.length,46)
const catalogue=load('src/data/term-unit-catalogue.ts','unitCatalogue')
assert.equal(new Set([...paid,...free].map(u=>u.id)).size,paid.length+free.length)
for(const u of [...paid,...free]){const m=catalogue.find(m=>m.id===u.id);assert(m);assert.equal(m.term,u.term);assert.equal(m.grade,u.grade);assert.equal(m.subject,u.subject);assert.equal(m.access,u.access)}
for(const grade of [2,3,4,5,6,7,8,9,10,11])for(const term of [1,2,3,4])for(const subject of ['mathematics','words'])assert.equal(catalogue.filter(u=>u.grade===grade&&u.term===term&&u.subject===subject).length,2)
for(const grade of [2,3,4,5,6,7,8,9,10,11])for(const subject of ['mathematics','words'])assert.equal(free.filter(u=>u.grade===grade&&u.subject===subject).length,1)
for(const unit of [...paid,...free]){
 assert.ok(unit.id.startsWith(`g${unit.grade}-`));assert.ok(unit.id.includes(`-t${unit.term}-`),'Term metadata mismatch: '+unit.id)
 assert.equal(unit.lessons.length,3);assert.equal(unit.practice.length,unit.contentKind==='EXISTING_PATH_REVIEW'?5:8);assert.equal(unit.checkpoint.length,5)
 const qs=[...unit.guided,...unit.practice,...unit.checkpoint,...unit.review];assert.equal(new Set(qs.map(q=>q.id)).size,qs.length)
 if(unit.term>=2&&unit.contentKind!=='EXISTING_PATH_REVIEW')assert.equal(new Set(qs.map(q=>JSON.stringify([q.prompt,q.visual,q.labels]))).size,qs.length,'Repeated question: '+unit.id)
 for(const q of qs){assert(q.options.includes(q.count));assert.equal(new Set(Object.values(q.labels)).size,q.options.length);assert(q.explanation)}
}
const env={ASSETS:{fetch:()=>new Response('assets')},SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'test'}
let mode='FREE';const original=globalThis.fetch
globalThis.fetch=async url=>String(url).endsWith('/auth/v1/user')?Response.json({id:'test-user'}):Response.json([{tier:mode==='FREE'?'FREE':'PREMIUM',premium_expires_at:mode==='EXPIRED'?'2000-01-01T00:00:00Z':'2099-01-01T00:00:00Z'}])
const request=(id,token)=>new Request('https://futureafricaminds.com/api/learning/term-unit?id='+id,{headers:token?{authorization:'Bearer test'}:{}})
try{
 for(const unit of paid){assert.equal((await worker.fetch(request(unit.id),env)).status,403);mode='FREE';assert.equal((await worker.fetch(request(unit.id,true),env)).status,403);mode='EXPIRED';assert.equal((await worker.fetch(request(unit.id,true),env)).status,403);mode='PREMIUM';const response=await worker.fetch(request(unit.id,true),env);assert.equal(response.status,200);assert.equal((await response.json()).id,unit.id)}
 assert.equal((await worker.fetch(request('missing'),env)).status,404)
 const bundles=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n')
 for(const unit of paid)for(const q of [...unit.guided,...unit.practice,...unit.checkpoint,...unit.review])assert(!bundles.includes(JSON.stringify(q.id)),'Paid question record leaked: '+unit.id+' / '+q.id)
 console.log('Term Premium checks passed: 267 protected units, anonymous/free/expired denial, active access, unknown IDs, answer validity and public bundle isolation.')
}finally{globalThis.fetch=original}
