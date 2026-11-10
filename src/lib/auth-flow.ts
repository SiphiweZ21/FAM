export function normaliseEmail(value: string) { return value.trim().toLowerCase() }
export function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }
export function safeAuthDestination(value: string | null) {
  if (!value || /[\\\r\n]/.test(value) || value.startsWith('//')) return '/account'
  const path = value.split(/[?#]/)[0]
  return ['/account', '/dashboard', '/parent-dashboard', '/grade-1/parent-dashboard'].includes(path) ? value : '/account'
}
export function authRedirect(origin: string, destination: string, recovery = false) {
  const url = new URL('/auth/callback', origin)
  url.searchParams.set('next', safeAuthDestination(destination))
  if (recovery) url.searchParams.set('action', 'recovery')
  return url.toString()
}
export function authErrorMessage(error: unknown) {
  const item = error as { code?: string; message?: string; status?: number }
  const message = item?.message?.toLowerCase() ?? ''
  if (item?.code === 'email_not_confirmed' || message.includes('email not confirmed')) return 'Confirm your email before signing in. Check Spam or Junk, or resend the confirmation below.'
  if (item?.code === 'invalid_credentials' || message.includes('invalid login credentials')) return 'Email or password is incorrect. Check your details or reset your password.'
  if (item?.status === 429 || message.includes('rate limit') || message.includes('after ') && message.includes('seconds')) return 'Too many requests. Please wait a few minutes before trying again.'
  if (message.includes('email address not authorized') || message.includes('error sending') || message.includes('smtp')) return 'We could not send the account email. Please try again later or contact support@futureafricaminds.com.'
  if (message.includes('already registered')) return 'Please sign in to your existing account or reset your password.'
  if (item?.code === 'weak_password' || message.includes('password should')) return 'Choose a stronger password with at least eight characters. Follow any additional password requirements shown by FAM.'
  if (message.includes('expired') || message.includes('otp')) return 'This email link has expired or has already been used. Request a new email and open the newest link.'
  if (message.includes('fetch') || message.includes('network')) return 'Unable to connect. Check your connection and try again.'
  return 'We could not complete this request. Please try again or contact support@futureafricaminds.com.'
}
