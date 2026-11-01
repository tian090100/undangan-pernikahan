# Rexy & Indah: demo gift registry

This is sample inventory only. No payments or purchases are made. Confirm the real list before launch.

Backend: Supabase project ejdgpkgozhkteuofmwle, Edge Function rexy-demo-gifts (JWT verification enabled). The browser uses the public anon key. The service role key remains inside the Edge runtime.

Bookings are private. The public response exposes only gift IDs and availability. A gift primary key and unique normalized WhatsApp number enforce the two booking limits atomically. Phone numbers are not OTP verified; this limits numbers, not independently verified people. Public booking can still be abused with different numbers. Add OTP/CAPTCHA and stronger rate limiting before a real gift launch.

Private demo schema: rexy_registry_private. Existing RSVP tables are untouched. The private couple dashboard now supports inspecting bookings and cancelling them with an audit trail; see admin-README.md. Project administrators can also manage records through SQL. Never expose private names/phones in the invitation or commit exports. Coordinate corrections with the couple; no public cancellation endpoint exists.

The frontend marks all gifts and gallery images as examples. Replace the illustration triptych with supplied couple photographs before launch. Source files migration.sql and index.ts mirror the deployed demo backend.

This draft remains outside the production page allowlist. Do not add it to production without reviewing PRODUCTION.md and confirming the intended preview deployment.

## November 1 requested list

The active list is now the 11 entries in `draft-klien/rexy-indah-reference/gift-catalog.js`. Both invitation and admin UI read that shared catalog. Ten Shopee URLs are preserved exactly as supplied by the couple, including query parameters; PS5 has no URL yet. Do not claim product specifications or destination verification: short-link destinations could not be read by the web tool. Icons are generic illustrations.

Kulkas and TV are retired IDs. Their existing bookings remain private in the database and appear only in the admin UI as previous-list bookings. The admin cancellation endpoint accepts both current and retired IDs, but the public booking endpoint accepts only the current eleven. The table constraint retains retired IDs for existing records. Active stats count only the current catalog; previous bookings are separately flagged. CSV exports include historical active bookings with readable gift names. No existing booking is deleted or reassigned by this catalog migration.
