# Portal Definitions

The platform has two portals. Both are built on the same underlying system — the agent engine, config layer, and log architecture. What differs is the scope of access, the visibility of information, and the tools available.

---

## Client portal

### What it is
The client portal is the primary interface for everyone at a client organization — contributors, domain owners, and the content owner/admin. It is a single adaptive UI that expands based on what each user has access to.

### Who uses it
- **Contributors** — everyday users from any function. Create and generate content, receive agent guidance, trigger request logs when they hit a wall.
- **Domain owners** — own a specific content area. Everything a contributor can do, plus visibility into their domain's request queue and log, and the ability to override governance within their domain.
- **Content owner/admin** — the content professional who administers the instance. Everything a domain owner can do, plus full log visibility across all domains, platform configuration access, digest management, and admin-level override rights.

### How role adaptation works
The UI adapts automatically when a user's permissions change — not through a manual toggle. When a domain owner grants another user access to their domain, that user's interface expands to reflect their new access the next time they load the portal. Role transitions feel like a natural expansion of capability, not a context switch.

A single user can hold multiple roles. A content owner who is also a domain owner for a specific area sees a unified view — not separate experiences stitched together.

### Core interface areas

**Agent** — the primary workspace. Available to all roles. The agent handles content review, brainstorming, generation, direct questions, and governance interactions. The agent interface is identical across roles — what differs is what the agent can surface based on the user's permissions and domain access.

**Request queue** — visible to domain owners and content owners. Shows open requests within their domain(s), status, and routing. Contributors can see requests they submitted; they cannot see the full queue.

**Log view** — visible to domain owners (their domain only) and content owners (all domains). Informational log, actionable requests, and override log. Filterable by domain, date, status, and type.

**Domain settings** — visible to domain owners (their domain) and content owners (all domains). Shows domain configuration, owner, stakeholders, routing, and override permissions. Read-only for domain owners; editable by content owners.

**Admin** — visible to content owners only. Platform configuration, user management, digest settings, and voice and tone configuration.

### What the client portal does not show
- Other clients' data, configurations, or activity
- Keri's internal flags or analysis from the questionnaire process
- Platform-level infrastructure or configuration
- Any information from another client's instance

---

## Product owner view

### What it is
The product owner view is a privileged layer built on the same system as the client portal. It gives Keri — and future consultants she assigns — cross-client visibility, platform administration tools, and the ability to see exactly what any client sees in their portal instance.

### Who uses it
- **Keri** — full access across all clients and all platform functions
- **Future consultants** — access scoped to their assigned clients; permissions defined by Keri based on their role in the consultancy (see IDEAS.md — consultant permissions model)

### Core interface areas

**Client agent view** — Keri can load any client's agent instance and see exactly what that client sees. Same config, same constraints, same agent behavior. This is the primary way Keri tests and supports a client instance. No "Keri mode" of the agent exists — what Keri sees is what the client sees.

**Client manager** — a cross-client dashboard showing all active client instances, their status, recent activity, open requests, and unresolved flags. Keri's entry point for managing her client portfolio.

**Questionnaire inbox** — where completed client questionnaires arrive after the client confirmation step. Each entry shows the client's confirmed responses and Keri's internal report — flags, soft issues, verbatims, and suggested follow-up questions. Used to prepare for follow-up meetings.

**Setup workspace** — the configuration environment for new client instances. Keri works through the 10-step discovery process here, using the setup prompt to generate config artifacts from questionnaire inputs. Produces a ready-to-commit config.json and supporting files.

**Platform settings** — platform-level configuration: base subject library, default voice and tone, base prompt templates, digest delivery infrastructure. Changes here affect all client instances.

**Activity log** — cross-client activity view. Filterable by client, date, event type. Useful for identifying platform-wide patterns — recurring request types, common governance conflicts, subjects that may need expansion.

### What the product owner view adds beyond the client portal
- Cross-client visibility — all clients, all instances, all activity
- Questionnaire inbox and Keri-facing reports
- Setup workspace and config generation
- Platform-level settings that affect all instances
- The ability to load any client's instance and see exactly what they see

### What the product owner view does not do
- Modify a client's instance without a new engagement — config is sealed after handoff
- Show one client's data to another client
- Expose platform infrastructure to clients

---

## Shared principles

**One system, two views** — the client portal and product owner view are not separate products. They share the same agent engine, config layer, log architecture, and UI foundation. What differs is scope of access and available tools.

**Consistency across roles** — the agent interaction is identical regardless of who is using it. A contributor, a content owner, and Keri all interact with the agent the same way. Permissions shape what the agent can surface, not how it behaves.

**No jarring transitions** — role changes, permission expansions, and view shifts should feel like a natural evolution of the interface, not a context switch. The UI adapts; it does not restart.
