import { supabase } from './supabase'
import { deleteGuestProfile, getGuestProfiles, type GuestMissionProgress } from './guest'

export type GuestTransferReceipt = {
  nickname: string
  gradeId: string
  transferredAt: string
  missions: GuestMissionProgress[]
}

const guestTransferReceiptKey = 'fam-guest-transfer-receipt-v1'

type SaveProgressInput = {
  subjectId: string
  topicId: string
  missionId: string
  score: number
  totalQuestions: number
  percentage: number
  knowledgePoints: number
  mastered: boolean
}

export async function saveLearnerProgress(
  input: SaveProgressInput
) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return { saved: false, local: false, reason: 'NOT_SIGNED_IN' }

  const now = new Date().toISOString()

  /*
   * 1. Record every completed attempt.
   * This gives us historical data for:
   *
   * - improvement trends
   * - repeated attempts
   * - weak topics
   * - recent performance
   */
  const { error: attemptError } = await supabase
    .from('mission_attempts')
    .insert({
      user_id: user.id,
      subject_id: input.subjectId,
      topic_id: input.topicId,
      mission_id: input.missionId,
      score: input.score,
      total_questions: input.totalQuestions,
      percentage: input.percentage,
      knowledge_points: input.knowledgePoints,
      attempted_at: now
    })

  if (attemptError) {
    throw attemptError
  }

  /*
   * 2. Check whether this mission already has
   * a learner_progress record.
   *
   * This allows us to preserve the original
   * first_completed_at date.
   */
  const {
    data: existingProgress,
    error: existingProgressError
  } = await supabase
    .from('learner_progress')
    .select('first_completed_at')
    .eq('user_id', user.id)
    .eq('subject_id', input.subjectId)
    .eq('topic_id', input.topicId)
    .eq('mission_id', input.missionId)
    .maybeSingle()

  if (existingProgressError) {
    throw existingProgressError
  }

  const alreadyMastered = Boolean(existingProgress?.first_completed_at)
  const mastered = input.mastered || alreadyMastered
  const firstCompletedAt =
    existingProgress?.first_completed_at ?? (input.mastered ? now : null)

  /*
   * 3. Keep learner_progress as the latest
   * state for this mission.
   */
  const { error: progressError } = await supabase
    .from('learner_progress')
    .upsert(
      {
        user_id: user.id,
        subject_id: input.subjectId,
        topic_id: input.topicId,
        mission_id: input.missionId,

        score: input.score,
        total_questions: input.totalQuestions,
        percentage: input.percentage,
        knowledge_points: input.knowledgePoints,

        completed: mastered,

        first_completed_at: firstCompletedAt,
        last_attempted_at: now,
        updated_at: now
      },
      {
        onConflict:
          'user_id,subject_id,topic_id,mission_id'
      }
    )

  if (progressError) {
    throw progressError
  }

  return {
    saved: true,
    local: false
  }
}

export async function migrateLegacyProgress(profileId: string) {
  const profile = getGuestProfiles().find(item => item.id === profileId)
  if (!profile || profile.gradeId !== 'grade-12' || profile.progress.length === 0) return { migrated: 0, receipt: null as GuestTransferReceipt | null }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { migrated: 0, receipt: null as GuestTransferReceipt | null }
  const transferred: GuestMissionProgress[] = []
  for (const item of profile.progress) {
    const { data: existing, error } = await supabase.from('learner_progress')
      .select('percentage')
      .eq('user_id', user.id)
      .eq('subject_id', item.subjectId)
      .eq('topic_id', item.topicId)
      .eq('mission_id', item.missionId)
      .maybeSingle()
    if (error) throw error
    if (!existing || Number(existing.percentage) < item.percentage) {
      const result = await saveLearnerProgress(item)
      if (!result.saved) throw new Error('A guest mission could not be transferred.')
    }
    transferred.push(item)
  }
  const receipt: GuestTransferReceipt = { nickname: profile.nickname, gradeId: profile.gradeId, transferredAt: new Date().toISOString(), missions: transferred }
  sessionStorage.setItem(guestTransferReceiptKey, JSON.stringify(receipt))
  deleteGuestProfile(profile.id)
  return { migrated: transferred.length, receipt }
}

export function getGuestTransferReceipt(): GuestTransferReceipt | null {
  try {
    const stored = sessionStorage.getItem(guestTransferReceiptKey)
    return stored ? JSON.parse(stored) as GuestTransferReceipt : null
  } catch { return null }
}

export function clearGuestTransferReceipt() {
  sessionStorage.removeItem(guestTransferReceiptKey)
}
