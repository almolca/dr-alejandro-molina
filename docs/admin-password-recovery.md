# Admin password recovery

Feature branch: `feat/admin-password-recovery`. Do not merge or deploy Production until reviewed.

## Flow

- `/admin/login` links to `/admin/forgot-password` (EN/ES labels).
- A Server Action validates the email, calls Supabase `resetPasswordForEmail`, and returns a generic response even when delivery fails or the account does not exist. Supabase enforces its configured recovery rate limits.
- PKCE callback: `/admin/reset-password/callback`. The email must be opened in the same browser and origin that requested it. Default Supabase `{{ .ConfirmationURL }}` email template is supported; implicit hash tokens and arbitrary `next` redirects are intentionally unsupported.
- Callback exchanges a one-use code, preserving `sb_flow_id`, verifies recovery redirect type from the installed Auth SDK and the server admin allowlist, then issues a signed HttpOnly, SameSite=Lax, Secure-in-production recovery proof valid for 15 minutes. The proof is bound to the authenticated user and access token. SDK upgrades must retain the runtime recovery redirect type; otherwise this check fails closed.
- The page and update action both validate the user with Supabase `getUser`; an ordinary login session alone cannot reset a password here. The action enforces matching passwords of 12–128 characters, updates through `updateUser`, removes the proof, requests global sign-out, and redirects to the login success message.
- Refreshing the access token invalidates the proof. Request a new email if the recovery session expires. Supabase revokes refresh sessions on global sign-out; already issued access tokens may remain valid until expiry.
- Admin routes render dynamically, with noindex metadata, X-Robots-Tag, private/no-store Cache-Control and no-referrer headers. Next Server Actions enforce same-origin POST protections.

## Configuration

Supabase project: `wsgudfdifdqwacnbntbr` (`dr-alejandro-molina`).

Site URL must be `https://dralejandromolinaurologist.com`.
Allow this exact production Redirect URL:
`https://dralejandromolinaurologist.com/admin/reset-password/callback`

For every Preview under review, add its exact URL with `/admin/reset-password/callback` to Supabase Redirect URLs. Avoid broad wildcards. Preview derives its own origin from Vercel's trusted VERCEL_URL; production uses the fixed canonical domain. ADMIN_AUTH_ORIGIN can override with a trusted exact origin; localhost:3000 HTTP is allowed only in development.

Existing server-only SUPABASE_SERVICE_ROLE_KEY is used solely as an HMAC signing fallback here; no service-role Auth client is used for recovery. A separate ADMIN_RECOVERY_SECRET can be configured instead. Keep this server-only and consistent across all deployment instances. Rotating either signing key invalidates outstanding proofs. Vercel's existing service-role key was confirmed present for Production and Preview without revealing it. The local .env has no signing secret, so local success-path verification uses test fixtures.

The default Supabase sender successfully delivered the owner acceptance email on 19 October 2026. Its provider limits still apply; configure production SMTP if delivery volume or reliability requires it.

## Verification

Automated tests cover signed-proof tampering, wrong user/session, expiry, secret rotation, password length/matching, trusted origin validation, missing/expired/non-recovery/unauthorized callback, PKCE flow ID forwarding, update without proof, success/sign-out, generic email responses and fixed email redirect.

Owner acceptance completed on 19 October 2026: the recovery email arrived, its link opened in the requesting browser, the owner set a private new password, and confirmed completion. Passwords, tokens, environment values and auth-bearing browser traces were not recorded. Invalid, expired, reused and non-recovery paths remain covered by automated tests and fail closed.

Dependency verification after acceptance:

- Next.js and `eslint-config-next` were updated from 16.3.4 to the patched 16.4.2 release.
- Vitest was updated from 3.2.7 to 5.0.5; Node types now match the Node 24 runtime used locally and by Vercel.
- `npm audit --omit=dev` reports zero production vulnerabilities.
- The remaining npm advisory is confined to the ESLint development dependency chain. Its upstream `braces` package has no patched release available; npm's forced suggestion would downgrade `eslint-config-next` to an incompatible Next.js 14 release and is intentionally not applied.
