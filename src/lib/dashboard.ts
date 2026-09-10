// src/lib/dashboard.ts

import {
  getSubjects
} from './content'

import {
  getLearnerAccessMode,
  type LearnerAccessMode
} from './access'

import { supabase } from './supabase'

export type PerformanceStatus =
  | 'ON_TRACK'
  | 'ALMOST_THERE'
  | 'NEEDS_ATTENTION'
  | 'FOCUS_NEEDED'
  | 'NO_DATA'

export type TrendStatus =
  | 'IMPROVING'
  | 'DECLINING'
  | 'STABLE'
  | 'NEW'

export type ProgressConfidence =
  | 'LOW'
  | 'BUILDING'
  | 'GOOD'
  | 'STRONG'

export type TopicCompletionStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'

export type DashboardTopic = {
  topicId: string
  name: string

  practiceAverage: number | null
  recentPerformance: number | null

  missionsCompleted: number
  missionsRemaining: number
  totalMissions: number

  coverage: number
  topicProgress: number

  attempts: number

  completionStatus:
    TopicCompletionStatus

  trend: TrendStatus
  trendChange: number | null
}

export type DashboardSubject = {
  subjectId: string
  name: string
  emoji: string

  accessMode: LearnerAccessMode

  targetMark: number
  currentSchoolMark: number | null

  practiceAverage: number | null
  recentPerformance: number | null

  examReadiness: number | null

  topicsStarted: number
  topicsCompleted: number
  topicsRemaining: number
  totalTopics: number

  missionsCompleted: number
  missionsRemaining: number
  totalMissions: number

  freeMissionsCompleted: number
  premiumMissionsRemaining: number

  coverage: number

  overallSubjectProgress: number

  knowledgePoints: number
  attempts: number

  gapToTarget: number | null

  progressConfidence:
    ProgressConfidence

  canCalculateTargetProgress: boolean
  canCalculateTrend: boolean
  canRecommendWeakTopics: boolean

  status: PerformanceStatus

  trend: TrendStatus
  trendChange: number | null

  topics: DashboardTopic[]

  strongestTopic: DashboardTopic | null
  weakestTopic: DashboardTopic | null
}

export type StudyRecommendation = {
  type:
    | 'START_FREE'
    | 'UPGRADE'
    | 'STUDY'

  subjectId: string
  subjectName: string

  topicId?: string
  topicName?: string

  missionId?: string
  missionTitle?: string

  reason: string
  message: string
}

export type LearnerDashboard = {
  accessMode: LearnerAccessMode

  subjects: DashboardSubject[]

  selectedSubjects: number

  topicsStarted: number
  topicsCompleted: number
  totalTopics: number

  missionsCompleted: number
  totalMissions: number

  totalAttempts: number

  overallPracticeAverage: number | null
  recentPerformance: number | null

  targetAverage: number | null

  totalKnowledgePoints: number

  strongestSubject: DashboardSubject | null
  focusSubject: DashboardSubject | null

  strongestTopic: {
    subjectName: string
    topic: DashboardTopic
  } | null

  weakestTopic: {
    subjectName: string
    topic: DashboardTopic
  } | null

  trend: TrendStatus
  trendChange: number | null

  recommendation: StudyRecommendation | null
}

type ProgressRow = {
  subject_id: string
  topic_id: string
  mission_id: string

  score: number
  total_questions: number
  percentage: number
  knowledge_points: number

  completed: boolean
}

type AttemptRow = {
  subject_id: string
  topic_id: string
  mission_id: string

  score: number
  total_questions: number
  percentage: number
  knowledge_points: number

  attempted_at: string
}

function average(
  values: number[]
) {
  if (values.length === 0) {
    return null
  }

  return Math.round(
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  )
}

function percentage(
  completed: number,
  total: number
) {
  if (total === 0) {
    return 0
  }

  return Math.round(
    (completed / total) * 100
  )
}

