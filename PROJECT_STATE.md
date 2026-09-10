# Project State

## Start here — next session

Authentication and client key routing are fully confirmed working as of 2026-09-10.

**New URLs (path-based routing):**
- Login: `/demo/login`
- App: `/demo`
- Root (`/`) redirects to `/demo` for now — update when second client is added

**Next task: remaining UI views** — Requests, Logs, Domains, Admin are currently placeholders. Pick one to build out, or decide on digest delivery method first.

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
- `ui/app/[clientKey]/login/page.tsx` — login screen
- `ui/app/[clientKey]/page.tsx` — main app with auth guard
- `ui/app/page.tsx` — root redirect to `/demo`

### Client key routing (fully confirmed 2026-09-10)
- Path-based routing: `/[clientKey]` and `/[clientKey]/login`
- Client key read from URL path via `useParams()`
- Old query param URLs (`?client=demo`) no longer used
- Root URL redirects to `/demo` as interim measure

---

## Deployment

- **Live URL:** `https://content-systems-platform.vercel.app`
- **Repo:** `github.com/keri-maijala/content-systems-platform`
- **Hosting:** Vercel — auto-deploys on push to `main`
- **Root directory:** `ui/`
- **Framework:** Next.js 14.2.29

### Environment variables — main project
- `ANTHROPIC_API_KEY` — set, working
- `AUTH_JWT_SECRET` — set, working
- `AUTH_DEMO_PASSWORD` — set, working

### Secondary Vercel project (content-systems-platform-2l2p)
- Not active — can be deleted when convenient

### Demo credentials
- Any user in `clients/demo/config.json` + the `AUTH_DEMO_PASSWORD` value set in Vercel
- Users: alex@acme.com, jordan@acme.com, sam@acme.com, taylor@acme.com

---

## Known issues

- Old `ui/app/login/page.tsx` still exists in repo — unused, should be deleted
- Root redirect hardcoded to `/demo` — update when second client is added
- CSS variables (`var(--navy)` etc.) cause hydration failures in statically rendered pages. Replaced with direct hex values as workaround.
- Branch divergence: if commits are made both from Claude and locally in the same session, pull before pushing locally.
- Two Vercel projects exist — only main one is active

---

## On the horizon

1. Delete old `ui/app/login/page.tsx` (cleanup)
2. Remaining UI views: Requests, Logs, Domains, Admin
3. Digest delivery method decision
4. Setup and discovery process implementation
5. Replace demo plaintext password with per-user bcrypt hashes before any real client onboarding
6. Update root redirect when second client is added
