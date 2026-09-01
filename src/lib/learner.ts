import { supabase } from './supabase'

export type LearnerSubjectTarget = {
  subjectId: string
  currentMark: number | null
  targetMark: number
}

export async function getLearnerSubjectTargets() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: selectedSubjects, error: subjectsError } =
    await supabase
      .from('learner_subjects')
      .select('subject_id')
      .eq('user_id', user.id)

  if (subjectsError) {
    throw subjectsError
  }

  const { data: targets, error: targetsError } =
    await supabase
      .from('subject_targets')
      .select(
        'subject_id, current_mark, target_mark'
      )
      .eq('user_id', user.id)

  if (targetsError) {
    throw targetsError
  }

  const targetMap = new Map(
    (targets ?? []).map(target => [
      target.subject_id,
      target
    ])
  )

  return (selectedSubjects ?? []).map(subject => {
    const target = targetMap.get(subject.subject_id)

    return {
      subjectId: subject.subject_id,
      currentMark: target?.current_mark ?? null,
      targetMark: target?.target_mark ?? 70
    }
  })
}

export async function saveLearnerSubjectTargets(
  subjects: LearnerSubjectTarget[]
) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error(
      'You must be signed in to save subjects.'
    )
  }

  const selectedIds = subjects.map(
    subject => subject.subjectId
  )

  const {
    data: existingSubjects,
    error: existingError
  } = await supabase
    .from('learner_subjects')
    .select('subject_id')
    .eq('user_id', user.id)

  if (existingError) {
    throw existingError
  }

  const existingIds = (existingSubjects ?? []).map(
    subject => subject.subject_id
  )

  const removedIds = existingIds.filter(
    subjectId => !selectedIds.includes(subjectId)
  )

  if (removedIds.length > 0) {
    const { error: removeSubjectsError } =
      await supabase
        .from('learner_subjects')
        .delete()
        .eq('user_id', user.id)
        .in('subject_id', removedIds)

    if (removeSubjectsError) {
      throw removeSubjectsError
    }

    const { error: removeTargetsError } =
      await supabase
        .from('subject_targets')
        .delete()
        .eq('user_id', user.id)
        .in('subject_id', removedIds)

    if (removeTargetsError) {
      throw removeTargetsError
    }
  }

  if (subjects.length === 0) {
    return
  }

  const subjectRows = subjects.map(subject => ({
    user_id: user.id,
    subject_id: subject.subjectId
  }))

  const { error: subjectError } = await supabase
    .from('learner_subjects')
    .upsert(subjectRows, {
      onConflict: 'user_id,subject_id'
    })

  if (subjectError) {
    throw subjectError
  }

  const targetRows = subjects.map(subject => ({
    user_id: user.id,
    subject_id: subject.subjectId,
    current_mark: subject.currentMark,
    target_mark: subject.targetMark,
    updated_at: new Date().toISOString()
  }))

  const { error: targetError } = await supabase
    .from('subject_targets')
    .upsert(targetRows, {
      onConflict: 'user_id,subject_id'
    })

  if (targetError) {
    throw targetError
  }
}
