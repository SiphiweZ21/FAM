create extension if not exists pgcrypto with schema extensions;

create table if not exists public.grade_one_children (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) between 1 and 50),
  grade smallint not null default 1 check (grade = 1),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.grade_one_guardians (
  child_id uuid not null references public.grade_one_children(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  guardian_name text not null check (char_length(trim(guardian_name)) between 1 and 60),
  role text not null check (role in ('owner', 'parent')),
  created_at timestamptz not null default now(),
  primary key (child_id, user_id)
);

create table if not exists public.grade_one_family_codes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.grade_one_children(id) on delete cascade,
  code_hash text not null unique,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.grade_one_family_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempted_at timestamptz not null default now()
);

alter table public.grade_one_progress
  add column if not exists child_id uuid references public.grade_one_children(id) on delete cascade;

create unique index if not exists grade_one_progress_child_id_key
  on public.grade_one_progress(child_id) where child_id is not null;

create index if not exists grade_one_guardians_user_idx on public.grade_one_guardians(user_id);
create index if not exists grade_one_family_codes_child_idx on public.grade_one_family_codes(child_id);
create index if not exists grade_one_family_attempts_user_time_idx on public.grade_one_family_attempts(user_id, attempted_at desc);

create or replace function public.is_grade_one_guardian(target_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.grade_one_guardians
    where child_id = target_child_id and user_id = auth.uid()
  );
$$;

