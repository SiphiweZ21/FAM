import {
  BookOpenCheck,
  ExternalLink,
  FileText,
  LockKeyhole,
  Paperclip
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Link,
  useParams
} from 'react-router-dom'

import {
  getLearnerAccessMode,
  type LearnerAccessMode
} from '../lib/access'
import {
  getPastPapersForSubject,
  type PastPaperDocument,
  type PastPaperDocumentType,
  type PastPaperExam
} from '../lib/past-papers'
import {
  getSubject
} from '../lib/content'

type SubjectSummary = Awaited<
  ReturnType<typeof getSubject>
>

function documentIcon(
  type: PastPaperDocumentType
) {
  if (type === 'MEMO') {
    return (
      <BookOpenCheck
        size={18}
        strokeWidth={2}
      />
    )
  }

  if (type === 'QUESTION') {
    return (
      <FileText
        size={18}
        strokeWidth={2}
      />
    )
  }

  return (
    <Paperclip
      size={18}
      strokeWidth={2}
    />
  )
}

function documentClass(
  type: PastPaperDocumentType
) {
  if (type === 'QUESTION') {
    return 'question'
  }

  if (type === 'MEMO') {
    return 'memo'
  }

  return 'supporting'
}

function documentOrder(
  document: PastPaperDocument
) {
  const order:
    Record<
      PastPaperDocumentType,
      number
    > = {
      QUESTION: 1,
      MEMO: 2,
      ADDENDUM: 3,
      ANSWER_BOOK: 4,
      ANNEXURE: 5,
      FORMULA_SHEET: 6,
      SOURCE_BOOKLET: 7,
      DATA_FILE: 8,
      OTHER: 9
    }

  return order[
    document.type
  ]
}

