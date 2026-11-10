import { hasLearningAccount } from './learning-session'
export type GradeSevenProgress = {
  completedPaths: { id: string; title: string; completedAt: string }[]
  lastPathId?: string
}

const prefix = 'fam-grade-seven-progress-v1'
function key() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${prefix}:${learnerId}` : prefix
}
export function getGradeSevenProgress(): GradeSevenProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key()) ?? '{}') as Partial<GradeSevenProgress>
    return { completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [], lastPathId: parsed.lastPathId }
  } catch { return { completedPaths: [] } }
}
function save(progress: GradeSevenProgress) {
  if (!hasLearningAccount()) return
  localStorage.setItem(key(), JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent('fam-grade-seven-progress'))
}
export function visitGradeSevenPath(id: string) {
  const progress = getGradeSevenProgress()
  if (progress.lastPathId !== id) save({ ...progress, lastPathId: id })
}
export function completeGradeSevenPath(id: string, title: string) {
  const progress = getGradeSevenProgress()
  if (progress.completedPaths.some(path => path.id === id)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { id, title, completedAt: new Date().toISOString() }] })
}
