# Content Systems Platform — Project State

## What this is

A hosted, multi-client content design platform. Each client accesses an isolated instance of a content design agent — configured during a consulting engagement, then fully independent. Clients interact through a web UI and never see the underlying infrastructure.

The platform serves two audiences:

- **Clients** — content teams and contributors using the agent day-to-day to write, review, and govern content
- **Keri** — configuring new client instances during setup, maintaining the platform layer, product owner

---

## Architecture overview

### Three layers

**Platform layer** (infrastructure, invisible to clients)
- Agent engine — reasoning behavior, prompt assembly, Anthropic API connection
- Setup tooling — configuration generator for new clients
- Request log collector — aggregates in-session requests into running log files per client
- Daily digest delivery — sends the request log to designated client owners on a 24-hour cycle

**Config layer** (built during discovery, sealed after handoff)
- Client key to sealed config directory
- Base subjects — all five mandatory, active for every client
- Domains — client-specific content areas with assigned owners and routing
- Style guides and voice/tone docs — client-specific .md files
- Role and permissions model — content owner, domain owner, contributor
- Routing table — request type to log to owner, configured per domain

**Client layer** (what clients see and use)
- Agent UI — loaded by client key, adaptive by role
- Content scoped entirely to their config directory
- Request flow — inline, triggered by use or by governance flag
- Daily digest — delivered to designated owners

---

## Repo structure

```
/platform/
  agent/
  setup/               # Discovery process, meeting guide, questionnaire
  digest/
  portals.md           # Portal definitions

/clients/
  .template/
    config.json        # Client config template — domain-based role model
  demo/
    config.json        # Demo client — Acme Co., three domains, four users
  [client-key]/
    config.json
    guides/
    governance/
    logs/
      informational.md
      requests.md
      overrides.md

/base/
  subjects/            # Five base subjects with scope statements + default voice and tone
  prompts/             # Subject prompts, stage prompts, request handling, setup
    stages/

/ui/                   # Next.js web application
  app/
    api/
      agent/           # Agent engine API route — streaming, Anthropic API
      client/          # Client config API route — loads config.json per client key
    components/        # Nav, AgentWorkspace, PlaceholderView
    lib/               # assemblePrompt.ts — dynamic prompt assembly
    globals.css
    layout.tsx
    page.tsx
  package.json
  next.config.mjs
  tsconfig.json
  tailwind.config.ts
  postcss.config.mjs

IDEAS.md
DECISIONS.md
```

---

## Role model

| Role | Override governance | View logs | Resolve requests | Configure |
|---|---|---|---|---|
| Content owner / admin | Yes — all domains | Yes — all domains | Yes | Yes |
| Domain owner | Yes — their domain only | Yes — their domain only | Yes — their domain | No |
| Contributor | No | No | No | No |

---

## Portal definitions

**Client portal** — single adaptive UI for all three roles. Interface expands automatically when permissions change.

**Product owner view** — Keri's privileged layer. Cross-client visibility, questionnaire inbox, setup workspace, platform settings. Keri can load any client instance and see exactly what they see.

---

## Governance flag model

A flag is raised only when the user explicitly requests a governance check, or continues pushing against a recommendation within a session. Not raised by default. Framing is conversational and observational.

---

## Current state

