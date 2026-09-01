import {
  ArrowRight,
  BookOpenCheck,
  Target
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  Navigate
} from 'react-router-dom'

import {
  getLearnerDashboard,
  type DashboardSubject,
  type LearnerDashboard
} from '../lib/dashboard'

function getConfidenceLabel(
  confidence:
    DashboardSubject['progressConfidence']
) {
  switch (confidence) {
    case 'STRONG':
      return 'Strong'

    case 'GOOD':
      return 'Good'

    case 'BUILDING':
      return 'Building'

    default:
      return 'Low'
  }
}

function getConfidenceClass(
  confidence:
    DashboardSubject['progressConfidence']
) {
  switch (confidence) {
    case 'STRONG':
      return 'strong'

    case 'GOOD':
      return 'good'

    case 'BUILDING':
      return 'building'

    default:
      return 'low'
  }
}

function getRecommendedTopic(
  subject: DashboardSubject
) {
  const inProgress =
    subject.topics.find(
      topic =>
        topic.completionStatus ===
        'IN_PROGRESS'
    )

  if (inProgress) {
    return {
      topic: inProgress,
      label: 'Continue this topic',
      reason:
        `${inProgress.missionsRemaining} ${
          inProgress.missionsRemaining ===
          1
            ? 'mission'
            : 'missions'
        } remaining`
    }
  }

  const notStarted =
    subject.topics.find(
      topic =>
        topic.completionStatus ===
        'NOT_STARTED'
    )

  if (notStarted) {
    return {
      topic: notStarted,
      label: 'Start next topic',
      reason:
        'Build your subject coverage'
    }
  }

  const completedTopic =
    [...subject.topics]
      .filter(
        topic =>
          topic.completionStatus ===
          'COMPLETED'
      )
      .sort(
        (
          a,
          b
        ) =>
          a.coverage -
          b.coverage
      )[0]

  if (completedTopic) {
    return {
      topic: completedTopic,
      label: 'Review topic',
      reason:
        'Keep your knowledge fresh'
    }
  }

  return null
}

