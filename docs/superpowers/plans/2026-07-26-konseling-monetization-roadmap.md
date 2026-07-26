# Konseling.org — Monetization Roadmap
**Date:** 2026-07-26  
**Status:** Proposed — roadmap for future implementation, not yet executed  
**Source spec:** `docs/superpowers/specs/2026-07-26-konseling-monetization-design.md`

---

## 1. Roadmap recommendation

**Keep crisis support and the core companion free forever.**

The recommended sequence is:

1. prove trust and retention with the free companion
2. monetize mission-aligned psychologist bookings / referrals first
3. add a light premium tier later for continuity and reflection features

This matches the monetization spec and keeps the product safe for a mental-health context.

---

## 2. Existing behavior vs proposed roadmap

### Existing today
- anonymous companion chat exists
- crisis detection, crisis banner, and takeover UX exist
- 119 SEJIWA / Kemenkes RI crisis path exists
- psychologist directory display exists
- Supabase client/server helpers exist
- no payments, no subscription tier, no booking commission, no premium continuity features

### Proposed roadmap
- add retention instrumentation without logging chat content
- add booking/referral monetization on top of the existing directory
- add optional premium account-based continuity features after retention proves out

---

## 3. Phase table

| Phase | Objective | Deliverables | Issue-sized slices |
|---|---|---|---|
| **Phase 1 — Prove trust & retention** | Confirm the free companion is actually used again and again. | Anonymous retention events, opt-in save-history signal, guardrail test for crisis path reachability. | 1) anonymous content-free analytics 2) non-blocking “simpan riwayat” opt-in 3) crisis-path guardrail test |
| **Phase 2 — Mission-aligned handoff revenue** | Monetize successful escalation to care, not distress. | Psychologist booking / referral flow, referral attribution, optional supporter CTA. | 1) booking CTA on psychologist directory 2) anonymous referral attribution 3) decide and wire booking commission model 4) optional supporter CTA |
| **Phase 3 — Light premium continuity** | Charge for depth and convenience, not access to help. | Optional accounts, sync, longer memory, mood trends, guided reflection, export, billing. | 1) optional Supabase account 2) cross-device sync + longer memory 3) mood trends 4) guided reflection library tiers 5) QRIS/e-wallet subscription |

---

## 4. Dependency order

```text
Phase 1: 1a → 1b, 1c can run in parallel
   ↓
Phase 2: 2a → 2b → 2c, with 2d independent
   ↓
Phase 3: 3a must land first, then 3b/3c/3d, then 3e billing
```

### Hard gates
- **Phase 3 should not start until Phase 1 retention data is healthy.**
- **3a accounts are the prerequisite** for premium sync/memory/billing.
- **2a booking flow is the prerequisite** for attribution and commission tracking.
- **1a instrumentation should land first** so future phase decisions are evidence-based.

---

## 5. Issue slices by phase

### Phase 1 issue slices
1. **Anonymous content-free retention instrumentation**
   - track session start, return visit, mood check-in usage
   - no chat content, no PII
2. **Non-blocking “simpan riwayat” opt-in signal**
   - local/session-scoped flag only
   - used to measure willingness to save history
3. **Crisis-path guardrail test**
   - verify crisis UI and hotline path remain reachable regardless of future monetization work

### Phase 2 issue slices
1. **Psychologist booking / referral CTA**
   - handoff from existing directory into booking or contact flow
2. **Anonymous referral attribution**
   - track which booking came from the app without storing chat content
3. **Booking commission model decision + implementation**
   - choose referral fee, flat commission, or partner package
4. **Soft supporter CTA**
   - optional “dukung kami” surface, framed as support not access

### Phase 3 issue slices
1. **Optional Supabase account for saved history**
   - anonymous stays default
2. **Cross-device sync + longer memory**
   - premium continuity features
3. **Mood trends and weekly/monthly insights**
4. **Guided journaling / reflection library tiers**
   - limited free sampler, full premium library
5. **QRIS / e-wallet subscription billing + supporter badge**
   - low-friction pricing in IDR

---

## 6. Suggested GitHub issue titles

1. `feat(analytics): anonymous content-free retention instrumentation`
2. `feat(chat): non-blocking simpan riwayat opt-in signal`
3. `test(crisis): guardrail for crisis UI and hotline reachability`
4. `feat(psikolog): booking/referral CTA on directory cards`
5. `feat(psikolog): anonymous referral attribution for bookings`
6. `feat(auth): optional account for saved history and sync`
7. `feat(premium): continuity features for memory and insights`
8. `feat(billing): IDR subscription via QRIS/e-wallet`

---

## 7. What not to do

- do not gate crisis support behind payment
- do not gate the core companion chat behind payment
- do not use per-message or consumption pricing for emotional support
- do not block a distressed user with a rate limit
- do not monetize chat content with ads or targeting
- do not frame premium as “better support” or “unlock help now”
- do not launch premium before retention proves out
- do not make accounts mandatory for basic use

---

## 8. Open questions to resolve later

- referral fee vs flat commission vs partner package
- whether to launch a supporter tier before premium
- whether to offer individual-only premium first or add caregiver/team plans later
- what exact metrics qualify as “retention is healthy enough” for Phase 3

---

## 9. Bottom line

This roadmap keeps the companion free and safe, earns first from mission-aligned handoff to professionals, and only adds premium once the product has proven real value and repeat use.
