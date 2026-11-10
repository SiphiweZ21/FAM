import { getSubjects } from './content'
import { supabase } from './supabase'

type RawTarget={subjectId:string;currentMark:number|null;targetMark:number}
type RawProgress={subjectId:string;topicId:string;missionId:string;percentage:number;knowledgePoints:number;completed:boolean;lastAttemptedAt:string|null}
type RawAttempt={subjectId:string;topicId:string;missionId:string;score:number;totalQuestions:number;percentage:number;knowledgePoints:number;attemptedAt:string}
type RawAttemptStat={subjectId:string;topicId:string;attempts:number;average:number;lastActive:string|null}
type RawReport={connected:boolean;selectedSubjects?:string[];targets?:RawTarget[];progress?:RawProgress[];attemptStats?:RawAttemptStat[];recentAttempts?:RawAttempt[]}

export type ParentTopicReport={topicId:string;name:string;missionsCompleted:number;totalMissions:number;progress:number;practiceAverage:number|null;attempts:number;status:'NOT_STARTED'|'IN_PROGRESS'|'COMPLETED'}
export type ParentSubjectReport={subjectId:string;name:string;emoji:string;targetMark:number;currentMark:number|null;practiceAverage:number|null;missionsCompleted:number;totalMissions:number;coverage:number;knowledgePoints:number;attempts:number;gapToTarget:number|null;status:'ON_TRACK'|'ALMOST_THERE'|'NEEDS_ATTENTION'|'NO_DATA';topics:ParentTopicReport[];strongestTopic:ParentTopicReport|null;weakestTopic:ParentTopicReport|null}
export type ParentRecentAttempt={subjectName:string;subjectEmoji:string;topicName:string;missionTitle:string;percentage:number;score:number;totalQuestions:number;attemptedAt:string}
export type Grade12DetailedParentReport={connected:boolean;subjects:ParentSubjectReport[];subjectsSelected:number;missionsCompleted:number;totalMissions:number;practiceAverage:number|null;attempts:number;knowledgePoints:number;lastActive:string|null;strongestSubject:ParentSubjectReport|null;focusSubject:ParentSubjectReport|null;recentAttempts:ParentRecentAttempt[];recommendations:string[]}

