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


---

### Governance flag triggers: persistence signals within a session
**Decision:** The agent recognizes a user is pushing against a recommendation based on three signals within a single session: explicit pushback on the same recommendation, aggressive or frustrated tone, or questions that suggest the user is trying to work around a recommendation. Persistence is not tracked across sessions.

**Context:** Needed to define what "continuing to override" means in practice so the agent can recognize it reliably.

**Reasoning:** Within-session tracking is sufficient and avoids the complexity of cross-session state. The three signals together cover the realistic range of how pushback actually presents — direct disagreement, emotional escalation, and indirect workarounds. Limiting to within-session keeps the model simple and avoids the agent carrying forward assumptions from previous interactions.

**Alternatives considered:** Cross-session tracking — rejected as unnecessarily complex and potentially feels surveillance-like to users.

---

### Governance flag access: any user can request
**Decision:** Any user — regardless of role — can explicitly request a governance flag on their content.

**Context:** Needed to define whether flag requests are role-gated.

**Reasoning:** A contributor who wants to understand whether their content conflicts with guidelines should be able to ask. Restricting flag requests to domain owners or above creates unnecessary friction for users who are trying to do the right thing. The flag itself surfaces the governance layer — what happens next (override, log, escalate) is where role permissions apply.

**Alternatives considered:** Domain owners and above only — rejected because it unnecessarily restricts access to governance information for users who are actively seeking it.

---

### Governance flag tone: conversational, observational, matter-of-fact
**Decision:** When a governance flag appears, the agent frames it conversationally and observationally — stating what it is noticing without alarm or formality. Example framing: "It looks like you need content that might go against our guidelines. Here's what we can do."

**Context:** Needed to define how the flag moment feels to the user — whether it's a hard stop, a formal process, or something in between.

**Reasoning:** Matter-of-fact framing keeps the interaction feeling like a conversation rather than a compliance process. Observational language ("it looks like") is non-accusatory and gives the user room to clarify if the agent has misread the situation. Presenting options immediately ("here's what we can do") moves the interaction forward rather than leaving the user at a dead end.

**Alternatives considered:** Formal/procedural framing — rejected because it breaks the conversational tone established across all other interaction patterns. Alarm or warning framing — rejected because it feels punitive and may cause users to avoid the agent rather than engage with it.

---

### Client fit: hard disqualifiers and yellow flags
**Decision:** Client fit is assessed against a defined set of hard disqualifiers and yellow flags. Hard disqualifiers result in declining the engagement. Yellow flags require conditions to be resolved before proceeding.

**Hard disqualifiers:**
- Expects compliance or legal responsibility to transfer to the platform
- Expects regulated content to be published without human review
- Expects the platform to replace a content person with no human in the loop
- Expects the platform to make final brand or business decisions
- No one in the organization owns content — no viable content owner/admin
- No defined or definable content domains
- Leadership unwilling to commit to a discovery engagement
- No appetite for any governance layer whatsoever

**Yellow flags:**
- Very small team where one person wears all roles
- Heavily regulated industry without explicit human review in their process
- Strong existing brand guidelines (likely requires voice and tone customization)
- Expects self-service under the current engagement model
- Leadership acknowledges content chaos but hasn't committed to addressing it

**Context:** Needed to define what makes a client a good fit vs. not, to protect both the client and the platform from mismatched engagements.

**Reasoning:** Hard disqualifiers protect against engagements that would fail — either because the client's expectations are fundamentally misaligned with what the platform does, or because their organizational structure can't support it. Yellow flags are worth exploring because they're often resolvable with the right conversation.

**Key clarifications made during definition:**
- "No existing content" is not a disqualifier — the platform's generation capabilities serve clients starting from scratch
- "Content chaos" is not a disqualifier — creating order from chaos is a core use case
- Self-service expectation is a yellow flag under the current model, not a permanent disqualifier — a future self-service tier is a viable product direction

---

### Discovery process: three phases before configuration
**Decision:** The setup process has three phases before configuration begins. Phase 1: discovery meeting (fit assessment). Phase 2: client questionnaire (configuration inputs). Phase 3: setup prompt (config generation). Each phase feeds the next.

**Context:** Initially framed setup as a single prompt. Clarified that Keri has an initial meeting with the client before any configuration work begins, and a questionnaire follows that meeting to gather the detailed inputs needed for configuration.

**Reasoning:** Separating fit assessment from configuration prevents wasted effort on clients who aren't a good match. The questionnaire ensures configuration inputs are complete and accurate before the setup prompt runs.

**Alternatives considered:** Single setup session covering fit and config together — rejected because it conflates two different conversations with different goals and different participants.

---

### Client questionnaire: owner-coordinated, section-delegable
**Decision:** The client questionnaire is owned by the content owner/admin. They receive it, review it, determine which sections belong to which teams, and are responsible for returning it complete. Some sections may be delegated to other team members — a marketing lead, a PM, an HR contact — for completion. The questionnaire is delivered in advance of a follow-up meeting; Keri and the client review it together to fill any gaps.

