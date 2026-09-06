# Discovery Process

The discovery process is a consulting engagement between Keri and the client. It produces a complete, sealed config directory. Each step below is required before handoff.

---

## Step 1: Define the primary content scope

Identify what kind of content the client actually produces. This determines which domains exist, who owns them, and how governance is structured.

Questions to answer:
- What are the primary content surfaces? (Marketing site, product UI, emails, documentation, social, etc.)
- Which of these are in scope for the platform at launch?
- Are there content areas that are out of scope now but may come in later?

Output: A defined list of content domains for this client.

---

## Step 2: Match ownership to domains

For each domain identified in Step 1, assign an owner. The owner is the person responsible for governance decisions, request resolution, and escalation within that domain.

Questions to answer:
- Who is responsible for each content domain?
- Is there a single owner per domain, or shared ownership?
- Who covers a domain if the primary owner is unavailable?

Output: A domain-to-owner mapping, ready for `config.json`.

---

## Step 3: Define users and roles

Identify everyone who will use the platform and assign them a role.

Three roles:
- **Content owner / admin** — the content professional. Full access, full override rights, all log visibility. Probably also the day-to-day content creator.
- **Domain owner** — owns a specific content area. Override rights and log visibility scoped to their domain only.
- **Contributor** — everyday user from any function. Creates and generates content within guardrails. No override rights, no log access.

Questions to answer:
- Who is the content owner / admin? (Usually one person, sometimes two.)
- Who are the domain owners? (One per domain identified in Step 1.)
- Who are the contributors? (Everyone else who will use the agent.)

Output: A user list with roles assigned, ready for `config.json`.

---

## Step 4: Configure governance and override permissions

For each domain, define what happens when the agent raises a governance denial.

Questions to answer:
- Can domain owners override governance denials within their domain?
- Are there any domains where overrides are never permitted?
- What is the override flagging threshold — how many overrides on the same item before admin is alerted?
- Who is notified when a flagging threshold is crossed?

Output: Override permissions and flagging thresholds per domain, ready for `config.json`.

---

## Step 5: Configure request routing

For each domain and request type, define where requests go and who is responsible for resolving them.

Questions to answer:
- Who resolves governance denial requests in each domain?
- Who resolves direct content requests in each domain?
- Are there stakeholders who should be informed but are not the primary resolver?
- Is escalation to Keri available? Under what conditions?

Output: A routing table per domain, ready for `config.json`.

---

## Step 6: Configure the digest

Define how and to whom the daily digest is delivered.

Questions to answer:
- Who receives the digest? (Admin always; domain owners optionally.)
- What is the delivery method? (Email, Slack, or other — TBD at platform level.)
- Should informational logs be included, or actionable and overrides only?

Output: Digest configuration, ready for `config.json`.

---

## Step 7: Configure voice and tone

Determine whether the client needs custom voice and tone or will use the Keri-defined default.

Questions to answer:
- Does the client have existing brand voice documentation?
- Does the default voice and tone fit their brand, or does it need to be replaced?
- If custom: work with the client to define their voice and tone. This replaces the default entirely.

Output: Voice and tone document (custom or confirmed default), committed to the client's config directory.

---

## Step 8: Build style guides and governance docs

Gather or draft any client-specific style guides, terminology lists, and governance rules.

Questions to answer:
- Does the client have existing style documentation? If so, convert it to `.md` format.
- Are there preferred and deprecated terms to govern?
- Are there domain-specific rules that override the base subjects in any area?

Output: Style guides and governance docs committed to `guides/` and `governance/` in the client's config directory.

---

## Step 9: Generate client key and test

Generate the client's unique key, configure their URL, and test the instance end to end before handoff.

Checklist:
- [ ] Client key generated
- [ ] Config directory sealed
- [ ] All roles and users confirmed
- [ ] Routing tested — requests reach the right owners
- [ ] Override flow tested — flagging works as configured
- [ ] Digest tested — delivery confirmed
- [ ] Agent tested across all active subjects and domains

---

## Step 10: Handoff

Onboard the client team to the agent UI. Lock setup mode. The instance is now live.

- [ ] Content owner / admin onboarded
- [ ] Domain owners onboarded
- [ ] Contributors onboarded (or onboarding plan confirmed)
- [ ] Setup mode locked
- [ ] Post-handoff support path confirmed (active engagement or structured request)