export async function getDetailedGrade12ParentReport(learnerId:string):Promise<Grade12DetailedParentReport>{
  const [{data,error},subjects]=await Promise.all([supabase.rpc('get_parent_grade12_report',{target_learner_id:learnerId}),getSubjects()])
  if(error)throw error
  const raw=data as RawReport
  if(!raw?.connected)return {connected:false,subjects:[],subjectsSelected:0,missionsCompleted:0,totalMissions:0,practiceAverage:null,attempts:0,knowledgePoints:0,lastActive:null,strongestSubject:null,focusSubject:null,recentAttempts:[],recommendations:[]}
  const selected=new Set(raw.selectedSubjects??[]),targets=new Map((raw.targets??[]).map(item=>[item.subjectId,item])),progress=raw.progress??[],attempts=raw.recentAttempts??[],stats=raw.attemptStats??[]
  const subjectReports=subjects.filter(subject=>selected.has(subject.id)||progress.some(row=>row.subjectId===subject.id)).map(subject=>{
    const subjectProgress=progress.filter(row=>row.subjectId===subject.id),subjectStats=stats.filter(row=>row.subjectId===subject.id),target=targets.get(subject.id)
    const topics=subject.topics.map(topic=>{
      const topicProgress=subjectProgress.filter(row=>row.topicId===topic.id),topicStat=subjectStats.find(row=>row.topicId===topic.id),completed=new Set(topicProgress.filter(row=>row.completed).map(row=>row.missionId)).size,total=topic.missions.length
      return {topicId:topic.id,name:topic.name,missionsCompleted:completed,totalMissions:total,progress:total?Math.round(completed/total*100):0,practiceAverage:topicStat?Number(topicStat.average):null,attempts:Number(topicStat?.attempts)||0,status:(completed>=total&&total?'COMPLETED':topicStat||completed?'IN_PROGRESS':'NOT_STARTED') as ParentTopicReport['status']}
    })
    const completed=new Set(subjectProgress.filter(row=>row.completed).map(row=>row.missionId)).size,total=subject.topics.reduce((sum,topic)=>sum+topic.missions.length,0),attemptCount=subjectStats.reduce((sum,row)=>sum+Number(row.attempts),0),practice=attemptCount?Math.round(subjectStats.reduce((sum,row)=>sum+Number(row.average)*Number(row.attempts),0)/attemptCount):null,targetMark=target?.targetMark??70
    const activeTopics=topics.filter(topic=>topic.practiceAverage!==null)
    const strongest=[...activeTopics].sort((a,b)=>(b.practiceAverage??0)-(a.practiceAverage??0))[0]??null
    const weakest=[...activeTopics].sort((a,b)=>(a.practiceAverage??0)-(b.practiceAverage??0))[0]??null
    const gap=practice===null?null:targetMark-practice
    return {subjectId:subject.id,name:subject.name,emoji:subject.emoji,targetMark,currentMark:target?.currentMark??null,practiceAverage:practice,missionsCompleted:completed,totalMissions:total,coverage:total?Math.round(completed/total*100):0,knowledgePoints:subjectProgress.reduce((sum,row)=>sum+(Number(row.knowledgePoints)||0),0),attempts:attemptCount,gapToTarget:gap,status:(practice===null?'NO_DATA':practice>=targetMark?'ON_TRACK':practice>=targetMark-10?'ALMOST_THERE':'NEEDS_ATTENTION') as ParentSubjectReport['status'],topics,strongestTopic:strongest,weakestTopic:weakest}
  })
  const active=subjectReports.filter(item=>item.practiceAverage!==null)
  const strongest=[...active].sort((a,b)=>(b.practiceAverage??0)-(a.practiceAverage??0))[0]??null
  const focus=[...active].sort((a,b)=>(a.practiceAverage??0)-(b.practiceAverage??0))[0]??subjectReports.find(item=>item.status==='NO_DATA')??null
  const recent=attempts.map(row=>{const subject=subjects.find(item=>item.id===row.subjectId),topic=subject?.topics.find(item=>item.id===row.topicId),mission=topic?.missions.find(item=>item.id===row.missionId);return {subjectName:subject?.name??row.subjectId,subjectEmoji:subject?.emoji??'📚',topicName:topic?.name??row.topicId,missionTitle:mission?.title??row.missionId,percentage:Number(row.percentage)||0,score:Number(row.score)||0,totalQuestions:Number(row.totalQuestions)||0,attemptedAt:row.attemptedAt}})
  const recommendations:string[]=[]
  if(focus?.status==='NO_DATA')recommendations.push(`Start ${focus.name} practice so FAM can measure progress toward the ${focus.targetMark}% target.`)
  else if(focus)recommendations.push(`Prioritise ${focus.name}${focus.weakestTopic?` — especially ${focus.weakestTopic.name}`:''}. The current practice average is ${focus.practiceAverage}%.`)
  const lowCoverage=subjectReports.filter(item=>item.coverage<34).sort((a,b)=>a.coverage-b.coverage)[0]
  if(lowCoverage&&lowCoverage.subjectId!==focus?.subjectId)recommendations.push(`Build coverage in ${lowCoverage.name}; ${lowCoverage.missionsCompleted} of ${lowCoverage.totalMissions} missions are complete.`)
  if(!recommendations.length)recommendations.push('Keep the current study rhythm and revisit completed topics to maintain exam readiness.')
  const totalAttempts=stats.reduce((sum,row)=>sum+Number(row.attempts),0),overallAverage=totalAttempts?Math.round(stats.reduce((sum,row)=>sum+Number(row.average)*Number(row.attempts),0)/totalAttempts):null
  return {connected:true,subjects:subjectReports,subjectsSelected:subjectReports.length,missionsCompleted:subjectReports.reduce((sum,item)=>sum+item.missionsCompleted,0),totalMissions:subjectReports.reduce((sum,item)=>sum+item.totalMissions,0),practiceAverage:overallAverage,attempts:totalAttempts,knowledgePoints:subjectReports.reduce((sum,item)=>sum+item.knowledgePoints,0),lastActive:attempts[0]?.attemptedAt??null,strongestSubject:strongest,focusSubject:focus,recentAttempts:recent,recommendations}
}
