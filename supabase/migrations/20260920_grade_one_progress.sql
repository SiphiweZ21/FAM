create table if not exists public.grade_one_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress_data jsonb not null default '{"schemaVersion":1,"completedPaths":[],"homeworkAttempts":0,"homeworkCorrect":0}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.grade_one_progress enable row level security;

drop policy if exists "Learners can read their Grade 1 progress" on public.grade_one_progress;
create policy "Learners can read their Grade 1 progress"
  on public.grade_one_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Learners can create their Grade 1 progress" on public.grade_one_progress;
create policy "Learners can create their Grade 1 progress"
  on public.grade_one_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Learners can update their Grade 1 progress" on public.grade_one_progress;
create policy "Learners can update their Grade 1 progress"
  on public.grade_one_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.grade_one_progress to authenticated;
