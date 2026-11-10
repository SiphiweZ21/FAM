import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { authErrorMessage, safeAuthDestination } from '../lib/auth-flow'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const initial = useRef(new URL(window.location.href)).current
  const fragment = new URLSearchParams(initial.hash.slice(1))
  const recovery = initial.searchParams.get('action') === 'recovery' || fragment.get('type') === 'recovery'
  const destination = safeAuthDestination(initial.searchParams.get('next'))
  const [state, setState] = useState<'loading' | 'confirmed' | 'recovery' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  useEffect(() => {
    let active = true
    let recoveryVerified = false
    const params = new URLSearchParams(initial.hash.slice(1))
    const linkError = params.get('error_description') || initial.searchParams.get('error_description') || params.get('error') || initial.searchParams.get('error')
    if (linkError) { setState('error'); setMessage('This email link could not be verified. It may have expired or already been used. Return to sign in and request a new link.'); return }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' && session) { recoveryVerified = true; setState('recovery') }
    })
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active || recoveryVerified) return
      if (error || !data.session) {
        setState('error'); setMessage(error ? authErrorMessage(error) : 'This link could not start a session. Request a new confirmation or password reset email, then open its newest link.')
      } else if (recovery) {
        // Only a recovery link or PASSWORD_RECOVERY event can open the reset form.
        if (params.get('type') === 'recovery' && params.has('access_token')) setState('recovery')
        else { setState('error'); setMessage('Open the password reset link from your email to choose a new password.') }
      } else setState('confirmed')
    }).catch(() => { if (active) { setState('error'); setMessage('Unable to verify this link. Check your connection and request a new email if needed.') } })
    return () => { active = false; subscription.unsubscribe() }
  }, [initial, recovery])
  async function continueLearning() {
    if (lock.current) return
    lock.current = true; setBusy(true)
    navigate(destination, { replace: true })
  }
  async function savePassword() {
    if (lock.current) return
    if (password.length < 8) { setMessage('Use at least eight characters for your new password.'); return }
    if (password !== confirmation) { setMessage('Your passwords do not match.'); return }
    lock.current = true; setBusy(true); setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setPassword(''); setConfirmation(''); setState('confirmed'); setMessage('Your password has been updated.')
    } catch (error) { setMessage(authErrorMessage(error)) }
    finally { lock.current = false; setBusy(false) }
  }
  return <section className="account-login-card narrow auth-callback"><span className="eyebrow">FAM ACCOUNT ACCESS</span>
    <h1>{state === 'recovery' ? 'Choose a new password' : state === 'confirmed' ? 'Your account is ready' : state === 'error' ? 'Let’s get you back in' : 'Checking your email link'}</h1>
    {state === 'loading' && <p role="status">Verifying your account. Please wait...</p>}
    {state === 'confirmed' && <><p>You are signed in. Continue to your account or selected purchase.</p><button type="button" className="button primary full" disabled={busy} onClick={() => void continueLearning()}>{busy ? 'Continuing...' : 'Continue to FAM'}</button></>}
    {state === 'recovery' && <form onSubmit={event => { event.preventDefault(); void savePassword() }}><div className="account-form"><label><span>New password</span><input required type="password" autoComplete="new-password" value={password} disabled={busy} onChange={event => setPassword(event.target.value)} /></label><label><span>Confirm new password</span><input required type="password" autoComplete="new-password" value={confirmation} disabled={busy} onChange={event => setConfirmation(event.target.value)} /></label></div><button className="button primary full" disabled={busy}>{busy ? 'Saving...' : 'Save new password'}</button></form>}
    {message && <p className="account-message" role="status">{message}</p>}
    {state === 'error' && <Link className="button primary full" to={destination}>Return to sign in</Link>}
  </section>
}
