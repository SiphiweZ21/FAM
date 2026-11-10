alter table public.payment_transactions
  add column if not exists package_code text;

create or replace function public.grant_paystack_premium(
  p_user_id uuid,
  p_reference text,
  p_transaction_id text,
  p_amount integer,
  p_currency text,
  p_paid_at timestamptz,
  p_package_code text
)
returns table (premium_expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration interval;
  v_source text;
  v_expires_at timestamptz;
begin
  if p_currency <> 'ZAR' then
    raise exception 'Unsupported payment currency';
  end if;

  if p_package_code = 'MONTHLY' and p_amount = 11000 then
    v_duration := interval '30 days';
    v_source := 'PAYSTACK_MONTHLY';
  elsif p_package_code = 'TERM' and p_amount = 20000 then
    v_duration := interval '3 months';
    v_source := 'PAYSTACK_TERM';
  else
    raise exception 'Invalid Premium package or amount';
  end if;

  insert into public.payment_transactions (
    user_id, provider, provider_reference, provider_transaction_id,
    amount, currency, status, paid_at, package_code
  ) values (
    p_user_id, 'PAYSTACK', p_reference, p_transaction_id,
    p_amount, p_currency, 'SUCCESS', p_paid_at, p_package_code
  ) on conflict (provider_reference) do nothing;

  if found then
    insert into public.learner_entitlements (
      user_id, tier, premium_started_at, premium_expires_at, source
    ) values (
      p_user_id, 'PREMIUM', now(), now() + v_duration, v_source
    )
    on conflict (user_id) do update set
      tier = 'PREMIUM',
      premium_started_at = case
        when public.learner_entitlements.premium_expires_at > now()
          then public.learner_entitlements.premium_started_at
        else now()
      end,
      premium_expires_at = greatest(now(), coalesce(public.learner_entitlements.premium_expires_at, now())) + v_duration,
      source = v_source;
  end if;

  select le.premium_expires_at into v_expires_at
  from public.learner_entitlements le
  where le.user_id = p_user_id;

  return query select v_expires_at;
end;
$$;

revoke all on function public.grant_paystack_premium(
  uuid, text, text, integer, text, timestamptz, text
) from public, anon, authenticated;

grant execute on function public.grant_paystack_premium(
  uuid, text, text, integer, text, timestamptz, text
) to service_role;