export default function PastPapersPage() {
  const {
    subjectId = ''
  } = useParams()

  const [
    subject,
    setSubject
  ] =
    useState<SubjectSummary | null>(
      null
    )

  const [
    accessMode,
    setAccessMode
  ] =
    useState<LearnerAccessMode>(
      'FREE'
    )

  const [
    papers,
    setPapers
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
    error,
    setError
  ] =
    useState<string | null>(
      null
    )

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const [
          loadedSubject,
          loadedAccessMode,
          loadedPapers
        ] =
          await Promise.all([
            getSubject(
              subjectId
            ),
            getLearnerAccessMode(),
            getPastPapersForSubject(
              subjectId
            )
          ])

        if (cancelled) {
          return
        }

        setSubject(
          loadedSubject
        )

        setAccessMode(
          loadedAccessMode
        )

        setPapers(
          loadedPapers
        )
      } catch (loadError) {
        console.error(
          'Unable to load past papers:',
          loadError
        )

        if (!cancelled) {
          setError(
            'Unable to load the exam library.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [subjectId])

  const papersByYear =
    useMemo(() => {
      const grouped =
        new Map<
          number,
          PastPaperExam[]
        >()

      papers.forEach(
        paper => {
          const year =
            paper.year || 0

          const existing =
            grouped.get(
              year
            ) ?? []

          existing.push(
            paper
          )

          grouped.set(
            year,
            existing
          )
        }
      )

      return Array.from(
        grouped.entries()
      ).sort(
        (
          [yearA],
          [yearB]
        ) =>
          yearB - yearA
      )
    }, [papers])

  const totalDocuments =
    papers.reduce(
      (
        total,
        paper
      ) =>
        total +
        paper.documents.length,
      0
    )

  if (loading) {
    return (
      <div className="stack-lg">
        <section className="info-card">
          <p>
            Loading exam library...
          </p>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stack-lg">
        <section className="info-card">
          <h2>
            Exam library unavailable
          </h2>

          <p>
            {error}
          </p>
        </section>
      </div>
    )
  }

  const isPremium =
    accessMode === 'PREMIUM'

  return (
    <div className="stack-lg">
      <header className="page-header">
        <span className="eyebrow">
          EXAM PREPARATION
        </span>

        <h1>
          Past Papers &
          Memorandums
        </h1>

        <p>
          Practise complete
          examinations with
          question papers,
          memorandums and
          supporting documents
          where available.
        </p>
      </header>

      {!isPremium ? (
        <section className="info-card">
          <div className="mission-access-label">
            <LockKeyhole
              size={18}
            />

            Premium exam library
          </div>

          <h2>
            Unlock Past Papers
          </h2>

          <p>
            Get access to the
            complete FAM exam
            library, including
            question papers,
            memorandums and
            supporting exam
            documents.
          </p>

          <div className="past-paper-document-types">
            <span>
              Question Papers
            </span>

            <span>
              Memorandums
            </span>

            <span>
              Addendums
            </span>

            <span>
              Answer Books
            </span>

            <span>
              Source Material
            </span>
          </div>

          <Link
            to="/account"
            className="button full"
          >
            Unlock Premium —
            R150/year
          </Link>
        </section>
      ) : (
        <>
          <section className="info-card">
            <span className="eyebrow">
              EXAM LIBRARY
            </span>

            <h2>
              {subject?.name ??
                'Subject exams'}
            </h2>

            <p>
              {papers.length}{' '}
              {papers.length === 1
                ? 'exam'
                : 'exams'}
              {' · '}
              {totalDocuments}{' '}
              documents available
              for this subject.
            </p>
          </section>

          {papers.length === 0 ? (
            <section className="info-card">
              <h2>
                No past exams yet
              </h2>

              <p>
                Past examination
                documents for this
                subject will appear
                here once they are
                available.
              </p>
            </section>
          ) : (
            papersByYear.map(
              (
                [
                  year,
                  yearPapers
                ]
              ) => (
                <section
                  key={year}
                  className="past-paper-year"
                >
                  <div className="past-paper-year-header">
                    <div>
                      <span className="eyebrow">
                        EXAM YEAR
                      </span>

                      <h2>
                        {year || 'Other'}
                      </h2>
                    </div>

                    <span className="past-paper-year-count">
                      {
                        yearPapers.length
                      }{' '}
                      {
                        yearPapers.length ===
                        1
                          ? 'paper'
                          : 'papers'
                      }
                    </span>
                  </div>

                  <div className="past-paper-list">
                    {yearPapers.map(
                      paper => {
                        const sortedDocuments =
                          [
                            ...paper.documents
                          ].sort(
                            (
                              a,
                              b
                            ) =>
                              documentOrder(
                                a
                              ) -
                              documentOrder(
                                b
                              )
                          )

                        return (
                          <article
                            key={
                              paper.id
                            }
                            className="past-paper-card"
                          >
                            <div className="past-paper-card-header">
                              <div>
                                <span className="past-paper-session">
                                  {
                                    paper.session
                                  }
                                </span>

                                <h3>
                                  {
                                    paper.paper
                                  }
                                </h3>
                              </div>

                              <span className="past-paper-document-count">
                                {
                                  paper.documents
                                    .length
                                }{' '}
                                {
                                  paper.documents
                                    .length ===
                                  1
                                    ? 'file'
                                    : 'files'
                                }
                              </span>
                            </div>

                            <div className="past-paper-documents">
                              {sortedDocuments.map(
                                document => (
                                  <a
                                    key={
                                      document.id
                                    }
                                    href={
                                      document.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`past-paper-document ${documentClass(
                                      document.type
                                    )}`}
                                  >
                                    <span className="past-paper-document-icon">
                                      {documentIcon(
                                        document.type
                                      )}
                                    </span>

                                    <span className="past-paper-document-content">
                                      <span className="past-paper-document-label">
                                        {
                                          document.label
                                        }
                                      </span>

                                      <span className="past-paper-document-action">
                                        Open document
                                      </span>
                                    </span>

                                    <ExternalLink
                                      className="past-paper-document-external"
                                      size={16}
                                      strokeWidth={2}
                                    />
                                  </a>
                                )
                              )}
                            </div>
                          </article>
                        )
                      }
                    )}
                  </div>
                </section>
              )
            )
          )}
        </>
      )}
    </div>
  )
}