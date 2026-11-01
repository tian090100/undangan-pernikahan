create schema rexy_registry_private;
revoke all on schema rexy_registry_private from public, anon, authenticated;
grant usage on schema rexy_registry_private to service_role;
create table rexy_registry_private.bookings (
 gift text primary key check (gift in ('fridge','ac','washer','car','motorcycle')),
 giver text not null check (char_length(giver) between 2 and 80),
 phone text unique not null check (phone ~ '^62[0-9]{8,13}$'),
 created_at timestamptz not null default now()
);
alter table rexy_registry_private.bookings enable row level security;
grant select, insert on rexy_registry_private.bookings to service_role;
create function public.rexy_demo_gifts() returns table(gift text) language sql security invoker set search_path='' as $$
 select gift from rexy_registry_private.bookings;
$$;
create function public.rexy_demo_book(p_gift text,p_name text,p_phone text) returns text language plpgsql security invoker set search_path='' as $$
begin
 insert into rexy_registry_private.bookings(gift,giver,phone) values(p_gift,p_name,p_phone);
 return 'booked';
exception when unique_violation then
 if exists(select 1 from rexy_registry_private.bookings where phone=p_phone) then return 'phone_taken'; end if;
 return 'gift_taken';
end;
$$;
revoke all on function public.rexy_demo_gifts() from public,anon,authenticated;
revoke all on function public.rexy_demo_book(text,text,text) from public,anon,authenticated;
grant execute on function public.rexy_demo_gifts() to service_role;
grant execute on function public.rexy_demo_book(text,text,text) to service_role;
