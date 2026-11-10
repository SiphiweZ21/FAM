import type { ProgrammeSubject } from '../lib/programme-subjects'
import { freeTermUnits } from './free-term-units'
export type UnitPhase = 'teach' | 'guided' | 'practice' | 'checkpoint' | 'complete' | 'review'
export type CountingQuestion = { id: string; count: number; emoji: string; options: number[]; skill: 'count' | 'zero'; layout: 'line' | 'scatter'; prompt?: string; visual?: string; labels?: Record<number,string>; explanation?: string }
export type LearningUnit = { id: string; grade: number; subject: ProgrammeSubject; term: number; title: string; access: 'FREE' | 'PREMIUM'; status: 'available'; version: number; sourcePath?: string; contentKind?: 'EXISTING_PATH_REVIEW'; reviewStatus?: 'EDUCATOR_REVIEW_PENDING'; objectives: string[]; lessons?: {title:string;body:string;visual:string}[]; writingTask?: string; scaffolding?: {HL:string;FAL:string}; guided: CountingQuestion[]; practice: CountingQuestion[]; checkpoint: CountingQuestion[]; review: CountingQuestion[] }
const question = (id: string, count: number, emoji: string, options: number[], layout: CountingQuestion['layout'] = 'line'): CountingQuestion => ({id,count,emoji,options,layout,skill:count===0?'zero':'count'})
export const countingUnit: LearningUnit = {
 id:'g1-maths-t1-counting-objects',grade:1,subject:'mathematics',term:1,title:'Count every object',access:'FREE',status:'available',version:1,
 objectives:['Touch each object once as you count.','Match a group to its number, from 0 to 10.','Use zero when a group is empty.'],
 guided:[question('g1',3,'⭐',[2,3,4]),question('g2',5,'🍎',[5,4,6],'scatter'),question('g3',0,'🌼',[1,2,0])],
 practice:[question('p1',2,'🐟',[3,1,2]),question('p2',6,'🌼',[6,5,7],'scatter'),question('p3',4,'🦋',[3,4,5]),question('p4',0,'🍎',[2,0,1]),question('p5',8,'⭐',[7,9,8],'scatter'),question('p6',1,'🐢',[0,1,2]),question('p7',10,'🍓',[10,9,8],'scatter'),question('p8',7,'🚗',[6,7,8])],
 checkpoint:[question('c1',9,'🌻',[8,10,9],'scatter'),question('c2',0,'🐟',[0,1,2]),question('c3',5,'🐢',[4,5,6],'scatter'),question('c4',3,'🍓',[3,4,2]),question('c5',10,'🦋',[9,10,8])],
 review:[question('r1',4,'🚗',[5,3,4],'scatter'),question('r2',0,'⭐',[1,0,2]),question('r3',7,'🍎',[7,8,6],'scatter')]
}
export const learningUnits: LearningUnit[] = [countingUnit, ...freeTermUnits]
export function findLearningUnit(grade: number, subject: string, term: number, id: string) { return learningUnits.find(unit=>unit.grade===grade&&unit.subject===subject&&unit.term===term&&unit.id===id&&unit.status==='available') }

export type UnitSummary = Pick<LearningUnit,'id'|'grade'|'subject'|'term'|'title'|'access'|'status'|'version'|'objectives'|'sourcePath'|'contentKind'|'reviewStatus'>
export { unitCatalogue } from './term-unit-catalogue'
