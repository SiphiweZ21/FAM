import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Navigate,
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  getLearnerAccessMode,
  type LearnerAccessMode
} from '../lib/access'

import { getMission } from '../lib/content'
import { saveLearnerProgress } from '../lib/progress'
import type { Mission } from '../types'

export default function QuizPage() {
  const {
    subjectId,
    topicId,
    missionId
  } = useParams()

  const navigate = useNavigate()

  const [mission, setMission] =
    useState<Mission | undefined>()

  const [accessMode, setAccessMode] =
    useState<LearnerAccessMode>('FREE')

  const [loading, setLoading] =
    useState(true)

  const [notFound, setNotFound] =
    useState(false)

  const [index, setIndex] =
    useState(0)

  const [selected, setSelected] =
    useState<number | null>(null)

  const [score, setScore] =
    useState(0)

  const [
    knowledgePoints,
    setKnowledgePoints
  ] = useState(0)

  const [complete, setComplete] =
    useState(false)

  const [
    savingProgress,
    setSavingProgress
  ] = useState(false)

  const [
    progressSaved,
    setProgressSaved
  ] = useState(false)

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
        console.error(
          'Unable to load quiz:',
          error
        )

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

  const question =
    mission?.questions[index]

  const progress =
    useMemo(() => {
      if (
        !mission ||
        mission.questions.length === 0
      ) {
        return 0
      }

      return (
        (
          (index + 1) /
          mission.questions.length
        ) * 100
      )
    }, [
      index,
      mission
    ])

  if (loading) {
    return (
      <div className="quiz-shell narrow">
        <p>
          Loading questions...
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

  if (missionIsLocked) {
    return (
      <Navigate
        to={`/subjects/${subjectId}/${topicId}/${missionId}`}
        replace
      />
    )
  }

  if (!question) {
    return (
      <Navigate
        to={`/subjects/${subjectId}`}
        replace
      />
    )
  }

  const currentSubjectId =
    subjectId

  const currentTopicId =
    topicId

  const currentMissionId =
    missionId

  async function choose(
    option: number
  ) {
    if (
      selected !== null ||
      !question ||
      !mission
    ) {
      return
    }

    setSelected(option)

    const correct =
      option ===
      question.answer

    const nextScore =
      correct
        ? score + 1
        : score

    const nextKnowledgePoints =
      correct
        ? knowledgePoints +
          (
            question.knowledgePoints ??
            0
          )
        : knowledgePoints

    if (correct) {
      setScore(
        nextScore
      )

      setKnowledgePoints(
        nextKnowledgePoints
      )
    }

    const isLastQuestion =
      index ===
      mission.questions.length -
        1

    if (isLastQuestion) {
      const percentage =
        Math.round(
          (
            nextScore /
            mission.questions.length
          ) * 100
        )

      setSavingProgress(true)

      try {
        const result =
          await saveLearnerProgress(
            {
              subjectId:
                currentSubjectId,

              topicId:
                currentTopicId,

              missionId:
                currentMissionId,

              score:
                nextScore,

              totalQuestions:
                mission.questions
                  .length,

              percentage,

              knowledgePoints:
                nextKnowledgePoints
            }
          )

        setProgressSaved(
          result.saved
        )
      } catch (error) {
        console.error(
          'Unable to save learner progress:',
          error
        )
      } finally {
        setSavingProgress(false)
      }
    }
  }

  function next() {
    if (!mission) {
      return
    }

    if (
      index ===
      mission.questions.length -
        1
    ) {
      setComplete(true)
      return
    }

    setIndex(
      current =>
        current + 1
    )

    setSelected(null)
  }

  if (complete) {
    const percentage =
      Math.round(
        (
          score /
          mission.questions.length
        ) * 100
      )

    return (
      <div className="result-card narrow">
        <span className="eyebrow">
          MISSION COMPLETE
        </span>

        <strong>
          {score}/
          {
            mission.questions
              .length
          }
        </strong>

        <h1>
          {percentage >= 80
            ? 'Excellent work!'
            : percentage >= 50
              ? 'Good progress!'
              : 'Keep building.'}
        </h1>

        <p>
          You scored{' '}
          {percentage}% and earned{' '}
          {knowledgePoints}{' '}
          knowledge points.
        </p>

        {progressSaved && (
          <p>
            ✓ Your progress has
            been saved.
          </p>
        )}

        <button
          className="button primary full"
          onClick={() =>
            navigate(
              `/subjects/${currentSubjectId}`
            )
          }
        >
          Back to subject
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-shell narrow">
      <div className="quiz-top">
        <span>
          Question {index + 1}{' '}
          of{' '}
          {
            mission.questions
              .length
          }
        </span>

        <strong>
          {Math.round(progress)}%
        </strong>
      </div>

      <div className="progress">
        <span
          style={{
            width:
              `${progress}%`
          }}
        />
      </div>

      <section className="question-card">
        <span className="eyebrow">
          {mission.title.toUpperCase()}
        </span>

        <h1>
          {question.prompt}
        </h1>

        <div className="options">
          {(question.options ?? []).map(
            (
              option,
              i
            ) => {
              const isSelected =
                selected === i

              const isCorrect =
                selected !==
                  null &&
                i ===
                  question.answer

              const isWrongSelection =
                selected !==
                  null &&
                isSelected &&
                i !==
                  question.answer

              return (
                <button
                  key={`${question.id}-${i}`}
                  className={[
                    'option',

                    isSelected
                      ? 'selected'
                      : '',

                    isCorrect
                      ? 'correct'
                      : '',

                    isWrongSelection
                      ? 'wrong'
                      : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    choose(i)
                  }
                >
                  <span>
                    {
                      String.fromCharCode(
                        65 + i
                      )
                    }
                  </span>

                  {option}
                </button>
              )
            }
          )}
        </div>

        {selected !== null && (
          <div className="explanation">
            <strong>
              {selected ===
              question.answer
                ? 'Correct ✓'
                : 'Not quite'}
            </strong>

            <p>
              {
                question.explanation
              }
            </p>

            {savingProgress && (
              <p>
                Saving your
                progress...
              </p>
            )}

            <button
              className="button primary full"
              onClick={next}
              disabled={
                savingProgress
              }
            >
              {index ===
              mission.questions
                .length -
                1
                ? 'See results'
                : 'Next question'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
