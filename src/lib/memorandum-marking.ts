import type { MarkingPoint } from '../types'

export type MarkedStep = MarkingPoint & {
  learnerAnswer: string
  awardedMarks: number
  matched: boolean
}

function normalise(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[×·]/g, '*')
    .replace(/[–—]/g, '-')
    .replace(/\s*([=+\-*/(),])\s*/g, '$1')
    .trim()
}

export function markMemorandumStep(point: MarkingPoint, learnerAnswer: string): MarkedStep {
  const answer = normalise(learnerAnswer)
  const accepted = [point.memoAnswer, ...(point.acceptedAnswers ?? [])].map(normalise)
  const keywords = (point.requiredKeywords ?? []).map(normalise)
  const exactMatch = answer.length > 0 && accepted.includes(answer)
  const keywordMatch = answer.length > 0 && keywords.length > 0 && keywords.every(keyword => answer.includes(keyword))
  const matched = exactMatch || keywordMatch

  return {
    ...point,
    learnerAnswer,
    matched,
    awardedMarks: matched ? point.marks : 0
  }
}

export function markMemorandumAnswer(points: MarkingPoint[], answers: Record<string, string>) {
  const steps = points.map(point => markMemorandumStep(point, answers[point.id] ?? ''))
  return {
    steps,
    earnedMarks: steps.reduce((total, step) => total + step.awardedMarks, 0),
    totalMarks: points.reduce((total, point) => total + point.marks, 0)
  }
}
