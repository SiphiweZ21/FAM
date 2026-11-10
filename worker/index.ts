import { grade12Revision } from './grade12-revision'
import { paidTermUnits } from './term-units'
import {safeLearningReturn} from '../src/lib/grade-premium'
import {initializePeach,verifyPeach,peachWebhook,peachReturn,peachReady} from './peach'
import {gradeContent} from './grade-content'
import {gradePathPolicy} from '../src/lib/grade-premium'
interface Env {
  PAYSTACK_CAPITEC_PAY_ENABLED?: string
  PAYMENT_PROVIDER?: string
  PEACH_ENTITY_ID?: string
  PEACH_SECRET_TOKEN?: string
  PEACH_MODE?: string
  ASSETS: Fetcher
  OPENAI_API_KEY: string
  PAYSTACK_SECRET_KEY: string
  SUPABASE_URL: string
  SUPABASE_PUBLISHABLE_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  SITE_URL?: string
}

type HomeworkGuidance = {
  title: string
  understanding: string
  keyConcept: string
  steps: string[]
  workedExplanation: string
  finalAnswer: string
  checkYourUnderstanding: string
  encouragement: string
}

type PaystackTransaction = {
  status: string
  reference: string
  amount: number
  currency: string
  paid_at?: string | null
  id: number
  customer?: { email?: string }
  metadata?: { user_id?: string; package_id?: string; product?: string; return_to?:string|null }
}

const CURRENCY = 'ZAR'
const PACKAGES = {
  MONTHLY: { amount: 11_000, product: 'FAM_PREMIUM_MONTHLY' },
  TERM: { amount: 20_000, product: 'FAM_PREMIUM_TERM' }
} as const
type PackageId = keyof typeof PACKAGES

function getPackage(packageId: string | undefined) {
  return packageId && Object.hasOwn(PACKAGES,packageId)
    ? { id: packageId as PackageId, ...PACKAGES[packageId as PackageId] }
    : null
}

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

