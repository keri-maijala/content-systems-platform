# Content Systems Platform

A hosted, multi-client content design platform. Each client accesses an isolated instance of a content design agent — configured during a consulting engagement, then fully independent.

Clients interact through a web UI and never see the underlying infrastructure.

---

## How it works

### Three layers

**Platform layer** — shared infrastructure, invisible to clients
- Agent engine (reasoning, keyword detection, response logic)
- Setup tooling (config generator for new clients)
- Request log collector and daily digest delivery

**Config layer** — built during discovery, sealed after handoff
- Client key → sealed config directory
- Base subjects selected from the shared library
- Client-specific style guides, governance tiers, and owner contacts

**Client layer** — what clients see and use
- Agent UI loaded by client key
- Content scoped entirely to their config directory
- Inline request flow, triggered by use or governance denial
- Daily digest delivered to designated owners

---

## Repo structure

```
/platform/
  agent/               # Core agent engine
  setup/               # Setup tooling and config generator
  digest/              # Daily digest collector and delivery

/clients/
  .template/           # Template for new client config directories
    config.json
    guides/
    governance/
    requests.md

/base/
  subjects/            # Shared base subject library
  prompts/             # Base prompt templates

/ui/
  index.html           # Client-facing agent UI shell
  prompts.js           # Prompt assembly logic
```

---

## Adding a new client

New clients are configured during a discovery and setup engagement. The output is a sealed config directory under `/clients/[client-key]/`. See `/platform/setup/` for tooling and process documentation.

---

## For clients

You access this platform through a URL provided during your setup engagement. You do not need to interact with this repository.

---

## Project state

See `PROJECT_STATE.md` for current status, open questions, and key decisions.
