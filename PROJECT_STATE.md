# Content Systems Platform — Project State

## What this is

A hosted, multi-client content design platform. Each client accesses an isolated instance of a content design agent — configured during a consulting engagement, then fully independent. Clients interact through a web UI and never see the underlying infrastructure.

The platform serves two audiences:

- **Clients** — content teams using the agent day-to-day to write, review, and govern content
- **The consultant (Keri)** — configuring new client instances during setup, maintaining the platform layer

---

## Architecture overview

### Three layers

**Platform layer** (infrastructure, invisible to clients)
- Agent engine — reasoning behavior, keyword detection, response logic
- Setup tooling — configuration generator for new clients
- Request log collector — aggregates in-session requests into a running `.md` file per client
- Daily digest delivery — sends the request log to designated client owners on a 24-hour cycle

**Config layer** (built during discovery, sealed after handoff)
- Client key → maps to a sealed config directory
- Base subjects — selected from a shared menu during discovery
- Style guides and voice/tone docs — client-specific `.md` files
- Governance tiers — Tier 1 (base subjects, selected during setup), Tier 2 (client-specific surfaces and decision logs)
- Owner contacts — who receives the daily digest

**Client layer** (what clients see and use)
- Agent UI — loaded by client key, branded neutral or lightly customized
- Content scoped entirely to their config directory
- Request flow — inline, triggered by use or by governance denial
- Daily digest — delivered to designated owners

---

## Repo structure (proposed)

```
/platform/
  agent/               # Core agent engine (shared, never client-facing)
  setup/               # Setup tooling and config generator
  digest/              # Daily digest collector and delivery logic

/clients/
  [client-key]/
    config.json        # Client metadata, owner contacts, base subject selections
    guides/            # Style guide and voice/tone .md files
    governance/        # Tier 1 and Tier 2 docs, decision logs
    requests.md        # Running log of in-session requests

/base/
  subjects/            # Shared base subject library (plain language, accessibility, etc.)
  prompts/             # Base prompt templates, extended per client

/ui/
  index.html           # Client-facing agent UI shell
  prompts.js           # Prompt assembly logic (reads from client config)
```

---

## Setup and discovery process (overview)

The setup process is a consulting engagement between Keri and the client. It produces a complete, sealed config directory. Steps:

1. **Discovery** — Identify the client's content surfaces, team structure, governance needs, and owner contacts
2. **Base subject selection** — Walk through the shared base subject library; client selects what applies
3. **Style guide build** — Draft or convert client style guide content into `.md` files
4. **Governance configuration** — Define Tier 1 (base subjects) and Tier 2 (surface-specific rules, decision logs, glossary)
5. **Owner setup** — Identify who receives the daily digest; configure delivery
6. **Key generation** — Generate client key, configure URL, test the instance
7. **Handoff** — Client team is onboarded to the UI; setup mode is locked

After handoff, the client's instance is fully isolated. Changes to their content require a new engagement or a structured request through the platform.

---

## Request and feature flow

Requests are submitted through the agent UI — either as standalone requests or triggered by a governance denial. When a denial occurs, the agent offers the option to log a request for review.

Each request is appended to the client's `requests.md` with:
- Timestamp
- Request type (new content, governance change, feature addition)
- Context (what the user was doing when the request was triggered)
- Description

The daily digest collects all new entries from `requests.md` and delivers them to the client's designated owners. Owners review, prioritize, and bring changes back to Keri as a new engagement if needed.

---

## Isolation model

Each client is identified by a unique key embedded in their access URL. The key maps to their config directory. The agent engine loads only from that directory — no client can see or affect another's content, governance, or request log.

The platform layer (engine, setup tooling, digest delivery) is shared infrastructure but is never exposed to clients.

---

## Current state

- [ ] Architecture document (this file)
- [ ] Repo structure created
- [ ] Platform layer: agent engine scoped from Apple CDA work
- [ ] Platform layer: setup tooling
- [ ] Platform layer: digest collector and delivery
- [ ] Base subject library defined
- [ ] UI shell (neutral, key-driven)
- [ ] First client config (pilot)

---

## Key decisions

| Decision | Rationale |
|---|---|
| Hosted multi-client, single deployment | Avoids per-client repo overhead; Keri manages one environment |
| Client key as access mechanism | Simple isolation without requiring login infrastructure |
| Config sealed after handoff | Preserves governance integrity; changes require a new engagement |
| Request log as `.md` file | Human-readable, auditable, no database required |
| Daily digest cadence | Batches requests to avoid noise; keeps owners informed without overwhelming |
| Shared base subjects, client-selected | Consistent platform quality floor; clients own their Tier 2 |
| Discovery/setup as consulting engagement | Ensures each instance is properly configured; creates a natural business model |

---

## Open questions

- What does the base subject library contain at launch? (Candidates: plain language, accessibility, inclusive language, terminology governance)
- How is the daily digest delivered — email, Slack, or something else?
- Does the UI need any light branding per client, or is neutral always sufficient?
- What triggers a "new engagement" for post-handoff changes — size of change, governance tier affected, or client request?
