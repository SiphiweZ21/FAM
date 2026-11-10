import {useEffect,useState} from 'react'
import {startPremiumCheckout,type PremiumPackageId} from '../lib/payments'
import PaymentMethodDetails,{usePaymentAvailability,type PaymentMethod} from './PaymentMethodDetails'
export default function SelectedPremiumCheckout({packageId,returnTo}:{packageId:PremiumPackageId;returnTo:string}) {
 const [method,setMethod]=useState<PaymentMethod>('CARD')
 const {ready,provider,capitecPay,retry}=usePaymentAvailability()
 const [loading,setLoading]=useState(false),[error,setError]=useState('')
 useEffect(()=>{if(!capitecPay)setMethod('CARD')},[capitecPay])
 async function pay(){if(loading)return;setLoading(true);setError('');try{await startPremiumCheckout(packageId,returnTo,method)}catch(error){setError(error instanceof Error?error.message:'Checkout could not be opened. Please try again.');setLoading(false)}}
 const term=packageId==='TERM',amount=term?'200':'110'
 return <section className="account-plan-card selected-premium-purchase"><span className="eyebrow">YOUR SELECTED PACKAGE</span><h2>{term?'Term Pass — R200':'Monthly Pass — R110'}</h2><p>{term?'3 months':'30 days'} of Premium access. One payment. No automatic renewal.</p>
 <PaymentMethodDetails method={method} onChange={setMethod} loading={loading} ready={ready} provider={provider} capitecPay={capitecPay} retry={retry}/>
 <button className="button primary full" disabled={loading||ready!==true} onClick={pay}>{loading?'Opening secure checkout...':`Pay R${amount}${method==='CAPITECPAY'?' with Capitec Pay':''}`}</button>
 {loading&&<p role="status">Opening {provider==='PEACH'?'Peach Payments':'Paystack'} checkout. Please keep this page open.</p>}{error&&<p className="payment-error-message" role="alert">{error}</p>}</section>
}
