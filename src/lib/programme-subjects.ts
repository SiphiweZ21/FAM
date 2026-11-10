export const programmeSubjectLabels = {
 mathematics: 'Mathematics', words: 'English', coding: 'Coding and Robotics',
 'life-skills': 'Life Skills', science: 'Science and Technology',
 'social-sciences': 'Social Sciences', 'creative-arts': 'Creative Arts',
 ems: 'Economic and Management Sciences', 'life-orientation': 'Life Orientation',
 technology: 'Technology'
} as const
export type ProgrammeSubject = keyof typeof programmeSubjectLabels
export function programmeSubjectName(subject: string) {
 return programmeSubjectLabels[subject as ProgrammeSubject] || subject
}
