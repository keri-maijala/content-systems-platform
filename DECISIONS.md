# Decisions Log

This document captures every meaningful decision made during the design and build of the Content Systems Platform. Each entry includes the decision, the context that prompted it, the reasoning behind it, and any alternatives considered.

Decisions are logged in the order they were made. Session dates are noted for reference.

---

## 2026-09-02

### Base subject library: five mandatory subjects
**Decision:** The base subject library consists of five subjects — plain language, accessibility, inclusive language, terminology governance, and voice and tone — all mandatory for every client instance. No opt-out.

**Context:** Needed to define what every client inherits from the platform by default.

**Reasoning:** Mandatory subjects ensure a consistent quality floor across all client instances. Opt-out logic adds complexity to setup and creates uneven platform quality. All five subjects are universally applicable regardless of client type or content scope.

**Alternatives considered:** Opt-in or opt-out per subject. Rejected because it weakens the platform's quality guarantee and complicates the setup process.

---

### Explicit in/out of scope per subject
**Decision:** Each base subject includes an explicit in-scope and out-of-scope statement.

**Context:** Needed to define what each subject covers and what it doesn't, to prevent client misunderstanding.

**Reasoning:** Without explicit boundaries, clients may expect the agent to handle things it isn't equipped for — technical accessibility implementation, legal compliance, trademark review. Explicit scope statements prevent confusion during onboarding and set clear agent boundaries.

**Alternatives considered:** In-scope only. Rejected because the out-of-scope statement does significant work, particularly for subjects like accessibility where the boundary between content and technical implementation is commonly misunderstood.

---

### Voice and tone model: Keri-defined default, replaced by client customization
**Decision:** Every client instance ships with a Keri-defined default voice and tone. If a client wants something different, it is customized during the discovery engagement and replaces the default entirely for that instance. Customization is always collaborative — never self-service.

**Context:** Needed to decide whether the base voice and tone is a scaffold (always active underneath client docs), a placeholder (active until client docs are in place), or a Keri-defined default (active unless replaced).

**Reasoning:** A Keri-defined default means clients without customization get a professional, considered voice rather than a generic placeholder. Client customization replaces rather than layers, keeping client instances clean and avoiding contradictions between base and client guidance.

**Alternatives considered:** Scaffold model (base always active, client docs layer on top) — rejected because it can quietly contradict client brand if not perfectly aligned. Placeholder model (base active until client docs exist, then switched off) — rejected because it creates gaps if client docs are incomplete.

---

## 2026-09-06

### Agent response pattern: suggestion first, reasoning second
**Decision:** When the agent reviews content or provides guidance, it leads with the suggestion and follows with the reasoning. Tone awareness is woven into all subject feedback rather than presented as a separate section.

**Context:** Needed to define how the agent structures its responses across all subject and stage prompts.

**Reasoning:** Leading with the suggestion respects the user's time — they get the actionable information immediately. The reasoning follows for users who want to understand why. Weaving tone into subject feedback produces a more natural, integrated response rather than a mechanical parallel audit.

**Alternatives considered:** Reasoning first — rejected because it buries the actionable information. Separate tone section — rejected because it fragments the feedback and feels like two audits rather than one point of view.

---

### Intent signal model: three tiers
**Decision:** The agent handles intent signals in three tiers. No signal: ask the user to confirm the stage before proceeding. Weak signal (agent can infer from content): note the assumption inline and proceed without requiring confirmation. Strong signal (user has stated context explicitly): proceed without any confirmation language.

**Context:** Needed to define how the agent handles uncertainty about journey stage when reviewing content for tone.

**Reasoning:** A binary confirm/proceed model is either too interruptive (always confirming) or too presumptuous (always inferring). Three tiers match the actual range of situations — some genuinely need clarification, some can proceed with a noted assumption, some are fully clear. It also trains users over time to provide context upfront.

**Alternatives considered:** Always confirm — rejected because it creates unnecessary friction when context is clear. Always infer — rejected because it produces unreliable feedback when context is genuinely ambiguous.

---

### Three-tier role model: content owner, domain owner, contributor
**Decision:** The platform uses three roles. Content owner/admin: full access, full override rights, all log visibility, also a day-to-day content user. Domain owner: override rights and log visibility scoped to their assigned domain only. Contributor: everyday user from any function, no override or log access.

