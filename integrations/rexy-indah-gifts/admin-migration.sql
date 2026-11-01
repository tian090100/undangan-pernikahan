create table rexy_registry_private.admin_accounts(
 username text primary key,
 password_hash text not null,
 failed_attempts integer not null default 0,
 last_failure timestamptz,
 locked_until timestamptz
);
create table rexy_registry_private.admin_sessions(
 token_hash text primary key,
 username text not null references rexy_registry_private.admin_accounts(username),
 expires_at timestamptz not null
);
create index rexy_admin_sessions_expiry on rexy_registry_private.admin_sessions(expires_at);
create table rexy_registry_private.booking_cancellations(
 id bigint generated always as identity primary key,
 gift text not null,
 giver text not null,
 phone text not null,
 booked_at timestamptz not null,
 cancelled_at timestamptz not null default now(),
 cancelled_by text not null
);
alter table rexy_registry_private.admin_accounts enable row level security;
alter table rexy_registry_private.admin_sessions enable row level security;
alter table rexy_registry_private.booking_cancellations enable row level security;
grant select,insert,update on rexy_registry_private.admin_accounts to service_role;
grant select,insert,delete on rexy_registry_private.admin_sessions to service_role;
grant select,insert on rexy_registry_private.booking_cancellations to service_role;
grant usage on sequence rexy_registry_private.booking_cancellations_id_seq to service_role;
grant delete,update on rexy_registry_private.bookings to service_role;
create function public.rexy_registry_admin(p_action text,p_token text default null,p_username text default null,p_password text default null,p_gift text default null,p_created timestamptz default null)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare
 account rexy_registry_private.admin_accounts%rowtype;
 actor text;
 token text;
 booking rexy_registry_private.bookings%rowtype;
 rows jsonb;
begin
 if p_action='login' then
  select * into account from rexy_registry_private.admin_accounts where username=p_username for update;
  if not found then return jsonb_build_object('error','invalid_login'); end if;
  if account.locked_until>now() then return jsonb_build_object('error','locked'); end if;
  if p_password is null or length(p_password)>128 or extensions.crypt(p_password,account.password_hash)<>account.password_hash then
   update rexy_registry_private.admin_accounts set
    failed_attempts=case when last_failure<now()-interval '15 minutes' then 1 else failed_attempts+1 end,
    locked_until=case when failed_attempts>=4 and last_failure>=now()-interval '15 minutes' then now()+interval '15 minutes' else null end,
    last_failure=now()
   where username=p_username;
   return jsonb_build_object('error','invalid_login');
  end if;
  update rexy_registry_private.admin_accounts set failed_attempts=0,last_failure=null,locked_until=null where username=p_username;
  delete from rexy_registry_private.admin_sessions where expires_at<now();
  token=encode(extensions.gen_random_bytes(32),'hex');
  insert into rexy_registry_private.admin_sessions values(encode(extensions.digest(token,'sha256'),'hex'),p_username,now()+interval '8 hours');
  return jsonb_build_object('token',token,'expires_in',28800);
 end if;
 if p_token is null or length(p_token)<>64 then return jsonb_build_object('error','unauthorized'); end if;
 select username into actor from rexy_registry_private.admin_sessions where token_hash=encode(extensions.digest(p_token,'sha256'),'hex') and expires_at>now();
 if not found then return jsonb_build_object('error','unauthorized'); end if;
 if p_action='logout' then
  delete from rexy_registry_private.admin_sessions where token_hash=encode(extensions.digest(p_token,'sha256'),'hex');
  return jsonb_build_object('ok',true);
 elsif p_action='list' then
  select coalesce(jsonb_agg(to_jsonb(b) order by b.created_at desc),'[]'::jsonb) into rows from rexy_registry_private.bookings b;
  return jsonb_build_object('bookings',rows);
 elsif p_action='cancel' then
  select * into booking from rexy_registry_private.bookings where gift=p_gift and created_at=p_created for update;
  if not found then return jsonb_build_object('error','stale_booking'); end if;
  insert into rexy_registry_private.booking_cancellations(gift,giver,phone,booked_at,cancelled_by) values(booking.gift,booking.giver,booking.phone,booking.created_at,actor);
  delete from rexy_registry_private.bookings where gift=p_gift and created_at=p_created;
  return jsonb_build_object('ok',true);
 end if;
 return jsonb_build_object('error','invalid_action');
end;
$$;
revoke all on function public.rexy_registry_admin(text,text,text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.rexy_registry_admin(text,text,text,text,text,timestamptz) to service_role;
