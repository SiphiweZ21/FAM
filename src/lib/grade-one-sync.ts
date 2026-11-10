import { supabase } from './supabase'
import { getGradeOneProgress, replaceGradeOneProgress, type CompletedPath, type GradeOneProgress } from './grade-one-progress'

export type GradeOneSyncStatus = 'local' | 'syncing' | 'synced' | 'offline'

let syncing = false

function emitStatus(status: GradeOneSyncStatus) {
  window.dispatchEvent(new CustomEvent('fam-grade-one-sync', { detail: status }))
}

function dateValue(value?: string) {
  const date = value ? Date.parse(value) : 0
  return Number.isFinite(date) ? date : 0
}

export function mergeGradeOneProgress(local: GradeOneProgress, remote?: Partial<GradeOneProgress> | null): GradeOneProgress {
  if (!remote) return local
  const paths = new Map<string, CompletedPath>()
  for (const path of [...(remote.completedPaths ?? []), ...local.completedPaths]) {
    const existing = paths.get(path.key)
    if (!existing || dateValue(path.completedAt) < dateValue(existing.completedAt)) paths.set(path.key, path)
  }
  const localActivity = local.lastActivity
  const remoteActivity = remote.lastActivity
  const lastActivity = dateValue(localActivity?.updatedAt) >= dateValue(remoteActivity?.updatedAt) ? localActivity : remoteActivity
  return {
    schemaVersion: 1,
    completedPaths: [...paths.values()].sort((a, b) => dateValue(a.completedAt) - dateValue(b.completedAt)),
    homeworkAttempts: Math.max(local.homeworkAttempts, Number(remote.homeworkAttempts) || 0),
    homeworkCorrect: Math.max(local.homeworkCorrect, Number(remote.homeworkCorrect) || 0),
    lastActivity
  }
}

export async function syncGradeOneProgress() {
  if (syncing) return
  syncing = true
  emitStatus('syncing')
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { emitStatus('local'); return }
    let childId: string | undefined
    const preferredChild = localStorage.getItem('fam-active-learner-id')
    let familyQuery = supabase.from('learner_guardians').select('learner_id').eq('user_id', session.user.id)
    if (preferredChild) familyQuery = familyQuery.eq('learner_id', preferredChild)
    const { data: memberships, error: familyError } = await familyQuery.limit(1)
    if (!familyError && memberships?.[0]?.learner_id) {
      const candidateId = memberships[0].learner_id
      const { data: profile } = await supabase.from('learner_profiles').select('grade').eq('id', candidateId).maybeSingle()
      if (profile?.grade === 1) childId = candidateId
    }
    const progressQuery = supabase.from('grade_one_progress').select('progress_data')
    const { data, error } = childId
      ? await progressQuery.eq('child_id', childId).maybeSingle()
      : await progressQuery.eq('user_id', session.user.id).maybeSingle()
    if (error) throw error
    const merged = mergeGradeOneProgress(getGradeOneProgress(), data?.progress_data as Partial<GradeOneProgress> | undefined)
    replaceGradeOneProgress(merged)
    const write = childId
      ? data
        ? supabase.from('grade_one_progress').update({ progress_data: merged, updated_at: new Date().toISOString() }).eq('child_id', childId)
        : supabase.from('grade_one_progress').insert({ user_id: session.user.id, child_id: childId, progress_data: merged, updated_at: new Date().toISOString() })
      : supabase.from('grade_one_progress').upsert({ user_id: session.user.id, progress_data: merged, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    const { error: writeError } = await write
    if (writeError) throw writeError
    emitStatus('synced')
  } catch (error) {
    console.warn('Grade 1 progress remains local until syncing is available:', error)
    emitStatus(navigator.onLine ? 'local' : 'offline')
  } finally {
    syncing = false
  }
}

export function initializeGradeOneProgressSync() {
  let timer: number | undefined
  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => void syncGradeOneProgress(), 700)
  }
  const onOnline = () => void syncGradeOneProgress()
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) schedule()
    else emitStatus('local')
  })
  window.addEventListener('fam-grade-one-progress', schedule)
  window.addEventListener('online', onOnline)
  void syncGradeOneProgress()
  return () => {
    window.clearTimeout(timer)
    subscription.unsubscribe()
    window.removeEventListener('fam-grade-one-progress', schedule)
    window.removeEventListener('online', onOnline)
  }
}
