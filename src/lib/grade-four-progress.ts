import { hasLearningAccount } from './learning-session'
export type GradeFourProgress = {
  completedPaths: { id: string; title: string; completedAt: string }[]
  lastPathId?: string
}

const prefix = 'fam-grade-four-progress-v1'
function key() {
  const learnerId = localStorage.getItem('fam-active-learner-id')
  return learnerId ? `${prefix}:${learnerId}` : prefix
}
export function getGradeFourProgress(): GradeFourProgress {
  try {
    const parsed = JSON.parse(localStorage.getItem(key()) ?? '{}') as Partial<GradeFourProgress>
    return { completedPaths: Array.isArray(parsed.completedPaths) ? parsed.completedPaths : [], lastPathId: parsed.lastPathId }
  } catch { return { completedPaths: [] } }
}
function save(progress: GradeFourProgress) {
  if (!hasLearningAccount()) return
  localStorage.setItem(key(), JSON.stringify(progress))
  window.dispatchEvent(new CustomEvent('fam-grade-four-progress'))
}
export function visitGradeFourPath(id: string) {
  const progress = getGradeFourProgress()
  if (progress.lastPathId !== id) save({ ...progress, lastPathId: id })
}
export function completeGradeFourPath(id: string, title: string) {
  const progress = getGradeFourProgress()
  if (progress.completedPaths.some(path => path.id === id)) return
  save({ ...progress, completedPaths: [...progress.completedPaths, { id, title, completedAt: new Date().toISOString() }] })
}
