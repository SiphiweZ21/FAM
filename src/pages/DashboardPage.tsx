// src/pages/DashboardPage.tsx

import {
  ArrowRight
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
  type DashboardTopic,
  type LearnerDashboard
} from '../lib/dashboard'

function getRelevantTopics(
  subject: DashboardSubject
): DashboardTopic[] {
  /*
   * Topic priority:
   *
   * 1. Topics already attempted with the
   *    lowest performance.
   *
   * 2. Topics currently in progress.
   *
   * 3. Topics not started yet.
   *
   * We only show a maximum of 3 so the
   * dashboard remains easy to scan.
   */

  const attemptedTopics =
    subject.topics
      .filter(
        topic =>
          topic.practiceAverage !== null
      )
      .sort(
        (a, b) =>
          (
            a.practiceAverage ??
            100
          ) -
          (
            b.practiceAverage ??
            100
          )
      )

  const inProgressTopics =
    subject.topics.filter(
      topic =>
        topic.practiceAverage === null &&
        topic.completionStatus ===
          'IN_PROGRESS'
    )

  const notStartedTopics =
    subject.topics.filter(
      topic =>
        topic.practiceAverage === null &&
        topic.completionStatus ===
          'NOT_STARTED'
    )

  return [
    ...attemptedTopics,
    ...inProgressTopics,
    ...notStartedTopics
  ].slice(0, 3)
}

function getTopicLabel(
  topic: DashboardTopic
) {
  if (
    topic.practiceAverage !== null
  ) {
    if (
      topic.practiceAverage < 50
    ) {
      return 'Needs focus'
    }

    if (
      topic.practiceAverage < 70
    ) {
      return 'Keep practising'
    }

    return 'Doing well'
  }

  if (
    topic.completionStatus ===
    'IN_PROGRESS'
  ) {
    return 'Continue'
  }

  return 'Not started'
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
        <p>{error}</p>
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
            Tell FAM what you are
            studying and the marks
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

  const isPremium =
    dashboard.accessMode ===
    'PREMIUM'

  return (
    <div className="stack-lg">
      <header className="dashboard-hero">
        <div>
          <span className="eyebrow">
            MY MATRIC DASHBOARD
          </span>

          <h1>
            Let's get you exam ready.
          </h1>

          <p>
            Track your readiness for
            each subject and see which
            topics need your attention.
          </p>
        </div>

        <Link
          to="/my-subjects"
          className="button ghost"
        >
          Edit subjects
        </Link>
      </header>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              MY SUBJECTS
            </span>

            <h2>
              Your exam readiness
            </h2>

            <p>
              Focus on one subject at
              a time and strengthen the
              topics that need more work.
            </p>
          </div>
        </div>

        <div className="dashboard-subject-grid">
          {dashboard.subjects.map(
            subject => {
              const relevantTopics =
                getRelevantTopics(
                  subject
                )

              return (
                <article
                  key={
                    subject.subjectId
                  }
                  className="dashboard-subject-card"
                >
                  <div className="dashboard-subject-top">
                    <span className="dashboard-subject-emoji">
                      {
                        subject.emoji
                      }
                    </span>
                  </div>

                  <h3>
                    {subject.name}
                  </h3>

                  <div className="dashboard-score-row">
                    <div>
                      <span>
                        Exam readiness
                      </span>

                      <strong>
                        {
                          subject
                            .examReadiness ??
                          '—'
                        }

                        {subject
                          .examReadiness !==
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
                          subject
                            .targetMark
                        }
                        %
                      </strong>
                    </div>
                  </div>

                  {subject
                    .practiceAverage !==
                    null && (
                    <p className="dashboard-subject-performance">
                      Practice
                      performance:{' '}
                      <strong>
                        {
                          subject
                            .practiceAverage
                        }
                        %
                      </strong>
                    </p>
                  )}

                  <div className="coverage-heading">
                    <span>
                      Learning coverage
                    </span>

                    <strong>
                      {
                        subject.coverage
                      }
                      %
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

                  {isPremium ? (
                    <div className="dashboard-subject-next">
                      <span className="eyebrow">
                        TOPICS TO FOCUS ON
                      </span>

                      {relevantTopics.length >
                      0 ? (
                        <div className="dashboard-topic-list">
                          {relevantTopics.map(
                            topic => (
                              <div
                                key={
                                  topic.topicId
                                }
                                className="dashboard-topic-item"
                              >
                                <div>
                                  <strong>
                                    {
                                      topic.name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      getTopicLabel(
                                        topic
                                      )
                                    }
                                  </span>
                                </div>

                                {topic
                                  .practiceAverage !==
                                  null && (
                                  <strong>
                                    {
                                      topic
                                        .practiceAverage
                                    }
                                    %
                                  </strong>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p>
                          Start a mission
                          to begin building
                          your topic
                          insights.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="dashboard-subject-next">
                      <span className="eyebrow">
                        PREMIUM INSIGHT
                      </span>

                      <strong>
                        See which topics
                        need your attention
                      </strong>

                      <span>
                        FAM analyses your
                        results to identify
                        areas to revise.
                      </span>

                      <Link
                        to="/account"
                        className="button primary full"
                      >
                        Unlock Premium
                      </Link>
                    </div>
                  )}

                  <Link
                    to={`/subjects/${subject.subjectId}`}
                    className="button secondary full"
                  >
                    Continue {
                      subject.name
                    }

                    <ArrowRight
                      size={15}
                    />
                  </Link>
                </article>
              )
            }
          )}
        </div>
      </section>

      <section className="dashboard-note">
        <strong>
          About your FAM readiness
        </strong>

        <p>
          Exam readiness combines your
          completed mission performance
          and learning coverage within
          each subject.
        </p>

        <p>
          Topic insights are based on
          activities you complete in
          FAM. Complete more missions
          across different topics to
          improve the quality of your
          study guidance.
        </p>

        <p>
          Your FAM readiness score is
          a study guidance indicator,
          not a prediction of your final
          Matric examination mark.
        </p>
      </section>
    </div>
  )
}