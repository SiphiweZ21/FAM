-- Run after existing Premium pass migrations. Credentials stay in Worker secrets.
alter table public.payment_transactions drop constraint if exists payment_transactions_provider_check;
alter table public.payment_transactions add constraint payment_transactions_provider_check check(provider in ('PAYSTACK','PEACH'));
create table if not exists public.peach_payment_orders (
 reference text primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 package_code text not null check(package_code in ('MONTHLY','TERM')),
 amount integer not null check(amount in (11000,20000)),
 status text not null default 'PENDING' check(status in ('PENDING','SUCCESS')),
 return_to text,
 created_at timestamptz not null default now()
);
alter table public.peach_payment_orders enable row level security;
revoke all on public.peach_payment_orders from anon,authenticated;
grant all on public.peach_payment_orders to service_role;
create or replace function public.grant_peach_premium(p_reference text,p_transaction_id text,p_amount integer,p_currency text)
returns table(premium_expires_at timestamptz)
language plpgsql security definer set search_path=public as $$
declare v_order public.peach_payment_orders%rowtype;v_duration interval;v_expiry timestamptz;
begin
 select * into v_order from public.peach_payment_orders where reference=p_reference for update;
 if not found or p_currency<>'ZAR' or p_amount<>v_order.amount or p_transaction_id is null or length(p_transaction_id)=0 then raise exception 'Invalid payment';end if;
 if v_order.package_code='MONTHLY' and p_amount=11000 then v_duration:=interval '30 days';
 elsif v_order.package_code='TERM' and p_amount=20000 then v_duration:=interval '3 months';
 else raise exception 'Invalid package';end if;
 -- Serialize purchases for this account, including different order references.
 perform pg_advisory_xact_lock(hashtextextended(v_order.user_id::text,0));
 insert into public.payment_transactions(user_id,provider,provider_reference,provider_transaction_id,amount,currency,status,paid_at,package_code)
 values(v_order.user_id,'PEACH',p_reference,'PEACH:'||p_transaction_id,p_amount,p_currency,'SUCCESS',now(),v_order.package_code)
 on conflict(provider_reference) do nothing;
 if found then
 insert into public.learner_entitlements(user_id,tier,premium_started_at,premium_expires_at,source)
 values(v_order.user_id,'PREMIUM',now(),now()+v_duration,'PEACH_'||v_order.package_code)
 on conflict(user_id) do update set tier='PREMIUM',premium_started_at=case when learner_entitlements.premium_expires_at>now() then learner_entitlements.premium_started_at else now() end,
 premium_expires_at=greatest(now(),coalesce(learner_entitlements.premium_expires_at,now()))+v_duration,source='PEACH_'||v_order.package_code;
 end if;
 update public.peach_payment_orders set status='SUCCESS' where reference=p_reference;
 select le.premium_expires_at into v_expiry from public.learner_entitlements le where le.user_id=v_order.user_id;
 return query select v_expiry;
end;$$;
revoke all on function public.grant_peach_premium(text,text,integer,text) from public,anon,authenticated;
grant execute on function public.grant_peach_premium(text,text,integer,text) to service_role;
