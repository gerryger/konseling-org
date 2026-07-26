# Execution Plan — Phase 1 Slice 1a: Anonymous Content-Free Retention Instrumentation
**Date:** 2026-07-26
**Status:** Proposed — target design for a single PR-sized slice, not yet implemented
**Source docs:**
- `docs/superpowers/plans/2026-07-26-konseling-monetization-roadmap.md` (Phase 1, slice 1a)
- `docs/superpowers/specs/2026-07-26-konseling-monetization-design.md` (§8 "instrument first", §9 risks)
- `docs/superpowers/plans/2026-07-26-konseling-monetization-issues.md` (issue #1)

This plan covers **only the first Phase 1 slice**. The "simpan riwayat" opt-in signal
(slice 1b) and the crisis-path guardrail test (slice 1c) are separate issues and out of
scope here.

---

## 1. Goal

Ship the app's first retention instrumentation so future monetization decisions are
evidence-based, per the spec's "Days 0–30: instrument first". Capture three anonymous,
content-free signals:

1. **session start** — the user reached the companion chat this visit
2. **return visit** — this visit follows a prior visit by the same anonymous device
3. **mood check-in usage** — the user completed (or skipped) the mood check-in

Nothing else. No chat content, no message text, no PII.

---

## 2. Existing behavior (do not change)

Confirmed by codebase exploration — this is what exists today:

- **No analytics/telemetry of any kind exists.** This slice is greenfield.
- Chat lives in `components/chat/chat-experience.tsx`, a 3-phase state machine
  (`'mood' | 'disclaimer' | 'chat'`). Reaching phase `'chat'` is the natural session-start
  boundary. The mood value from the mood screen is currently **discarded** in
  `handleMoodContinue`.
- Mood check-in is the first screen (`components/chat/mood-screen.tsx`, `MoodScreen`).
  "Use" = clicking **Lanjutkan** after selecting one of 5 moods
  (`senang | biasa | lelah | cemas | hancur`), or **Lewati** to skip.
- The only persisted flag today is `konseling.disclaimerAccepted` (localStorage). The
  `konseling.` prefix is the naming convention to follow. No `sessionId`/visit concept exists.
- Crisis handling (`lib/chat/crisis-detection.ts`, banner/takeover in `chat-experience.tsx`)
  drives UI only and records nothing. **This slice must not touch it.**
- Supabase clients exist (`lib/supabase/`) but are entirely unused, anon-key only, with no
  tables and no migrations directory.
- Tests: Jest 30 + React Testing Library, in `__tests__/` mirroring source. Run via
  `npx jest`. Follow `__tests__/components/chat/chat-experience.test.tsx`.

## 3. Proposed work (this slice)

A thin, best-effort, fire-and-forget instrumentation layer plus one persistence sink.

### New files
- `lib/analytics/events.ts` — event type union + `emitEvent()` (best-effort, never throws,
  never blocks UI). Exactly three event names; a strict allowlist of fields.
- `lib/analytics/anon-id.ts` — SSR-guarded helpers for an anonymous visitor token, a
  per-visit session id, and return-visit detection, all via `localStorage`/`sessionStorage`
  under the `konseling.` prefix.
- `app/api/events/route.ts` — `POST` sink. Validates against the field allowlist, rejects
  any unexpected field, and inserts one row per event into Supabase.
- `supabase/migrations/<ts>_retention_events.sql` — new table + RLS anon-insert policy
  (new directory; none exists yet).

### Edited files
- `components/chat/chat-experience.tsx` — emit `session_start` once when phase becomes
  `'chat'` (a `useEffect` guarded to fire once); emit `return_visit` on mount when a prior
  visit is detected; emit `mood_checkin` from `handleMoodContinue` using the already-passed
  mood argument (which is otherwise discarded).

No changes to crisis code, no changes to the chat streaming path, no new runtime deps.

---

## 4. Event & data model

### Event names (closed set)
| Event | Fired when | Payload beyond envelope |
|---|---|---|
| `session_start` | user reaches chat phase `'chat'` | none |
| `return_visit` | on load, prior visit by same visitor token detected | none |
| `mood_checkin` | user clicks Lanjutkan or Lewati on the mood screen | `mood`: one of the 5 enum buckets or `"skipped"` |

### Shared envelope (every event)
- `event`: one of the three names above
- `visitorId`: opaque random token (e.g. `crypto.randomUUID()`), persisted in
  `localStorage` under `konseling.visitorId`. Rotatable, not linked to identity → not PII.
- `sessionId`: opaque random token per visit, in `sessionStorage` under `konseling.sessionId`.
- `ts`: client timestamp (ISO string), for return-visit math and ordering.

### Return-visit detection
- `konseling.lastVisitAt` holds the previous visit timestamp.
- On load: if `lastVisitAt` exists and the gap exceeds a threshold (**propose 30 minutes**,
  configurable constant), emit `return_visit`; then overwrite `lastVisitAt` with now.

### Storage keys (all `konseling.` prefixed)
`konseling.visitorId`, `konseling.sessionId`, `konseling.lastVisitAt`.

### Supabase table `retention_events`
Columns: `id` (uuid pk), `event` (text), `visitor_id` (text), `session_id` (text),
`mood` (text, nullable), `created_at` (timestamptz default now()).
RLS: anon `INSERT` only, no `SELECT` for anon. **No column ever holds message text.**

---

## 5. Privacy guarantees (hard requirements)

- **No chat content, ever** — no message text, no composer input, no crisis phrases. The
  only free-form-ish value is `mood`, and it is constrained to a 5-value enum + `"skipped"`.
- The `/api/events` endpoint **rejects** any request containing a field outside the
  allowlist (e.g. `content`, `text`, `message`) rather than silently dropping it, so a
  future careless caller fails loudly in tests.
- `visitorId` is a random opaque token with no link to identity, email, or IP-derived data
  — anonymous by default, per AGENTS.md §4/§5.
- `emitEvent` failures are swallowed; instrumentation must never surface an error, block
  the UI, or delay crisis UX (spec §9 risks #1 and #5).

---

## 6. Build order

1. `lib/analytics/anon-id.ts` — visitor/session id + return-visit helpers (SSR-guarded).
2. `lib/analytics/events.ts` — event union, allowlist, best-effort `emitEvent()` transport.
3. `app/api/events/route.ts` — validate + insert; add the Supabase migration.
4. Wire the three hook points in `chat-experience.tsx`.
5. Tests (see §8).

---

## 7. Acceptance criteria

- [ ] Reaching the chat phase emits exactly one `session_start` per visit.
- [ ] Completing the mood check-in emits one `mood_checkin` carrying the selected mood
      bucket; skipping emits `mood_checkin` with `mood: "skipped"`.
- [ ] A second visit after the threshold, same browser, emits `return_visit`; a first-ever
      visit does not.
- [ ] All three events carry `visitorId`, `sessionId`, and `ts`; none carries any message
      text or field outside the allowlist.
- [ ] `/api/events` rejects a payload containing a disallowed field (e.g. `content`).
- [ ] `emitEvent` never throws and never blocks: with the transport failing, chat and the
      crisis banner/takeover still render and function normally.
- [ ] No new keys outside the `konseling.` prefix; `konseling.disclaimerAccepted` behavior
      unchanged.
- [ ] `npx jest` green; `npm run lint` clean; no console errors on `/checkin` load.
- [ ] Crisis flow manually re-verified intact after the change (per AGENTS.md).

---

## 8. Tests

Mirror `__tests__/components/chat/chat-experience.test.tsx` (mock the transport the way the
suite already mocks `lib/api/chat-client`).

**Unit — `__tests__/lib/analytics/events.test.ts`**
- `emitEvent` builds an envelope with `visitorId`/`sessionId`/`ts` and the correct `event`.
- Given a failing transport, `emitEvent` resolves without throwing.
- The event union / allowlist rejects (or omits) any non-allowlisted field.

**Unit — `__tests__/lib/analytics/anon-id.test.ts`**
- First call creates and persists `konseling.visitorId`; second call returns the same value.
- Return-visit helper returns false with no `lastVisitAt`, true when the gap exceeds the
  threshold, and updates `lastVisitAt`.
- SSR-guarded: helpers no-op safely when `window` is undefined.

**Component — `__tests__/components/chat/retention-instrumentation.test.tsx`**
- Entering chat fires one `session_start` (mock transport asserted).
- Selecting a mood + Lanjutkan fires `mood_checkin` with that bucket; Lewati fires
  `mood_checkin` with `"skipped"`.
- With transport rejected, the chat still reaches the chat phase and the crisis banner
  still renders on a triggering message (guardrail that instrumentation never breaks UX).

**Route — `__tests__/app/api/events.test.ts`** (optional if route logic is thin)
- Valid event → 2xx; payload with a disallowed field → 4xx.

---

## 9. Out of scope / deferred

- Any dashboard, aggregation query, or reporting UI over the events.
- Consent/opt-out UI (anonymous-by-default here; a Do-Not-Track/opt-out surface is an open
  question, not required by the source docs).
- Slice 1b (`simpan riwayat` opt-in) and slice 1c (crisis-path guardrail test) — separate issues.
- Anything from Phase 2 (booking/referral) or Phase 3 (accounts, premium, billing).

## 10. Open questions (from source docs, resolve before/if needed)

- What exact metrics qualify as "retention is healthy enough" to unlock Phase 3? (Roadmap §8)
- Which user action best predicts willingness to pay — saved history, repeated use, or
  insights? This slice's `return_visit` + slice 1b's opt-in begin answering it. (Spec §11)
- Confirm the `retention_events` sink approach (Supabase anon-insert vs. a lighter endpoint)
  with whoever owns the data model — Supabase currently has no tables or service-role key.
