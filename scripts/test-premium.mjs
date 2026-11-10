import assert from 'node:assert/strict'
import fs from 'node:fs'
import worker from '../.verification/index.js'
const manifest=JSON.parse(fs.readFileSync('src/lib/grade-premium-manifest.json','utf8'))
const env={ASSETS:{fetch:()=>new Response('assets')},SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'test-service',SITE_URL:'https://futureafricaminds.com',PAYMENT_PROVIDER:'PEACH',PEACH_ENTITY_ID:'entity',PEACH_SECRET_TOKEN:'secret',PEACH_MODE:'test'}
let mode='FREE',grants=0,order
const originalFetch=globalThis.fetch
const signature=async fields=>{const message=Object.keys(fields).filter(k=>k!=='signature').sort().map(k=>k+fields[k]).join('');const key=await crypto.subtle.importKey('raw',new TextEncoder().encode('secret'),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message))),b=>b.toString(16).padStart(2,'0')).join('')}
globalThis.fetch=async(url,options)=>{
 const value=String(url)
 if(value.endsWith('/auth/v1/user'))return Response.json({id:options?.headers?.authorization?.includes('other')?'other-user':'test-user',email:'parent@example.com'})
 if(value.includes('/learner_entitlements?'))return Response.json([{tier:mode==='FREE'?'FREE':'PREMIUM',premium_expires_at:mode==='EXPIRED'?'2000-01-01T00:00:00Z':'2099-01-01T00:00:00Z'}])
 if(value.endsWith('/peach_payment_orders')&&options?.method==='POST'){order=JSON.parse(options.body);return new Response('',{status:201})}
 if(value.includes('/peach_payment_orders?'))return Response.json(order?[{...order,status:'PENDING'}]:[])
 if(value.includes('/rpc/grant_peach_premium')){grants++;return Response.json([{premium_expires_at:'2099-01-01T00:00:00Z'}])}
 throw new Error('Unexpected fetch: '+value)
}
const request=(path,token='',method='GET',body)=>new Request('https://futureafricaminds.com'+path,{method,headers:token?{authorization:'Bearer '+token}:undefined,body})
try{
 let checks=0
 for(const [base,topics]of Object.entries(manifest)){
  let response=await worker.fetch(request('/api/learning/grade-content?path='+encodeURIComponent(base+'/practice/'+topics[0].id)),env);assert.equal(response.status,200,base+' free');assert.ok((await response.json()).activities.length)
  if(topics.length<2)continue
  const path='/api/learning/grade-content?path='+encodeURIComponent(base+'/practice/'+topics[1].id)
  response=await worker.fetch(request(path),env);assert.equal(response.status,403)
  mode='FREE';assert.equal((await worker.fetch(request(path,'free'),env)).status,403)
  mode='EXPIRED';assert.equal((await worker.fetch(request(path,'expired'),env)).status,403)
  mode='PREMIUM';assert.equal((await worker.fetch(request(path,'premium'),env)).status,200)
  mode='FREE';checks+=5
 }
 for(const path of ['/grades/grade-1/mathematics/addition','/grades/grade-1/mathematics/number-mission'])assert.equal((await worker.fetch(request('/api/learning/grade-content?path='+encodeURIComponent(path)),env)).status,403)
 assert.equal((await worker.fetch(request('/api/payments/initialize','parent','POST',JSON.stringify({packageId:'INVALID'})),env)).status,400)
 const checkout=await worker.fetch(request('/api/payments/initialize','parent','POST',JSON.stringify({packageId:'TERM',returnTo:'//evil.example'})),env)
 assert.equal(checkout.status,200);const data=await checkout.json();assert.equal(data.fields.defaultPaymentMethod,'CAPITECPAY');assert.equal(data.fields.amount,'200.00');assert.equal(order.return_to,null)
 assert.equal((await worker.fetch(request('/api/payments/peach/verify?reference='+data.reference,'other'),env)).status,403)
 const fields={merchantTransactionId:data.reference,amount:'200.00',currency:'ZAR',paymentType:'DB',id:'tx-123','result.code':'000.000.000'}
 fields.signature=await signature(fields)
 const webhook=()=>worker.fetch(request('/api/payments/peach/webhook','','POST',new URLSearchParams(fields).toString()),env)
 assert.equal((await webhook()).status,200);assert.equal(grants,1)
 fields.amount='110.00';assert.equal((await webhook()).status,401);assert.equal(grants,1)
 fields.signature=await signature(fields);assert.equal((await webhook()).status,200);assert.equal(grants,1)
 fields.amount='200.00';fields.paymentType='RF';fields.signature=await signature(fields);await webhook();assert.equal(grants,1)
 fields.paymentType='DB';fields['result.code']='000.200.000';fields.signature=await signature(fields);await webhook();assert.equal(grants,1)
 fields['result.code']='000.100.110';fields.signature=await signature(fields);await worker.fetch(request('/api/payments/peach/webhook','','POST',new URLSearchParams(fields).toString()),{...env,PEACH_MODE:'live'});assert.equal(grants,1)
 // Premium question records must not ship in public client bundles.
 const bundles=fs.readdirSync('dist/assets').filter(p=>p.endsWith('.js')).map(p=>fs.readFileSync('dist/assets/'+p,'utf8')).join('\n')
 assert.ok(!bundles.includes('missing-number'), 'Grade 2 premium activity leaked into client')
 assert.ok(!bundles.includes('subtract-flowers'), 'Number mission leaked into client')
 console.log(`Passed ${checks} grade access checks across ${Object.keys(manifest).length} subjects, payment authorization/signature/amount/refund/pending/live-mode checks, and public bundle checks.`)
}finally{globalThis.fetch=originalFetch}