async function hasActivePremium(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/learner_entitlements?user_id=eq.${encodeURIComponent(userId)}&select=tier,premium_expires_at&limit=1`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  )
  if (!response.ok) {
    console.error('Unable to verify Premium entitlement', response.status)
    return false
  }
  const rows = await response.json<Array<{ tier?: string; premium_expires_at?: string | null }>>()
  const entitlement = rows[0]
  if (entitlement?.tier !== 'PREMIUM') return false
  if (!entitlement.premium_expires_at) return true
  return new Date(entitlement.premium_expires_at).getTime() > Date.now()
}

async function safetyIdentifier(userId: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(userId))
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('').slice(0, 64)
}

function extractResponseText(result: {
  output_text?: string
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
}) {
  if (result.output_text) return result.output_text
  for (const item of result.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === 'output_text' && content.text) return content.text
    }
  }
  return null
}

async function homeworkHelp(request: Request, env: Env) {
  const user = await getUser(request, env)
  if (!user) return json({ error: 'Sign in to use Homework & Assignment Help.' }, 401)
  if (!(await hasActivePremium(user.id, env))) {
    return json({ error: 'Homework & Assignment Help requires an active FAM Premium package.' }, 403)
  }
  if (!env.OPENAI_API_KEY) return json({ error: 'Homework Help is not configured yet.' }, 503)

  const body = await request.json().catch(() => ({})) as { grade?: unknown; subject?: unknown; question?: unknown }
  const grade = Number(body.grade)
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const question = typeof body.question === 'string' ? body.question.trim() : ''

  if (!Number.isInteger(grade) || grade < 1 || grade > 12) return json({ error: 'Choose a valid grade from 1 to 12.' }, 400)
  if (subject.length < 2 || subject.length > 80) return json({ error: 'Choose a valid subject.' }, 400)
  if (question.length < 10) return json({ error: 'Please enter the complete homework question.' }, 400)
  if (question.length > 6_000) return json({ error: 'The question is too long. Keep it under 6,000 characters.' }, 400)

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      store: false,
      safety_identifier: await safetyIdentifier(user.id),
      max_output_tokens: 1800,
      reasoning: { effort: 'low' },
      instructions: `You are the FutureAfricaMinds learning tutor for South African learners. Teach at the supplied grade level and subject. Use South African English and CAPS-aligned terminology when relevant. Help the learner understand and complete the work; do not encourage copying, impersonation, plagiarism or submission of model-written work as their own. For ordinary homework, explain the method before giving the final answer. For essays and assignments, provide a plan, reasoning, examples and improvement guidance rather than a ready-to-submit full assignment. If the question is ambiguous or missing essential information, say exactly what is missing. Check calculations carefully. Never claim that a question appeared in an official examination unless the user supplied evidence. Keep the response focused and age-appropriate.`,
      input: `Grade: ${grade}\nSubject: ${subject}\nLearner question:\n${question}`,
      text: {
        format: {
          type: 'json_schema',
          name: 'fam_homework_guidance',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              understanding: { type: 'string' },
              keyConcept: { type: 'string' },
              steps: { type: 'array', minItems: 2, maxItems: 8, items: { type: 'string' } },
              workedExplanation: { type: 'string' },
              finalAnswer: { type: 'string' },
              checkYourUnderstanding: { type: 'string' },
              encouragement: { type: 'string' }
            },
            required: ['title', 'understanding', 'keyConcept', 'steps', 'workedExplanation', 'finalAnswer', 'checkYourUnderstanding', 'encouragement']
          }
        },
        verbosity: 'medium'
      }
    })
  })

  const result = await response.json<{
    error?: { message?: string }
    output_text?: string
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>
  }>()
  if (!response.ok) {
    console.error('OpenAI homework response failed', response.status, result.error?.message)
    return json({ error: 'FAM could not prepare guidance right now. Please try again shortly.' }, 502)
  }
  const responseText = extractResponseText(result)
  if (!responseText) return json({ error: 'FAM returned an incomplete response. Please try again.' }, 502)

  try {
    return json({ guidance: JSON.parse(responseText) as HomeworkGuidance })
  } catch {
    console.error('Homework guidance was not valid structured JSON')
    return json({ error: 'FAM could not format the guidance. Please try again.' }, 502)
  }
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

function paystackReady(env:Env){return !!env.SUPABASE_URL&&!!env.SUPABASE_SERVICE_ROLE_KEY&&/^sk_(test|live)_[a-zA-Z0-9]+$/.test(env.PAYSTACK_SECRET_KEY||'')&&!!env.SITE_URL&&env.SITE_URL.startsWith('https://')}
async function initializePayment(request: Request, env: Env) {
  if(!paystackReady(env))return json({error:'Secure checkout is not available yet. Please try again later.'},503)
  const user = await getUser(request, env)

  if (!user?.email) {
    return json({ error: 'Sign in before upgrading to Premium.' }, 401)
  }

  const requestBody = await request.json().catch(() => ({})) as { packageId?: string; returnTo?:string; paymentMethod?:string }
  const selectedPackage = getPackage(requestBody.packageId)
  if (!selectedPackage) return json({ error: 'Choose a valid Premium package.' }, 400)

  if(requestBody.paymentMethod==='CAPITECPAY'&&env.PAYSTACK_CAPITEC_PAY_ENABLED!=='true')return json({error:'Capitec Pay is awaiting activation. Please choose card payment.'},409)
  const reference = `fam-${user.id.replaceAll('-', '').slice(0, 12)}-${crypto.randomUUID().replaceAll('-', '')}`
  const siteUrl = (env.SITE_URL || 'https://futureafricaminds.com').replace(/\/$/, '')
  const response = await paystack(env, '/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: user.email,
      amount: selectedPackage.amount,
      currency: CURRENCY,
      reference,
      callback_url: `${siteUrl}/payment/callback?provider=PAYSTACK`,
      channels: requestBody.paymentMethod==='CAPITECPAY'?['capitec_pay']:['card'],
      metadata: {
        user_id: user.id,
        product: selectedPackage.product,
        package_id: selectedPackage.id,
        return_to: safeLearningReturn(requestBody.returnTo||null)
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
    reference: result.data.reference || reference,
    packageId: selectedPackage.id
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
  const selectedPackage = getPackage(transaction.metadata?.package_id)
  if (!selectedPackage) return false
  return transaction.status === 'success' &&
    transaction.amount === selectedPackage.amount &&
    transaction.currency === CURRENCY &&
    transaction.metadata?.product === selectedPackage.product
}

async function grantPremium(transaction: PaystackTransaction, env: Env) {
  const userId = transaction.metadata?.user_id
  const selectedPackage = getPackage(transaction.metadata?.package_id)
  if (!userId) throw new Error('Paystack transaction is missing user metadata')
  if (!selectedPackage) throw new Error('Paystack transaction has an invalid package')

  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/rpc/grant_paystack_premium`,
    {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_reference: transaction.reference,
        p_transaction_id: String(transaction.id),
        p_amount: transaction.amount,
        p_currency: transaction.currency,
        p_paid_at: transaction.paid_at || new Date().toISOString(),
        p_package_code: selectedPackage.id
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
  if (!transaction || transaction.reference!==reference || !isValidPayment(transaction)) {
    return json({ error: 'Payment has not been verified.' }, 400)
  }

  if (transaction.metadata?.user_id !== user.id) {
    return json({ error: 'This payment does not belong to your account.' }, 403)
  }

  const result = await grantPremium(transaction, env)
  return json({
    verified: true,
    premiumExpiresAt: result[0]?.premium_expires_at || null,
    packageId: transaction.metadata?.package_id,
    returnTo: safeLearningReturn(transaction.metadata?.return_to||null),
    reference: transaction.reference
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
      if(request.method==='GET'&&url.pathname==='/api/payments/config'){const peach=env.PAYMENT_PROVIDER==='PEACH';const available=peach?peachReady(env):paystackReady(env);return json({provider:peach?'PEACH':'PAYSTACK',available,capitecPay:available&&(peach||env.PAYSTACK_CAPITEC_PAY_ENABLED==='true')})}
      if(request.method==='POST'&&url.pathname==='/api/payments/initialize')return env.PAYMENT_PROVIDER==='PEACH'?initializePeach(request,env,await getUser(request,env)):initializePayment(request,env)
      if(request.method==='GET'&&url.pathname==='/api/payments/peach/verify')return verifyPeach(request,env,await getUser(request,env))
      if(request.method==='POST'&&url.pathname==='/api/payments/peach/webhook')return peachWebhook(request,env)
      if(['GET','POST'].includes(request.method)&&url.pathname==='/api/payments/peach/return')return peachReturn(request,env)
      if(request.method==='GET'&&url.pathname==='/api/learning/grade12-revision') {
        const note=grade12Revision.find(n=>n.id===url.searchParams.get('id'));
        if(!note)return json({error:'Revision topic not found.'},404);
        if(note.access==='PREMIUM'){const user=await getUser(request,env);if(!user||!(await hasActivePremium(user.id,env)))return json({error:'Sign in with active Premium to read these worked examples.'},403)}
        return json(note);
      }
      if(request.method==='GET'&&url.pathname==='/api/learning/term-unit'){
        const id=url.searchParams.get('id');const unit=paidTermUnits.find(u=>u.id===id&&u.status==='available');if(!unit)return json({error:'Learning unit not found.'},404);
        const user=await getUser(request,env);if(!user||!(await hasActivePremium(user.id,env)))return json({error:'This unit requires active FAM Premium access.'},403);
        return json(unit);
      }
      if (request.method === 'GET' && url.pathname === '/api/learning/grade-content') {
        const path=(url.searchParams.get('path')||'').replace(/\/$/,'')
        const normalized=path==='/grades/grade-1/mathematics/addition'?'/grades/grade-1/mathematics/number-mission':path
        const content=gradeContent[normalized]
        if(!content)return json({error:'Learning path not found.'},404)
        if(gradePathPolicy(path)?.premium){const user=await getUser(request,env);if(!user||!(await hasActivePremium(user.id,env)))return json({error:'This path requires active FAM Premium access.'},403)}
        return json(content)
      }
      if (request.method === 'POST' && url.pathname === '/api/payments/paystack/initialize') {
        return initializePayment(request, env)
      }
      if (request.method === 'GET' && url.pathname === '/api/payments/paystack/verify') {
        return verifyPayment(request, env)
      }
      if (request.method === 'POST' && url.pathname === '/api/payments/paystack/webhook') {
        return webhook(request, env)
      }
      if (request.method === 'POST' && url.pathname === '/api/homework/help') {
        return homeworkHelp(request, env)
      }
      if (url.pathname.startsWith('/api/')) return json({ error: 'Not found.' }, 404)
      return env.ASSETS.fetch(request)
    } catch (error) {
      console.error('FAM Worker API error', error)
      return json({ error: 'A secure FAM service failed. Please try again.' }, 500)
    }
  }
} satisfies ExportedHandler<Env>
