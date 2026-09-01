interface Env {
  ASSETS: Fetcher
  PAYSTACK_SECRET_KEY: string
  SUPABASE_URL: string
  SUPABASE_PUBLISHABLE_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SITE_URL?: string
}

type PaystackTransaction = {
  status: string
  reference: string
  amount: number
  currency: string
  paid_at?: string | null
  id: number
  customer?: { email?: string }
  metadata?: { user_id?: string }
}

const PRICE_CENTS = 15_000
const CURRENCY = 'ZAR'

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  })
}

async function getUser(request: Request, env: Env) {
  const authorization = request.headers.get('authorization')

  if (!authorization?.startsWith('Bearer ')) return null

  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      authorization
    }
  })

  if (!response.ok) return null

  return response.json<{ id: string; email?: string }>()
}

async function paystack(
  env: Env,
  path: string,
  init?: RequestInit
) {
  return fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      ...init?.headers
    }
  })
}

async function initializePayment(request: Request, env: Env) {
  const user = await getUser(request, env)

  if (!user?.email) {
    return json({ error: 'Sign in before upgrading to Premium.' }, 401)
  }

  const reference = `fam_${user.id.replaceAll('-', '').slice(0, 12)}_${crypto.randomUUID().replaceAll('-', '')}`
  const siteUrl = (env.SITE_URL || 'https://futureafricaminds.com').replace(/\/$/, '')
  const response = await paystack(env, '/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      amount: PRICE_CENTS,
      currency: CURRENCY,
      reference,
      callback_url: `${siteUrl}/payment/callback`,
      metadata: {
        user_id: user.id,
        product: 'FAM_PREMIUM_12_MONTHS'
      }
    })
  })
  const result = await response.json<{
    status: boolean
    message?: string
    data?: { authorization_url?: string; reference?: string }
  }>()

  if (!response.ok || !result.status || !result.data?.authorization_url) {
    console.error('Paystack initialization failed', response.status, result.message)
    return json({ error: 'Payment could not be started. Please try again.' }, 502)
  }

  return json({
    authorizationUrl: result.data.authorization_url,
    reference: result.data.reference || reference
  })
}

async function fetchVerifiedTransaction(reference: string, env: Env) {
  const response = await paystack(
    env,
    `/transaction/verify/${encodeURIComponent(reference)}`
  )
  const result = await response.json<{
    status: boolean
    message?: string
    data?: PaystackTransaction
  }>()

  if (!response.ok || !result.status || !result.data) return null
  return result.data
}

function isValidPayment(transaction: PaystackTransaction) {
  return transaction.status === 'success' &&
    transaction.amount === PRICE_CENTS &&
    transaction.currency === CURRENCY
}

async function grantPremium(transaction: PaystackTransaction, env: Env) {
  const userId = transaction.metadata?.user_id
  if (!userId) throw new Error('Paystack transaction is missing user metadata')

  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/rpc/grant_paystack_premium`,
    {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_reference: transaction.reference,
        p_transaction_id: String(transaction.id),
        p_amount: transaction.amount,
        p_currency: transaction.currency,
        p_paid_at: transaction.paid_at || new Date().toISOString()
      })
    }
  )

  if (!response.ok) {
    const detail = await response.text()
    console.error('Premium grant failed', response.status, detail)
    throw new Error('Premium access could not be updated')
  }

  return response.json<{ premium_expires_at: string }[]>()
}

async function verifyPayment(request: Request, env: Env) {
  const user = await getUser(request, env)
  if (!user) return json({ error: 'Sign in to verify this payment.' }, 401)

  const url = new URL(request.url)
  const reference = url.searchParams.get('reference')
  if (!reference || reference.length > 160) {
    return json({ error: 'A valid payment reference is required.' }, 400)
  }

  const transaction = await fetchVerifiedTransaction(reference, env)
  if (!transaction || !isValidPayment(transaction)) {
    return json({ error: 'Payment has not been verified.' }, 400)
  }

  if (transaction.metadata?.user_id !== user.id) {
    return json({ error: 'This payment does not belong to your account.' }, 403)
  }

  const result = await grantPremium(transaction, env)
  return json({
    verified: true,
    premiumExpiresAt: result[0]?.premium_expires_at || null
  })
}

async function validWebhookSignature(request: Request, body: string, secret: string) {
  const signature = request.headers.get('x-paystack-signature')
  if (!signature) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )
  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(body)
  )
  const expected = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  if (signature.length !== expected.length) return false
  let difference = 0
  for (let i = 0; i < signature.length; i += 1) {
    difference |= signature.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return difference === 0
}

async function webhook(request: Request, env: Env) {
  const body = await request.text()
  if (!(await validWebhookSignature(request, body, env.PAYSTACK_SECRET_KEY))) {
    return json({ error: 'Invalid signature.' }, 401)
  }

  const event = JSON.parse(body) as {
    event?: string
    data?: PaystackTransaction
  }
  if (event.event !== 'charge.success' || !event.data) return json({ received: true })

  const transaction = await fetchVerifiedTransaction(event.data.reference, env)
  if (transaction && isValidPayment(transaction)) await grantPremium(transaction, env)

  return json({ received: true })
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    try {
      if (request.method === 'POST' && url.pathname === '/api/payments/paystack/initialize') {
        return initializePayment(request, env)
      }
      if (request.method === 'GET' && url.pathname === '/api/payments/paystack/verify') {
        return verifyPayment(request, env)
      }
      if (request.method === 'POST' && url.pathname === '/api/payments/paystack/webhook') {
        return webhook(request, env)
      }
      if (url.pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404)
      return env.ASSETS.fetch(request)
    } catch (error) {
      console.error('Payment API error', error)
      return json({ error: 'A secure payment operation failed. Please try again.' }, 500)
    }
  }
} satisfies ExportedHandler<Env>
