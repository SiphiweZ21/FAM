import { supabase } from './supabase'
let authenticated = false
export function hasLearningAccount() { return authenticated }
export function initializeLearningSession() {
  let active = true
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { if (active) authenticated = Boolean(session?.user) })
  void supabase.auth.getSession().then(({ data }) => { if (active) authenticated = Boolean(data.session?.user) }).catch(() => { if (active) authenticated = false })
  return () => { active = false; authenticated = false; subscription.unsubscribe() }
}
