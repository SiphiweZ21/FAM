import { supabase } from './supabase'

async function authenticatedRequest(path: string, init?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sign in before upgrading to Premium.')

  const response = await fetch(path, {
    ...init,
    headers: {
      authorization: `Bearer ${session.access_token}`,
      ...init?.headers
    }
  })
  const result = await response.json() as {
    error?: string
    authorizationUrl?: string
    verified?: boolean
    premiumExpiresAt?: string | null
  }

  if (!response.ok) throw new Error(result.error || 'Payment request failed.')
  return result
}

export async function startPremiumCheckout() {
  const result = await authenticatedRequest(
    '/api/payments/paystack/initialize',
    { method: 'POST' }
  )
  if (!result.authorizationUrl) throw new Error('Payment checkout is unavailable.')
  window.location.assign(result.authorizationUrl)
}

export function verifyPremiumPayment(reference: string) {
  return authenticatedRequest(
    `/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`
  )
}
