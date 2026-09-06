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
