alter table rexy_registry_private.bookings drop constraint bookings_gift_check;
alter table rexy_registry_private.bookings add constraint bookings_gift_check check(gift in ('fridge','air_fryer','vacuum','tv','ps5'));
