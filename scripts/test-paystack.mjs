import assert from 'node:assert/strict'
import worker from '../.verification/index.js'
const env={ASSETS:{fetch:()=>new Response('assets')},SUPABASE_URL:'https://example.supabase.co',SUPABASE_PUBLISHABLE_KEY:'test',SUPABASE_SERVICE_ROLE_KEY:'service',SITE_URL:'https://futureafricaminds.com',PAYSTACK_SECRET_KEY:'sk_test_123',PAYSTACK_CAPITEC_PAY_ENABLED:'true'}
let initialized,transaction,grants=0
const original=globalThis.fetch
const api=(path,body,method='POST')=>new Request('https://futureafricaminds.com'+path,{method,headers:{authorization:'Bearer user','content-type':'application/json'},body:body?JSON.stringify(body):undefined})
globalThis.fetch=async(url,options)=>{
 const address=String(url)
 if(address.endsWith('/auth/v1/user'))return Response.json({id:'test-user',email:'parent@example.com'})
 if(address.endsWith('/transaction/initialize')){initialized=JSON.parse(options.body);return Response.json({status:true,data:{authorization_url:'https://checkout.paystack.com/test',reference:initialized.reference}})}
 if(address.includes('/transaction/verify/'))return Response.json({status:true,data:transaction})
 if(address.endsWith('/rpc/grant_paystack_premium')){grants++;return Response.json([{premium_expires_at:'2099-01-01T00:00:00Z'}])}
 throw new Error('Unexpected fetch '+address)
}
try{
 let response=await worker.fetch(api('/api/payments/config',null,'GET'),env);let config=await response.json();assert.equal(config.provider,'PAYSTACK');assert.equal(config.available,true);assert.equal(config.capitecPay,true)
 response=await worker.fetch(api('/api/payments/initialize',{packageId:'TERM',paymentMethod:'CAPITECPAY',returnTo:'/grades/grade-4/mathematics/practice/fractions-and-patterns'}),env);assert.equal(response.status,200);assert.equal(initialized.amount,20000);assert.deepEqual(initialized.channels,['capitec_pay']);assert.ok(/^[a-zA-Z0-9-.=]+$/.test(initialized.reference));assert.ok(initialized.callback_url.includes('provider=PAYSTACK'))
 response=await worker.fetch(api('/api/payments/initialize',{packageId:'MONTHLY',paymentMethod:'CARD'}),env);assert.equal(response.status,200);assert.deepEqual(initialized.channels,['card']);assert.equal(initialized.amount,11000)
 assert.equal((await worker.fetch(api('/api/payments/initialize',{packageId:'TERM',paymentMethod:'CAPITECPAY'}),{...env,PAYSTACK_CAPITEC_PAY_ENABLED:'false'})).status,409)
 assert.equal((await worker.fetch(api('/api/payments/initialize',{packageId:'TERM'}),{...env,PAYSTACK_SECRET_KEY:''})).status,503)
 transaction={status:'success',reference:initialized.reference,amount:11000,currency:'ZAR',id:123,metadata:{user_id:'test-user',package_id:'MONTHLY',product:'FAM_PREMIUM_MONTHLY',return_to:'/grades/grade-3/mathematics/practice/comparing'}}
 const verify=()=>worker.fetch(api('/api/payments/paystack/verify?reference='+transaction.reference,null,'GET'),env)
 let result=await (await verify()).json();assert.equal(result.verified,true);assert.equal(result.returnTo,transaction.metadata.return_to);assert.equal(grants,1)
 transaction.amount=1;assert.equal((await verify()).status,400);assert.equal(grants,1)
 transaction.amount=11000;transaction.metadata.user_id='someone-else';assert.equal((await verify()).status,403);assert.equal(grants,1)
 transaction.metadata.user_id='test-user';transaction.status='pending';assert.equal((await verify()).status,400);assert.equal(grants,1)
 transaction.status='success';transaction.metadata.product='OTHER';assert.equal((await verify()).status,400)
 transaction.metadata.product='FAM_PREMIUM_MONTHLY';const body=JSON.stringify({event:'charge.success',data:transaction});const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.PAYSTACK_SECRET_KEY),{name:'HMAC',hash:'SHA-512'},false,['sign']);const signature=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body))),b=>b.toString(16).padStart(2,'0')).join('');
 const webhook=new Request('https://futureafricaminds.com/api/payments/paystack/webhook',{method:'POST',headers:{'x-paystack-signature':signature},body});assert.equal((await worker.fetch(webhook,env)).status,200);assert.equal(grants,2)
 const bad=new Request('https://futureafricaminds.com/api/payments/paystack/webhook',{method:'POST',headers:{'x-paystack-signature':'invalid'},body});assert.equal((await worker.fetch(bad,env)).status,401);assert.equal(grants,2)
 console.log('Paystack checks passed: default gateway, prices, channels, activation gate, references, verified access, ownership, pending/invalid payments and webhook signatures.')
}finally{globalThis.fetch=original}
