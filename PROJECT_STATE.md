# Project State

## Start here — next session

Authentication is fully confirmed working as of 2026-09-10.

**Test results:**
1. ✓ Unauthenticated visit to `/?client=demo` → redirects to login
2. ✓ Login with valid credentials → lands in app
3. ✓ Sign out → returns to login page

**Next task: client key routing** — each client gets their own path or subdomain. See IDEAS.md and the horizon list below.

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

### Authentication (fully confirmed 2026-09-10)
- `ui/app/api/auth/login/route.ts` — validates email against client config, checks password against `AUTH_DEMO_PASSWORD` env var, issues 8-hour JWT session cookie
- `ui/app/api/auth/session/route.ts` — GET validates session token; DELETE clears cookie (sign out)
- `ui/app/login/page.tsx` — login screen
- `ui/app/page.tsx` — auth guard; redirects to login if no valid session
- `ui/app/components/Nav.tsx` — sign out button

### Authentication architecture decisions
- Demo password stored as plaintext in `AUTH_DEMO_PASSWORD` Vercel env var (demo only — production will use bcrypt hashes per user)
- User list loaded from `clients/{clientKey}/config.json` at runtime via `fs.readFileSync`
- JWT secret: `AUTH_JWT_SECRET` (set in -2l2p project only — see known issues)
- Session duration: 8 hours
- `platform/auth/hash-password.mjs` utility exists for future per-user bcrypt setup

---

## Deployment

- **Live URL:** `https://content-systems-platform.vercel.app`
- **Repo:** `github.com/keri-maijala/content-systems-platform`
- **Hosting:** Vercel — auto-deploys on push to `main`
- **Root directory:** `ui/`
- **Framework:** Next.js 14.2.29

### Environment variables — main project (content-systems-platform)
- `ANTHROPIC_API_KEY` — set, working
- `AUTH_JWT_SECRET` — set, working
- `AUTH_DEMO_PASSWORD` — set 2026-09-10, working

### Environment variables — secondary project (content-systems-platform-2l2p)
- Has all the original bcrypt-based `AUTH_USER_` vars and `AUTH_JWT_SECRET`
- Not the active deployment — ignore for now

### Demo credentials
- Any user in `clients/demo/config.json` + the `AUTH_DEMO_PASSWORD` value set in Vercel
- Users: alex@acme.com, jordan@acme.com, sam@acme.com, taylor@acme.com

---

## Known issues

- Two Vercel projects exist (`content-systems-platform` and `content-systems-platform-2l2p`) — only the main one is active. The -2l2p project can be deleted once we are confident we don't need to reference it.
- CSS variables (`var(--navy)` etc.) cause hydration failures in statically rendered pages. Replaced with direct hex values in login page and Nav as workaround.
- Branch divergence: if commits are made both from Claude and locally in the same session, pull before pushing locally.

---

## On the horizon

1. Client key routing — each client gets their own path or subdomain
2. Remaining UI views: Requests, Logs, Domains, Admin
3. Digest delivery method decision
4. Setup and discovery process implementation
5. Replace demo plaintext password with per-user bcrypt hashes before any real client onboarding
