alter table rexy_registry_private.bookings drop constraint bookings_gift_check;
alter table rexy_registry_private.bookings add constraint bookings_gift_check check(gift in ('air_fryer','coffee_machine','knife_set','wok_pan','cookware_set','vacuum','vacuum_mop','rice_cooker','air_purifier','air_cooler','ps5','fridge','tv'));
