import { supabase } from './supabase'

export type GradeOneGuardian = {
  child_id: string
  user_id: string
  guardian_name: string
  role: 'owner' | 'parent'
  created_at: string
}

export type GradeOneFamily = {
  childId: string
  childName: string
  role: 'owner' | 'parent'
  guardians: GradeOneGuardian[]
}

export async function getGradeOneFamily(): Promise<GradeOneFamily | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  const { data: membership, error } = await supabase.from('grade_one_guardians').select('child_id,role').eq('user_id', session.user.id).maybeSingle()
  if (error) throw error
  if (!membership) return null
  const [{ data: child, error: childError }, { data: guardians, error: guardiansError }] = await Promise.all([
    supabase.from('grade_one_children').select('id,first_name').eq('id', membership.child_id).single(),
    supabase.from('grade_one_guardians').select('child_id,user_id,guardian_name,role,created_at').eq('child_id', membership.child_id).order('created_at')
  ])
  if (childError) throw childError
  if (guardiansError) throw guardiansError
  return { childId: child.id, childName: child.first_name, role: membership.role, guardians: (guardians ?? []) as GradeOneGuardian[] }
}

export async function createGradeOneFamily(childName: string, parentName: string) {
  const { data, error } = await supabase.rpc('create_grade_one_family', { child_first_name: childName, parent_name: parentName })
  if (error) throw error
  return data as string
}

export async function generateGradeOneFamilyCode(childId: string) {
  const { data, error } = await supabase.rpc('generate_grade_one_family_code', { target_child_id: childId })
  if (error) throw error
  const result = Array.isArray(data) ? data[0] : data
  return result as { access_code: string; expires_at: string }
}

export async function joinGradeOneFamily(code: string, parentName: string) {
  const { data, error } = await supabase.rpc('join_grade_one_family', { access_code: code, parent_name: parentName })
  if (error) throw error
  if (!data) throw new Error('This family code is invalid or has expired.')
  return data as string
}

export async function removeGradeOneGuardian(childId: string, userId: string) {
  const { error } = await supabase.rpc('remove_grade_one_guardian', { target_child_id: childId, target_user_id: userId })
  if (error) throw error
}
