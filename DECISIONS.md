

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

---

### Authentication model: username and password credentials
**Decision:** Authentication uses username and password credentials. Credentials are stored in a separate file per client — not in `config.json` and not in the GitHub repo. The credentials file lives in the deployment environment only.

**Context:** The app currently loads the first content owner from the config as the default "logged in" user — a placeholder that works for development but isn't real identity. Needed to decide how real authentication will work before building it.

**Reasoning:** Credentials-based auth is self-contained — no external dependencies, no client IT setup required, no SSO configuration needed. It's the right fit for the current stage. SSO (Google, Microsoft, Okta) is the likely long-term direction for production clients, but introduces external dependencies that aren't warranted yet.

**Key constraints:**
- Passwords must be hashed — never stored as plain text, not even in hashed form in the repo
- Credentials file belongs in the deployment environment, not version control
- The login endpoint must be rate-limited to prevent brute-force attempts
- Credentials must only travel over HTTPS
- The agent must never surface anything about a user's credentials

**Open questions deferred:** Who sets the initial password (Keri during setup vs. user on first login); session length. Likely: Keri sets initial password during setup, users can change it; 8-hour sessions.

**Future path:** SSO is the right eventual model for workplace clients who already have identity systems. The credentials model is a stepping stone, not the permanent answer.

---

### Client API keys: per-deployment environment variables
**Decision:** Each client provides their own Anthropic API key. That key is stored as an environment variable in their deployment — not in the repo, not in the config file, not in any shared system. Keri receives the key from the client during setup and configures it in their deployment environment.

**Context:** The question arose from the credentials discussion: if clients need their own LLM API access, where does that live and who manages it?

**Reasoning:** Per-client API keys mean billing stays with the client (their Anthropic account absorbs usage charges), Keri isn't subsidizing usage across a shared key, and each client's access is fully isolated. Storing it as an environment variable in their deployment keeps it out of version control and out of any shared system.

**Implication for deployment model:** This decision makes the one-deploy-per-client model necessary, not just preferable. A single shared deployment with URL param routing cannot support per-client API keys. The move from Option A (URL param) to Option B (env var per deployment) is now confirmed as the right production architecture.

**Current state:** The platform currently uses a single `ANTHROPIC_API_KEY` environment variable. This works for development. When real client instances are stood up, each gets their own deployment with their own key.

**User context awareness: role and domain passed to agent**
**Decision:** The current user's name, role, and assigned domains are passed to the agent as part of the system prompt at the start of every conversation. The agent uses this to tailor its responses — a content owner gets different guidance and options than a contributor.

**Context:** The agent previously had no awareness of who it was talking to — it applied the same behavior regardless of role.

**Reasoning:** Role-aware responses are core to the platform's permission model. A contributor should not be offered override options they don't have access to. A domain owner should have their responses scoped to their domains. Passing user context in the system prompt is the right mechanism — it's invisible to the user and shapes the agent's behavior from the first message.

**Current limitation:** The user context is currently populated from the config file (first content owner in the list), not from real authentication. This is a placeholder. When authentication is built, the same prop will be populated from the authenticated user's record — no structural change needed.
