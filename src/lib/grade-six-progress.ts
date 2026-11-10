import { hasLearningAccount } from './learning-session'
export type GradeSixProgress = {
  completedPaths: { id: string; title: string; completedAt: string }[]
  lastPathId?: string
}

const prefix = 'fam-grade-six-progress-v1'
function key() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${prefix}:${learnerId}` : prefix
}
export function getGradeSixProgress(): GradeSixProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key()) ?? '{}') as Partial<GradeSixProgress>
    return { completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [], lastPathId: parsed.lastPathId }
  } catch { return { completedPaths: [] } }
}
function save(progress: GradeSixProgress) {
  if (!hasLearningAccount()) return
  localStorage.setItem(key(), JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent('fam-grade-six-progress'))
}
export function visitGradeSixPath(id: string) {
  const progress = getGradeSixProgress()
  if (progress.lastPathId !== id) save({ ...progress, lastPathId: id })
}
export function completeGradeSixPath(id: string, title: string) {
  const progress = getGradeSixProgress()
  if (progress.completedPaths.some(path => path.id === id)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { id, title, completedAt: new Date().toISOString() }] })
}