function getStatus(
  performance: number | null,
  target: number,
  canCalculateTargetProgress: boolean
): PerformanceStatus {
  if (
    performance === null ||
    !canCalculateTargetProgress
  ) {
    return 'NO_DATA'
  }

  const gap =
    target - performance

  if (gap <= 0) {
    return 'ON_TRACK'
  }

  if (gap <= 5) {
    return 'ALMOST_THERE'
  }

  if (gap <= 15) {
    return 'NEEDS_ATTENTION'
  }

  return 'FOCUS_NEEDED'
}

function getConfidence(
  missionsCompleted: number,
  coverage: number,
  topicsStarted: number,
  totalTopics: number
): ProgressConfidence {
  if (
    missionsCompleted <= 1 ||
    topicsStarted <= 1
  ) {
    return 'LOW'
  }

  const topicBreadth =
    totalTopics > 0
      ? topicsStarted / totalTopics
      : 0

  if (
    coverage < 25 ||
    topicBreadth < 0.25
  ) {
    return 'BUILDING'
  }

  if (
    coverage < 60 ||
    topicBreadth < 0.6
  ) {
    return 'GOOD'
  }

  return 'STRONG'
}

function getTrend(
  attempts: AttemptRow[]
): {
  trend: TrendStatus
  change: number | null
} {
  if (attempts.length < 2) {
    return {
      trend: 'NEW',
      change: null
    }
  }

  const sorted =
    [...attempts].sort(
      (a, b) =>
        new Date(
          a.attempted_at
        ).getTime() -
        new Date(
          b.attempted_at
        ).getTime()
    )

  const recent =
    sorted.slice(-3)

  const earlier =
    sorted.slice(
      Math.max(
        0,
        sorted.length - 6
      ),
      Math.max(
        0,
        sorted.length - 3
      )
    )

  if (earlier.length === 0) {
    const first =
      sorted[0].percentage

    const latest =
      sorted[
        sorted.length - 1
      ].percentage

    const change =
      latest - first

    if (change >= 5) {
      return {
        trend: 'IMPROVING',
        change
      }
    }

    if (change <= -5) {
      return {
        trend: 'DECLINING',
        change
      }
    }

    return {
      trend: 'STABLE',
      change
    }
  }

  const recentAverage =
    average(
      recent.map(
        attempt =>
          attempt.percentage
      )
    ) ?? 0

  const earlierAverage =
    average(
      earlier.map(
        attempt =>
          attempt.percentage
      )
    ) ?? 0

  const change =
    recentAverage -
    earlierAverage

  if (change >= 5) {
    return {
      trend: 'IMPROVING',
      change
    }
  }

  if (change <= -5) {
    return {
      trend: 'DECLINING',
      change
    }
  }

  return {
    trend: 'STABLE',
    change
  }
}

function getRecentPerformance(
  attempts: AttemptRow[]
) {
  const sorted =
    [...attempts].sort(
      (a, b) =>
        new Date(
          b.attempted_at
        ).getTime() -
        new Date(
          a.attempted_at
        ).getTime()
    )

  return average(
    sorted
      .slice(0, 5)
      .map(
        attempt =>
          attempt.percentage
      )
  )
}

