# Project State

## Start here — next session

Authentication is built and partially working. One issue remains unresolved at end of session:

**The login page is being rendered as a static page by Next.js**, which means React doesn't attach interactivity (form handlers don't fire). The last commit adds `export const dynamic = 'force-dynamic'` to the login page — this should fix it but was not yet confirmed before wrapping up.

**First thing next session:** Test the login page. Go to `https://content-systems-platform.vercel.app/login?client=demo` and try signing in with `alex@acme.com`. If it works, move on. If not, the issue is Next.js static rendering — investigate why `force-dynamic` didn't take effect.

**Test checklist for auth:**
1. Unauthenticated visit to `/?client=demo` → redirects to login
2. Login with valid credentials → lands in app
3. Login with wrong password → shows error message
4. Sign out button in nav → returns to login
5. Session persists on page refresh

Once auth is confirmed working, move to **client key routing** (next item on the build list).

---

## What's built

### Platform architecture
- Base subject library: five subjects committed to `base/subjects/`
- Ten tone stage prompts committed to `base/stages/`
- Demo client config at `clients/demo/config.json` — Acme Co., three domains, four users
- Dynamic prompt assembly at `ui/app/lib/assemblePrompt.ts`
- Full prompt assembly chain verified end-to-end

### UI
- Next.js/React shell with visual identity: deep navy left rail (#1A1A2E), Fraunces serif headings, Inter body, warm off-white (#F7F6F3)
- Agent workspace with streaming message thread, empty state, prompt suggestions, auto-growing textarea
- Nav with role-based visibility, domain list, user identity
- Placeholder views for Requests, Logs, Domains, Admin
- Agent wired to Anthropic API and working

### Authentication (built today — partially confirmed)
- `platform/auth/hash-password.mjs` — utility for generating bcrypt password hashes during client setup
- `ui/app/api/auth/login/route.ts` — validates credentials against env vars, issues 12-hour JWT session cookie; includes rate limiting (5 attempts per 15 minutes) and email enumeration protection
- `ui/app/api/auth/session/route.ts` — GET validates session token; DELETE clears cookie (sign out)
- `ui/app/login/page.tsx` — login screen
- `ui/app/page.tsx` — auth guard added; redirects to login if no valid session
- `ui/app/components/Nav.tsx` — sign out button added

### Authentication architecture decisions (made today)
- Credentials stored as bcrypt hashes in Vercel environment variables (not in repo)
- Env var naming convention: `AUTH_USER_<email with @ → _AT_ and . → _DOT_>`
- JWT secret: `AUTH_JWT_SECRET`
- No forced password reset — strong random passwords generated at setup and delivered securely
- Session duration: 12 hours
- Forced reset dropped from scope — requires database layer to implement properly

---

## Deployment

- **Live URL:** `https://content-systems-platform.vercel.app`
- **Repo:** `github.com/keri-maijala/content-systems-platform`
- **Hosting:** Vercel — auto-deploys on push to `main`
- **Root directory:** `ui/`
- **Framework:** Next.js 14.2.29

### Environment variables set in Vercel
- `ANTHROPIC_API_KEY` — set previously, working
- `AUTH_JWT_SECRET` — set today
- `AUTH_USER_alex_AT_acme_DOT_com` — set today
- `AUTH_USER_jordan_AT_acme_DOT_com` — set today
- `AUTH_USER_sam_AT_acme_DOT_com` — set today
- `AUTH_USER_taylor_AT_acme_DOT_com` — set today

### Demo credentials (for testing only — not for client use)
- alex@acme.com — `9eI3q&rdsESyCFcy`
- jordan@acme.com — `XJnRGp#KO3h0^*e5`
- sam@acme.com — `0qhUXv75m&aHaiIk`
- taylor@acme.com — `XIJ9tISJun&75ary`

---

## Known issues

- Login page static rendering: Next.js 14 treats client components as static unless forced otherwise. Fixed with `export const dynamic = 'force-dynamic'` — not yet confirmed working.
- CSS variables (`var(--navy)` etc.) cause hydration failures when used in pages that Next.js tries to statically render. Replaced with direct hex values in login page and Nav as workaround. Main app still uses CSS vars — monitor for issues.
- Branch divergence: if commits are made both from Claude and locally in the same session, pull before pushing locally.

---

## On the horizon

1. Confirm auth end-to-end (next session first task)
2. Client key routing — each client gets their own subdomain or path
3. Remaining UI views: Requests, Logs, Domains, Admin
4. Digest delivery method decision
5. Setup and discovery process implementation
