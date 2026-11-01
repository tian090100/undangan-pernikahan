# Private gift dashboard

Local UI: /draft-klien/rexy-indah-reference/admin/ (outside the production allowlist).
Backend: Supabase Edge Function rexy-gift-admin, JWT verification enabled. This uses the existing project public anon JWT for gateway compatibility and a separate opaque admin session for authorization. The public anon JWT alone never authorizes private reads or cancellations.

The user-requested username is provisioned server-side. No password, password hash, session token, or private booking export belongs in source control. The password is bcrypt-hashed with cost 12 in the private admin_accounts table. Provision/reset only through trusted server administration; never make a public reset endpoint with the service key.

Login generates 32 random bytes. Only the SHA-256 token hash is stored in admin_sessions. Sessions expire after 8 hours and are revoked on successful logout. The UI keeps the token only in memory; reloading/closing the page requires another login. The account locks for 15 minutes after five failed logins within 15 minutes. All actions use HTTPS POST and no-store responses. CORS restricts browser origins but is not the authorization layer.

The private schema has RLS enabled without public policies, intentionally denying ordinary client access. Only the Edge runtime's service role can execute the invoker RPC or read its tables. Supabase's informational RLS-no-policy notices describe that intentional default-deny behavior: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Cancellation checks both gift ID and exact original booking timestamp under a row lock. It archives the giver, phone, original timestamp and cancelling account before removing the active booking in one transaction. A stale dialog cannot cancel a newer booking. Revoking a session immediately prevents later API requests with that token. There is no unauthenticated cancellation endpoint.

The CSV download escapes formula-like cells, uses UTF-8 BOM, and includes only the current booking list; downloaded files contain private data. Demo mode is separate fictional data and cannot cancel or contact real givers.

Validation: admin-security-tests.sql runs fixture-only transaction tests as service_role and rolls back all fixture changes. Tests cover denied anonymous access, wrong password, valid session, listing, stale cancellation, successful cancellation audit, logout revocation, and lockout. UI login, filtering, cancellation-dialog dismiss, demo mode, and CSV export are checked separately. Keep actual booking data private during visual QA.

No changes to the public registry endpoint or existing RSVP tables are needed. Publication remains separate from this local draft revision.
