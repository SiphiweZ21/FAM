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
  emoji?: string
  validationStatus?: 'DRAFT' | 'REVIEWED' | 'VERIFIED'
  sourceLabel?: string
  totalMarks?: number
}

export type Question = {
  id: string
  prompt: string
  type: 'MULTIPLE_CHOICE' | 'MEMORANDUM_STEPS'
  options?: string[]
  answer?: number
  explanation: string
  knowledgePoints?: number
  source?: ExamQuestionSource
  markingPoints?: MarkingPoint[]
  totalMarks: number
}

export type ExamQuestionSource = {
  year?: number
  session?: string
  paper?: string
  questionNumber?: string
}

export type MarkingPoint = {
  id: string
  label: string
  marks: number
  memoAnswer: string
  acceptedAnswers?: string[]
  requiredKeywords?: string[]
  feedback?: string
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
  validationStatus?: 'DRAFT' | 'REVIEWED' | 'VERIFIED'
  sourceLabel?: string
  totalMarks?: number
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
  options?: {
    id: string
    text: string
  }[]
  correctOptionId?: string
  explanation: string
  knowledgePoints: number
  type?: 'MULTIPLE_CHOICE' | 'MEMORANDUM_STEPS'
  source?: ExamQuestionSource
  markingPoints?: MarkingPoint[]
  totalMarks?: number
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
