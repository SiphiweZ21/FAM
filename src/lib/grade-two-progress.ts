import { hasLearningAccount } from './learning-session'
export type GradeTwoProgress = {
  completedPaths: { id: string; title: string; completedAt: string }[]
  lastPathId?: string
}

const prefix = 'fam-grade-two-progress-v1'
function key() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${prefix}:${learnerId}` : prefix
}
export function getGradeTwoProgress(): GradeTwoProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key()) ?? '{}') as Partial<GradeTwoProgress>
    return { completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [], lastPathId: parsed.lastPathId }
  } catch { return { completedPaths: [] } }
}
function save(progress: GradeTwoProgress) {
  if (!hasLearningAccount()) return
  localStorage.setItem(key(), JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent('fam-grade-two-progress'))
}
export function visitGradeTwoPath(id: string) {
  const progress = getGradeTwoProgress()
  if (progress.lastPathId !== id) save({ ...progress, lastPathId: id })
}
export function completeGradeTwoPath(id: string, title: string) {
  const progress = getGradeTwoProgress()
  if (progress.completedPaths.some(path => path.id === id)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { id, title, completedAt: new Date().toISOString() }] })
}
