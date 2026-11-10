import {supabase} from './supabase'
import {safeLearningReturn} from './grade-premium'
export type PremiumPackageId='MONTHLY'|'TERM'
type PaymentResult={error?:string;authorizationUrl?:string;checkoutUrl?:string;fields?:Record<string,string>;reference?:string;verified?:boolean;state?:string;premiumExpiresAt?:string|null;packageId?:PremiumPackageId;returnTo?:string|null}
async function authenticatedRequest(path:string,init?:RequestInit):Promise<PaymentResult>{
 const {data:{session}}=await supabase.auth.getSession();if(!session)throw new Error('Sign in before upgrading to Premium.')
 let response:Response;try{response=await fetch(path,{...init,signal:AbortSignal.timeout(20000),headers:{authorization:`Bearer ${session.access_token}`,...init?.headers}})}catch{throw new Error('Secure checkout could not be reached. No payment has been taken. Please try again.')}
 let result:PaymentResult;try{result=await response.json()}catch{throw new Error('Secure checkout is temporarily unavailable. Please try again.')}
 if(!response.ok)throw new Error(result.error||'Payment request failed.');return result
}
export async function startPremiumCheckout(packageId:PremiumPackageId,learningReturnTo?:string,paymentMethod:'CAPITECPAY'|'CARD'='CAPITECPAY'){
 const returnTo=safeLearningReturn(learningReturnTo||null)||safeLearningReturn(new URLSearchParams(window.location.search).get('returnTo'))||safeLearningReturn(sessionStorage.getItem('fam-payment-return'))
 if(returnTo)sessionStorage.setItem('fam-payment-return',returnTo)
 const result=await authenticatedRequest('/api/payments/initialize',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({packageId,returnTo,paymentMethod})})
 if(result.checkoutUrl&&result.fields){
 const url=new URL(result.checkoutUrl);if(!['https://secure.peachpayments.com','https://testsecure.peachpayments.com'].includes(url.origin))throw new Error('Unexpected checkout destination.')
 const form=document.createElement('form');form.method='POST';form.action=url.toString();for(const [name,value]of Object.entries(result.fields)){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input)}document.body.appendChild(form);form.submit();return
 }
 if(!result.authorizationUrl)throw new Error('Payment checkout is unavailable.')
 const url=new URL(result.authorizationUrl);if(url.origin!=='https://checkout.paystack.com')throw new Error('Invalid checkout destination.');window.location.assign(url.toString())
}
export function verifyPremiumPayment(reference:string,provider='PAYSTACK'){return authenticatedRequest(`/api/payments/${provider==='PEACH'?'peach':'paystack'}/verify?reference=${encodeURIComponent(reference)}`)}