**Context:** Needed to define how the questionnaire is delivered, who completes it, and how multi-stakeholder input is handled.

**Reasoning:** The content owner is the right primary owner — they have the broadest view of the organization's content structure and the authority to assign responsibility. Delegation acknowledges that some questions (domain ownership, routing, stakeholder lists) may require input from people who weren't in the discovery meeting. The advance-plus-review model ensures the questionnaire is as complete as possible before the follow-up meeting, making that meeting more productive.

**Future possibility:** A version of the questionnaire that supports formal delegation — the owner assigns sections to specific people, who receive and complete their portion independently before the owner assembles the full response. Noted in IDEAS.md.

---

### Questionnaire flow: client-submitted, agent-analyzed, two outputs
**Decision:** The client submits the completed questionnaire directly to the agent — not to Keri. The agent produces two outputs: a client-facing confirmation summary (clean, no flags) reviewed section by section with the client, and a Keri-facing report (mirroring the questionnaire structure, followed by flags with verbatim client responses) sent to Keri after client confirmation.

**Context:** Initially framed the questionnaire as something Keri processes. Clarified that the agent receives and analyzes it first, surfaces a summary to the client for confirmation, then sends Keri a separate report with analysis the client doesn't see.

**Reasoning:** The agent doing the first-pass analysis saves Keri time and ensures she arrives at the follow-up meeting with a clear picture of what's complete, what's missing, and what needs discussion. Keeping the Keri-facing flags invisible to the client preserves the client relationship — they see a clean confirmation of what they submitted, not a list of problems.

**Alternatives considered:** Keri processes the questionnaire directly — rejected because it adds manual work and delays the analysis. Single output seen by both client and Keri — rejected because flags and contradictions should not be surfaced to the client before Keri has had a chance to discuss them.

---

### Questionnaire agent analysis: hard flags to client, soft flags to Keri
**Decision:** When the agent analyzes the questionnaire, obvious compliance issues (e.g., client claims no compliance requirements but lists a regulated domain) are flagged directly with the client during the confirmation step. Softer issues — ambiguous scope, governance gaps, broad domains that may be hard to govern — are flagged only in the Keri-facing report.

**Context:** Needed to define what the agent surfaces to the client vs. keeps for Keri.

**Reasoning:** Hard flags (compliance contradictions) need to be resolved before the questionnaire can be treated as accurate — the client needs to correct them. Soft flags are matters of judgment that Keri is better positioned to address in conversation with the client, where context and relationship can shape how they're raised.

---

### Keri-facing report format: mirror then flags with verbatims
**Decision:** The Keri-facing report mirrors the questionnaire structure — section by section summary of what the client provided — followed by a flags section that includes each flag with the verbatim client response that triggered it.

**Context:** Needed to define how the Keri-facing report is organized.

**Reasoning:** Mirroring the questionnaire structure makes it easy for Keri to cross-reference against the original. Including verbatims alongside flags gives Keri the client's exact words — useful for follow-up conversations where tone and phrasing matter.

---

### Two portals: client portal and product owner view
**Decision:** The platform has two portals. The client portal is a single adaptive UI serving all three client roles — contributor, domain owner, content owner. The product owner view is a privileged layer on top of the same system, used by Keri (and future consultants) for platform administration, client management, and cross-client visibility. Keri can also use the agent in the product owner view exactly as a client would — seeing what they see.

**Context:** The agent engine needs to know which portal it's serving to load the right prompts and permissions. Two portals were implied by the architecture but had not been explicitly defined.

**Reasoning:** A single adaptive client UI keeps the experience consistent as users gain access to new areas — no jarring context switches. The product owner view as a privileged layer rather than a separate product keeps the system unified and allows Keri to move naturally between administration and agent use.

**Alternatives considered:** Separate portals per role — rejected because role transitions (e.g., a contributor becoming a domain owner) should feel seamless, not like switching tools. Separate Keri product — rejected because Keri needs to see exactly what clients see when testing or supporting an instance.

---

### Client portal role transitions: permission-triggered, not toggle-driven
**Decision:** The client portal UI adapts automatically when a user's permissions change — for example, when a domain owner grants another user access to their domain. The user does not manually switch between role views. The interface expands or contracts based on what they currently have access to.

**Context:** Needed to define what triggers a role shift in the adaptive UI.

**Reasoning:** Permission-triggered adaptation is less disruptive than a manual toggle — the user gains access to new capabilities naturally, as part of a workflow, rather than having to switch modes. It also means the UI reflects reality at all times rather than depending on the user to manage their own view.

---

### Product owner view: Keri sees what the client sees
**Decision:** When Keri uses the agent in the product owner view, she sees exactly what the client sees for that instance — the same agent, the same config, the same constraints. This is her primary way of testing and supporting a client instance.

**Context:** Needed to define how Keri uses the agent in her own portal.

**Reasoning:** Seeing exactly what the client sees is the only reliable way to test and support an instance. A separate "Keri mode" of the agent would introduce drift between what Keri tests and what clients experience.
