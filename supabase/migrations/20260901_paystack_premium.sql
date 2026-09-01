create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider = 'PAYSTACK'),
  provider_reference text not null unique,
  provider_transaction_id text not null unique,
  amount integer not null check (amount > 0),
  currency text not null,
  status text not null check (status in ('SUCCESS')),
  paid_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.payment_transactions enable row level security;

create policy "Learners can view their own payments"
on public.payment_transactions for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.grant_paystack_premium(
  p_user_id uuid,
  p_reference text,
  p_transaction_id text,
  p_amount integer,
  p_currency text,
  p_paid_at timestamptz
)
returns table (premium_expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_expiry timestamptz;
begin
  if p_amount <> 15000 or p_currency <> 'ZAR' then
    raise exception 'Invalid FAM Premium payment';
  end if;

  insert into public.payment_transactions (
    user_id, provider, provider_reference, provider_transaction_id,
    amount, currency, status, paid_at
  ) values (
    p_user_id, 'PAYSTACK', p_reference, p_transaction_id,
    p_amount, p_currency, 'SUCCESS', p_paid_at
  ) on conflict (provider_reference) do nothing;

  if found then
    insert into public.learner_entitlements (
      user_id, tier, premium_started_at, premium_expires_at, source
    ) values (
      p_user_id, 'PREMIUM', now(), now() + interval '12 months', 'PAYSTACK'
    )
    on conflict (user_id) do update set
      tier = 'PREMIUM',
      premium_started_at = coalesce(public.learner_entitlements.premium_started_at, now()),
      premium_expires_at = greatest(
        now(),
        coalesce(public.learner_entitlements.premium_expires_at, now())
      ) + interval '12 months',
      source = 'PAYSTACK';
  end if;

  select le.premium_expires_at into v_expiry
  from public.learner_entitlements le
  where le.user_id = p_user_id;

  return query select v_expiry;
end;
$$;

revoke all on function public.grant_paystack_premium(
  uuid, text, text, integer, text, timestamptz
) from public, anon, authenticated;

grant execute on function public.grant_paystack_premium(
  uuid, text, text, integer, text, timestamptz
) to service_role;
