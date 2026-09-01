import {
  BookOpenCheck,
  ChevronRight,
  ExternalLink,
  FileText,
  LockKeyhole,
  Target
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link,
  Navigate,
  useParams
} from 'react-router-dom'

import {
  getLearnerAccessMode,
  type LearnerAccessMode
} from '../lib/access'

import {
  getSubject
} from '../lib/content'

import {
  getPastPapersForSubject,
  type PastPaperExam
} from '../lib/past-papers'

import {
  getSubjectAnalytics,
  type SubjectAnalytics,
  type TopicStatus
} from '../lib/subject-analytics'

import type { Subject } from '../types'

function topicStatusLabel(
  status: TopicStatus
): string {
  switch (status) {
    case 'STRONG':
      return 'Strong'

    case 'DEVELOPING':
      return 'Developing'

    case 'NEEDS_FOCUS':
      return 'Needs Focus'

    case 'IN_PROGRESS':
      return 'In Progress'

    default:
      return 'Not Started'
  }
}

function topicStatusClass(
  status: TopicStatus
): string {
  switch (status) {
    case 'STRONG':
      return 'strong'

    case 'DEVELOPING':
      return 'developing'

    case 'NEEDS_FOCUS':
      return 'needs-focus'

    case 'IN_PROGRESS':
      return 'in-progress'

    default:
      return 'not-started'
  }
}

