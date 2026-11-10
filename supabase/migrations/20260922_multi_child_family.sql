create extension if not exists pgcrypto with schema extensions;

create table if not exists public.learner_profiles (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) between 1 and 50),
  grade smallint not null check (grade between 1 and 12),
  created_by uuid not null references auth.users(id) on delete cascade,
  learner_user_id uuid unique references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learner_guardians (
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  guardian_name text not null check (char_length(trim(guardian_name)) between 1 and 60),
  role text not null check (role in ('owner', 'parent')),
  created_at timestamptz not null default now(),
  primary key (learner_id, user_id)
);

create table if not exists public.family_access_codes (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  purpose text not null check (purpose in ('parent', 'learner')),
  code_hash text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_access_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now()
);

-- Preserve families created by the earlier Grade 1 milestone.
insert into public.learner_profiles(id, first_name, grade, created_by, created_at)
select id, first_name, 1, created_by, created_at from public.grade_one_children
on conflict (id) do nothing;

insert into public.learner_guardians(learner_id, user_id, guardian_name, role, created_at)
select child_id, user_id, guardian_name, role, created_at from public.grade_one_guardians
on conflict (learner_id, user_id) do nothing;

create index if not exists learner_guardians_user_idx on public.learner_guardians(user_id);
create index if not exists family_access_codes_learner_idx on public.family_access_codes(learner_id);
create index if not exists family_access_attempts_user_time_idx on public.family_access_attempts(user_id, attempted_at desc);

create or replace function public.is_learner_guardian(target_learner_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.learner_guardians where learner_id = target_learner_id and user_id = auth.uid()); $$;

