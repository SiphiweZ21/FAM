import { supabase } from './supabase'

export type LearnerAccessMode =
  | 'FREE'
  | 'PREMIUM'

export type LearnerEntitlement = {
  accessMode: LearnerAccessMode
  premiumStartedAt: string | null
  premiumExpiresAt: string | null
  source: string | null
}

const FREE_ENTITLEMENT: LearnerEntitlement = {
  accessMode: 'FREE',
  premiumStartedAt: null,
  premiumExpiresAt: null,
  source: null
}

export async function getLearnerEntitlement():
Promise<LearnerEntitlement> {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError) {
    console.error(
      'Unable to read authenticated user:',
      userError
    )

    return FREE_ENTITLEMENT
  }

  if (!user) {
    return FREE_ENTITLEMENT
  }

  const {
    data,
    error
  } = await supabase
    .from('learner_entitlements')
    .select(
      `
      tier,
      premium_started_at,
      premium_expires_at,
      source
      `
    )
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error(
      'Unable to load learner entitlement:',
      error
    )

    return FREE_ENTITLEMENT
  }

  if (!data) {
    return FREE_ENTITLEMENT
  }

  const expiresAt =
    data.premium_expires_at
      ? new Date(
          data.premium_expires_at
        )
      : null

  const premiumIsActive =
    data.tier === 'PREMIUM' &&
    (
      !expiresAt ||
      expiresAt.getTime() >
        Date.now()
    )

  return {
    accessMode:
      premiumIsActive
        ? 'PREMIUM'
        : 'FREE',

    premiumStartedAt:
      data.premium_started_at ??
      null,

    premiumExpiresAt:
      data.premium_expires_at ??
      null,

    source:
      data.source ??
      null
  }
}

export async function getLearnerAccessMode():
Promise<LearnerAccessMode> {
  const entitlement =
    await getLearnerEntitlement()

  return entitlement.accessMode
}

export async function hasPremiumAccess():
Promise<boolean> {
  const accessMode =
    await getLearnerAccessMode()

  return accessMode === 'PREMIUM'
}