import { hasLearningAccount } from './learning-session'
export type GradeOneWorld = 'number' | 'word' | 'life' | 'coding'

export type CompletedPath = {
  key: string
  world: GradeOneWorld
  pathId: string
  title: string
  badge: string
  completedAt: string
}

export type LastActivity = {
  title: string
  route: string
  world: GradeOneWorld | 'homework'
  updatedAt: string
}

export type GradeOneProgress = {
  schemaVersion: 1
  completedPaths: CompletedPath[]
  homeworkAttempts: number
  homeworkCorrect: number
  lastActivity?: LastActivity
}

const legacyStorageKey = 'fam-grade-one-progress-v1'

function storageKey() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${legacyStorageKey}:${learnerId}` : legacyStorageKey
}

const migrationOwnerKey = 'fam-grade-one-progress-migrated-to'
export const gradeOnePathTotal = 23

const emptyProgress: GradeOneProgress = {
  schemaVersion: 1,
  completedPaths: [],
  homeworkAttempts: 0,
  homeworkCorrect: 0
}

export function getGradeOneProgress(): GradeOneProgress {
  try {
    const key = storageKey()
    const canUseLegacy = key === legacyStorageKey || !localStorage.getItem(migrationOwnerKey)
    const stored = localStorage.getItem(key) ?? (canUseLegacy ? localStorage.getItem(legacyStorageKey) : null)
    if (!stored) return { ...emptyProgress, completedPaths: [] }
    const parsed = JSON.parse(stored) as Partial<GradeOneProgress>
    return {
      schemaVersion: 1,
      completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [],
      homeworkAttempts: Number(parsed.homeworkAttempts) || 0,
      homeworkCorrect: Number(parsed.homeworkCorrect) || 0,
      lastActivity: parsed.lastActivity
    }
  } catch {
    return { ...emptyProgress, completedPaths: [] }
  }
}

function save(progress: GradeOneProgress) {
  if (!hasLearningAccount()) return
  const key = storageKey()
  localStorage.setItem(key, JSON.stringify(progress))
  if (key !== legacyStorageKey) localStorage.setItem(migrationOwnerKey, key.slice(legacyStorageKey.length + 1))
  window.dispatchEvent(new CustomEvent('fam-grade-one-progress'))
}

export function replaceGradeOneProgress(progress: GradeOneProgress) {
  const current = getGradeOneProgress()
  if (JSON.stringify(current) === JSON.stringify(progress)) return
  save(progress)
}

export function setLastGradeOneActivity(title: string, route: string, world: LastActivity['world']) {
  const progress = getGradeOneProgress()
  save({ ...progress, lastActivity: { title, route, world, updatedAt: new Date().toISOString() } })
}

export function completeGradeOnePath(world: GradeOneWorld, pathId: string, title: string, badge: string) {
  const progress = getGradeOneProgress()
  const key = `${world}:${pathId}`
  if (progress.completedPaths.some(path => path.key === key)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { key, world, pathId, title, badge, completedAt: new Date().toISOString() }] })
}

export function recordGradeOneHomework(correct: boolean) {
  const progress = getGradeOneProgress()
  save({ ...progress, homeworkAttempts: progress.homeworkAttempts + 1, homeworkCorrect: progress.homeworkCorrect + Number(correct) })
}

export function gradeOneCompletion(progress: GradeOneProgress) {
  return Math.round((Math.min(progress.completedPaths.length, gradeOnePathTotal) / gradeOnePathTotal) * 100)
}
