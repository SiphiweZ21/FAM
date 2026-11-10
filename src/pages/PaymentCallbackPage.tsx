import {safeLearningReturn} from '../lib/grade-premium'
import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyPremiumPayment } from '../lib/payments'

type Status = 'VERIFYING' | 'SUCCESS' | 'ERROR' | 'PENDING'

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('VERIFYING')
  const [message, setMessage] = useState('Confirming your secure payment...')

  const [receipt,setReceipt]=useState<{reference:string;expires:string|null}|null>(null)
  const [retry,setRetry]=useState(0)
  const [returnTo,setReturnTo]=useState<string|null>(null)
  useEffect(() => {
    let active=true
    setStatus('VERIFYING')
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    if (!reference) {
      setStatus('ERROR')
      setMessage('The payment reference is missing.')
      return
    }

    verifyPremiumPayment(reference,searchParams.get('provider')||'PAYSTACK')
      .then((result) => {
        if(!active)return
        if(!result.verified){setStatus('PENDING');setMessage(result.state==='CANCELLED'?'Payment was cancelled. Your access has not changed.':'Your payment is not confirmed yet. Check again before starting another payment.');return}
        setReturnTo(safeLearningReturn(result.returnTo||sessionStorage.getItem('fam-payment-return')))
        setReceipt({reference,expires:result.premiumExpiresAt||null})
        setStatus('SUCCESS')
        setMessage(result.packageId === 'TERM'
          ? 'Payment verified. Your 3-month FAM Premium Term Pass is now active.'
          : 'Payment verified. Your 30-day FAM Premium Monthly Pass is now active.')
      })
      .catch((error: unknown) => {
        if(!active)return
        setStatus('ERROR')
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.')
      })
    return ()=>{active=false}
  }, [searchParams,retry])

  return (
    <div className="stack-lg narrow">
      <section className="account-login-card payment-result-card">
        {status === 'VERIFYING' && <LoaderCircle className="payment-spinner" size={42} />}
        {status === 'SUCCESS' && <CheckCircle2 className="payment-success-icon" size={42} />}
        {status === 'ERROR' && <TriangleAlert className="payment-error-icon" size={42} />}
        <span className="eyebrow">FAM PREMIUM</span>
        <h1>{status === 'VERIFYING' ? 'Verifying payment' : status === 'SUCCESS' ? 'Premium activated' : 'Verification incomplete'}</h1>
        <p>{message}</p>
        {status==='SUCCESS'&&receipt&&<dl><dt>Payment reference</dt><dd>{receipt.reference}</dd>{receipt.expires&&<><dt>Premium access until</dt><dd>{new Date(receipt.expires).toLocaleDateString('en-ZA')}</dd></>}</dl>}
        {(status==='ERROR'||status==='PENDING')&&<button className="button primary full" onClick={()=>setRetry(v=>v+1)}>Check payment again</button>}
        {status==='SUCCESS'&&returnTo&&<Link className="button primary full" to={returnTo}>Continue learning</Link>}
        {status !== 'VERIFYING' && (
          <Link className="button primary full" to="/account">
            {status === 'SUCCESS' ? 'View my Premium account' : 'Return to my account'}
          </Link>
        )}
      </section>
    </div>
  )
}
