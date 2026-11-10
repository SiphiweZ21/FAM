import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import PremiumPackageCards from './PremiumPackageCards'
import {startPremiumCheckout,type PremiumPackageId} from '../lib/payments'
import {supabase} from '../lib/supabase'
export default function PremiumUpgradePanel({returnTo}:{returnTo:string}) {
 const navigate=useNavigate()
 const [loading,setLoading]=useState<PremiumPackageId|null>(null)
 const [error,setError]=useState('')
 async function pay(packageId: PremiumPackageId, paymentMethod: 'CAPITECPAY'|'CARD' = 'CAPITECPAY'){
  if(loading)return
  setLoading(packageId);setError('')
  try{
   const {data:{session}}=await supabase.auth.getSession()
   if(!session){navigate(`/account?returnTo=${encodeURIComponent(returnTo)}&packageId=${packageId}`);return}
   await startPremiumCheckout(packageId,returnTo,paymentMethod)
  }catch(error){setError(error instanceof Error?error.message:'Checkout could not be started. Please try again.');setLoading(null)}
 }
 return <div className="premium-upgrade-panel"><PremiumPackageCards onSelect={pay} loadingPackage={loading}/>{error&&<p className="payment-error-message" role="alert">{error}</p>}<p className="premium-payment-note">Choose a pass to open secure checkout. Sign in or create a free account first so your purchase is linked to your account.</p></div>
}
