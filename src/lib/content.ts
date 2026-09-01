import type {
  ContentManifest,
  ManifestMission,
  Mission,
  Question,
  RemoteMission,
  Subject
} from '../types'

const baseUrl = (
  import.meta.env.VITE_CONTENT_BASE_URL ||
  'https://fam-matric-content.pages.dev/v1'
).replace(/\/$/, '')

const subjectDescriptions: Record<string, string> = {
  accounting: 'Companies, financial statements, analysis and accounting principles.',
  'agricultural-sciences': 'Animal nutrition, production, genetics and agricultural management.',
  'business-studies': 'Business environments, operations, strategies and entrepreneurship.',
  cat: 'Computer applications, information management and digital technologies.',
  'consumer-studies': 'Consumer behaviour, food, clothing, housing and entrepreneurship.',
  economics: 'Macroeconomics, microeconomics, markets and economic development.',
  'english-hl': 'Language, literature, comprehension and writing.',
  'english-fal': 'Language, comprehension, literature and writing.',
  geography: 'Climate, geomorphology, settlements, economic geography and mapwork.',
  history: 'Historical investigation, interpretation and examination preparation.',
  'life-sciences': 'DNA, genetics, evolution, reproduction and biological systems.',
  mathematics: 'Functions, calculus, algebra, geometry, trigonometry and more.',
  'physical-sciences': 'Physics and chemistry revision built around exam-style practice.',
  tourism: 'Tourism sectors, destinations, sustainability and tourism management.',
  'life-orientation': 'Personal development, careers, citizenship and wellbeing.',
  'isizulu-hl': 'IsiZulu Home Language revision and examination preparation.',
  'isizulu-fal': 'IsiZulu First Additional Language revision and examination preparation.'
}

function topicName(topicId: string): string {
  return topicId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function getManifest(): Promise<ContentManifest> {
  const response = await fetch(`${baseUrl}/manifest.json`)

  if (!response.ok) {
    throw new Error(`Unable to load FAM manifest: ${response.status}`)
  }

  return response.json()
}

export async function getSubjects(): Promise<Subject[]> {
  const manifest = await getManifest()

  const published = manifest.missions.filter(
    mission =>
      mission.status === 'PUBLISHED' &&
      mission.gradeId === 'grade-12'
  )

  const subjectMap = new Map<string, Subject>()

  for (const item of published) {
    let subject = subjectMap.get(item.subjectId)

    if (!subject) {
      subject = {
        id: item.subjectId,
        name: item.subjectName,
        emoji: item.emoji || '📚',
        description:
          subjectDescriptions[item.subjectId] ||
          `Grade 12 ${item.subjectName} revision and exam preparation.`,
        topics: []
      }

      subjectMap.set(item.subjectId, subject)
    }

    let topic = subject.topics.find(t => t.id === item.topicId)

    if (!topic) {
      topic = {
        id: item.topicId,
        name: topicName(item.topicId),
        missions: []
      }

      subject.topics.push(topic)
    }

    topic.missions.push({
      id: item.id,
      title: item.title,
      shortTitle: item.shortTitle,
      description: item.description,
      premium: item.access === 'PREMIUM',
      access: item.access,
      contentPath: item.contentPath,
      questionCount: item.questionCount,
      questions: []
    })
  }

  for (const subject of subjectMap.values()) {
    for (const topic of subject.topics) {
      topic.missions.sort((a, b) => {
        const aManifest = published.find(m => m.id === a.id)
        const bManifest = published.find(m => m.id === b.id)

        return (aManifest?.order ?? 0) - (bManifest?.order ?? 0)
      })
    }
  }

  return Array.from(subjectMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export async function getSubject(
  subjectId: string
): Promise<Subject | undefined> {
  const subjects = await getSubjects()
  return subjects.find(subject => subject.id === subjectId)
}

export async function getMission(
  subjectId: string,
  topicId: string,
  missionId: string
): Promise<Mission | undefined> {
  const manifest = await getManifest()

  const manifestMission: ManifestMission | undefined =
    manifest.missions.find(
      mission =>
        mission.subjectId === subjectId &&
        mission.topicId === topicId &&
        mission.id === missionId &&
        mission.status === 'PUBLISHED'
    )

  if (!manifestMission) return undefined

  const response = await fetch(
    `${baseUrl}/${manifestMission.contentPath}`
  )

  if (!response.ok) {
    throw new Error(`Unable to load mission: ${response.status}`)
  }

  const remote: RemoteMission = await response.json()

  const questions: Question[] = remote.questions.map(question => {
    const answerIndex = question.options.findIndex(
      option => option.id === question.correctOptionId
    )

    return {
      id: question.id,
      prompt: question.text,
      options: question.options.map(option => option.text),
      answer: answerIndex,
      explanation: question.explanation,
      knowledgePoints: question.knowledgePoints
    }
  })

  return {
    id: remote.id,
    title: remote.title,
    shortTitle: remote.shortTitle,
    description: remote.description,
    premium: remote.access === 'PREMIUM',
    access: remote.access,
    contentPath: manifestMission.contentPath,
    questionCount: questions.length,
    questions
  }
}
