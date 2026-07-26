# Konseling.org — Monetization Issue List
**Date:** 2026-07-26
**Status:** Proposed — issue backlog for future implementation, not yet executed
**Source docs:**
- `docs/superpowers/specs/2026-07-26-konseling-monetization-design.md`
- `docs/superpowers/plans/2026-07-26-konseling-monetization-roadmap.md`

---

## How to read this

These are **proposed** GitHub issues derived from the monetization roadmap. None of this
is implemented yet. Each issue is labeled with its phase and follows the roadmap's
dependency order.

**Non-negotiable across every issue below:**
- Crisis support, crisis detection, and the 119 SEJIWA / Kemenkes RI path stay **free and untouched**.
- Retention and referral tracking is **anonymous** — no chat content, no PII.
- Nothing here gates the core companion chat behind a paywall.

**Existing today (not part of these issues):** anonymous companion chat, crisis
detection + banner + takeover, the 119 SEJIWA path, the psychologist directory display,
and Supabase client/server helpers. There are currently no payments, no subscription
tier, no booking commission, and no premium continuity features.

---

## Phase 1 — Prove trust & retention

### 1. `feat(analytics): anonymous content-free retention instrumentation`
**Phase 1 · foundational (lands first)**
Track anonymous retention signals — session start, return visit, mood check-in usage —
with zero chat content and zero PII. This is the evidence base for every later phase decision.
_Detailed execution plan: `docs/superpowers/plans/2026-07-26-konseling-phase1-retention-instrumentation-plan.md`._

### 2. `feat(chat): non-blocking simpan riwayat opt-in signal`
**Phase 1**
Add a non-blocking "simpan riwayat" opt-in using a local/session-scoped flag only, to
measure willingness to save history. Must never block or gate the chat.

### 3. `test(crisis): guardrail for crisis UI and hotline reachability`
**Phase 1**
Add a regression guardrail test asserting the crisis UI, takeover, and 119 SEJIWA hotline
path stay reachable regardless of any future monetization work.

---

## Phase 2 — Mission-aligned handoff revenue

### 4. `feat(psikolog): booking/referral CTA on directory cards`
**Phase 2 · prerequisite for attribution & commission**
Add a booking/referral CTA that hands off from the existing psychologist directory into a
booking or contact flow. Monetizes escalation to care, not distress.

### 5. `feat(psikolog): anonymous referral attribution for bookings`
**Phase 2 · depends on #4**
Track which booking originated from the app using anonymous attribution only — no chat
content, no PII — so referral economics can be measured.

### 6. `feat(psikolog): booking commission model decision + wiring`
**Phase 2 · depends on #4, #5**
Decide between referral fee, flat commission, or partner package, then wire the chosen
model. Includes an optional soft "dukung kami" supporter CTA framed as support, not access.

---

## Phase 3 — Light premium continuity (gated on healthy retention)

### 7. `feat(auth): optional account for saved history and sync`
**Phase 3 · prerequisite for all premium features**
Introduce an optional Supabase account for saved history; anonymous stays the default.
Do not start until Phase 1 retention data is healthy.

### 8. `feat(premium): continuity + IDR subscription (memory, insights, billing)`
**Phase 3 · depends on #7**
Ship premium continuity — cross-device sync, longer memory, mood trends, guided reflection
tiers — behind a low-friction QRIS/e-wallet IDR subscription with a supporter badge.
Premium is depth and convenience only; it never gates help.

---

## Guardrails carried by every issue

- Do not gate crisis support or the core companion chat behind payment.
- Do not use per-message or consumption pricing for emotional support.
- Do not block a distressed user with a rate limit.
- Do not monetize chat content with ads or targeting.
- Do not frame premium as "better support" or "unlock help now."
- Do not launch premium before retention proves out.
- Do not make accounts mandatory for basic use.
