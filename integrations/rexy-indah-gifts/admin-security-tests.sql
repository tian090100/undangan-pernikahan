begin;
insert into rexy_registry_private.admin_accounts(username,password_hash) values ('__dashboard_test__',extensions.crypt('fixture-password',extensions.gen_salt('bf',4)));
set local role service_role;
do $$
declare result jsonb; session_token text; fixture_time timestamptz;
begin
 if public.rexy_registry_admin('list')->>'error'<>'unauthorized' then raise exception 'anonymous read allowed'; end if;
 if public.rexy_registry_admin('login',null,'__dashboard_test__','wrong')->>'error'<>'invalid_login' then raise exception 'wrong password allowed'; end if;
 result=public.rexy_registry_admin('login',null,'__dashboard_test__','fixture-password');
 session_token=result->>'token';
 if session_token is null then raise exception 'valid login failed'; end if;
 if public.rexy_registry_admin('list',session_token)->'bookings' is null then raise exception 'authenticated list failed'; end if;
 if not exists(select 1 from rexy_registry_private.bookings where gift='ps5') then
  insert into rexy_registry_private.bookings(gift,giver,phone) values('ps5','DASHBOARD TEST ONLY','62800000000999') returning created_at into fixture_time;
  if public.rexy_registry_admin('cancel',session_token,null,null,'ps5',fixture_time+interval '1 second')->>'error'<>'stale_booking' then raise exception 'stale cancellation allowed'; end if;
  if public.rexy_registry_admin('cancel',session_token,null,null,'ps5',fixture_time)->>'ok'<>'true' then raise exception 'cancel failed'; end if;
  if not exists(select 1 from rexy_registry_private.booking_cancellations where gift='ps5' and cancelled_by='__dashboard_test__') then raise exception 'audit missing'; end if;
 end if;
 perform public.rexy_registry_admin('logout',session_token);
 if public.rexy_registry_admin('list',session_token)->>'error'<>'unauthorized' then raise exception 'revoked session allowed'; end if;
 for i in 1..5 loop perform public.rexy_registry_admin('login',null,'__dashboard_test__','wrong'); end loop;
 if public.rexy_registry_admin('login',null,'__dashboard_test__','fixture-password')->>'error'<>'locked' then raise exception 'lockout failed'; end if;
end $$;
rollback;
select not has_function_privilege('anon','public.rexy_registry_admin(text,text,text,text,text,timestamptz)','execute') as anon_blocked,not has_function_privilege('authenticated','public.rexy_registry_admin(text,text,text,text,text,timestamptz)','execute') as ordinary_user_blocked;
