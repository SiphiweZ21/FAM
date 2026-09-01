import { CheckCircle2, LoaderCircle, TriangleAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyPremiumPayment } from '../lib/payments'

type Status = 'VERIFYING' | 'SUCCESS' | 'ERROR'

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('VERIFYING')
  const [message, setMessage] = useState('Confirming your secure payment...')

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref')
    if (!reference) {
      setStatus('ERROR')
      setMessage('The payment reference is missing.')
      return
    }

    verifyPremiumPayment(reference)
      .then(() => {
        setStatus('SUCCESS')
        setMessage('Payment verified. Your 12 months of FAM Premium are now active.')
      })
      .catch((error: unknown) => {
        setStatus('ERROR')
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.')
      })
  }, [searchParams])

  return (
    <div className="stack-lg narrow">
      <section className="account-login-card payment-result-card">
        {status === 'VERIFYING' && <LoaderCircle className="payment-spinner" size={42} />}
        {status === 'SUCCESS' && <CheckCircle2 className="payment-success-icon" size={42} />}
        {status === 'ERROR' && <TriangleAlert className="payment-error-icon" size={42} />}
        <span className="eyebrow">FAM PREMIUM</span>
        <h1>{status === 'VERIFYING' ? 'Verifying payment' : status === 'SUCCESS' ? 'Premium activated' : 'Verification incomplete'}</h1>
        <p>{message}</p>
        {status !== 'VERIFYING' && (
          <Link className="button primary full" to="/account">
            {status === 'SUCCESS' ? 'View my Premium account' : 'Return to my account'}
          </Link>
        )}
      </section>
    </div>
  )
}
