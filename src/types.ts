export type Subject = {
  id: string
  name: string
  emoji: string
  description: string
  topics: Topic[]
}

export type Topic = {
  id: string
  name: string
  missions: Mission[]
}

export type Mission = {
  id: string
  title: string
  shortTitle?: string
  description: string
  premium: boolean
  access: 'FREE' | 'PREMIUM'
  contentPath: string
  questionCount: number
  questions: Question[]
}

export type Question = {
  id: string
  prompt: string
  options: string[]
  answer: number
  explanation: string
  knowledgePoints?: number
}

export type ManifestMission = {
  id: string
  topicId: string
  order: number
  title: string
  shortTitle: string
  gradeId: string
  gradeName: string
  subjectId: string
  subjectName: string
  description: string
  emoji: string
  startingLives: number
  offline: boolean
  access: 'FREE' | 'PREMIUM'
  questionCount: number
  maximumKnowledgePoints: number
  contentVersion: number
  status: string
  contentPath: string
}

export type ContentManifest = {
  schemaVersion: number
  generatedAt: string
  missionCount: number
  missions: ManifestMission[]
}

export type RemoteQuestion = {
  id: string
  text: string
  options: {
    id: string
    text: string
  }[]
  correctOptionId: string
  explanation: string
  knowledgePoints: number
}

export type RemoteMission = {
  id: string
  topicId: string
  order: number
  title: string
  shortTitle: string
  gradeId: string
  gradeName: string
  subjectId: string
  subjectName: string
  description: string
  emoji: string
  startingLives: number
  offline: boolean
  access: 'FREE' | 'PREMIUM'
  questions: RemoteQuestion[]
}
