import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {CreditCard,ShieldCheck,Smartphone,RefreshCw} from 'lucide-react'
export type PaymentMethod='CAPITECPAY'|'CARD'
export function usePaymentAvailability(){
 const [capitecPay,setCapitecPay]=useState(false)
 const [ready,setReady]=useState<boolean|null>(null),[provider,setProvider]=useState('PAYSTACK'),[revision,setRevision]=useState(0)
 useEffect(()=>{let active=true;setReady(null);void fetch('/api/payments/config',{signal:AbortSignal.timeout(8000)}).then(async response=>{if(!response.ok)throw new Error();return response.json()}).then(config=>{if(active){setProvider(config.provider);setCapitecPay(config.capitecPay===true);setReady(config.available===true)}}).catch(()=>{if(active)setReady(false)});return()=>{active=false}},[revision])
 return {ready,provider,capitecPay,retry:()=>setRevision(value=>value+1)}
}
export default function PaymentMethodDetails({method,onChange,loading=false,ready,provider,capitecPay,retry}:{method:PaymentMethod;onChange:(method:PaymentMethod)=>void;loading?:boolean;ready:boolean|null;provider:string;capitecPay:boolean;retry:()=>void}){
 return <div className="trusted-checkout"><div className="trusted-checkout-heading"><ShieldCheck size={22}/><div><strong>{provider==='PEACH'?'Peach Payments':'Paystack'} secure checkout</strong><p>Choose how you would like to pay for your Monthly or Term Pass.</p></div></div>
 <><div className="checkout-methods" role="group" aria-label="Choose payment method"><button type="button" className={method==='CAPITECPAY'?'selected':''} aria-pressed={method==='CAPITECPAY'} disabled={loading||!capitecPay} onClick={()=>onChange('CAPITECPAY')}><Smartphone size={24}/><strong>Capitec Pay</strong><span>{capitecPay?'Approve in your Capitec app':'Awaiting merchant activation'}</span></button><button type="button" className={method==='CARD'?'selected':''} aria-pressed={method==='CARD'} disabled={loading} onClick={()=>onChange('CARD')}><CreditCard size={24}/><strong>Debit or credit card</strong><span>Pay through secure checkout</span></button></div><p>{method==='CAPITECPAY'?'Choose your pass → approve in your Capitec app → return to FAM. No card details needed.':`Choose your pass → enter your card details on ${provider==='PEACH'?'Peach':'Paystack'}’s secure checkout → return to FAM.`}</p></>
 {ready===null&&<p role="status">Checking secure checkout availability...</p>}
 {ready===false&&<div className="checkout-status" role="status"><p>Online checkout is temporarily unavailable.</p><button type="button" className="button secondary" onClick={retry}><RefreshCw size={16}/>Check availability</button></div>}
 <p className="premium-payment-note">One payment. No automatic renewal. Banking approval happens through your payment provider.</p><p className="premium-payment-note"><Link to="/refund-policy">Read our refund and cancellation policy</Link> · Full refund on request within seven calendar days.</p></div>
}
