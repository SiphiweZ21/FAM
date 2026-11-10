import { GraduationCap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VerificationNotice from './VerificationNotice'
import { authRedirect, authErrorMessage, normaliseEmail, validEmail } from '../lib/auth-flow'

type AuthPanelProps = {
  hideIntro?: boolean
  hideFooter?: boolean
  formDescription?: string
  onAuthenticated?: () => void
  title?: string
  eyebrow?: string
  heading?: string
  description?: string
  formEyebrow?: string
  signInLabel?: string
  signUpLabel?: string
  emailPlaceholder?: string
  footerTitle?: string
  footerDescription?: string
}

export default function AuthPanel({
  hideIntro = true,
  hideFooter = true,
  formDescription,
  onAuthenticated,
  title = 'Welcome to FAM',
  eyebrow = 'YOUR FAM DASHBOARD',
  heading = 'Sign in to continue',
  description = 'Sign in or create a free account to save your progress.',
  formEyebrow = 'LEARNER ACCESS',
  signInLabel = 'Sign in and open dashboard',
  signUpLabel = 'Create learner account',
  emailPlaceholder = 'learner@example.com',
  footerTitle = 'Start for free',
  footerDescription = 'Create a free account to save your progress and continue your learning across devices.'
}: AuthPanelProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(() => new URLSearchParams(location.search).get('mode') === 'signup' ? 'signup' : 'signin')
  const [message, setMessage] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const busy = useRef(false)
  useEffect(() => {setMode(new URLSearchParams(location.search).get('mode') === 'signup' ? 'signup' : 'signin')}, [location.search])
  useEffect(() => {
    if (!cooldown) return
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])
  function redirect(recovery = false) {
    return authRedirect(window.location.origin, window.location.pathname + window.location.search, recovery)
  }
  async function authenticated() {
    setPassword(''); setConfirmation('')
    if (onAuthenticated) onAuthenticated(); else navigate('/account')
  }
  async function request(action: 'signin' | 'signup' | 'reset' | 'resend') {
    if (busy.current) return
    const address = normaliseEmail(email)
    if (!validEmail(address)) { setMessage('Enter a valid email address.'); return }
    if ((action === 'signin' || action === 'signup') && !password) { setMessage('Enter your password.'); return }
    if (action === 'signup' && password.length < 8) { setMessage('Use at least eight characters for your password.'); return }
    if (action === 'signup' && password !== confirmation) { setMessage('Your passwords do not match.'); return }
    if ((action === 'reset' || action === 'resend') && cooldown > 0) return
    busy.current = true; setSubmitting(true); setMessage(''); setEmail(address)
    try {
      if (action === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: address, password })
        if (error) {
          if (error.code === 'email_not_confirmed' || error.message.toLowerCase().includes('email not confirmed')) setNeedsConfirmation(true)
          throw error
        }
        setNeedsConfirmation(false)
        await authenticated()
      } else if (action === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: address, password, options: { emailRedirectTo: redirect() } })
        if (error) throw error
        if (data.session) { await authenticated() }
        else {
          setPassword(''); setConfirmation(''); setMode('signin'); setNeedsConfirmation(true); setVerificationEmail(address); setCooldown(60)
          setMessage('Registration submitted. For a new account, a verification email has been requested. Please follow the steps below before signing in.')
        }
      } else if (action === 'resend') {
        const { error } = await supabase.auth.resend({ type: 'signup', email: address, options: { emailRedirectTo: redirect() } })
        if (error) throw error
        setCooldown(60); setVerificationEmail(address)
        setMessage('If your account is awaiting confirmation, a new email has been requested. Check Spam or Junk and open the newest link. If it does not arrive, contact support@futureafricaminds.com.')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(address, { redirectTo: redirect(true) })
        if (error) throw error
        setCooldown(60)
        setMessage('If an account exists for this email, a password reset email has been requested. Check your inbox and Spam or Junk.')
      }
    } catch (error) {
      const failure = error as { status?: number; code?: string }
      if (failure.status === 429 || failure.code === 'over_email_send_rate_limit') setCooldown(60)
      setMessage(authErrorMessage(error))
    }
    finally { busy.current = false; setSubmitting(false) }
  }

  return (
    <div className="dashboard-auth narrow">
      {!hideIntro&&<header><span className="eyebrow">{eyebrow}</span><h1>{heading}</h1><p>{description}</p></header>}
      <section className="account-login-card">
        {verificationEmail ? <VerificationNotice email={verificationEmail} message={message} cooldown={cooldown} submitting={submitting} onResend={() => void request('resend')} onBack={() => {setVerificationEmail(''); setNeedsConfirmation(false); setMessage(''); setMode('signin')}} /> : <>
        <div className="account-login-heading"><div className="account-login-icon"><GraduationCap size={24} /></div><div><span className="eyebrow">{formEyebrow}</span><h2>{mode === 'signup' ? 'Create your free account' : mode === 'reset' ? 'Reset your password' : title}</h2></div></div>
        <p>{formDescription || description}</p>
        {mode !== 'reset' && <div className="auth-mode-buttons" role="group" aria-label="Account access"><button type="button" aria-pressed={mode === 'signin'} disabled={submitting} onClick={() => { setMode('signin'); setMessage('') }}>Sign in</button><button type="button" aria-pressed={mode === 'signup'} disabled={submitting} onClick={() => { setMode('signup'); setMessage('') }}>Create account</button></div>}
        <form onSubmit={event => { event.preventDefault(); void request(mode) }}>
        <div className="account-form">
          <label><span>Email</span><input required type="email" value={email} disabled={submitting} onChange={event => { setEmail(event.target.value); setNeedsConfirmation(false) }} placeholder={emailPlaceholder} autoComplete="email" /></label>
          {mode !== 'reset' && <label><span>Password</span><input required type="password" value={password} disabled={submitting} onChange={event => setPassword(event.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your FAM password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} /></label>}
          {mode === 'signup' && <label><span>Confirm password</span><input required type="password" value={confirmation} disabled={submitting} onChange={event => setConfirmation(event.target.value)} autoComplete="new-password" /></label>}
        </div>
        <button type="submit" className="button primary full" disabled={submitting || mode === 'reset' && cooldown > 0}>{submitting ? 'Please wait...' : mode === 'signup' ? signUpLabel : mode === 'reset' ? 'Send password reset email' : signInLabel}</button>
        </form>
        {mode === 'reset' && <button type="button" className="button secondary full" disabled={submitting} onClick={() => {setMode('signin'); setMessage('')}}>Back to sign in</button>}
        {mode === 'signin' && <button type="button" className="button secondary full" onClick={() => { setMode('reset'); setMessage(''); setPassword('') }} disabled={submitting}>Forgot your password?</button>}
        {message && <p className="account-message" role="status" aria-live="polite">{message}</p>}
        {needsConfirmation && <div className="auth-confirmation-help"><p>Your email must be confirmed before you can sign in. Make sure the address above is correct.</p><button type="button" className="button secondary full" disabled={submitting || cooldown > 0} onClick={() => void request('resend')}>{cooldown > 0 ? `Resend confirmation in ${cooldown}s` : 'Resend confirmation email'}</button><p>Still no email? <a href="mailto:support@futureafricaminds.com?subject=FAM%20account%20confirmation">Contact FAM Support</a>.</p></div>}
        {mode === 'reset' && cooldown > 0 && <p role="status">You can request another email in {cooldown}s.</p>}

        </>}
      </section>
      {!hideFooter&&<section className="account-free-note"><strong>{footerTitle}</strong><p>{footerDescription}</p></section>}
    </div>
  )
}
