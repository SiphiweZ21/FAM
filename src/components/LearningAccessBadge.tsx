import {LockKeyhole,CheckCircle2} from 'lucide-react'
export default function LearningAccessBadge({access}:{access:string}) {
 const premium=access==='PREMIUM'
 return <span className={`learning-access-badge ${premium?'premium':'free'}`}>{premium?<LockKeyhole size={14} aria-hidden="true"/>:<CheckCircle2 size={14} aria-hidden="true"/>}{premium?'Premium':'Free introduction'}</span>
}
