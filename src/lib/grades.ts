export type GradeId = `grade-${number}`

export type GradeStage = 'foundation' | 'intermediate' | 'senior' | 'exam'

export type Grade = {
  id: GradeId
  number: number
  name: string
  stage: GradeStage
  stageLabel: string
}

export const grades: Grade[] = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1
  const stage: GradeStage = number <= 3
    ? 'foundation'
    : number <= 6
      ? 'intermediate'
      : number <= 9
        ? 'senior'
        : 'exam'

  const stageLabel = stage === 'foundation'
    ? 'Play & discover'
    : stage === 'intermediate'
      ? 'Explore & practise'
      : stage === 'senior'
        ? 'Learn & challenge'
        : 'Study & prepare'

  return {
    id: `grade-${number}` as GradeId,
    number,
    name: `Grade ${number}`,
    stage,
    stageLabel
  }
})

const selectedGradeKey = 'fam-selected-grade'

export function rememberGrade(gradeId: GradeId) {
  localStorage.setItem(selectedGradeKey, gradeId)
}

export function getRememberedGrade(): GradeId | null {
  const stored = localStorage.getItem(selectedGradeKey)
  return grades.some(grade => grade.id === stored) ? stored as GradeId : null
}

export function getGrade(gradeId?: string): Grade | undefined {
  return grades.find(grade => grade.id === gradeId)
}