export default function SubjectPage() {
  const { subjectId } = useParams()

  const [
    subject,
    setSubject
  ] =
    useState<Subject | undefined>()

  const [
    accessMode,
    setAccessMode
  ] =
    useState<LearnerAccessMode>(
      'FREE'
    )

  const [
    analytics,
    setAnalytics
  ] =
    useState<SubjectAnalytics | null>(
      null
    )

  const [
    pastPapers,
    setPastPapers
  ] =
    useState<PastPaperExam[]>(
      []
    )

  const [
    loading,
    setLoading
  ] =
    useState(true)

  const [
    notFound,
    setNotFound
  ] =
    useState(false)

  useEffect(() => {
    if (!subjectId) {
      setNotFound(true)
      setLoading(false)
      return
    }

    Promise.all([
      getSubject(subjectId),
      getLearnerAccessMode(),
      getSubjectAnalytics(
        subjectId
      ),
      getPastPapersForSubject(
        subjectId
      )
    ])
      .then(
        ([
          subjectResult,
          accessResult,
          analyticsResult,
          pastPaperResult
        ]) => {
          if (!subjectResult) {
            setNotFound(true)
            return
          }

          setSubject(
            subjectResult
          )

          setAccessMode(
            accessResult
          )

          setAnalytics(
            analyticsResult
          )

          setPastPapers(
            pastPaperResult
          )
        }
      )
      .catch(error => {
        console.error(error)
        setNotFound(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [subjectId])

  const recentPastPapers =
    useMemo(
      () =>
        [...pastPapers]
          .sort(
            (
              a,
              b
            ) =>
              b.year - a.year
          )
          .slice(
            0,
            2
          ),
      [pastPapers]
    )

  if (loading) {
    return (
      <div className="stack-lg">
        <p>
          Loading subject...
        </p>
      </div>
    )
  }

  if (
    notFound ||
    !subject
  ) {
    return (
      <Navigate
        to="/subjects"
        replace
      />
    )
  }

  const isPremium =
    accessMode === 'PREMIUM'

  const totalMissions =
    subject.topics.reduce(
      (
        total,
        topic
      ) =>
        total +
        topic.missions.length,
      0
    )

  const freeMissions =
    subject.topics.reduce(
      (
        total,
        topic
      ) =>
        total +
        topic.missions.filter(
          mission =>
            !mission.premium
        ).length,
      0
    )

  const premiumMissions =
    totalMissions -
    freeMissions

  const recommendedTopic =
    analytics?.recommendedTopic ??
    null

  const recommendedTopicData =
    recommendedTopic
      ? subject.topics.find(
          topic =>
            topic.id ===
            recommendedTopic.topicId
        )
      : undefined

  const recommendedTopicAnalytics =
    recommendedTopic
      ? analytics?.topics.find(
          topic =>
            topic.topicId ===
            recommendedTopic.topicId
        )
      : undefined

  const recommendedMission =
    recommendedTopicData
      ?.missions.find(
        mission => {
          const missionAnalytics =
            recommendedTopicAnalytics
              ?.missions.find(
                analyticsMission =>
                  analyticsMission.missionId ===
                  mission.id
              )

          const isAccessible =
            !mission.premium ||
            isPremium

          const isIncomplete =
            !missionAnalytics?.completed

          return (
            isAccessible &&
            isIncomplete
          )
        }
      ) ??
    recommendedTopicData
      ?.missions.find(
        mission =>
          !mission.premium ||
          isPremium
      ) ??
    null

  return (
    <div className="stack-lg">
      <header className="page-header">
        <span className="subject-icon large">
          {subject.emoji}
        </span>

        <span className="eyebrow">
          GRADE 12 SUBJECT
        </span>

        <h1>
          {subject.name}
        </h1>

        <p>
          {subject.description}
        </p>
      </header>

      <section className="subject-access-summary">
        <div>
          <span className="eyebrow">
            SUBJECT LEARNING PLAN
          </span>

          <h2>
            {totalMissions}{' '}
            {totalMissions === 1
              ? 'mission'
              : 'missions'}
          </h2>
        </div>

        {isPremium ? (
          <div className="subject-access-badge premium">
            Premium access
          </div>
        ) : (
          <div className="subject-access-badge free">
            Free access
          </div>
        )}

        {!isPremium && (
          <p>
            You can complete the free
            mission now. Premium unlocks
            the remaining{' '}
            <strong>
              {premiumMissions}
            </strong>{' '}
            missions so FAM can build a
            fuller picture of your progress
            across this subject.
          </p>
        )}

        {isPremium && (
          <p>
            All missions in this subject
            are unlocked.
          </p>
        )}
      </section>

      {analytics && (
        <section className="subject-analytics-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                YOUR SUBJECT PROGRESS
              </span>

              <h2>
                Learning overview
              </h2>
            </div>
          </div>

          <div className="subject-analytics-grid">
            <div className="subject-analytics-card">
              <span className="subject-analytics-label">
                Practice Average
              </span>

              <strong>
                {analytics.practiceAverage !==
                null
                  ? `${analytics.practiceAverage}%`
                  : '—'}
              </strong>

              <span className="subject-analytics-help">
                Completed missions only
              </span>
            </div>

            <div className="subject-analytics-card">
              <span className="subject-analytics-label">
                Subject Coverage
              </span>

              <strong>
                {analytics.coverage}%
              </strong>

              <span className="subject-analytics-help">
                {
                  analytics.missionsCompleted
                }{' '}
                of{' '}
                {
                  analytics.totalMissions
                }{' '}
                missions
              </span>
            </div>

            <div className="subject-analytics-card">
              <span className="subject-analytics-label">
                Topics Started
              </span>

              <strong>
                {analytics.topicsStarted}
                {' / '}
                {analytics.totalTopics}
              </strong>

              <span className="subject-analytics-help">
                {
                  analytics.topicsCompleted
                }{' '}
                completed
              </span>
            </div>

            <div className="subject-analytics-card">
              <span className="subject-analytics-label">
                Missions Remaining
              </span>

              <strong>
                {
                  analytics.missionsRemaining
                }
              </strong>

              <span className="subject-analytics-help">
                Continue building coverage
              </span>
            </div>
          </div>

          {!isPremium &&
            analytics.missionsCompleted <=
              1 && (
              <div className="subject-progress-note">
                <strong>
                  Early progress
                </strong>

                <p>
                  One mission gives you a
                  starting result, but it
                  does not yet represent
                  your overall performance
                  in {subject.name}.
                </p>
              </div>
            )}
        </section>
      )}

      {recommendedTopic && (
        <section className="subject-recommendation-card">
          <div className="subject-recommendation-icon">
            <Target
              size={22}
            />
          </div>

          <div>
            <span className="eyebrow">
              RECOMMENDED NEXT
            </span>

            <h2>
              {
                recommendedTopic.topicName
              }
            </h2>

            <p>
              {recommendedTopic.status ===
              'NEEDS_FOCUS'
                ? 'Your recent practice suggests this topic needs more attention.'
                : recommendedTopic.status ===
                    'IN_PROGRESS'
                  ? 'Continue this topic to improve both coverage and confidence.'
                  : recommendedTopic.status ===
                      'NOT_STARTED'
                    ? 'Start this topic to broaden your subject coverage.'
                    : 'Continue practising this topic to strengthen your understanding.'}
            </p>
          </div>

          {recommendedMission && (
            <Link
              className="button primary full"
              to={`/subjects/${subject.id}/${recommendedTopic.topicId}/${recommendedMission.id}`}
            >
              Continue revision
            </Link>
          )}
        </section>
      )}

      {analytics && (
        <section className="subject-topic-analytics">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                TOPIC PERFORMANCE
              </span>

              <h2>
                Where to focus
              </h2>
            </div>
          </div>

          <div className="subject-topic-status-list">
            {analytics.topics.map(
              topic => (
                <div
                  key={
                    topic.topicId
                  }
                  className="subject-topic-status-card"
                >
                  <div className="subject-topic-status-header">
                    <div>
                      <h3>
                        {
                          topic.topicName
                        }
                      </h3>

                      <span>
                        {
                          topic.completedMissions
                        }
                        {' / '}
                        {
                          topic.totalMissions
                        }{' '}
                        missions
                      </span>
                    </div>

                    <span
                      className={`topic-status-pill ${topicStatusClass(
                        topic.status
                      )}`}
                    >
                      {topicStatusLabel(
                        topic.status
                      )}
                    </span>
                  </div>

                  <div className="subject-topic-metrics">
                    <span>
                      Coverage{' '}
                      <strong>
                        {topic.coverage}%
                      </strong>
                    </span>

                    <span>
                      Practice{' '}
                      <strong>
                        {topic.practiceAverage !==
                        null
                          ? `${topic.practiceAverage}%`
                          : '—'}
                      </strong>
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {isPremium &&
        recentPastPapers.length >
          0 && (
          <section className="subject-exam-practice">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  EXAM PRACTICE
                </span>

                <h2>
                  Practise past exams
                </h2>
              </div>
            </div>

            <p className="subject-exam-intro">
              Attempt the question paper
              first, then use the
              memorandum to check your
              answers.
            </p>

            <div className="subject-exam-list">
              {recentPastPapers.map(
                exam => {
                  const question =
                    exam.documents.find(
                      document =>
                        document.type ===
                        'QUESTION'
                    )

                  const memo =
                    exam.documents.find(
                      document =>
                        document.type ===
                        'MEMO'
                    )

                  return (
                    <article
                      key={exam.id}
                      className="subject-exam-card"
                    >
                      <div className="subject-exam-card-heading">
                        <div>
                          <span className="eyebrow">
                            {exam.year}{' '}
                            {exam.session}
                          </span>

                          <h3>
                            {exam.paper}
                          </h3>
                        </div>

                        <span className="subject-exam-files">
                          {
                            exam.documents
                              .length
                          }{' '}
                          files
                        </span>
                      </div>

                      <div className="subject-exam-actions">
                        {question && (
                          <a
                            className="subject-exam-action question"
                            href={
                              question.url
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <FileText
                              size={18}
                            />

                            <span>
                              <strong>
                                Open Question
                                Paper
                              </strong>

                              <small>
                                Attempt the exam
                                first
                              </small>
                            </span>

                            <ExternalLink
                              size={15}
                            />
                          </a>
                        )}

                        {memo && (
                          <a
                            className="subject-exam-action memo"
                            href={
                              memo.url
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            <BookOpenCheck
                              size={18}
                            />

                            <span>
                              <strong>
                                Check Memorandum
                              </strong>

                              <small>
                                Review your
                                answers
                              </small>
                            </span>

                            <ExternalLink
                              size={15}
                            />
                          </a>
                        )}
                      </div>
                    </article>
                  )
                }
              )}
            </div>

            <Link
              className="button secondary full"
              to={`/subjects/${subject.id}/past-papers`}
            >
              View Full Exam Library
            </Link>
          </section>
        )}

      {!isPremium && (
        <section className="subject-exam-practice subject-exam-locked">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                EXAM PRACTICE
              </span>

              <h2>
                Past exam papers &
                answers
              </h2>
            </div>

            <LockKeyhole
              size={20}
            />
          </div>

          <p>
            Premium gives you access to
            past question papers,
            memorandums and supporting
            examination documents for{' '}
            {subject.name}.
          </p>

          <Link
            className="button secondary full"
            to={`/subjects/${subject.id}/past-papers`}
          >
            View Exam Library
          </Link>
        </section>
      )}

      {subject.topics.map(
        topic => (
          <section
            className="topic-block"
            key={topic.id}
          >
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  TOPIC
                </span>

                <h2>
                  {topic.name}
                </h2>
              </div>

              <span>
                {
                  topic.missions.length
                }{' '}
                {topic.missions.length ===
                1
                  ? 'mission'
                  : 'missions'}
              </span>
            </div>

            <div className="mission-list">
              {topic.missions.map(
                (
                  mission,
                  index
                ) => {
                  const isLocked =
                    mission.premium &&
                    !isPremium

                  const topicAnalytics =
                    analytics?.topics.find(
                      analyticsTopic =>
                        analyticsTopic.topicId ===
                        topic.id
                    )

                  const missionAnalytics =
                    topicAnalytics?.missions.find(
                      analyticsMission =>
                        analyticsMission.missionId ===
                        mission.id
                    )

                  const isCompleted =
                    missionAnalytics?.completed ??
                    false

                  const missionContent = (
                    <>
                      <span className="mission-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </span>

                      <div>
                        <div className="mission-title-row">
                          <h3>
                            {
                              mission.title
                            }
                          </h3>

                          {isLocked ? (
                            <span className="locked-pill">
                              <LockKeyhole
                                size={13}
                              />
                              PREMIUM
                            </span>
                          ) : mission.premium ? (
                            <span className="premium-pill">
                              PREMIUM
                            </span>
                          ) : (
                            <span className="free-pill">
                              FREE
                            </span>
                          )}
                        </div>

                        <p>
                          {
                            mission.description
                          }
                        </p>

                        {isCompleted ? (
                          <span className="mission-progress-status completed">
                            ✓ COMPLETED
                            {' · '}
                            {
                              missionAnalytics
                                ?.percentage
                            }%
                            {' · '}
                            {
                              missionAnalytics
                                ?.score
                            }
                            /
                            {
                              missionAnalytics
                                ?.totalQuestions
                            }
                          </span>
                        ) : (
                          !isLocked && (
                            <span className="mission-progress-status not-started">
                              NOT STARTED
                            </span>
                          )
                        )}

                        {isLocked && (
                          <span className="mission-lock-message">
                            Unlock Premium
                            to continue this
                            topic.
                          </span>
                        )}
                      </div>

                      {isLocked ? (
                        <LockKeyhole
                          size={18}
                        />
                      ) : (
                        <ChevronRight
                          size={20}
                        />
                      )}
                    </>
                  )

                  if (isLocked) {
                    return (
                      <Link
                        className="mission-card mission-card-locked"
                        key={
                          mission.id
                        }
                        to="/account"
                      >
                        {
                          missionContent
                        }
                      </Link>
                    )
                  }

                  return (
                    <Link
                      className={`mission-card ${
                        isCompleted
                          ? 'mission-card-completed'
                          : ''
                      }`}
                      key={
                        mission.id
                      }
                      to={`/subjects/${subject.id}/${topic.id}/${mission.id}`}
                    >
                      {
                        missionContent
                      }
                    </Link>
                  )
                }
              )}
            </div>
          </section>
        )
      )}

      {!isPremium && (
        <section className="subject-premium-cta">
          <span className="eyebrow">
            CONTINUE YOUR SUBJECT
          </span>

          <h2>
            Unlock all{' '}
            {subject.name}{' '}
            missions
          </h2>

          <p>
            One free mission gives you a
            starting result. Completing
            more topics and missions gives
            FAM enough learning data to
            track subject coverage,
            identify weak areas and compare
            your progress more meaningfully
            with your target mark.
          </p>

          <div className="premium-benefits">
            <span>
              ✓ {premiumMissions}{' '}
              additional missions
            </span>

            <span>
              ✓ Full topic coverage
            </span>

            <span>
              ✓ Target progress tracking
            </span>

            <span>
              ✓ Weak-topic insights
            </span>

            <span>
              ✓ Personalised revision
              priorities
            </span>

            <span>
              ✓ Past exam papers &
              memorandums
            </span>
          </div>

          <strong className="premium-price">
            R99 / year
          </strong>

          <Link
            className="button primary full"
            to="/account"
          >
            Unlock Premium
          </Link>
        </section>
      )}

      <Link
        className="button secondary full"
        to={`/subjects/${subject.id}/past-papers`}
      >
        Past Papers & Memorandums
      </Link>
    </div>
  )
}