export async function getLearnerDashboard():
Promise<LearnerDashboard | null> {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const user = session?.user ?? null

  if (!user) {
    return null
  }

  const [
    accessMode,
    availableSubjects,
    selectedSubjectsResult,
    targetsResult,
    progressResult,
    attemptsResult
  ] =
    await Promise.all([
      getLearnerAccessMode(),

      getSubjects(),

      supabase
        .from(
          'learner_subjects'
        )
        .select('subject_id')
        .eq(
          'user_id',
          user.id
        ),

      supabase
        .from(
          'subject_targets'
        )
        .select(
          `
          subject_id,
          current_mark,
          target_mark
          `
        )
        .eq(
          'user_id',
          user.id
        ),

      supabase
        .from(
          'learner_progress'
        )
        .select(
          `
          subject_id,
          topic_id,
          mission_id,
          score,
          total_questions,
          percentage,
          knowledge_points,
          completed
          `
        )
        .eq(
          'user_id',
          user.id
        ),

      supabase
        .from(
          'mission_attempts'
        )
        .select(
          `
          subject_id,
          topic_id,
          mission_id,
          score,
          total_questions,
          percentage,
          knowledge_points,
          attempted_at
          `
        )
        .eq(
          'user_id',
          user.id
        )
        .order(
          'attempted_at',
          {
            ascending: true
          }
        )
    ])

  if (
    selectedSubjectsResult.error
  ) {
    throw selectedSubjectsResult.error
  }

  if (targetsResult.error) {
    throw targetsResult.error
  }

  if (progressResult.error) {
    throw progressResult.error
  }

  if (attemptsResult.error) {
    throw attemptsResult.error
  }

  const selectedIds =
    new Set(
      (
        selectedSubjectsResult.data ??
        []
      ).map(
        row => row.subject_id
      )
    )

  const targetMap =
    new Map(
      (
        targetsResult.data ??
        []
      ).map(
        target => [
          target.subject_id,
          target
        ]
      )
    )

  const progress =
    (
      progressResult.data ??
      []
    ) as ProgressRow[]

  const attempts =
    (
      attemptsResult.data ??
      []
    ) as AttemptRow[]

  const dashboardSubjects:
  DashboardSubject[] =
    availableSubjects
      .filter(
        subject =>
          selectedIds.has(
            subject.id
          )
      )
      .map(subject => {
        const target =
          targetMap.get(
            subject.id
          )

        const subjectProgress =
          progress.filter(
            row =>
              row.subject_id ===
              subject.id &&
              row.completed
          )

        const subjectAttempts =
          attempts.filter(
            attempt =>
              attempt.subject_id ===
              subject.id
          )

        const allMissions =
          subject.topics.flatMap(
            topic =>
              topic.missions.map(
                mission => ({
                  ...mission,
                  topicId:
                    topic.id
                })
              )
          )

        const completedMissionIds =
          new Set(
            subjectProgress.map(
              row =>
                row.mission_id
            )
          )

        const totalMissions =
          allMissions.length

        const missionsCompleted =
          subjectProgress.length

        const missionsRemaining =
          Math.max(
            0,
            totalMissions -
              missionsCompleted
          )

        const practiceAverage =
          average(
            subjectProgress.map(
              row =>
                row.percentage
            )
          )

        const recentPerformance =
          getRecentPerformance(
            subjectAttempts
          )

        const targetMark =
          target?.target_mark ??
          70

        const currentSchoolMark =
          target?.current_mark ??
          null

        const subjectCoverage =
          percentage(
            missionsCompleted,
            totalMissions
          )

        /*
         * FAM Exam Readiness V1
         *
         * 70% = performance
         * 30% = subject coverage
         *
         * This is a study guidance score,
         * not a prediction of the final
         * Matric examination result.
         */
        const examReadiness =
          practiceAverage !== null
            ? Math.round(
                practiceAverage * 0.7 +
                subjectCoverage * 0.3
              )
            : null

        const totalProgressPoints =
          subjectProgress.reduce(
            (sum, row) =>
              sum +
              row.percentage,
            0
          )

        const overallSubjectProgress =
          totalMissions > 0
            ? Math.round(
                totalProgressPoints /
                  totalMissions
              )
            : 0

        const topics:
        DashboardTopic[] =
          subject.topics.map(
            topic => {
              const topicProgress =
                subjectProgress.filter(
                  row =>
                    row.topic_id ===
                    topic.id
                )

              const topicAttempts =
                subjectAttempts.filter(
                  attempt =>
                    attempt.topic_id ===
                    topic.id
                )

              const totalTopicMissions =
                topic.missions.length

              const topicMissionsCompleted =
                topicProgress.length

              const topicMissionsRemaining =
                Math.max(
                  0,
                  totalTopicMissions -
                    topicMissionsCompleted
                )

              const topicCoverage =
                percentage(
                  topicMissionsCompleted,
                  totalTopicMissions
                )

              const topicPracticeAverage =
                average(
                  topicProgress.map(
                    row =>
                      row.percentage
                  )
                )

              const totalTopicProgressPoints =
                topicProgress.reduce(
                  (sum, row) =>
                    sum +
                    row.percentage,
                  0
                )

              const topicProgressScore =
                totalTopicMissions > 0
                  ? Math.round(
                      totalTopicProgressPoints /
                        totalTopicMissions
                    )
                  : 0

              let completionStatus:
              TopicCompletionStatus =
                'NOT_STARTED'

              if (
                topicMissionsCompleted >
                  0 &&
                topicMissionsCompleted <
                  totalTopicMissions
              ) {
                completionStatus =
                  'IN_PROGRESS'
              }

              if (
                totalTopicMissions >
                  0 &&
                topicMissionsCompleted >=
                  totalTopicMissions
              ) {
                completionStatus =
                  'COMPLETED'
              }

              const topicTrend =
                getTrend(
                  topicAttempts
                )

              return {
                topicId:
                  topic.id,

                name:
                  topic.name,

                practiceAverage:
                  topicPracticeAverage,

                recentPerformance:
                  getRecentPerformance(
                    topicAttempts
                  ),

                missionsCompleted:
                  topicMissionsCompleted,

                missionsRemaining:
                  topicMissionsRemaining,

                totalMissions:
                  totalTopicMissions,

                coverage:
                  topicCoverage,

                topicProgress:
                  topicProgressScore,

                attempts:
                  topicAttempts.length,

                completionStatus,

                trend:
                  topicTrend.trend,

                trendChange:
                  topicTrend.change
              }
            }
          )

        const topicsStarted =
          topics.filter(
            topic =>
              topic.completionStatus !==
              'NOT_STARTED'
          ).length

        const topicsCompleted =
          topics.filter(
            topic =>
              topic.completionStatus ===
              'COMPLETED'
          ).length

        const totalTopics =
          topics.length

        const topicsRemaining =
          Math.max(
            0,
            totalTopics -
              topicsCompleted
          )

        const freeMissions =
          allMissions.filter(
            mission =>
              mission.access ===
              'FREE'
          )

        const premiumMissions =
          allMissions.filter(
            mission =>
              mission.access ===
              'PREMIUM'
          )

        const freeMissionsCompleted =
          freeMissions.filter(
            mission =>
              completedMissionIds.has(
                mission.id
              )
          ).length

        const premiumMissionsRemaining =
          premiumMissions.filter(
            mission =>
              !completedMissionIds.has(
                mission.id
              )
          ).length

        const confidence =
          getConfidence(
            missionsCompleted,
            subjectCoverage,
            topicsStarted,
            totalTopics
          )

        const canCalculateTargetProgress =
          accessMode ===
            'PREMIUM' &&
          missionsCompleted >= 3 &&
          topicsStarted >= 2

        const canCalculateTrend =
          subjectAttempts.length >= 3

        const topicsWithData =
          topics.filter(
            topic =>
              topic.practiceAverage !==
              null
          )

        const canRecommendWeakTopics =
          accessMode ===
            'PREMIUM' &&
          topicsWithData.length >= 2

        const gapToTarget =
          canCalculateTargetProgress &&
          practiceAverage !== null
            ? targetMark -
              practiceAverage
            : null

        const subjectTrend =
          getTrend(
            subjectAttempts
          )

        const strongestTopic =
          topicsWithData.length >
          0
            ? [
                ...topicsWithData
              ].sort(
                (a, b) =>
                  (
                    b.practiceAverage ??
                    0
                  ) -
                  (
                    a.practiceAverage ??
                    0
                  )
              )[0]
            : null

        const weakestTopic =
          topicsWithData.length >
          0
            ? [
                ...topicsWithData
              ].sort(
                (a, b) =>
                  (
                    a.practiceAverage ??
                    0
                  ) -
                  (
                    b.practiceAverage ??
                    0
                  )
              )[0]
            : null

        const knowledgePoints =
          subjectProgress.reduce(
            (sum, row) =>
              sum +
              row.knowledge_points,
            0
          )

        return {
          subjectId:
            subject.id,

          name:
            subject.name,

          emoji:
            subject.emoji,

          accessMode,

          targetMark,

          currentSchoolMark,

          practiceAverage,

          recentPerformance,

          examReadiness,

          topicsStarted,
          topicsCompleted,
          topicsRemaining,
          totalTopics,

          missionsCompleted,
          missionsRemaining,
          totalMissions,

          freeMissionsCompleted,
          premiumMissionsRemaining,

          coverage:
            subjectCoverage,

          overallSubjectProgress,

          knowledgePoints,

          attempts:
            subjectAttempts.length,

          gapToTarget,

          progressConfidence:
            confidence,

          canCalculateTargetProgress,
          canCalculateTrend,
          canRecommendWeakTopics,

          status:
            getStatus(
              practiceAverage,
              targetMark,
              canCalculateTargetProgress
            ),

          trend:
            subjectTrend.trend,

          trendChange:
            subjectTrend.change,

          topics,

          strongestTopic,
          weakestTopic
        }
      })

  const subjectsWithPerformance =
    dashboardSubjects.filter(
      subject =>
        subject.practiceAverage !==
        null
    )

  const strongestSubject =
    subjectsWithPerformance.length >
    0
      ? [
          ...subjectsWithPerformance
        ].sort(
          (a, b) =>
            (
              b.practiceAverage ??
              0
            ) -
            (
              a.practiceAverage ??
              0
            )
        )[0]
      : null

  const focusSubject =
    dashboardSubjects.length > 0
      ? [
          ...dashboardSubjects
        ].sort(
          (a, b) =>
            a.overallSubjectProgress -
            b.overallSubjectProgress
        )[0]
      : null

  const allTopics =
    dashboardSubjects.flatMap(
      subject =>
        subject.topics
          .filter(
            topic =>
              topic.practiceAverage !==
              null
          )
          .map(topic => ({
            subjectName:
              subject.name,
            topic
          }))
    )

  const strongestTopic =
    allTopics.length > 0
      ? [...allTopics].sort(
          (a, b) =>
            (
              b.topic.practiceAverage ??
              0
            ) -
            (
              a.topic.practiceAverage ??
              0
            )
        )[0]
      : null

  const weakestTopic =
    allTopics.length > 0
      ? [...allTopics].sort(
          (a, b) =>
            (
              a.topic.practiceAverage ??
              0
            ) -
            (
              b.topic.practiceAverage ??
              0
            )
        )[0]
      : null

  let recommendation:
    StudyRecommendation | null =
      null

  if (focusSubject) {
    const subject =
      availableSubjects.find(
        item =>
          item.id ===
          focusSubject.subjectId
      )

    if (subject) {
      const completedMissionIds =
        new Set(
          progress
            .filter(
              row =>
                row.subject_id ===
                  subject.id &&
                row.completed
            )
            .map(
              row =>
                row.mission_id
            )
        )

      const freeMission =
        subject.topics
          .flatMap(
            topic =>
              topic.missions.map(
                mission => ({
                  mission,
                  topic
                })
              )
          )
          .find(
            item =>
              item.mission.access ===
                'FREE' &&
              !completedMissionIds.has(
                item.mission.id
              )
          )

      if (
        accessMode === 'FREE' &&
        freeMission
      ) {
        recommendation = {
          type:
            'START_FREE',

          subjectId:
            subject.id,

          subjectName:
            subject.name,

          topicId:
            freeMission.topic.id,

          topicName:
            freeMission.topic.name,

          missionId:
            freeMission.mission.id,

          missionTitle:
            freeMission.mission.title,

          reason:
            `Start your ${subject.name} progress profile with the free mission.`,

          message:
            `Your first mission gives FAM an initial result. More topics and missions are required before your ${focusSubject.targetMark}% subject target can be meaningfully tracked.`
        }
      } else if (
        accessMode === 'FREE'
      ) {
        recommendation = {
          type:
            'UPGRADE',

          subjectId:
            subject.id,

          subjectName:
            subject.name,

          reason:
            `You have started your ${subject.name} progress profile, but free mode only provides limited subject coverage.`,

          message:
            `Unlock Premium to complete more topics and missions so FAM can measure your progress toward your ${focusSubject.targetMark}% target, identify weak areas and recommend what to revise next.`
        }
      } else {
        const weakTopic =
          focusSubject.topics
            .filter(
              topic =>
                topic.practiceAverage !==
                null
            )
            .sort(
              (a, b) =>
                (
                  a.practiceAverage ??
                  0
                ) -
                (
                  b.practiceAverage ??
                  0
                )
            )[0]

        const topicToFocus =
          subject.topics.find(
            topic =>
              topic.id ===
              weakTopic?.topicId
          ) ??
          subject.topics.find(
            topic =>
              topic.missions.some(
                mission =>
                  !completedMissionIds.has(
                    mission.id
                  )
              )
          )

        const missionToDo =
          topicToFocus?.missions.find(
            mission =>
              !completedMissionIds.has(
                mission.id
              )
          ) ??
          topicToFocus?.missions[0]

        recommendation = {
          type:
            'STUDY',

          subjectId:
            subject.id,

          subjectName:
            subject.name,

          topicId:
            topicToFocus?.id,

          topicName:
            topicToFocus?.name,

          missionId:
            missionToDo?.id,

          missionTitle:
            missionToDo?.title,

          reason:
            weakTopic
              ? `${weakTopic.name} currently needs the most attention in ${subject.name}.`
              : `Continue building your ${subject.name} subject coverage.`,

          message:
            missionToDo
              ? `Complete "${missionToDo.title}" next.`
              : `Complete another ${subject.name} mission.`
        }
      }
    }
  }

  const overallPracticeAverage =
    subjectsWithPerformance.length >
    0
      ? average(
          subjectsWithPerformance.map(
            subject =>
              subject.practiceAverage ??
              0
          )
        )
      : null

  const targetAverage =
    dashboardSubjects.length > 0
      ? average(
          dashboardSubjects.map(
            subject =>
              subject.targetMark
          )
        )
      : null

  const overallTrend =
    getTrend(attempts)

  return {
    accessMode,

    subjects:
      dashboardSubjects,

    selectedSubjects:
      dashboardSubjects.length,

    topicsStarted:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.topicsStarted,
        0
      ),

    topicsCompleted:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.topicsCompleted,
        0
      ),

    totalTopics:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.totalTopics,
        0
      ),

    missionsCompleted:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.missionsCompleted,
        0
      ),

    totalMissions:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.totalMissions,
        0
      ),

    totalAttempts:
      attempts.length,

    overallPracticeAverage,

    recentPerformance:
      getRecentPerformance(
        attempts
      ),

    targetAverage,

    totalKnowledgePoints:
      dashboardSubjects.reduce(
        (sum, subject) =>
          sum +
          subject.knowledgePoints,
        0
      ),

    strongestSubject,
    focusSubject,

    strongestTopic,
    weakestTopic,

    trend:
      overallTrend.trend,

    trendChange:
      overallTrend.change,

    recommendation
  }
}