export default function DashboardPage() {
  const [
    dashboard,
    setDashboard
  ] =
    useState<LearnerDashboard | null>(
      null
    )

  const [
    loading,
    setLoading
  ] =
    useState(true)

  const [
    signedOut,
    setSignedOut
  ] =
    useState(false)

  const [
    error,
    setError
  ] =
    useState('')

  useEffect(() => {
    getLearnerDashboard()
      .then(result => {
        if (!result) {
          setSignedOut(true)
          return
        }

        setDashboard(result)
      })
      .catch(error => {
        console.error(error)

        setError(
          'Unable to load your dashboard.'
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="narrow">
        <p>
          Analysing your progress...
        </p>
      </div>
    )
  }

  if (signedOut) {
    return (
      <Navigate
        to="/account"
        replace
      />
    )
  }

  if (error) {
    return (
      <div className="narrow">
        <p>
          {error}
        </p>
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  if (
    dashboard.selectedSubjects === 0
  ) {
    return (
      <div className="stack-lg narrow">
        <header className="page-header">
          <span className="eyebrow">
            YOUR MATRIC PLAN
          </span>

          <h1>
            Choose your subjects.
          </h1>

          <p>
            Subject selection and target
            setting are free. Tell FAM what
            you are studying and what marks
            you want to achieve.
          </p>
        </header>

        <Link
          to="/my-subjects"
          className="button primary full"
        >
          Choose my subjects
        </Link>
      </div>
    )
  }

  return (
    <div className="stack-lg">
      <header className="dashboard-hero">
        <div>
          <span className="eyebrow">
            MY MATRIC DASHBOARD
          </span>

          <h1>
            Know what to study next.
          </h1>

          <p>
            Track your practice,
            subject coverage and
            revision priorities in one
            place.
          </p>
        </div>

        <Link
          to="/my-subjects"
          className="button ghost"
        >
          Edit subjects
        </Link>
      </header>

      {dashboard.accessMode ===
        'FREE' && (
        <section className="free-dashboard-notice">
          <span className="eyebrow">
            FREE PROGRESS PROFILE
          </span>

          <h2>
            Your journey has started.
          </h2>

          <p>
            Your free mission gives FAM an
            initial practice result, but one
            mission cannot represent an
            entire subject.
          </p>

          <p>
            Your target marks are saved.
            Complete more missions and
            topics to build a stronger
            learning profile.
          </p>
        </section>
      )}

      <section className="dashboard-summary-grid">
        <article>
          <span>
            Practice average
          </span>

          <strong>
            {dashboard
              .overallPracticeAverage ??
              '—'}

            {dashboard
              .overallPracticeAverage !==
              null &&
              '%'}
          </strong>

          <small>
            Completed work only
          </small>
        </article>

        <article>
          <span>
            Target average
          </span>

          <strong>
            {dashboard.targetAverage ??
              '—'}

            {dashboard.targetAverage !==
              null &&
              '%'}
          </strong>

          <small>
            Your goals
          </small>
        </article>

        <article>
          <span>
            Topics completed
          </span>

          <strong>
            {dashboard.topicsCompleted}
          </strong>

          <small>
            of {dashboard.totalTopics}
          </small>
        </article>

        <article>
          <span>
            Missions completed
          </span>

          <strong>
            {dashboard.missionsCompleted}
          </strong>

          <small>
            of {dashboard.totalMissions}
          </small>
        </article>
      </section>

      {dashboard.recommendation && (
        <section
          className={
            dashboard.recommendation
              .type === 'UPGRADE'
              ? 'premium-progress-card'
              : 'next-study-card'
          }
        >
          <div className="dashboard-recommendation-icon">
            {dashboard.recommendation
              .type ===
            'UPGRADE' ? (
              <Target
                size={22}
              />
            ) : (
              <BookOpenCheck
                size={22}
              />
            )}
          </div>

          <span className="eyebrow">
            {dashboard.recommendation
              .type === 'UPGRADE'
              ? 'UNLOCK FULL PROGRESS'
              : 'FAM RECOMMENDS'}
          </span>

          <h2>
            {
              dashboard.recommendation
                .subjectName
            }
          </h2>

          <p>
            {
              dashboard.recommendation
                .reason
            }
          </p>

          <p>
            {
              dashboard.recommendation
                .message
            }
          </p>

          {dashboard.recommendation
            .type ===
          'UPGRADE' ? (
            <>
              <div className="premium-benefits">
                <span>
                  ✓ Track performance
                  across topics
                </span>

                <span>
                  ✓ Compare progress
                  with your target
                </span>

                <span>
                  ✓ Find weak areas
                </span>

                <span>
                  ✓ See improvement
                  over time
                </span>

                <span>
                  ✓ Get personalised
                  revision priorities
                </span>

                <span>
                  ✓ Access past exam
                  papers and answers
                </span>
              </div>

              <strong className="premium-price">
                R150 / year
              </strong>

              <Link
                to="/account"
                className="button primary full"
              >
                Unlock full progress
              </Link>
            </>
          ) : (
            <Link
              to={`/subjects/${dashboard.recommendation.subjectId}`}
              className="button primary full"
            >
              Start recommended revision
            </Link>
          )}
        </section>
      )}

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              MY SUBJECTS
            </span>

            <h2>
              Coverage & performance
            </h2>
          </div>

          <span>
            {dashboard.selectedSubjects}{' '}
            selected
          </span>
        </div>

        <div className="dashboard-subject-grid">
          {dashboard.subjects.map(
            subject => {
              const recommendation =
                getRecommendedTopic(
                  subject
                )

              return (
                <article
                  key={
                    subject.subjectId
                  }
                  className="dashboard-subject-card"
                >
                  <Link
                    to={`/subjects/${subject.subjectId}`}
                    className="dashboard-subject-main-link"
                  >
                    <div className="dashboard-subject-top">
                      <span className="dashboard-subject-emoji">
                        {
                          subject.emoji
                        }
                      </span>

                      <span
                        className={`dashboard-confidence ${getConfidenceClass(
                          subject.progressConfidence
                        )}`}
                      >
                        Confidence:{' '}
                        {getConfidenceLabel(
                          subject.progressConfidence
                        )}
                      </span>
                    </div>

                    <h3>
                      {subject.name}
                    </h3>

                    <div className="dashboard-score-row">
                      <div>
                        <span>
                          Practice
                        </span>

                        <strong>
                          {subject.practiceAverage ??
                            '—'}

                          {subject.practiceAverage !==
                            null &&
                            '%'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Target
                        </span>

                        <strong>
                          {
                            subject.targetMark
                          }
                          %
                        </strong>
                      </div>
                    </div>

                    {!subject
                      .canCalculateTargetProgress && (
                      <div className="target-data-warning">
                        More learning data
                        is needed before FAM
                        can compare your
                        practice meaningfully
                        with your target.
                      </div>
                    )}

                    <div className="coverage-heading">
                      <span>
                        Subject coverage
                      </span>

                      <strong>
                        {subject.coverage}%
                      </strong>
                    </div>

                    <div className="subject-progress-bar">
                      <span
                        style={{
                          width:
                            `${subject.coverage}%`
                        }}
                      />
                    </div>

                    <div className="coverage-stats">
                      <div>
                        <strong>
                          {
                            subject.topicsCompleted
                          }
                          /
                          {
                            subject.totalTopics
                          }
                        </strong>

                        <span>
                          Topics
                        </span>
                      </div>

                      <div>
                        <strong>
                          {
                            subject.missionsCompleted
                          }
                          /
                          {
                            subject.totalMissions
                          }
                        </strong>

                        <span>
                          Missions
                        </span>
                      </div>

                      <div>
                        <strong>
                          {
                            subject.missionsRemaining
                          }
                        </strong>

                        <span>
                          Remaining
                        </span>
                      </div>
                    </div>

                    <div className="overall-progress-row">
                      <span>
                        Overall subject
                        progress
                      </span>

                      <strong>
                        {
                          subject
                            .overallSubjectProgress
                        }
                        %
                      </strong>
                    </div>
                  </Link>

                  {recommendation && (
                    <div className="dashboard-subject-next">
                      <span className="eyebrow">
                        RECOMMENDED NEXT
                      </span>

                      <strong>
                        {
                          recommendation
                            .topic.name
                        }
                      </strong>

                      <span>
                        {
                          recommendation
                            .reason
                        }
                      </span>

                      <Link
                        to={`/subjects/${subject.subjectId}`}
                        className="dashboard-subject-next-link"
                      >
                        {
                          recommendation
                            .label
                        }

                        <ArrowRight
                          size={15}
                        />
                      </Link>
                    </div>
                  )}

                  {subject.accessMode ===
                    'FREE' &&
                    subject
                      .freeMissionsCompleted >
                      0 && (
                      <div className="subject-premium-message">
                        <strong>
                          You have started
                          this subject.
                        </strong>

                        <span>
                          {
                            subject
                              .premiumMissionsRemaining
                          }{' '}
                          Premium missions
                          can continue
                          building your
                          progress profile.
                        </span>
                      </div>
                    )}

                  <div className="dashboard-subject-actions">
                    <Link
                      to={`/subjects/${subject.subjectId}`}
                      className="button secondary full"
                    >
                      Open subject
                    </Link>

                    <Link
                      to={`/subjects/${subject.subjectId}/past-papers`}
                      className="button ghost full"
                    >
                      Past exam papers
                    </Link>
                  </div>
                </article>
              )
            }
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              TOPIC COVERAGE
            </span>

            <h2>
              What you have covered
            </h2>
          </div>
        </div>

        {dashboard.subjects.map(
          subject => (
            <section
              key={
                subject.subjectId
              }
              className="dashboard-topic-subject"
            >
              <div className="dashboard-topic-subject-header">
                <span>
                  {subject.emoji}
                </span>

                <div>
                  <h3>
                    {subject.name}
                  </h3>

                  <p>
                    {
                      subject.topicsCompleted
                    }{' '}
                    of{' '}
                    {
                      subject.totalTopics
                    }{' '}
                    topics completed
                  </p>
                </div>
              </div>

              <div className="dashboard-topic-list">
                {subject.topics.map(
                  topic => (
                    <div
                      key={
                        topic.topicId
                      }
                      className="dashboard-topic-row"
                    >
                      <div>
                        <strong>
                          {topic.name}
                        </strong>

                        <span>
                          {
                            topic
                              .missionsCompleted
                          }
                          /
                          {
                            topic.totalMissions
                          }{' '}
                          missions
                        </span>
                      </div>

                      <div className="dashboard-topic-result">
                        <strong>
                          {
                            topic.coverage
                          }
                          %
                        </strong>

                        <span>
                          {topic
                            .completionStatus ===
                          'COMPLETED'
                            ? 'Completed'
                            : topic
                                  .completionStatus ===
                                'IN_PROGRESS'
                              ? `${topic.missionsRemaining} remaining`
                              : 'Not started'}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )
        )}
      </section>

      <section className="dashboard-note">
        <strong>
          How FAM calculates progress
        </strong>

        <p>
          Practice average shows how you
          performed on missions you have
          completed. Subject coverage shows
          how much of the available subject
          content you have completed.
        </p>

        <p>
          Your target is a subject-level
          goal. One free mission cannot
          reliably show whether you are on
          track for that target. More topic
          and mission results are needed
          before FAM can provide meaningful
          target progress guidance.
        </p>

        <p>
          FAM practice analytics are study
          guidance indicators and are not
          predictions of your final Matric
          examination mark.
        </p>
      </section>
    </div>
  )
}