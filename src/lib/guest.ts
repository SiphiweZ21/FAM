import type { GradeId } from './grades'

export type GuestMissionProgress = {
  subjectId: string
  topicId: string
  missionId: string
  score: number
  totalQuestions: number
  percentage: number
  knowledgePoints: number
  mastered: boolean
  attempts: number
  updatedAt: string
}

export type GuestProfile = {
  id: string
  nickname: string
  gradeId: GradeId
  createdAt: string
  lastActiveAt: string
  progress: GuestMissionProgress[]
}

// Compatibility only: old saved data may be recovered. No new guest profiles.
const profilesKey = 'fam-guest-profiles-v1'
export function getGuestProfiles(): GuestProfile[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(profilesKey) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(item => typeof item?.id === 'string' && typeof item?.nickname === 'string' && Array.isArray(item?.progress)) : []
  } catch { return [] }
}
export function retireGuestSession() {
  const activeLearner = localStorage.getItem('fam-active-learner-id')
  if (getGuestProfiles().some(profile => profile.id === activeLearner)) localStorage.removeItem('fam-active-learner-id')
  localStorage.removeItem('fam-active-guest-profile-v1')
}
export function deleteGuestProfile(profileId: string) {
  const profiles = getGuestProfiles()
  // Keep a recovery backup; removing an imported profile must not erase older paths.
  let previous: GuestProfile[] = []
  try { const stored = JSON.parse(localStorage.getItem('fam-retired-guest-backup-v1') ?? '[]'); if (Array.isArray(stored)) previous = stored } catch { /* Keep the current valid records. */ }
  const archive = new Map([...previous, ...profiles].map(profile => [profile.id, profile]))
  localStorage.setItem('fam-retired-guest-backup-v1', JSON.stringify([...archive.values()]))
  localStorage.setItem(profilesKey, JSON.stringify(profiles.filter(profile => profile.id !== profileId)))
}
