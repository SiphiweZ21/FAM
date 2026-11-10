export interface PeachEnv {
 PEACH_ENTITY_ID?:string;PEACH_SECRET_TOKEN?:string;PEACH_MODE?:string;PAYMENT_PROVIDER?:string
 SUPABASE_URL:string;SUPABASE_SERVICE_ROLE_KEY:string;SITE_URL?:string
}
export const paymentPackages={MONTHLY:11000,TERM:20000} as const
const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json','cache-control':'no-store'}})
export function peachReady(env:PeachEnv){return !!env.SUPABASE_URL&&!!env.SUPABASE_SERVICE_ROLE_KEY&&!!env.PEACH_ENTITY_ID&&!!env.PEACH_SECRET_TOKEN&&['test','live'].includes(env.PEACH_MODE||'')&&!!env.SITE_URL&&new URL(env.SITE_URL).protocol==='https:'}
function endpoint(env:PeachEnv){return env.PEACH_MODE==='live'?'https://secure.peachpayments.com':'https://testsecure.peachpayments.com'}
export async function peachSignature(fields:Record<string,string>,secret:string){
 const message=Object.keys(fields).filter(k=>k!=='signature').sort().map(k=>k+fields[k]).join('')
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign'])
 const digest=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message))
 return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')
}
function equal(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
async function db(env:PeachEnv,path:string,init?:RequestInit){const response=await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`,{...init,headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'content-type':'application/json',...init?.headers}});if(!response.ok)throw new Error('Payment storage unavailable');return response}
type Order={reference:string;user_id:string;package_code:'MONTHLY'|'TERM';amount:number;status:string;return_to:string|null}
async function getOrder(env:PeachEnv,reference:string){const response=await db(env,`peach_payment_orders?reference=eq.${encodeURIComponent(reference)}&select=*&limit=1`);return (await response.json<Order[]>())[0]}
export function successfulPeachCode(code:string,mode?:string){return code==='000.000.000'||code==='000.100.100'||(mode==='test'&&code==='000.100.110')}
export function validPeachPayment(fields:Record<string,string>,order:Order,mode?:string){return fields.merchantTransactionId===order.reference&&fields.currency==='ZAR'&&fields.paymentType==='DB'&&/^\d+\.\d{2}$/.test(fields.amount||'')&&Math.round(Number(fields.amount)*100)===order.amount&&!!fields.id&&successfulPeachCode(fields['result.code']||fields.result_code||'',mode)}
async function grant(env:PeachEnv,order:Order,fields:Record<string,string>){
 const response=await db(env,'rpc/grant_peach_premium',{method:'POST',body:JSON.stringify({p_reference:order.reference,p_transaction_id:fields.id,p_amount:order.amount,p_currency:'ZAR'})})
 const rows=await response.json<Array<{premium_expires_at:string}>>()
 return {verified:true,packageId:order.package_code,premiumExpiresAt:rows[0]?.premium_expires_at,returnTo:order.return_to,reference:order.reference}
}
export async function initializePeach(request:Request,env:PeachEnv,user:{id:string}|null){
 if(!user)return reply({error:'Sign in before upgrading to Premium.'},401)
 if(!peachReady(env))return reply({error:'Secure checkout is being set up. Please try again later.'},503)
 const body=await request.json() as {packageId?:string;returnTo?:string;paymentMethod?:string}
 if(!body.packageId||!Object.hasOwn(paymentPackages,body.packageId))return reply({error:'Choose a valid Premium package.'},400)
 const packageId=body.packageId as keyof typeof paymentPackages,reference='fam'+crypto.randomUUID().replaceAll('-','').slice(0,13)
 const site=new URL(env.SITE_URL!).origin
 const returnTo=body.returnTo&&/^\/(grades|subjects|quiz)\//.test(body.returnTo)&&!/[\\\r\n]/.test(body.returnTo)?body.returnTo:null
 await db(env,'peach_payment_orders',{method:'POST',body:JSON.stringify({reference,user_id:user.id,package_code:packageId,amount:paymentPackages[packageId],return_to:returnTo})})
 const fields:Record<string,string>={'authentication.entityId':env.PEACH_ENTITY_ID!,merchantTransactionId:reference,amount:(paymentPackages[packageId]/100).toFixed(2),currency:'ZAR',paymentType:'DB',nonce:crypto.randomUUID(),defaultPaymentMethod:body.paymentMethod==='CARD'?'CARD':'CAPITECPAY',forceDefaultMethod:'false',shopperResultUrl:`${site}/api/payments/peach/return?reference=${reference}`,notificationUrl:`${site}/api/payments/peach/webhook`}
 fields.signature=await peachSignature(fields,env.PEACH_SECRET_TOKEN!)
 return reply({checkoutUrl:`${endpoint(env)}/checkout`,fields,reference,provider:'PEACH',packageId})
}
export async function verifyPeach(request:Request,env:PeachEnv,user:{id:string}|null){
 if(!user)return reply({error:'Sign in to verify your payment.'},401)
 if(!peachReady(env))return reply({error:'Payment verification is temporarily unavailable.'},503)
 const reference=new URL(request.url).searchParams.get('reference')||''
 if(!/^fam[a-f0-9]{13}$/.test(reference))return reply({error:'A valid payment reference is required.'},400)
 const order=await getOrder(env,reference)
 if(!order||order.user_id!==user.id)return reply({error:'This payment does not belong to your account.'},403)
 if(order.status==='SUCCESS'){
  const entitlement=await db(env,`learner_entitlements?user_id=eq.${encodeURIComponent(user.id)}&select=premium_expires_at&limit=1`)
  const rows=await entitlement.json<Array<{premium_expires_at:string}>>()
  return reply({verified:true,packageId:order.package_code,premiumExpiresAt:rows[0]?.premium_expires_at,returnTo:order.return_to,reference})
 }
 const fields:Record<string,string>={'authentication.entityId':env.PEACH_ENTITY_ID!,merchantTransactionId:reference}
 fields.signature=await peachSignature(fields,env.PEACH_SECRET_TOKEN!)
 const response=await fetch(`${endpoint(env)}/status?${new URLSearchParams(fields)}`)
 if(!response.ok)return reply({error:'We could not confirm your payment yet. Please check again before paying again.'},502)
 const raw=await response.json<Record<string,unknown>>()
 // Status payloads use nested result fields; webhooks use dotted fields.
 const payment:Record<string,string>={};for(const [key,value]of Object.entries(raw))if(typeof value==='string')payment[key]=value
 const result=raw.result as {code?:string}|undefined;if(result?.code)payment['result.code']=result.code
 if(validPeachPayment(payment,order,env.PEACH_MODE))return reply(await grant(env,order,payment))
 if(order.status==='SUCCESS')return reply({verified:true,packageId:order.package_code,returnTo:order.return_to,reference})
 const code=payment['result.code']||payment.result_code
 return reply({verified:false,state:code==='100.396.101'?'CANCELLED':'PENDING',reference,packageId:order.package_code})
}
export async function peachWebhook(request:Request,env:PeachEnv){
 if(!peachReady(env))return reply({error:'Payment service unavailable'},503)
 const raw=await request.text();if(raw.length>65536)return reply({error:'Payload too large'},413)
 const params=new URLSearchParams(raw),fields:Record<string,string>={}
 for(const [key,value]of params){if(Object.hasOwn(fields,key))return reply({error:'Duplicate fields'},400);fields[key]=value}
 if(!fields.signature||!equal(fields.signature,await peachSignature(fields,env.PEACH_SECRET_TOKEN!)))return reply({error:'Invalid signature'},401)
 const reference=fields.merchantTransactionId;if(!reference)return reply({error:'Missing reference'},400)
 const order=await getOrder(env,reference);if(!order)return reply({error:'Unknown payment'},404)
 if(validPeachPayment(fields,order,env.PEACH_MODE))await grant(env,order,fields)
 return reply({received:true})
}
export function peachReturn(request:Request,env:PeachEnv){const reference=new URL(request.url).searchParams.get('reference')||'';const destination=new URL('/payment/callback',env.SITE_URL||new URL(request.url).origin);destination.searchParams.set('provider','PEACH');destination.searchParams.set('reference',reference);return Response.redirect(destination.toString(),303)}
