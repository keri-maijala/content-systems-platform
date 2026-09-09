

---

## 2026-09-08

### Client key routing: URL param now, env var later
**Decision:** Client instances are identified by a `?client=` URL parameter (e.g., `yourapp.com/?client=demo`). The default when no param is present is `'demo'`. Moving to an environment variable per deployment (Option B) is deferred to when real client instances are stood up.

**Context:** Needed to define how the app knows which client it's serving. The agent route already accepted a `clientKey` parameter; the question was how the frontend surfaces it.

**Reasoning:** A URL param is the lowest-friction approach during active development — it lets us test multiple client configs by changing the URL without any redeployment. The env var approach (one deploy per client, key baked in at deploy time) is the right production model but adds overhead that isn't justified yet. The two approaches are a one-line swap — the prop names and POST body structure are identical either way.

**Alternatives considered:** Subdomain routing (e.g., `demo.contentsystems.co`) — rejected for now because it requires infrastructure (wildcard DNS, middleware) that isn't warranted at this stage. Env var only — rejected because it would require a redeployment every time we test a different client config.

---

### App startup states: loading, error, ready
**Decision:** The app has three explicit startup states. Loading: a quiet centered indicator shown while the client config fetches. Error: a clear "Client not found" message naming the key that failed, shown when no config exists for the given key. Ready: the full app renders only after config is confirmed.

**Context:** Before this change, the app would render with placeholder "…" values while fetching, and silently show blank fields if the client key was invalid. Neither state communicated what was happening.

**Reasoning:** Three explicit states make the app feel solid rather than fragile. The error state is particularly important as we add more client configs — an invalid URL should tell you clearly what went wrong, not just go blank. Holding the full render until config is ready prevents the flicker of placeholder text being replaced by real data.

**Alternatives considered:** Render immediately with placeholders — rejected because it produces a visible flicker and doesn't distinguish between "loading" and "failed."

---

### Client config loaded from API, not hardcoded
**Decision:** The app loads client name, user name, role, and domains from a `/api/client` route that reads the client's `config.json` at runtime. The hardcoded `DEMO_CONFIG` block in `page.tsx` has been removed.

**Context:** `page.tsx` previously had static values for user name, client name, role, and domains. These needed to come from the real config to make client routing meaningful.

**Reasoning:** Hardcoded values would mean the UI never actually reflects the real client config — the routing work would have no visible effect. Loading from the API means the nav, agent header, and any other UI elements that depend on client data are always accurate.

**Current limitation:** The app currently loads the first `content_owner` user in the config as the "logged in" user. This is a placeholder for real authentication, which is a later piece of work. It will be a clean swap when authentication is built — nothing in the current structure needs to change.

---

### Non-engineer explanation standard: "so what" framing for every change
**Decision:** Every code change is accompanied by a plain-language explanation of what changed and why it matters — written for a non-engineer product owner, not a developer. This is a standing agreement for all sessions.

**Context:** Keri is the product owner and primary decision-maker but is not an engineer. Technical explanations of what changed are not sufficient without the "so what" — what it means for the product, the user experience, or the build sequence.

**Reasoning:** Keeping Keri oriented at a product level — not just a code level — ensures that build decisions stay connected to product intent. It also makes the session record more useful: the session summaries and DECISIONS.md capture not just what was built but why it matters in context.

**Format:** Each change gets: what visibly changed (if anything), what invisibly changed, and what it means for what comes next.

---

### Decision logging: real-time during sessions, not reconstructed at close
**Decision:** DECISIONS.md is updated during sessions as decisions are made, not reconstructed from session summaries at close. Session summaries remain the session-level orientation record; DECISIONS.md is the fine-grained reasoning record.

**Context:** Earlier sessions logged decisions well, but today's session initially proceeded without updating DECISIONS.md in real time. The reasoning and context for several decisions would have been lost or flattened if not captured before session close.

**Reasoning:** The reasoning behind a decision is freshest at the moment it's made. Reconstructing it later from a summary introduces flattening and omission. DECISIONS.md is most valuable as a record of how the platform's thinking evolved — that requires capturing the moment, not summarizing it later.

**Going forward:** At natural pauses in each session, DECISIONS.md is updated before continuing to build. Session close includes a final review to confirm nothing was missed.
