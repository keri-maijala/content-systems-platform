# Project State

## Start here — next session

Authentication, client key routing, and the Requests view are fully confirmed working as of 2026-09-10.

**Next task: Logs view** — or decide to skip straight to Domains or Admin. See horizon list below.

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
- Requests view — fully working (see below)
- Placeholder views for Logs, Domains, Admin

### Authentication (fully confirmed 2026-09-10)
- `ui/app/api/auth/login/route.ts` — validates email against client config, checks password against `AUTH_DEMO_PASSWORD` env var, issues 8-hour JWT session cookie
- `ui/app/api/auth/session/route.ts` — GET validates session token; DELETE clears cookie (sign out)
- `ui/app/[clientKey]/login/page.tsx` — login screen
- `ui/app/[clientKey]/page.tsx` — main app with auth guard
- `ui/app/page.tsx` — root redirect to `/demo`

### Client key routing (fully confirmed 2026-09-10)
- Path-based routing: `/[clientKey]` and `/[clientKey]/login`
- Client key read from URL path via `useParams()`
- Root URL redirects to `/demo` as interim measure

### Requests view (fully confirmed 2026-09-10)
- `ui/app/components/RequestsView.tsx` — list with filter tabs, expand/collapse, status badges, type tags
- `ui/app/api/requests/route.ts` — GET (filtered by role) and PATCH (resolve/update status)
- `clients/demo/logs/requests.json` — request data stored as JSON in repo, read/written via GitHub API
- Visibility: content_owner sees all; domain_owner sees their domains + flagged; contributor sees own only
- Resolution requires manual owner action (governance principle)
- "Mark in progress" and "Mark resolved" buttons working
- Key architectural decision: GitHub API for read/write (Vercel filesystem is read-only)

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
- `GITHUB_TOKEN` — set, working (required for requests read/write)

### Secondary Vercel project (content-systems-platform-2l2p)
- Not active — can be deleted when convenient

### Demo credentials
- Any user in `clients/demo/config.json` + the `AUTH_DEMO_PASSWORD` value set in Vercel
- Users: alex@acme.com, jordan@acme.com, sam@acme.com, taylor@acme.com

---

## Known issues
- Root redirect hardcoded to `/demo` — update when second client is added
- CSS variables (`var(--navy)` etc.) cause hydration failures in statically rendered pages — replaced with direct hex values as workaround
- Branch divergence: if commits are made both from Claude and locally in the same session, pull before pushing locally
- Two Vercel projects exist — only main one is active

---

## On the horizon

1. Logs view
2. Domains view
3. Admin view
4. Notifications — email and/or Slack when request is created or updated
5. Agent-to-request flow — agent can create a request from a conversation
6. Digest delivery — weekly owner summary with request status
7. Replace demo plaintext password with per-user bcrypt hashes before any real client onboarding
8. Update root redirect when second client is added
9. Delete secondary Vercel project (content-systems-platform-2l2p)
