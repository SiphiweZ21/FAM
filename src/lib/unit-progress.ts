import type { LearningUnit, UnitPhase } from '../data/term-programmes'
export type UnitProgress = { version: number; phase: UnitPhase; index: number; teachIndex: number; checkpointAnswers: Record<string,number>; practiceMistakes: number; completedAt?: string; reviewedAt?: string; writingSample?: string }
export function emptyUnitProgress(unit: LearningUnit): UnitProgress { return {version:unit.version,phase:'teach',index:0,teachIndex:0,checkpointAnswers:{},practiceMistakes:0} }
export function unitStorageKey(userId: string, learnerId: string | null, unit: Pick<LearningUnit,'id'>) { return `fam-unit-v1:${userId}:${learnerId||'self'}:${unit.id}` }
export function readUnitProgress(key: string | null, unit: LearningUnit): UnitProgress {
 const empty=emptyUnitProgress(unit)
 if (!key) return empty
 try {
  const data=JSON.parse(localStorage.getItem(key)||'null') as UnitProgress|null
  if (!data || data.version!==unit.version || !['teach','guided','practice','checkpoint','complete','review'].includes(data.phase)) return empty
  const bank=data.phase==='guided'?unit.guided:data.phase==='practice'?unit.practice:data.phase==='checkpoint'?unit.checkpoint:data.phase==='review'?unit.review:[]
  const answers: Record<string,number>={}
  for(const q of unit.checkpoint) if(q.options.includes(data.checkpointAnswers?.[q.id])) answers[q.id]=data.checkpointAnswers[q.id]
  return {...empty,writingSample:typeof data.writingSample==='string'?data.writingSample.slice(0,1000):undefined,phase:data.phase,index:bank.length?Math.max(0,Math.min(bank.length-1,Math.floor(Number(data.index)||0))):0,teachIndex:Math.max(0,Math.min(2,Math.floor(Number(data.teachIndex)||0))),checkpointAnswers:answers,practiceMistakes:Math.max(0,Number(data.practiceMistakes)||0),completedAt:typeof data.completedAt==='string'?data.completedAt:undefined,reviewedAt:typeof data.reviewedAt==='string'?data.reviewedAt:undefined}
 } catch {return empty}
}
export function checkpointScore(unit: LearningUnit, progress: UnitProgress) { return unit.checkpoint.filter(q=>progress.checkpointAnswers[q.id]===q.count).length }
export function reviewDue(progress: UnitProgress, now=Date.now()) { const date=Date.parse(progress.completedAt||''); return Number.isFinite(date)&&now-date>=86400000&&!progress.reviewedAt }
