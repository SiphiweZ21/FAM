import { hasLearningAccount } from './learning-session'
export type GradeThreeProgress = {
  completedPaths: { id: string; title: string; completedAt: string }[]
  lastPathId?: string
}

const prefix = 'fam-grade-three-progress-v1'
function key() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${prefix}:${learnerId}` : prefix
}
export function getGradeThreeProgress(): GradeThreeProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key()) ?? '{}') as Partial<GradeThreeProgress>
    return { completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [], lastPathId: parsed.lastPathId }
  } catch { return { completedPaths: [] } }
}
function save(progress: GradeThreeProgress) {
  if (!hasLearningAccount()) return
  localStorage.setItem(key(), JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent('fam-grade-three-progress'))
}
export function visitGradeThreePath(id: string) {
  const progress = getGradeThreeProgress()
  if (progress.lastPathId !== id) save({ ...progress, lastPathId: id })
}
export function completeGradeThreePath(id: string, title: string) {
  const progress = getGradeThreeProgress()
  if (progress.completedPaths.some(path => path.id === id)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { id, title, completedAt: new Date().toISOString() }] })
}
