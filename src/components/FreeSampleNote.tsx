import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function FreeSampleNote() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  useEffect(() => {
    let active = true
    void supabase.auth.getSession().then(({ data }) => { if (active) setSignedIn(Boolean(data.session)) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (active) setSignedIn(Boolean(session)) })
    return () => { active = false; subscription.unsubscribe() }
  }, [])
  if (signedIn !== false) return null
  return <aside className="sample-registration-prompt"><strong>Enjoying your free introduction?</strong><p>Create a free account to save future progress and continue learning.</p><Link className="button primary" to="/account?mode=signup">Create free account</Link> <Link className="button secondary" to="/account">Sign in</Link></aside>
}