create or replace function public.create_grade_one_family(child_first_name text, parent_name text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_child_id uuid;
begin
  if auth.uid() is null then raise exception 'Sign in before creating a child profile.'; end if;
  if trim(child_first_name) = '' or char_length(trim(child_first_name)) > 50 then raise exception 'Enter a valid child name.'; end if;
  if trim(parent_name) = '' or char_length(trim(parent_name)) > 60 then raise exception 'Enter a valid parent name.'; end if;
  if exists (select 1 from public.grade_one_guardians where user_id = auth.uid()) then raise exception 'This account is already linked to a child.'; end if;

  insert into public.grade_one_children(first_name, created_by)
  values (trim(child_first_name), auth.uid()) returning id into new_child_id;

  insert into public.grade_one_guardians(child_id, user_id, guardian_name, role)
  values (new_child_id, auth.uid(), trim(parent_name), 'owner');

  update public.grade_one_progress set child_id = new_child_id
  where user_id = auth.uid() and child_id is null;

  if not found then
    insert into public.grade_one_progress(user_id, child_id)
    values (auth.uid(), new_child_id)
    on conflict (user_id) do update set child_id = excluded.child_id;
  end if;

  return new_child_id;
end;
$$;

create or replace function public.generate_grade_one_family_code(target_child_id uuid)
returns table(access_code text, expires_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  alphabet constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  raw_bytes bytea;
  new_code text := '';
  i integer;
begin
  if not exists (
    select 1 from public.grade_one_guardians
    where child_id = target_child_id and user_id = auth.uid() and role = 'owner'
  ) then raise exception 'Only the primary parent can generate a family code.'; end if;
  if (select count(*) from public.grade_one_guardians where child_id = target_child_id) >= 2 then
    raise exception 'Two parents are already linked to this child.';
  end if;

  update public.grade_one_family_codes set expires_at = now()
  where child_id = target_child_id and used_at is null and expires_at > now();

  raw_bytes := gen_random_bytes(8);
  for i in 0..7 loop
    new_code := new_code || substr(alphabet, (get_byte(raw_bytes, i) % char_length(alphabet)) + 1, 1);
  end loop;

  expires_at := now() + interval '24 hours';
  insert into public.grade_one_family_codes(child_id, code_hash, created_by, expires_at)
  values (target_child_id, encode(digest(new_code, 'sha256'), 'hex'), auth.uid(), expires_at);
  access_code := new_code;
  return next;
end;
$$;

create or replace function public.join_grade_one_family(access_code text, parent_name text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  matched_code public.grade_one_family_codes%rowtype;
  recent_attempts integer;
  guardian_count integer;
begin
  if auth.uid() is null then raise exception 'Sign in before joining a family.'; end if;
  if trim(parent_name) = '' or char_length(trim(parent_name)) > 60 then raise exception 'Enter a valid parent name.'; end if;
  if exists (select 1 from public.grade_one_guardians where user_id = auth.uid()) then raise exception 'This account is already linked to a child.'; end if;

  select count(*) into recent_attempts from public.grade_one_family_attempts
  where user_id = auth.uid() and attempted_at > now() - interval '15 minutes';
  if recent_attempts >= 5 then raise exception 'Too many attempts. Try again in 15 minutes.'; end if;
  insert into public.grade_one_family_attempts(user_id) values (auth.uid());

  select * into matched_code from public.grade_one_family_codes
  where code_hash = encode(digest(regexp_replace(upper(access_code), '[^A-Z0-9]', '', 'g'), 'sha256'), 'hex')
    and used_at is null and expires_at > now()
  for update;
  -- Return null instead of raising so the failed-attempt record is committed.
  if not found then return null; end if;

  select count(*) into guardian_count from public.grade_one_guardians where child_id = matched_code.child_id;
  if guardian_count >= 2 then raise exception 'Two parents are already linked to this child.'; end if;

  insert into public.grade_one_guardians(child_id, user_id, guardian_name, role)
  values (matched_code.child_id, auth.uid(), trim(parent_name), 'parent');
  update public.grade_one_family_codes set used_at = now(), used_by = auth.uid() where id = matched_code.id;
  return matched_code.child_id;
end;
$$;

create or replace function public.remove_grade_one_guardian(target_child_id uuid, target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.grade_one_guardians
    where child_id = target_child_id and user_id = auth.uid() and role = 'owner'
  ) then raise exception 'Only the primary parent can remove access.'; end if;
  if target_user_id = auth.uid() then raise exception 'The primary parent cannot remove their own access.'; end if;
  delete from public.grade_one_guardians where child_id = target_child_id and user_id = target_user_id and role = 'parent';
end;
$$;

alter table public.grade_one_children enable row level security;
alter table public.grade_one_guardians enable row level security;
alter table public.grade_one_family_codes enable row level security;
alter table public.grade_one_family_attempts enable row level security;

revoke all on public.grade_one_children, public.grade_one_guardians, public.grade_one_family_codes, public.grade_one_family_attempts from anon;
revoke all on public.grade_one_children, public.grade_one_guardians, public.grade_one_family_codes, public.grade_one_family_attempts from authenticated;
grant select on public.grade_one_children, public.grade_one_guardians to authenticated;

drop policy if exists "Guardians can read their Grade 1 child" on public.grade_one_children;
create policy "Guardians can read their Grade 1 child" on public.grade_one_children for select to authenticated
  using (public.is_grade_one_guardian(id));

drop policy if exists "Guardians can read family members" on public.grade_one_guardians;
create policy "Guardians can read family members" on public.grade_one_guardians for select to authenticated
  using (public.is_grade_one_guardian(child_id));

drop policy if exists "Learners can read their Grade 1 progress" on public.grade_one_progress;
create policy "Guardians can read Grade 1 progress" on public.grade_one_progress for select to authenticated
  using (auth.uid() = user_id or (child_id is not null and public.is_grade_one_guardian(child_id)));

drop policy if exists "Learners can create their Grade 1 progress" on public.grade_one_progress;
create policy "Guardians can create Grade 1 progress" on public.grade_one_progress for insert to authenticated
  with check (auth.uid() = user_id and (child_id is null or public.is_grade_one_guardian(child_id)));

drop policy if exists "Learners can update their Grade 1 progress" on public.grade_one_progress;
create policy "Guardians can update Grade 1 progress" on public.grade_one_progress for update to authenticated
  using (auth.uid() = user_id or (child_id is not null and public.is_grade_one_guardian(child_id)))
  with check (child_id is null or public.is_grade_one_guardian(child_id));

revoke all on function public.is_grade_one_guardian(uuid) from public;
revoke all on function public.create_grade_one_family(text, text) from public;
revoke all on function public.generate_grade_one_family_code(uuid) from public;
revoke all on function public.join_grade_one_family(text, text) from public;
revoke all on function public.remove_grade_one_guardian(uuid, uuid) from public;
grant execute on function public.is_grade_one_guardian(uuid) to authenticated;
grant execute on function public.create_grade_one_family(text, text) to authenticated;
grant execute on function public.generate_grade_one_family_code(uuid) to authenticated;
grant execute on function public.join_grade_one_family(text, text) to authenticated;
grant execute on function public.remove_grade_one_guardian(uuid, uuid) to authenticated;
