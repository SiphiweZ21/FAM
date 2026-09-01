import { supabase } from './supabase'
import { getSubject } from './content'

export type TopicStatus =
  | 'STRONG'
  | 'DEVELOPING'
  | 'NEEDS_FOCUS'
  | 'IN_PROGRESS'
  | 'NOT_STARTED'

export type MissionAnalytics = {
  missionId: string
  completed: boolean
  score: number
  totalQuestions: number
  percentage: number
}

export type TopicAnalytics = {
  topicId: string
  topicName: string
  status: TopicStatus

  totalMissions: number
  completedMissions: number
  remainingMissions: number

  coverage: number
  practiceAverage: number | null
  progress: number

  revisionPriority: number

  missions: MissionAnalytics[]
}

export type SubjectAnalytics = {
  subjectId: string
  subjectName: string

  totalTopics: number
  topicsStarted: number
  topicsCompleted: number
  topicsRemaining: number

  totalMissions: number
  missionsCompleted: number
  missionsRemaining: number

  practiceAverage: number | null
  coverage: number
  progress: number

  topics: TopicAnalytics[]

  recommendedTopic:
    TopicAnalytics | null
}

type ProgressRow = {
  topic_id: string
  mission_id: string
  score: number
  total_questions: number
  percentage: number
  completed: boolean
}

function round(
  value: number
): number {
  return Math.round(value)
}

function getTopicStatus(
  completedMissions: number,
  totalMissions: number,
  practiceAverage: number | null
): TopicStatus {
  if (completedMissions === 0) {
    return 'NOT_STARTED'
  }

  if (
    completedMissions <
    totalMissions
  ) {
    if (
      practiceAverage !== null &&
      practiceAverage < 50
    ) {
      return 'NEEDS_FOCUS'
    }

    return 'IN_PROGRESS'
  }

  if (
    practiceAverage !== null &&
    practiceAverage >= 75
  ) {
    return 'STRONG'
  }

  if (
    practiceAverage !== null &&
    practiceAverage < 50
  ) {
    return 'NEEDS_FOCUS'
  }

  return 'DEVELOPING'
}

function getRevisionPriority(
  status: TopicStatus,
  practiceAverage: number | null,
  coverage: number
): number {
  if (
    status === 'NEEDS_FOCUS'
  ) {
    return 100
  }

  if (
    status === 'IN_PROGRESS'
  ) {
    return (
      80 -
      coverage / 4
    )
  }

  if (
    status === 'DEVELOPING'
  ) {
    return (
      60 -
      (
        practiceAverage ??
        0
      ) / 10
    )
  }

  if (
    status === 'NOT_STARTED'
  ) {
    return 40
  }

  return 10
}

export async function getSubjectAnalytics(
  subjectId: string
): Promise<SubjectAnalytics | null> {
  const subject =
    await getSubject(
      subjectId
    )

  if (!subject) {
    return null
  }

  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser()

  let progressRows:
    ProgressRow[] = []

  if (user) {
    const {
      data,
      error
    } =
      await supabase
        .from(
          'learner_progress'
        )
        .select(`
          topic_id,
          mission_id,
          score,
          total_questions,
          percentage,
          completed
        `)
        .eq(
          'user_id',
          user.id
        )
        .eq(
          'subject_id',
          subjectId
        )

    if (error) {
      console.error(
        'Unable to load subject progress:',
        error
      )
    } else {
      progressRows =
        (data ??
          []) as ProgressRow[]
    }
  }

  const topics:
    TopicAnalytics[] =
    subject.topics.map(
      topic => {
        const totalMissions =
          topic.missions.length

        const topicProgress =
          progressRows.filter(
            row =>
              row.topic_id ===
              topic.id
          )

        const completedRows =
          topicProgress.filter(
            row =>
              row.completed
          )

        const completedMissions =
          completedRows.length

        const remainingMissions =
          Math.max(
            0,
            totalMissions -
              completedMissions
          )

        const coverage =
          totalMissions > 0
            ? round(
                (
                  completedMissions /
                  totalMissions
                ) *
                  100
              )
            : 0

        const practiceAverage =
          completedRows.length > 0
            ? round(
                completedRows.reduce(
                  (
                    total,
                    row
                  ) =>
                    total +
                    row.percentage,
                  0
                ) /
                  completedRows.length
              )
            : null

        const progress =
          totalMissions > 0
            ? round(
                completedRows.reduce(
                  (
                    total,
                    row
                  ) =>
                    total +
                    row.percentage,
                  0
                ) /
                  totalMissions
              )
            : 0

        const status =
          getTopicStatus(
            completedMissions,
            totalMissions,
            practiceAverage
          )

        const missions:
          MissionAnalytics[] =
          topic.missions.map(
            mission => {
              const progressRow =
                topicProgress.find(
                  row =>
                    row.mission_id ===
                    mission.id
                )

              return {
                missionId:
                  mission.id,

                completed:
                  progressRow
                    ?.completed ??
                  false,

                score:
                  progressRow
                    ?.score ??
                  0,

                totalQuestions:
                  progressRow
                    ?.total_questions ??
                  0,

                percentage:
                  progressRow
                    ?.percentage ??
                  0
              }
            }
          )

        return {
          topicId:
            topic.id,

          topicName:
            topic.name,

          status,

          totalMissions,
          completedMissions,
          remainingMissions,

          coverage,
          practiceAverage,
          progress,

          revisionPriority:
            getRevisionPriority(
              status,
              practiceAverage,
              coverage
            ),

          missions
        }
      }
    )

  const totalTopics =
    topics.length

  const topicsStarted =
    topics.filter(
      topic =>
        topic.completedMissions >
        0
    ).length

  const topicsCompleted =
    topics.filter(
      topic =>
        topic.totalMissions >
          0 &&
        topic.completedMissions ===
          topic.totalMissions
    ).length

  const topicsRemaining =
    Math.max(
      0,
      totalTopics -
        topicsCompleted
    )

  const totalMissions =
    topics.reduce(
      (
        total,
        topic
      ) =>
        total +
        topic.totalMissions,
      0
    )

  const missionsCompleted =
    topics.reduce(
      (
        total,
        topic
      ) =>
        total +
        topic.completedMissions,
      0
    )

  const missionsRemaining =
    Math.max(
      0,
      totalMissions -
        missionsCompleted
    )

  const completedRows =
    progressRows.filter(
      row =>
        row.completed
    )

  const practiceAverage =
    completedRows.length > 0
      ? round(
          completedRows.reduce(
            (
              total,
              row
            ) =>
              total +
              row.percentage,
            0
          ) /
            completedRows.length
        )
      : null

  const coverage =
    totalMissions > 0
      ? round(
          (
            missionsCompleted /
            totalMissions
          ) *
            100
        )
      : 0

  const progress =
    totalMissions > 0
      ? round(
          completedRows.reduce(
            (
              total,
              row
            ) =>
              total +
              row.percentage,
            0
          ) /
            totalMissions
        )
      : 0

  const recommendedTopic =
    topics
      .filter(
        topic =>
          topic.status !==
          'STRONG'
      )
      .sort(
        (
          a,
          b
        ) =>
          b.revisionPriority -
          a.revisionPriority
      )[0] ??
    null

  return {
    subjectId,
    subjectName:
      subject.name,

    totalTopics,
    topicsStarted,
    topicsCompleted,
    topicsRemaining,

    totalMissions,
    missionsCompleted,
    missionsRemaining,

    practiceAverage,
    coverage,
    progress,

    topics,

    recommendedTopic
  }
}