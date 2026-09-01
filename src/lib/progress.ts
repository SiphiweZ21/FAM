import { supabase } from './supabase'

type SaveProgressInput = {
  subjectId: string
  topicId: string
  missionId: string
  score: number
  totalQuestions: number
  percentage: number
  knowledgePoints: number
}

export async function saveLearnerProgress(
  input: SaveProgressInput
) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      saved: false,
      reason: 'NOT_SIGNED_IN'
    }
  }

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

  const firstCompletedAt =
    existingProgress?.first_completed_at ?? now

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

        completed: true,

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
    saved: true
  }
}