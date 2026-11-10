create or replace function public.get_parent_grade12_report(target_learner_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  learner_uid uuid;
  result jsonb;
begin
  if not public.is_learner_guardian(target_learner_id) then
    raise exception 'You do not have access to this learner.';
  end if;

  select learner_user_id into learner_uid
  from public.learner_profiles
  where id = target_learner_id and grade = 12;

  if learner_uid is null then
    return jsonb_build_object('connected', false);
  end if;

  select jsonb_build_object(
    'connected', true,
    'selectedSubjects', coalesce((
      select jsonb_agg(subject_id order by subject_id)
      from public.learner_subjects where user_id = learner_uid
    ), '[]'::jsonb),
    'targets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'subjectId', subject_id,
        'currentMark', current_mark,
        'targetMark', target_mark
      ) order by subject_id)
      from public.subject_targets where user_id = learner_uid
    ), '[]'::jsonb),
    'progress', coalesce((
      select jsonb_agg(jsonb_build_object(
        'subjectId', subject_id,
        'topicId', topic_id,
        'missionId', mission_id,
        'percentage', percentage,
        'knowledgePoints', knowledge_points,
        'completed', completed,
        'lastAttemptedAt', last_attempted_at
      ) order by last_attempted_at desc nulls last)
      from public.learner_progress where user_id = learner_uid
    ), '[]'::jsonb),
    'attemptStats', coalesce((
      select jsonb_agg(jsonb_build_object(
        'subjectId', subject_id,
        'topicId', topic_id,
        'attempts', attempt_count,
        'average', practice_average,
        'lastActive', last_active
      ) order by subject_id, topic_id)
      from (
        select subject_id, topic_id, count(*) as attempt_count,
          round(avg(percentage)) as practice_average,
          max(attempted_at) as last_active
        from public.mission_attempts
        where user_id = learner_uid
        group by subject_id, topic_id
      ) stats
    ), '[]'::jsonb),
    'recentAttempts', coalesce((
      select jsonb_agg(row_data order by attempted_at desc)
      from (
        select attempted_at, jsonb_build_object(
          'subjectId', subject_id,
          'topicId', topic_id,
          'missionId', mission_id,
          'score', score,
          'totalQuestions', total_questions,
          'percentage', percentage,
          'knowledgePoints', knowledge_points,
          'attemptedAt', attempted_at
        ) as row_data
        from public.mission_attempts
        where user_id = learner_uid
        order by attempted_at desc
        limit 20
      ) recent
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_parent_grade12_report(uuid) from public;
grant execute on function public.get_parent_grade12_report(uuid) to authenticated;