**Context:** Needed to define who uses the system and what they can do. The initial framing of "editor" as a senior content person with override rights was reframed when it became clear that the primary day-to-day users are people outside the content team.

**Reasoning:** The content person is typically both the configurator/governor and a day-to-day user. Domain owners are non-content professionals responsible for a specific content area. Contributors are everyone else. Roles based on domain ownership and accountability rather than content expertise reflects how clients actually work.

**Alternatives considered:** Standard/editor/admin hierarchy based on content expertise — rejected because it didn't match real use patterns. The "editor" concept was reframed as domain owner once we understood that governance ownership is domain-specific, not expertise-based.

---

### Domain-based structure as central organizing unit
**Decision:** Content domains are the central organizing unit of the platform. Domains are defined during discovery — each client's domain structure reflects their actual content scope. Each domain carries its own owner, stakeholders, override permissions, flagging thresholds, and routing config.

**Context:** Needed to define how governance ownership, request routing, and permissions are organized. A marketing client's ownership structure is completely different from a product company's.

**Reasoning:** Domains match how content ownership actually works in organizations. A marketing lead owns marketing content; a PM owns product content. Scoping permissions and routing to domains rather than globally makes the platform flexible enough to serve very different client types without requiring a custom role structure each time.

**Alternatives considered:** Global routing table with request types — rejected because it doesn't account for the fact that the same request type (e.g., terminology) might be owned by different people in different clients.

---

### Three log streams: informational, actionable, overrides
**Decision:** The platform maintains three distinct log streams per client. Informational (logs/informational.md): out-of-scope asks, no action required, visible to admin on demand, not in digest by default. Actionable (logs/requests.md): governance flags and direct requests, requires resolution, always in digest. Overrides (logs/overrides.md): governance overrides, always logged, always visible to admin, flagged at configurable thresholds.

**Context:** Needed to define what gets logged, where, and who sees it. Started as a single requests.md file; evolved as the distinction between informational and actionable became clear.

**Reasoning:** Mixing informational and actionable items in a single log creates noise and obscures what needs attention. Overrides need their own stream because they're always visible to admin regardless of whether they trigger further action. Three streams keeps each purpose clean and makes the digest useful rather than overwhelming.

**Alternatives considered:** Single requests.md — rejected because it conflates items that need action with items that are just informational. Two streams (informational + actionable) — extended to three when overrides emerged as a category that needs permanent admin visibility regardless of action status.

---

### Governance flags: triggered deliberately, not by default
**Decision:** The agent does not flag governance conflicts by default during every interaction. A governance flag is only raised when: (1) the user explicitly requests it, or (2) the user continues to push against a recommendation after it has already been given.

**Context:** Initially framed governance denial as something the agent raises whenever content conflicts with a rule. Clarified that this would create friction in every interaction — turning every piece of advice into a formal process.

**Reasoning:** The agent behaves like a knowledgeable colleague by default — it gives good advice without making every suggestion into a governed decision. The governance machinery only becomes visible when it genuinely needs to be. This keeps the day-to-day experience natural and low-friction while preserving the governance layer for moments that actually warrant it.

**Alternatives considered:** Flag every conflict — rejected because it would make every interaction feel like a compliance check rather than a collaborative content tool.

---

### Running decisions log: DECISIONS.md
**Decision:** A dedicated DECISIONS.md in the repo root captures every meaningful decision in real time, with context, reasoning, and alternatives considered. Session summaries remain the session-level digest; DECISIONS.md is the fine-grained record.

**Context:** Session summaries were capturing what was decided but flattening the reasoning and the path taken to get there. Needed a more granular record.

**Reasoning:** A fine-grained decisions log is more useful than a session-level table for anyone who needs to understand how the platform's thinking evolved — including future clients, collaborators, or Keri herself returning to a decision months later. It also feeds naturally into the content decision trail concept in IDEAS.md.

**Alternatives considered:** Richer session summaries — rejected in favor of a dedicated log because session summaries serve a different purpose (re-orientation) and shouldn't be burdened with full decision context. Both (DECISIONS.md + richer summaries) — considered but the dedicated log is sufficient; session summaries can stay lean.

