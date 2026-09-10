# Decisions

Architectural and product decisions logged in real time. Most recent first.

---

## 2026-09-09 — Authentication

### Credentials stored in environment variables, not config
**Decision:** Hashed passwords live in Vercel environment variables (`AUTH_USER_<email_key>`), not in `config.json`.
**Reasoning:** Security-first approach — credentials never touch the repo. The multi-user complexity (one env var per user) is manageable at this platform's scale.
**Trade-off accepted:** Emergency credential rotation requires a Vercel dashboard visit rather than a code change. No runtime write-back possible.

### Bcrypt with cost factor 12
**Decision:** Passwords hashed with bcrypt at 12 rounds.
**Reasoning:** Computationally expensive enough to resist brute force; standard for this use case.

### JWT session tokens, 12-hour duration, httpOnly cookie
**Decision:** Sessions issued as JWTs stored in httpOnly, secure, sameSite=lax cookies.
**Reasoning:** Stateless — no database needed. httpOnly prevents JavaScript access to the token. 12 hours balances security and usability for a work tool.
**Token contains:** email, name, role, domains, clientKey.

### No forced password reset on first login
**Decision:** Dropped from scope.
**Reasoning:** Forced reset requires writing a new hash somewhere at runtime — impossible with env vars as the credential store. Mitigation: strong random passwords generated at setup and delivered securely (password manager share, Signal, etc.). Revisit when database layer is added.

### Rate limiting: 5 attempts per 15 minutes per IP
**Decision:** In-memory rate limiting on the login route.
**Reasoning:** Prevents brute force without requiring a database. Resets on redeployment — acceptable for this scale.
**Note:** In-memory means rate limit state is per-instance and doesn't persist across Vercel serverless function invocations. Sufficient for now.

### Email enumeration protection
**Decision:** Deliberate 500ms delay on failed lookups (user not found or no env var set).
**Reasoning:** Without the delay, an attacker could determine which email addresses are registered by comparing response times.

### Env var naming convention
**Decision:** `AUTH_USER_<email with @ → _AT_ and . → _DOT_>`
**Example:** `alex@acme.com` → `AUTH_USER_alex_AT_acme_DOT_com`
**Reasoning:** Readable, unambiguous, works within Vercel's env var naming constraints.

---

## Prior decisions (pre-2026-09-09)

See git history and earlier session summaries for decisions made before this log was started.
