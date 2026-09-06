# Content Systems Platform — Project State

## What this is

A hosted, multi-client content design platform. Each client accesses an isolated instance of a content design agent — configured during a consulting engagement, then fully independent. Clients interact through a web UI and never see the underlying infrastructure.

The platform serves two audiences:

- **Clients** — content teams and contributors using the agent day-to-day to write, review, and govern content
- **The consultant (Keri)** — configuring new client instances during setup, maintaining the platform layer

---

## Architecture overview

### Three layers

**Platform layer** (infrastructure, invisible to clients)
- Agent engine — reasoning behavior, keyword detection, response logic
- Setup tooling — configuration generator for new clients
- Request log collector — aggregates in-session requests into running log files per client
- Daily digest delivery — sends the request log to designated client owners on a 24-hour cycle

**Config layer** (built during discovery, sealed after handoff)
- Client key → maps to a sealed config directory
- Base subjects — all five mandatory, active for every client
- Domains — client-specific content areas with assigned owners and routing
- Style guides and voice/tone docs — client-specific `.md` files
- Role and permissions model — content owner, domain owner, contributor
- Routing table — request type → log → owner, configured per domain

**Client layer** (what clients see and use)
- Agent UI — loaded by client key, branded neutral or lightly customized
- Content scoped entirely to their config directory
- Request flow — inline, triggered by use or by governance denial
- Daily digest — delivered to designated owners

---

## Repo structure

```
/platform/
  agent/               # Core agent engine (shared, never client-facing)
  setup/               # Setup tooling, config generator, discovery process
  digest/              # Daily digest collector and delivery logic

/clients/
  .template/
    config.json        # Client config template — domain-based role model
  [client-key]/
    config.json        # Sealed client config
    guides/            # Style guide and voice/tone .md files
    governance/        # Governance docs and decision logs
    logs/
      informational.md # Out-of-scope asks — no action required
      requests.md      # Actionable requests — governance denials and direct requests
      overrides.md     # Governance overrides — always visible to admin

/base/
  subjects/            # Shared base subject library with scope statements
  prompts/             # Base subject prompts and stage prompts
    stages/            # One prompt per journey stage

/ui/
  index.html           # Client-facing agent UI shell
  prompts.js           # Prompt assembly logic (reads from client config)

IDEAS.md               # Ideas log — future discovery and feature candidates
```

---

## Role model

Three roles, domain-scoped where relevant:

| Role | Override governance | View logs | Resolve requests | Configure |
|---|---|---|---|---|
| Content owner / admin | Yes — all domains | Yes — all domains | Yes | Yes |
| Domain owner | Yes — their domain only | Yes — their domain only | Yes — their domain | No |
| Contributor | No | No | No | No |

The content owner is typically also the day-to-day content creator. Domain owners are non-content professionals (PM, marketing lead, etc.) responsible for a specific content area.

---

## Log architecture

Three distinct log streams per client:

| Log | Purpose | Digest | Admin visibility |
|---|---|---|---|
| `logs/informational.md` | Out-of-scope asks — pattern recognition over time | Off by default | On demand |
| `logs/requests.md` | Actionable — governance denials and direct requests | Yes | Always |
| `logs/overrides.md` | Governance overrides — flagged at configurable thresholds | Yes | Always |

---

## Discovery process

Ten-step consulting engagement producing a sealed client config. Full detail in `platform/setup/discovery-process.md`.

1. Define primary content scope
2. Match ownership to domains
3. Define users and roles
4. Configure governance and override permissions
5. Configure request routing
6. Configure the digest
7. Configure voice and tone
8. Build style guides and governance docs
9. Generate client key and test
10. Handoff

---

## Current state

- [x] Architecture documented
- [x] Repo structure created
- [x] Base subject library — five mandatory subjects with scope statements (`base/subjects/`)
- [x] Default voice and tone document (`base/subjects/voice-and-tone-default.md`)
- [x] Base subject prompts — one per subject (`base/prompts/`)
- [x] Stage prompts — one per journey stage (`base/prompts/stages/`)
- [x] Discovery process defined (`platform/setup/discovery-process.md`)
- [x] Config template revised — domain-based role model (`clients/.template/config.json`)
- [x] Ideas log started (`IDEAS.md`)
- [ ] Request handling prompts
- [ ] Setup prompts (Keri-facing)
- [ ] Agent engine
- [ ] Setup tooling
- [ ] Digest collector and delivery
- [ ] UI shell
- [ ] First client config (pilot)

---

## Key decisions

| Decision | Detail |
|---|---|
| Hosted multi-client, single deployment | Avoids per-client repo overhead; Keri manages one environment |
| Client key as access mechanism | Simple isolation without requiring login infrastructure |
| Config sealed after handoff | Preserves governance integrity; changes require a new engagement |
| Five base subjects, all mandatory | Plain language, accessibility, inclusive language, terminology governance, voice and tone |
| Each subject has explicit in/out of scope | Prevents client misunderstanding; sets clear agent boundaries |
| Voice and tone model | Keri-defined default ships with every client; replaced entirely by client customization during discovery |
| Agent response pattern | Suggestion first, reasoning second; tone awareness woven into all subject feedback |
| Intent signal model | No signal → confirm before proceeding; weak signal → note assumption inline; strong signal → proceed |
| Three-tier role model | Content owner (full access), domain owner (domain-scoped), contributor (no override or log access) |
| Domain-based routing | Content domains defined during discovery; each domain has an owner, stakeholders, override permissions, and routing config |
| Three log streams | Informational (no action), actionable requests (governance denials + direct requests), overrides (always logged) |
| Discovery as consulting engagement | Ensures proper configuration; 10-step process from scope definition to handoff |

---

## Open questions

- Daily digest delivery method — email, Slack, or other (TBD)
- UI branding — neutral always, or light per-client customization?
- What triggers a post-handoff "new engagement" — size of change, governance tier, or client request?
- Stakeholder relationship types — currently only "informed"; needs expansion during request handling prompt work

