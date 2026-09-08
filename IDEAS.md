# Ideas Log

This document captures ideas for future discovery — features, integrations, and capabilities that are out of scope for the current build but worth exploring. Each entry includes the original idea, the fuller vision as understood, open questions, and potential surfaces.

---

## Content decision trail

**Origin:** Session 2026-09-06

**The idea**
A content-level provenance system that attaches the history of a piece of content to the content itself — not just to the platform logs. Anyone with access could trigger a view on a specific piece of content and see its full decision trail in context.

**The fuller vision**
A designer, PM, or content person hovers over or selects a piece of content and sees:
- The current approved version
- Previous versions and what changed between them
- Who made each decision and when
- What was proposed and rejected, and by whom
- Any governance flags raised along the way, and how they were resolved

The history travels with the content rather than living only in the platform. It surfaces in context — wherever the content lives — rather than requiring someone to go looking in a separate log.

**Potential surfaces**
- Figma plugin — tooltip or panel triggered on a text element
- Browser extension — overlaid on live or staged content
- CMS integration — inline history panel within the content editor
- Agent UI panel — accessible from within the platform
- API — queryable by other tools that need provenance data

**Scope questions**
- Is this for all content, or only content that has passed through the agent?
- Who can see the full trail — admin only, or any user?
- Is rejected content visible to all roles, or restricted?
- How far back does the trail go — from platform launch, or from a configurable start date?

**Ownership questions**
- Who triggers a new entry — the agent automatically, the user manually, or both?
- Who can annotate or contextualize a decision in the trail?
- How does the trail handle content that exists before the platform is in place?

**Dependencies**
- Content identity — the system needs a way to identify and track a specific piece of content across versions. This is non-trivial if content lives in multiple tools.
- Role and permissions model — visibility of the trail will depend on what role structure we land on.
- Log architecture — the platform logs we're building now are a precursor; the content trail extends that concept to the artifact level.

---

---

## Self-service subscription tier

**Origin:** Session 2026-09-06

**The idea**
A lower-touch, lower-cost version of the platform delivered as a subscription with a setup wizard. Clients configure their own instance without a consulting engagement with Keri.

**The fuller vision**
The current model requires Keri's involvement for every client — discovery, configuration, and handoff. A self-service tier would allow clients to configure their own instance through a guided setup wizard, reducing the cost and time of onboarding. Keri's role shifts from active configurator to platform maintainer and optional upgrade path.

This could serve smaller clients, clients with simpler content needs, or clients who want to try the platform before committing to a full engagement.

**Product implications**
- Setup wizard replaces the discovery engagement for self-service clients
- Configuration is more constrained — fewer custom options, more opinionated defaults
- Voice and tone customization may be limited or wizard-driven rather than collaborative
- Support model changes — Keri is not the first line of support for self-service clients
- Upgrade path from self-service to full engagement should be defined

**Potential tiers**
- Self-service subscription — setup wizard, constrained config, lower price point
- Consulting engagement — current model, full customization, Keri-configured

**Open questions**
- What is the right constraint level for self-service? How much customization is too much without Keri's expertise guiding it?
- How does voice and tone work in self-service — wizard-driven options, or always the Keri-defined default?
- What does the upgrade path look like — can a self-service config be imported into a full engagement?
- What support model works for self-service clients?

**Dependencies**
- Setup wizard UI — significant build effort
- Constrained config schema — a subset of the full config.json
- Pricing and business model decisions

---

## Delegable client questionnaire

**Origin:** Session 2026-09-06

**The idea**
A version of the client questionnaire that supports formal section delegation. The content owner assigns specific sections to specific people — a marketing lead, a PM, an HR contact — who receive and complete their portion independently. The owner assembles the full response before submitting.

**The fuller vision**
Currently the questionnaire is a single document the content owner coordinates manually. A delegable version would make that coordination explicit and trackable — each section has a named owner, a deadline, and a completion status. The content owner sees what's been completed and what's outstanding before the follow-up meeting with Keri.

