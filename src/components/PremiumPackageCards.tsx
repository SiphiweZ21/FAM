import {useEffect,useState} from 'react'
import PaymentMethodDetails,{usePaymentAvailability,type PaymentMethod} from './PaymentMethodDetails'
import { CheckCircle2, Sparkles } from 'lucide-react'
import type { PremiumPackageId } from '../lib/payments'

type Props = {
  onSelect?: (packageId: PremiumPackageId, paymentMethod: PaymentMethod) => void
  loadingPackage?: PremiumPackageId | null
  compact?: boolean
}

const benefits = [
  'Unlock available learning paths across grades',
  'Homework and assignment help',
  'Full progress insights',
  'Lessons, practice and quizzes',
  'Past papers and memorandums'
]

export default function PremiumPackageCards({ onSelect, loadingPackage = null, compact = false }: Props) {
  const [method,setMethod]=useState<PaymentMethod>('CARD')
  const {ready,provider,capitecPay,retry}=usePaymentAvailability()
  useEffect(()=>{if(!capitecPay)setMethod('CARD')},[capitecPay])
  const capitec=capitecPay&&method==='CAPITECPAY'
  return (
    <div className="premium-packages-and-payments">
      <PaymentMethodDetails method={method} onChange={setMethod} loading={Boolean(loadingPackage)} ready={ready} provider={provider} capitecPay={capitecPay} retry={retry}/>
    <div className={`premium-package-grid${compact ? ' compact' : ''}`}>
      <article className="premium-package-card">
        <span className="eyebrow">MONTHLY PASS</span>
        <h3>Flexible access</h3>
        <div className="premium-package-price"><strong>R110</strong><span>30 days</span></div>
        {!compact && <ul>{benefits.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>}
        <p className="premium-payment-note">One payment. No automatic renewal. {capitec ? `Secure ${provider==='PEACH'?'Peach Payments':'Paystack'} checkout · Capitec Pay or card.` : 'Secure checkout.'}</p>
        {onSelect && <button className="button secondary full" type="button" onClick={() => onSelect('MONTHLY',method)} disabled={Boolean(loadingPackage)||ready!==true}>{loadingPackage === 'MONTHLY' ? 'Opening secure checkout...' : `Pay R110${capitec?' with Capitec Pay':''} — Monthly Pass`}</button>}
      </article>
      <article className="premium-package-card featured">
        <span className="premium-best-value"><Sparkles size={14} /> BEST VALUE</span>
        <span className="eyebrow">TERM PASS</span>
        <h3>Learn for a full term</h3>
        <div className="premium-package-price"><strong>R200</strong><span>3 months</span></div>
        <p className="premium-saving">Save R130 compared with three monthly passes.</p>
        {!compact && <ul>{benefits.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>}
        <p className="premium-payment-note">One payment. No automatic renewal. {capitec ? `Secure ${provider==='PEACH'?'Peach Payments':'Paystack'} checkout · Capitec Pay or card.` : 'Secure checkout.'}</p>
        {onSelect && <button className="button primary full" type="button" onClick={() => onSelect('TERM',method)} disabled={Boolean(loadingPackage)||ready!==true}>{loadingPackage === 'TERM' ? 'Opening secure checkout...' : `Pay R200${capitec?' with Capitec Pay':''} — Term Pass`}</button>}
      </article>
    </div>
    </div>
  )
}