- [x] Architecture documented
- [x] Repo structure created
- [x] Base subject library — five mandatory subjects with scope statements
- [x] Default voice and tone document
- [x] Base subject prompts — one per subject
- [x] Stage prompts — one per journey stage
- [x] Request handling prompts
- [x] Setup prompts — client-facing and Keri-facing
- [x] Discovery meeting guide
- [x] Client questionnaire
- [x] Discovery process — 10 steps
- [x] Config template — domain-based role model
- [x] Portal definitions
- [x] UI shell — Next.js app with adaptive nav and agent workspace
- [x] Agent engine — API route wired to Anthropic API with streaming
- [x] Next.js project scaffolding — package.json, next.config.mjs, tsconfig.json, tailwind, postcss
- [x] Dynamic prompt assembly — assemblePrompt.ts reads from repo files at runtime
- [x] Demo client config — Acme Co., three domains (Marketing, Product, Legal), four users
- [x] Client key routing — URL param (?client=demo), defaults to demo, one-deploy-per-client confirmed as production model
- [x] Client config API route — /api/client loads config.json per client key
- [x] Real data in UI — client name, user name, role, domains loaded from config (not hardcoded)
- [x] Loading and error states — clean startup sequence, clear error for unknown client keys
- [x] User context in agent — role and domains passed to system prompt, agent responds differently by role
- [x] App deployed to Vercel — live at https://content-systems-platform.vercel.app/?client=demo
- [x] DECISIONS.md — full decisions log, updated in real time during sessions
- [x] IDEAS.md — ideas log (social media post add-on captured)
- [ ] Authentication — login screen, credentials per client, forced password reset on first login, 12-hour sessions
- [ ] Requests, logs, domains, admin views in UI
- [ ] Product owner view
- [ ] Digest collector and delivery
- [ ] First client config (pilot)

---

## Deployment

- **Platform:** Vercel (Hobby)
- **Live URL:** https://content-systems-platform.vercel.app/?client=demo
- **Deploy model:** GitHub push → Vercel auto-deploys within ~1 minute
- **Environment variables:** ANTHROPIC_API_KEY set in Vercel dashboard
- **Production model:** One Vercel deployment per client, each with their own environment variables (client key, API key, credentials)

---

## Key decisions

See DECISIONS.md for full context and reasoning.

| Decision | Detail |
|---|---|
| Five base subjects, all mandatory | Plain language, accessibility, inclusive language, terminology governance, voice and tone |
| Voice and tone model | Keri-defined default, replaced entirely by client customization |
| Agent response pattern | Suggestion first, reasoning second |
| Intent signal model | No signal: confirm. Weak: note assumption. Strong: proceed. |
| Governance flag model | Triggered by explicit request or persistence only |
| Three-tier role model | Content owner, domain owner, contributor |
| Domain-based structure | Central organizing unit, defined during discovery |
| Three log streams | Informational, actionable requests, overrides |
| Two portals | Client portal and product owner view |
| Questionnaire flow | Client submits to agent, agent confirms with client, Keri gets internal report |
| Tech stack | Next.js, React, Anthropic API, streaming responses |
| Dynamic prompt assembly | assemblePrompt.ts assembles system prompt from repo files at runtime |
| Demo client | Acme Co. — used to verify full config-to-prompt chain |
| Client key routing | URL param now (?client=), env var per deployment in production |
| One deploy per client | Confirmed as production architecture — required for per-client API keys and credentials |
| Authentication model | Username and password, credentials in deployment environment not repo, 12-hour sessions |
| Client API keys | Each client provides their own Anthropic API key, stored as env var in their deployment |
| Non-engineer framing | Every change explained with plain-language "so what" — standing agreement for all sessions |
| Decision logging | Real-time during sessions, not reconstructed at close |

---

## Open questions

- Daily digest delivery method — email, Slack, or other (blocking digest build)
- UI branding — neutral always, or light per-client customization?
- What triggers a post-handoff new engagement?
- Stakeholder relationship types beyond "informed"

---

## Next session: start here

**Pick up with: authentication.**

What's decided:
- Username and password credentials
- Credentials stored as environment variables in Vercel (not in repo, not in config file)
- Passwords hashed — never plain text
- Keri sets initial password during client setup
- User must reset password on first login
- Sessions last 12 hours
- Login endpoint must be rate-limited
- Credentials only over HTTPS (Vercel handles this automatically)

What to build:
1. Password hashing utility — script Keri runs during setup to generate a hashed password
2. Login API route — /api/auth/login — validates credentials, issues session token
3. Session API route — /api/auth/session — validates session token, returns user
4. Login screen — email, password, submit
5. Forced reset screen — shown on first login
6. Auth guard in page.tsx — redirect to login if no valid session
