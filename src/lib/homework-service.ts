import { supabase } from './supabase'

export type HomeworkGuidance = {
  title: string
  understanding: string
  keyConcept: string
  steps: string[]
  workedExplanation: string
  finalAnswer: string
  checkYourUnderstanding: string
  encouragement: string
}

type HomeworkHelpRequest = {
  grade: number
  subject: string
  question: string
}

export async function requestHomeworkHelp(input: HomeworkHelpRequest): Promise<HomeworkGuidance> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sign in to use Premium Homework Help.')

  const response = await fetch('/api/homework/help', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.access_token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(input)
  })

  const result = await response.json() as { error?: string; guidance?: HomeworkGuidance }
  if (!response.ok) throw new Error(result.error || 'FAM could not prepare guidance for this question.')
  if (!result.guidance) throw new Error('FAM returned an incomplete response. Please try again.')
  return result.guidance
}
