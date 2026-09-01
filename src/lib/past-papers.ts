const DEFAULT_CONTENT_BASE_URL =
  'https://fam-matric-content.pages.dev/v1'

const CONTENT_BASE_URL =
  import.meta.env.VITE_CONTENT_BASE_URL ||
  DEFAULT_CONTENT_BASE_URL

export type PastPaperDocumentType =
  | 'QUESTION'
  | 'MEMO'
  | 'ADDENDUM'
  | 'ANSWER_BOOK'
  | 'ANNEXURE'
  | 'FORMULA_SHEET'
  | 'SOURCE_BOOKLET'
  | 'DATA_FILE'
  | 'OTHER'

export type PastPaperDocument = {
  id: string
  type: PastPaperDocumentType
  label: string
  url: string
}

export type PastPaperExam = {
  id: string
  subjectId: string
  year: number
  session: string
  paper: string
  documents: PastPaperDocument[]
}

type RawPastPaper =
  Record<string, unknown>

function stringValue(
  value: unknown
): string {
  return typeof value === 'string'
    ? value
    : ''
}

function numberValue(
  value: unknown
): number {
  if (
    typeof value === 'number'
  ) {
    return value
  }

  if (
    typeof value === 'string'
  ) {
    const parsed =
      Number.parseInt(
        value,
        10
      )

    return Number.isNaN(
      parsed
    )
      ? 0
      : parsed
  }

  return 0
}

function normalisePaperLabel(
  value: unknown
): string {
  if (
    typeof value === 'number'
  ) {
    return `Paper ${value}`
  }

  if (
    typeof value !== 'string'
  ) {
    return 'Paper'
  }

  const trimmed =
    value.trim()

  if (!trimmed) {
    return 'Paper'
  }

  const lower =
    trimmed.toLowerCase()

  if (
    lower.startsWith(
      'paper'
    )
  ) {
    return trimmed
  }

  const pMatch =
    trimmed.match(
      /^p\s*(\d+)$/i
    )

  if (pMatch) {
    return `Paper ${pMatch[1]}`
  }

  if (
    /^\d+$/.test(
      trimmed
    )
  ) {
    return `Paper ${trimmed}`
  }

  return trimmed
}

function normaliseDocumentType(
  value: string
): PastPaperDocumentType {
  const normalised =
    value
      .trim()
      .toUpperCase()
      .replace(
        /[\s-]+/g,
        '_'
      )

  if (
    normalised.includes(
      'MEMO'
    ) ||
    normalised.includes(
      'MARKING'
    )
  ) {
    return 'MEMO'
  }

  if (
    normalised.includes(
      'QUESTION'
    )
  ) {
    return 'QUESTION'
  }

  if (
    normalised.includes(
      'ADDEND'
    )
  ) {
    return 'ADDENDUM'
  }

  if (
    normalised.includes(
      'ANSWER'
    )
  ) {
    return 'ANSWER_BOOK'
  }

  if (
    normalised.includes(
      'ANNEX'
    )
  ) {
    return 'ANNEXURE'
  }

  if (
    normalised.includes(
      'FORMULA'
    ) ||
    normalised.includes(
      'INFORMATION'
    )
  ) {
    return 'FORMULA_SHEET'
  }

  if (
    normalised.includes(
      'SOURCE'
    )
  ) {
    return 'SOURCE_BOOKLET'
  }

  if (
    normalised.includes(
      'DATA'
    )
  ) {
    return 'DATA_FILE'
  }

  return 'OTHER'
}

function documentLabel(
  type: PastPaperDocumentType
): string {
  switch (type) {
    case 'QUESTION':
      return 'Question Paper'

    case 'MEMO':
      return 'Memorandum'

    case 'ADDENDUM':
      return 'Addendum'

    case 'ANSWER_BOOK':
      return 'Answer Book'

    case 'ANNEXURE':
      return 'Annexure'

    case 'FORMULA_SHEET':
      return 'Formula / Information Sheet'

    case 'SOURCE_BOOKLET':
      return 'Source Booklet'

    case 'DATA_FILE':
      return 'Data Files'

    default:
      return 'Supporting Document'
  }
}

