import FreeSampleNote from './FreeSampleNote'
import PremiumUpgradePanel from './PremiumUpgradePanel'
import {useEffect,useState,type ReactNode} from 'react'
import {Link,useLocation} from 'react-router-dom'
import {getLearnerAccessMode} from '../lib/access'
import {gradePathPolicy} from '../lib/grade-premium'
import {supabase} from '../lib/supabase'
export default function GradePremiumGate({children}:{children:ReactNode}) {
 const location=useLocation(),policy=gradePathPolicy(location.pathname)
 const key=location.pathname+location.search
 const [access,setAccess]=useState<{key:string;premium:boolean}|null>(null)
 const [revision,setRevision]=useState(0)
 useEffect(()=>{const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{setAccess(null);setRevision(v=>v+1)});return ()=>subscription.unsubscribe()},[])
 useEffect(()=>{let active=true;setAccess(null);if(policy?.premium)void getLearnerAccessMode().then(mode=>{if(active)setAccess({key,premium:mode==='PREMIUM'})});return ()=>{active=false}},[key,revision,policy?.premium])
 if(!policy?.premium)return <>{children}{policy && <FreeSampleNote />}</>
 if(access?.key!==key)return <div className="adventure-loading" role="status">Checking your learning access...</div>
 if(access.premium)return children
 return <section className="account-login-card premium-lesson-offer"><span className="eyebrow">FAM PREMIUM</span><h1>Unlock {policy.title}</h1><p>Enjoy one complete introductory path free in each subject. Premium unlocks the remaining available paths across grades.</p><p>Continue with lessons, practice and quizzes at your own pace.</p><PremiumUpgradePanel returnTo={key}/><Link className="button full" to={policy.back}>Explore this subject</Link><p>Create a free account to keep your progress, or sign in to an existing Premium account.</p></section>
}
