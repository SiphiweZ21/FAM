import { supabase } from './supabase'

export type Guardian = { learner_id:string; user_id:string; guardian_name:string; role:'owner'|'parent'; created_at:string }
export type LearnerProfile = { id:string; firstName:string; grade:number; role:'owner'|'parent'; learnerAccountConnected:boolean; guardians:Guardian[] }
export type Grade12ParentSummary = { connected:boolean; subjectsSelected?:number; missionsCompleted?:number; practiceAverage?:number; attempts?:number; lastActive?:string|null; targets?:Array<{subjectId:string;currentMark:number|null;targetMark:number}> }

export async function getFamilyLearners():Promise<LearnerProfile[]> {
  const { data:{session} }=await supabase.auth.getSession(); if(!session?.user) return []
  const { data:memberships,error }=await supabase.from('learner_guardians').select('learner_id,role').eq('user_id',session.user.id).order('created_at')
  if(error) throw error; if(!memberships?.length) return []
  const ids=memberships.map(item=>item.learner_id)
  const [{data:profiles,error:profileError},{data:guardians,error:guardianError}]=await Promise.all([
    supabase.from('learner_profiles').select('id,first_name,grade,learner_user_id').in('id',ids),
    supabase.from('learner_guardians').select('learner_id,user_id,guardian_name,role,created_at').in('learner_id',ids).order('created_at')
  ])
  if(profileError) throw profileError; if(guardianError) throw guardianError
  return (profiles??[]).map(profile=>({id:profile.id,firstName:profile.first_name,grade:profile.grade,role:(memberships.find(item=>item.learner_id===profile.id)?.role??'parent') as 'owner'|'parent',learnerAccountConnected:Boolean(profile.learner_user_id),guardians:(guardians??[]).filter(item=>item.learner_id===profile.id) as Guardian[]})).sort((a,b)=>a.firstName.localeCompare(b.firstName))
}

export async function createLearnerProfile(firstName:string,grade:number,parentName:string){const {data,error}=await supabase.rpc('create_learner_profile',{learner_first_name:firstName,learner_grade:grade,parent_name:parentName});if(error)throw error;return data as string}
export async function generateFamilyCode(learnerId:string,purpose:'parent'|'learner'){const {data,error}=await supabase.rpc('generate_family_access_code',{target_learner_id:learnerId,code_purpose:purpose});if(error)throw error;return (Array.isArray(data)?data[0]:data) as {access_code:string;expires_at:string}}
export async function redeemFamilyCode(code:string,type:'parent'|'learner',name?:string){const {data,error}=await supabase.rpc('redeem_family_access_code',{access_code:code,connection_type:type,display_name:name??null});if(error)throw error;if(!data)throw new Error('This access code is invalid or has expired.');return data as string}
export async function removeGuardian(learnerId:string,userId:string){const {error}=await supabase.rpc('remove_learner_guardian',{target_learner_id:learnerId,target_user_id:userId});if(error)throw error}
export async function changeLearnerGrade(learnerId:string,grade:number){const {error}=await supabase.rpc('update_learner_grade',{target_learner_id:learnerId,new_grade:grade});if(error)throw error}
export async function getGrade12ParentSummary(learnerId:string){const {data,error}=await supabase.rpc('get_parent_grade12_summary',{target_learner_id:learnerId});if(error)throw error;return data as Grade12ParentSummary}
