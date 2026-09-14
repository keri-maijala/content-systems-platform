# Project State

## Start here — next session

Design is restored and confirmed on Vercel. Config schema v1.1 is live. Domains view with designates section is built.

**Next task: Admin view editing layer** — role changes, designate assignments, user promotion. All sections are currently read-only.

---

## What's built

### Platform architecture
- Base subject library: five subjects committed to `base/subjects/`
- Ten tone stage prompts committed to `base/stages/`
- Demo client config at `clients/demo/config.json` — Acme Co., three domains, four users, schema v1.1
- Dynamic prompt assembly at `ui/app/lib/assemblePrompt.ts`
- Full prompt assembly chain verified end-to-end

### Config schema v1.1
- `schema` block: version, format identifier, timestamp
- `designates` on each domain: standing/temporary, permissions, approval status
- `coverage` on all users: backups (content owner only) + OOO block
- `cross_domain_access` on domain owner users
- `.template/config.json` kept in sync

### UI design system
- Plus Jakarta Sans (UI) + Playfair Display (display)
- Ink/paper/teal palette with CSS variables throughout
- Warm nav (#EAE5D8), white pill active state, outline SVG icons, hover states
- Main area background: #F6F3EE (lighter than nav, not white)

### UI views
- **Agent** — composer top-anchored, heading aligned with first nav item, white textarea, teal send button, suggestion chips below composer, streaming message thread
- **Requests** — Open/Completed/Archive tabs, Resolve and Dismiss actions, role-scoped visibility
- **Outgoing requests** — read-only status tracking for all roles
- **Logs** — placeholder
- **Domains** — expandable cards per domain; ownership, override permissions, request routing, designates section (empty state + live designate cards with standing/temporary, approved/pending, permissions)
- **Admin** — four tabbed sections (Users, Digest, Subjects, Engagement) — all read-only currently

### Authentication (fully confirmed)
- Login, session, auth guard, sign out — all working
- Credentials: any user in `clients/demo/config.json` + `AUTH_DEMO_PASSWORD` env var

### Client key routing
- Path-based: `/[clientKey]` and `/[clientKey]/login`
- Root URL redirects to `/demo`

---

## Deployment

- **Live URL:** `https://content-systems-platform.vercel.app/demo/login`
- **Repo:** `github.com/keri-maijala/content-systems-platform`
- **Hosting:** Vercel — auto-deploys on push to `main`
- **Root directory:** `ui/`
- **Framework:** Next.js 14.2.29

### Environment variables
- `ANTHROPIC_API_KEY` — set, working
- `AUTH_JWT_SECRET` — set, working
- `AUTH_DEMO_PASSWORD` — set, working
- `GITHUB_TOKEN` — set, working

### Demo credentials
- alex@acme.com, jordan@acme.com, sam@acme.com, taylor@acme.com
- Password: `AUTH_DEMO_PASSWORD` value in Vercel

---

## Known issues
- Root redirect hardcoded to `/demo` — update when second client is added
- CSS variables cause hydration failures in statically rendered pages — login page uses direct hex values as workaround
- Secondary Vercel project (content-systems-platform-2l2p) still exists — can be deleted

---

## On the horizon

1. Admin view — editing layer (role changes, designate assignments, user promotion)
2. Domains view — editing (add/edit designates, update routing)
3. Logs view
4. Notifications — email and/or Slack
5. Agent-to-request flow
6. Digest delivery
7. Figma handoff — agent → Figma export, Figma → agent import (config as source of truth)
8. Replace demo plaintext password with per-user bcrypt hashes before real client onboarding
9. Update root redirect when second client added
10. Delete secondary Vercel project