**Potential surfaces**
- A shared document with named section owners (lightweight, low-build)
- A simple web form that routes sections to different email addresses
- A dedicated questionnaire tool within the platform setup flow

**Open questions**
- How does the content owner assign sections — by name, by role, or by domain?
- What happens if a delegated section comes back incomplete?
- Does Keri see the delegation structure, or just the completed questionnaire?

**Dependencies**
- Content owner role must be clearly established before delegation is possible
- Requires either a shared document infrastructure or a lightweight web form

---

## Consultant permissions model

**Origin:** Session 2026-09-06

**The idea**
A permissions model for consultants working under Keri — defining what access they get in the product owner view, which clients they're assigned to, and what they can and cannot do within those engagements.

**The fuller vision**
If Keri hires other consultants, they would need access to the product owner view scoped to their assigned clients. The model would need to define:
- Which clients a consultant is assigned to
- What they can do within those client instances (review only, configure, full access)
- Whether they can see across all their assigned clients or only one at a time
- What Keri can see about their activity

**Open questions**
- What roles exist within the consultancy — junior consultant, senior consultant, partner?
- Does role within the consultancy map directly to portal permissions, or are they configured independently?
- Can a consultant be assigned to a client in read-only mode for training or shadowing purposes?
- Does the client know which consultant is working on their instance?

**Dependencies**
- Product owner view must be defined first
- Consultant role structure depends on how Keri structures her consultancy over time
---

## Client-facing platform explainer and leadership ROI documentation

**Origin:** Session 2026-09-08

**The idea**
Two related documents: one that explains how the platform works to client teams in plain language, and one that helps clients justify the platform investment to their leadership. Neither is a sales document — they're educational materials that help clients understand what they've bought and make the case internally.

**The fuller vision**

### How it works — for client teams

A plain-language explainer aimed at the people who will use the platform day to day. Not technical. Covers:

- What the platform is and what it does (a shared content design agent configured for your organization)
- The three things it helps with: writing and reviewing content, maintaining consistency across teams, and surfacing governance issues before they become problems
- How it's organized (domains, roles, the agent workspace)
- Who does what (contributors ask questions and get reviews; domain owners manage their area; content owners have full visibility)
- What happens with requests that go beyond the agent's guidance (logged, routed to the right person, resolved)
- What the agent won't do (legal, brand identity, final decisions — those stay with your team)

Tone: conversational, confident, non-technical. Written the way a thoughtful colleague would explain it.

### Leadership ROI justification — for client sponsors

A document that helps a content owner or program lead make the case to a director, VP, or CFO. Covers:

- The problem it solves (inconsistent content, high review overhead, governance issues caught late, knowledge siloed in one or two people)
- What changes with the platform (consistent guidance available to everyone, governance issues surface earlier, content owners spend less time fielding one-off questions, new team members ramp faster)
- How to frame the value (time saved on review cycles, reduction in back-and-forth, fewer late-stage revisions, lower risk of compliance or brand issues)
- What it costs and what that buys (consulting engagement + platform access; includes configuration, onboarding, and ongoing guidance)
- What comparable alternatives look like (style guide maintenance, dedicated content design headcount, ad hoc review processes) and why they fall short

Tone: direct, businesslike, evidence-oriented. Assumes a reader who is skeptical but open.

**Format considerations**
- Both could live as .md files in a /platform/materials/ directory
- The team explainer could also be adapted as onboarding content delivered through the platform itself
- The leadership doc could be a template Keri customizes per client during setup
- Either could be built as a polished PDF for formal delivery

**Open questions**
- Should these be generic templates Keri customizes, or generated from client config during setup?
- Does the leadership doc include specific numbers (hours saved, headcount equivalent) or stay qualitative?
- Is there a version of the team explainer that lives inside the platform as onboarding content?
- Should Keri deliver these, or hand them to the client's content owner to deliver internally?

**Dependencies**
- Client config structure — the team explainer will reference domain names, roles, and contact owners
- Pricing model — the leadership doc needs to reflect actual engagement cost
- Setup flow — if these are generated during setup, they need to be part of the setup prompt output
