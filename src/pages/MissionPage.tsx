import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react'

import {
  useEffect,
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

import { getMission } from '../lib/content'

import type { Mission } from '../types'

export default function MissionPage() {
  const {
    subjectId,
    topicId,
    missionId
  } = useParams()

  const [
    mission,
    setMission
  ] =
    useState<Mission | undefined>()

  const [
    accessMode,
    setAccessMode
  ] =
    useState<LearnerAccessMode>(
      'FREE'
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
    if (
      !subjectId ||
      !topicId ||
      !missionId
    ) {
      setNotFound(true)
      setLoading(false)
      return
    }

    Promise.all([
      getMission(
        subjectId,
        topicId,
        missionId
      ),
      getLearnerAccessMode()
    ])
      .then(
        ([
          missionResult,
          accessResult
        ]) => {
          if (!missionResult) {
            setNotFound(true)
            return
          }

          setMission(
            missionResult
          )

          setAccessMode(
            accessResult
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
  }, [
    subjectId,
    topicId,
    missionId
  ])

  if (loading) {
    return (
      <div className="stack-lg narrow">
        <p>
          Loading mission...
        </p>
      </div>
    )
  }

  if (
    notFound ||
    !mission ||
    !subjectId ||
    !topicId ||
    !missionId
  ) {
    return (
      <Navigate
        to="/subjects"
        replace
      />
    )
  }

  const isPremiumLearner =
    accessMode === 'PREMIUM'

  const missionIsLocked =
    mission.premium &&
    !isPremiumLearner

  return (
    <div className="stack-lg narrow">
      <header className="mission-hero">
        <span className="eyebrow">
          GRADE 12 REVISION
        </span>

        <div className="mission-access-label">
          {mission.premium ? (
            <span className="premium-pill">
              PREMIUM
            </span>
          ) : (
            <span className="free-pill">
              FREE
            </span>
          )}
        </div>

        <h1>
          {mission.title}
        </h1>

        <p>
          {mission.description}
        </p>
      </header>

      <section className="info-card">
        <h2>
          Mission briefing
        </h2>

        <div className="check-row">
          <CheckCircle2
            size={20}
          />

          <span>
            {
              mission.questions
                .length
            }{' '}
            production questions
          </span>
        </div>

        <div className="check-row">
          <CheckCircle2
            size={20}
          />

          <span>
            Instant answer
            explanations
          </span>
        </div>

        <div className="check-row">
          <CheckCircle2
            size={20}
          />

          <span>
            Results at the end
          </span>
        </div>

        <div className="check-row">
          <CheckCircle2
            size={20}
          />

          <span>
            Progress saved to your
            learner profile
          </span>
        </div>
      </section>

      {missionIsLocked ? (
        <section className="premium-card">
          <LockKeyhole
            size={28}
          />

          <div>
            <span className="eyebrow">
              PREMIUM MISSION
            </span>

            <h2>
              This mission is locked
            </h2>

            <p>
              You can complete the
              free mission in this
              subject without
              upgrading. Premium
              unlocks the remaining
              missions and gives FAM
              enough learning data
              to build stronger
              progress insights
              across your topics.
            </p>
          </div>

          <div className="premium-benefits">
            <span>
              ✓ Full subject missions
            </span>

            <span>
              ✓ Topic coverage tracking
            </span>

            <span>
              ✓ Target progress insights
            </span>

            <span>
              ✓ Weak-area identification
            </span>

            <span>
              ✓ Revision priorities
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

          <Link
            className="button secondary full"
            to={`/subjects/${subjectId}`}
          >
            Back to subject
          </Link>
        </section>
      ) : (
        <>
          {mission.premium &&
            isPremiumLearner && (
              <section className="premium-access-confirmation">
                <CheckCircle2
                  size={18}
                />

                <div>
                  <strong>
                    Premium access
                  </strong>

                  <span>
                    This mission is
                    unlocked.
                  </span>
                </div>
              </section>
            )}

          <Link
            className="button primary full"
            to={`/quiz/${subjectId}/${topicId}/${missionId}`}
          >
            Start mission
            <ArrowRight
              size={18}
            />
          </Link>
        </>
      )}
    </div>
  )
}