create or replace function public.create_learner_profile(learner_first_name text, learner_grade integer, parent_name text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in before creating a learner profile.'; end if;
  if trim(learner_first_name) = '' or char_length(trim(learner_first_name)) > 50 then raise exception 'Enter a valid learner name.'; end if;
  if learner_grade < 1 or learner_grade > 12 then raise exception 'Choose a grade from 1 to 12.'; end if;
  if trim(parent_name) = '' or char_length(trim(parent_name)) > 60 then raise exception 'Enter a valid parent name.'; end if;

  insert into public.learner_profiles(first_name, grade, created_by)
  values(trim(learner_first_name), learner_grade, auth.uid()) returning id into new_id;
  insert into public.learner_guardians(learner_id, user_id, guardian_name, role)
  values(new_id, auth.uid(), trim(parent_name), 'owner');

  if learner_grade = 1 then
    update public.grade_one_progress set child_id = new_id where user_id = auth.uid() and child_id is null;
  end if;
  return new_id;
end;
$$;

create or replace function public.generate_family_access_code(target_learner_id uuid, code_purpose text default 'parent')
returns table(access_code text, expires_at timestamptz)
language plpgsql security definer set search_path = public, extensions
as $$
declare alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; raw_bytes bytea; new_code text := ''; i integer;
begin
  if code_purpose not in ('parent','learner') then raise exception 'Invalid connection type.'; end if;
  if not exists(select 1 from public.learner_guardians where learner_id=target_learner_id and user_id=auth.uid() and role='owner') then raise exception 'Only the primary parent can generate access codes.'; end if;
  if code_purpose='parent' and (select count(*) from public.learner_guardians where learner_id=target_learner_id) >= 2 then raise exception 'Two parents are already linked to this learner.'; end if;
  if code_purpose='learner' and exists(select 1 from public.learner_profiles where id=target_learner_id and learner_user_id is not null) then raise exception 'A learner account is already connected.'; end if;
  update public.family_access_codes set expires_at=now() where learner_id=target_learner_id and purpose=code_purpose and used_at is null and expires_at>now();
  raw_bytes:=gen_random_bytes(8);
  for i in 0..7 loop new_code:=new_code||substr(alphabet,(get_byte(raw_bytes,i)%char_length(alphabet))+1,1); end loop;
  expires_at:=now()+interval '24 hours';
  insert into public.family_access_codes(learner_id,purpose,code_hash,created_by,expires_at) values(target_learner_id,code_purpose,encode(digest(new_code,'sha256'),'hex'),auth.uid(),expires_at);
  access_code:=new_code; return next;
end;
$$;

create or replace function public.redeem_family_access_code(access_code text, connection_type text, display_name text default null)
returns uuid language plpgsql security definer set search_path = public, extensions
as $$
declare matched public.family_access_codes%rowtype; recent integer;
begin
  if auth.uid() is null then raise exception 'Sign in before using a family code.'; end if;
  if connection_type not in ('parent','learner') then raise exception 'Invalid connection type.'; end if;
  select count(*) into recent from public.family_access_attempts where user_id=auth.uid() and attempted_at>now()-interval '15 minutes';
  if recent>=5 then raise exception 'Too many attempts. Try again in 15 minutes.'; end if;
  insert into public.family_access_attempts(user_id) values(auth.uid());
  select * into matched from public.family_access_codes where code_hash=encode(digest(regexp_replace(upper(access_code),'[^A-Z0-9]','','g'),'sha256'),'hex') and purpose=connection_type and used_at is null and expires_at>now() for update;
  if not found then return null; end if;
  if connection_type='parent' then
    if trim(coalesce(display_name,''))='' then raise exception 'Enter your parent or caregiver name.'; end if;
    if exists(select 1 from public.learner_guardians where learner_id=matched.learner_id and user_id=auth.uid()) then raise exception 'This parent is already connected.'; end if;
    if (select count(*) from public.learner_guardians where learner_id=matched.learner_id)>=2 then raise exception 'Two parents are already linked to this learner.'; end if;
    insert into public.learner_guardians(learner_id,user_id,guardian_name,role) values(matched.learner_id,auth.uid(),trim(display_name),'parent');
  else
    if exists(select 1 from public.learner_profiles where learner_user_id=auth.uid()) then raise exception 'This learner account is already connected to a profile.'; end if;
    update public.learner_profiles set learner_user_id=auth.uid(),updated_at=now() where id=matched.learner_id and learner_user_id is null;
    if not found then raise exception 'A learner account is already connected.'; end if;
  end if;
  update public.family_access_codes set used_at=now(),used_by=auth.uid() where id=matched.id;
  return matched.learner_id;
end;
$$;

create or replace function public.remove_learner_guardian(target_learner_id uuid,target_user_id uuid)
returns void language plpgsql security definer set search_path=public
as $$
begin
  if not exists(select 1 from public.learner_guardians where learner_id=target_learner_id and user_id=auth.uid() and role='owner') then raise exception 'Only the primary parent can remove access.'; end if;
  if target_user_id=auth.uid() then raise exception 'The primary parent cannot remove their own access.'; end if;
  delete from public.learner_guardians where learner_id=target_learner_id and user_id=target_user_id and role='parent';
end;
$$;

create or replace function public.update_learner_grade(target_learner_id uuid,new_grade integer)
returns void language plpgsql security definer set search_path=public
as $$
begin
  if new_grade<1 or new_grade>12 then raise exception 'Choose a grade from 1 to 12.'; end if;
  if not exists(select 1 from public.learner_guardians where learner_id=target_learner_id and user_id=auth.uid() and role='owner') then raise exception 'Only the primary parent can change the grade.'; end if;
  update public.learner_profiles set grade=new_grade,updated_at=now() where id=target_learner_id;
end;
$$;

create or replace function public.get_parent_grade12_summary(target_learner_id uuid)
returns jsonb language plpgsql stable security definer set search_path=public
as $$
declare learner_uid uuid; result jsonb;
begin
  if not public.is_learner_guardian(target_learner_id) then raise exception 'You do not have access to this learner.'; end if;
  select learner_user_id into learner_uid from public.learner_profiles where id=target_learner_id;
  if learner_uid is null then return jsonb_build_object('connected',false); end if;
  select jsonb_build_object(
    'connected',true,
    'subjectsSelected',(select count(*) from public.learner_subjects where user_id=learner_uid),
    'missionsCompleted',(select count(*) from public.learner_progress where user_id=learner_uid and completed=true),
    'practiceAverage',coalesce((select round(avg(percentage)) from public.mission_attempts where user_id=learner_uid),0),
    'attempts',(select count(*) from public.mission_attempts where user_id=learner_uid),
    'lastActive',(select max(attempted_at) from public.mission_attempts where user_id=learner_uid),
    'targets',coalesce((select jsonb_agg(jsonb_build_object('subjectId',subject_id,'currentMark',current_mark,'targetMark',target_mark)) from public.subject_targets where user_id=learner_uid),'[]'::jsonb)
  ) into result;
  return result;
end;
$$;

alter table public.learner_profiles enable row level security;
alter table public.learner_guardians enable row level security;
alter table public.family_access_codes enable row level security;
alter table public.family_access_attempts enable row level security;
revoke all on public.learner_profiles,public.learner_guardians,public.family_access_codes,public.family_access_attempts from anon,authenticated;
grant select on public.learner_profiles,public.learner_guardians to authenticated;
create policy "Families can read linked learner profiles" on public.learner_profiles for select to authenticated using(public.is_learner_guardian(id) or learner_user_id=auth.uid());
create policy "Families can read linked guardians" on public.learner_guardians for select to authenticated using(public.is_learner_guardian(learner_id));

drop policy if exists "Guardians can read Grade 1 progress" on public.grade_one_progress;
create policy "Families can read Grade 1 progress" on public.grade_one_progress for select to authenticated using(auth.uid()=user_id or (child_id is not null and public.is_learner_guardian(child_id)));
drop policy if exists "Guardians can update Grade 1 progress" on public.grade_one_progress;
create policy "Families can update Grade 1 progress" on public.grade_one_progress for update to authenticated using(auth.uid()=user_id or (child_id is not null and public.is_learner_guardian(child_id))) with check(child_id is null or public.is_learner_guardian(child_id));

revoke all on function public.is_learner_guardian(uuid),public.create_learner_profile(text,integer,text),public.generate_family_access_code(uuid,text),public.redeem_family_access_code(text,text,text),public.remove_learner_guardian(uuid,uuid),public.update_learner_grade(uuid,integer),public.get_parent_grade12_summary(uuid) from public;
grant execute on function public.is_learner_guardian(uuid),public.create_learner_profile(text,integer,text),public.generate_family_access_code(uuid,text),public.redeem_family_access_code(text,text,text),public.remove_learner_guardian(uuid,uuid),public.update_learner_grade(uuid,integer),public.get_parent_grade12_summary(uuid) to authenticated;
