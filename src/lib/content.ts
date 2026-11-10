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

let manifestCache: ContentManifest | null = null
let manifestRequest: Promise<ContentManifest> | null = null
let subjectsCache: Subject[] | null = null
let subjectsRequest: Promise<Subject[]> | null = null
const missionRequests = new Map<string, Promise<Mission | undefined>>()
const missionManifestIndex = new Map<string, ManifestMission>()
const manifestCacheKey = 'fam-content-manifest-v1'
const manifestCacheTtlMs = 5 * 60 * 1000

type StoredManifest = {
  cachedAt: number
  manifest: ContentManifest
}

function indexManifest(manifest: ContentManifest) {
  missionManifestIndex.clear()
  for (const mission of manifest.missions) {
    missionManifestIndex.set(
      `${mission.subjectId}:${mission.topicId}:${mission.id}`,
      mission
    )
  }
}

function readStoredManifest(): ContentManifest | null {
  try {
    const stored = localStorage.getItem(manifestCacheKey)
    if (!stored) return null

    const parsed = JSON.parse(stored) as StoredManifest
    if (
      !parsed.manifest?.missions ||
      Date.now() - parsed.cachedAt > manifestCacheTtlMs
    ) {
      localStorage.removeItem(manifestCacheKey)
      return null
    }

    indexManifest(parsed.manifest)
    return parsed.manifest
  } catch {
    localStorage.removeItem(manifestCacheKey)
    return null
  }
}

function storeManifest(manifest: ContentManifest) {
  try {
    localStorage.setItem(manifestCacheKey, JSON.stringify({
      cachedAt: Date.now(),
      manifest
    } satisfies StoredManifest))
  } catch {
    // Content still works when storage is unavailable or full.
  }
}

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

function topicName(mission: ManifestMission): string {
  const title = mission.title
    .replace(/\s+(Foundations|Applications|Exam Practice)$/i, '')
    .trim()

  if (title && title !== mission.title) return title

  return mission.topicId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function getManifest(): Promise<ContentManifest> {
  if (manifestCache) return manifestCache
  if (manifestRequest) return manifestRequest

  const storedManifest = readStoredManifest()
  if (storedManifest) {
    manifestCache = storedManifest
    return storedManifest
  }

  // A five-minute version bucket avoids stale releases without defeating the
  // browser and CDN cache on every page reload.
  const cacheVersion = Math.floor(Date.now() / manifestCacheTtlMs)
  const manifestUrl = `${baseUrl}/manifest.json?v=${cacheVersion}`

  manifestRequest = fetch(manifestUrl, { cache: 'default' })
    .then(async response => {
      if (!response.ok) throw new Error(`Unable to load FAM manifest: ${response.status}`)
      const manifest = await response.json() as ContentManifest
      manifestCache = manifest
      indexManifest(manifest)
      storeManifest(manifest)
      return manifest
    })
    .catch(error => {
      manifestRequest = null
      throw error
    })

  return manifestRequest
}

export async function getSubjects(): Promise<Subject[]> {
  if (subjectsCache) return subjectsCache
  if (subjectsRequest) return subjectsRequest

  subjectsRequest = buildSubjects()
    .then(subjects => {
      subjectsCache = subjects
      return subjects
    })
    .catch(error => {
      subjectsRequest = null
      throw error
    })

  return subjectsRequest
}

async function buildSubjects(): Promise<Subject[]> {
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
        name: topicName(item),
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
      validationStatus: item.validationStatus,
      sourceLabel: item.sourceLabel,
      totalMarks: item.totalMarks,
      questions: []
    })
  }

  for (const subject of subjectMap.values()) {
    for (const topic of subject.topics) {
      topic.missions.sort((a, b) => {
        const aManifest = missionManifestIndex.get(`${subject.id}:${topic.id}:${a.id}`)
        const bManifest = missionManifestIndex.get(`${subject.id}:${topic.id}:${b.id}`)

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
  const cacheKey = `${subjectId}:${topicId}:${missionId}`
  const existingRequest = missionRequests.get(cacheKey)
  if (existingRequest) return existingRequest

  const request = loadMission(subjectId, topicId, missionId)
    .catch(error => {
      missionRequests.delete(cacheKey)
      throw error
    })
  missionRequests.set(cacheKey, request)
  return request
}

async function loadMission(
  subjectId: string,
  topicId: string,
  missionId: string
): Promise<Mission | undefined> {
  const manifest = await getManifest()

  const manifestMission = missionManifestIndex.get(
    `${subjectId}:${topicId}:${missionId}`
  )

  if (!manifestMission || manifestMission.status !== 'PUBLISHED') return undefined

  const contentUrl = new URL(
    `${baseUrl}/${manifestMission.contentPath}`
  )

  if (manifestMission.checksum) {
    contentUrl.searchParams.set('v', manifestMission.checksum)
  }

  const response = await fetch(contentUrl.toString(), {
    cache: 'force-cache'
  })

  if (!response.ok) {
    throw new Error(`Unable to load mission: ${response.status}`)
  }

  const remote: RemoteMission = await response.json()

  const questions: Question[] = remote.questions.map(question => {
    const answerIndex = (question.options ?? []).findIndex(
      option => option.id === question.correctOptionId
    )

    return {
      id: question.id,
      prompt: question.text,
      type: question.type ?? (question.markingPoints?.length ? 'MEMORANDUM_STEPS' : 'MULTIPLE_CHOICE'),
      options: question.options?.map(option => option.text) ?? [],
      answer: answerIndex >= 0 ? answerIndex : undefined,
      explanation: question.explanation,
      knowledgePoints: question.knowledgePoints,
      source: question.source,
      markingPoints: question.markingPoints,
      totalMarks: question.totalMarks ?? question.markingPoints?.reduce((total, point) => total + point.marks, 0) ?? 1
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
    questions,
    emoji: remote.emoji
  }
}
