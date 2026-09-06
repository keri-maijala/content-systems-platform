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