function makeDocument(
  id: string,
  type: PastPaperDocumentType,
  url: string
):
PastPaperDocument | null {
  if (!url) {
    return null
  }

  return {
    id,
    type,
    label:
      documentLabel(
        type
      ),
    url
  }
}

function normaliseRawPaper(
  raw: RawPastPaper,
  index: number
):
PastPaperExam | null {
  const subjectId =
    stringValue(
      raw.subjectId ??
      raw.subject_id ??
      raw.subject
    )

  const year =
    numberValue(
      raw.year
    )

  const session =
    stringValue(
      raw.session ??
      raw.examSession ??
      raw.exam_session ??
      raw.term
    ) ||
    'Exam'

  const paper =
    normalisePaperLabel(
      raw.paper ??
      raw.paperNumber ??
      raw.paper_number
    )

  const id =
    stringValue(
      raw.id
    ) ||
    `${subjectId}-${year}-${session}-${paper}-${index}`

  const documents:
    PastPaperDocument[] = []

  const questionUrl =
    stringValue(
      raw.questionUrl ??
      raw.question_url ??
      raw.questionPaperUrl ??
      raw.question_paper_url
    )

  const memoUrl =
    stringValue(
      raw.memoUrl ??
      raw.memo_url ??
      raw.memorandumUrl ??
      raw.memorandum_url
    )

  const question =
    makeDocument(
      `${id}-question`,
      'QUESTION',
      questionUrl
    )

  if (question) {
    documents.push(
      question
    )
  }

  const memo =
    makeDocument(
      `${id}-memo`,
      'MEMO',
      memoUrl
    )

  if (memo) {
    documents.push(
      memo
    )
  }

  const rawDocuments =
    Array.isArray(
      raw.documents
    )
      ? raw.documents
      : []

  rawDocuments.forEach(
    (
      item,
      documentIndex
    ) => {
      if (
        !item ||
        typeof item !==
          'object'
      ) {
        return
      }

      const record =
        item as Record<
          string,
          unknown
        >

      const url =
        stringValue(
          record.url ??
          record.href ??
          record.fileUrl ??
          record.file_url
        )

      if (!url) {
        return
      }

      const rawType =
        stringValue(
          record.type ??
          record.documentType ??
          record.document_type ??
          record.label
        )

      const type =
        normaliseDocumentType(
          rawType
        )

      const document:
        PastPaperDocument = {
          id:
            stringValue(
              record.id
            ) ||
            `${id}-document-${documentIndex}`,

          type,

          label:
            stringValue(
              record.label ??
              record.name ??
              record.title
            ) ||
            documentLabel(
              type
            ),

          url
        }

      documents.push(
        document
      )
    }
  )

  if (!subjectId) {
    return null
  }

  return {
    id,
    subjectId,
    year,
    session,
    paper,
    documents
  }
}

export async function getPastPapers():
Promise<PastPaperExam[]> {
  const response =
    await fetch(
      `${CONTENT_BASE_URL}/past-papers.json`
    )

  if (!response.ok) {
    throw new Error(
      `Unable to load past papers: ${response.status}`
    )
  }

  const payload:
    unknown =
    await response.json()

  const rows =
    Array.isArray(
      payload
    )
      ? payload
      : (
          payload &&
          typeof payload ===
            'object' &&
          Array.isArray(
            (
              payload as {
                papers?: unknown
              }
            ).papers
          )
        )
        ? (
            payload as {
              papers: unknown[]
            }
          ).papers
        : []

  return rows
    .map(
      (
        raw,
        index
      ) => {
        if (
          !raw ||
          typeof raw !==
            'object'
        ) {
          return null
        }

        return normaliseRawPaper(
          raw as RawPastPaper,
          index
        )
      }
    )
    .filter(
      (
        paper
      ): paper is PastPaperExam =>
        paper !== null
    )
}

export async function getPastPapersForSubject(
  subjectId: string
):
Promise<PastPaperExam[]> {
  const papers =
    await getPastPapers()

  return papers
    .filter(
      paper =>
        paper.subjectId ===
        subjectId
    )
    .sort(
      (
        a,
        b
      ) =>
        b.year - a.year
    )
}