import {
  useEffect,
  useMemo,
  useState
} from 'react'
import { Link } from 'react-router-dom'
import { getSubjects } from '../lib/content'
import {
  getLearnerSubjectTargets,
  saveLearnerSubjectTargets
} from '../lib/learner'
import type { Subject } from '../types'

type SubjectSelection = {
  selected: boolean
  currentMark: string
  targetMark: string
}

export default function MySubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(
    []
  )

  const [selections, setSelections] = useState<
    Record<string, SubjectSelection>
  >({})

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [
          availableSubjects,
          learnerSubjects
        ] = await Promise.all([
          getSubjects(),
          getLearnerSubjectTargets()
        ])

        setSubjects(availableSubjects)

        const existingMap = new Map(
          learnerSubjects.map(item => [
            item.subjectId,
            item
          ])
        )

        const initialSelections =
          availableSubjects.reduce<
            Record<string, SubjectSelection>
          >((accumulator, subject) => {
            const existing = existingMap.get(subject.id)

            accumulator[subject.id] = {
              selected: Boolean(existing),
              currentMark:
                existing?.currentMark !== null &&
                existing?.currentMark !== undefined
                  ? String(existing.currentMark)
                  : '',
              targetMark: String(
                existing?.targetMark ?? 70
              )
            }

            return accumulator
          }, {})

        setSelections(initialSelections)
      } catch (error) {
        console.error(error)
        setMessage(
          'Unable to load your subjects.'
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const selectedCount = useMemo(
    () =>
      Object.values(selections).filter(
        selection => selection.selected
      ).length,
    [selections]
  )

  function toggleSubject(subjectId: string) {
    setSelections(current => ({
      ...current,
      [subjectId]: {
        ...current[subjectId],
        selected:
          !current[subjectId]?.selected
      }
    }))
  }

  function updateMark(
    subjectId: string,
    field: 'currentMark' | 'targetMark',
    value: string
  ) {
    setSelections(current => ({
      ...current,
      [subjectId]: {
        ...current[subjectId],
        [field]: value
      }
    }))
  }

  async function save() {
    setMessage('')

    const selectedSubjects = subjects
      .filter(
        subject =>
          selections[subject.id]?.selected
      )
      .map(subject => {
        const selection = selections[subject.id]

        const currentMark =
          selection.currentMark.trim() === ''
            ? null
            : Number(selection.currentMark)

        const targetMark = Number(
          selection.targetMark
        )

        if (
          currentMark !== null &&
          (currentMark < 0 || currentMark > 100)
        ) {
          throw new Error(
            `${subject.name}: current mark must be between 0 and 100.`
          )
        }

        if (
          Number.isNaN(targetMark) ||
          targetMark < 0 ||
          targetMark > 100
        ) {
          throw new Error(
            `${subject.name}: target mark must be between 0 and 100.`
          )
        }

        return {
          subjectId: subject.id,
          currentMark,
          targetMark
        }
      })

    setSaving(true)

    try {
      await saveLearnerSubjectTargets(
        selectedSubjects
      )

      setMessage(
        '✓ Your subjects and targets have been saved.'
      )
    } catch (error) {
      console.error(error)

      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to save your subjects.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="narrow">
        <p>Loading your subjects...</p>
      </div>
    )
  }

  return (
    <div className="stack-lg narrow">
      <header className="page-header">
        <span className="eyebrow">
          MY MATRIC PLAN
        </span>

        <h1>Choose your subjects</h1>

        <p>
          Select the subjects you are taking and
          tell FAM what mark you are aiming for.
        </p>
      </header>

      <section className="info-card">
        <strong>
          {selectedCount} subject
          {selectedCount === 1 ? '' : 's'} selected
        </strong>

        <p>
          Your targets will be used to measure
          your progress and recommend where to
          focus your revision.
        </p>
      </section>

      <div className="subject-target-list">
        {subjects.map(subject => {
          const selection = selections[subject.id]

          if (!selection) return null

          return (
            <section
              className={[
                'subject-target-card',
                selection.selected
                  ? 'subject-target-card-selected'
                  : ''
              ]
                .filter(Boolean)
                .join(' ')}
              key={subject.id}
            >
              <button
                type="button"
                className="subject-target-toggle"
                onClick={() =>
                  toggleSubject(subject.id)
                }
              >
                <span className="subject-target-emoji">
                  {subject.emoji}
                </span>

                <span>
                  <strong>{subject.name}</strong>

                  <small>
                    {selection.selected
                      ? 'Selected'
                      : 'Tap to select'}
                  </small>
                </span>

                <span className="subject-target-check">
                  {selection.selected
                    ? '✓'
                    : '+'}
                </span>
              </button>

              {selection.selected && (
                <div className="subject-target-fields">
                  <label>
                    Current mark
                    <div className="percentage-input">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          selection.currentMark
                        }
                        placeholder="Optional"
                        onChange={event =>
                          updateMark(
                            subject.id,
                            'currentMark',
                            event.target.value
                          )
                        }
                      />

                      <span>%</span>
                    </div>
                  </label>

                  <label>
                    Target mark
                    <div className="percentage-input">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={
                          selection.targetMark
                        }
                        onChange={event =>
                          updateMark(
                            subject.id,
                            'targetMark',
                            event.target.value
                          )
                        }
                      />

                      <span>%</span>
                    </div>
                  </label>
                </div>
              )}
            </section>
          )
        })}
      </div>

      <button
        type="button"
        className="button primary full"
        onClick={save}
        disabled={saving}
      >
        {saving
          ? 'Saving...'
          : 'Save my subjects'}
      </button>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      <Link
        className="button secondary full"
        to="/account"
      >
        Back to account
      </Link>
    </div>
  )
}
