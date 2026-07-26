# "Simpan riwayat" Opt-in Signal — Design

- **Issue:** #24 — `feat(chat): non-blocking simpan riwayat opt-in signal`
- **Date:** 2026-07-26
- **Roadmap slot:** Phase 1, 1b (runs in parallel with the crisis guardrail #25)
- **Status:** Approved — ready for implementation plan

## Problem

The roadmap needs evidence that users *want* their chat history saved before the
expensive account + database work (#29 optional Supabase account, #30 premium
continuity/sync) is justified. Today the sidebar shows mock history and a passive
"Login untuk simpan" hint, but nothing captures whether an anonymous user would
opt in to saving.

## Goal

Add a non-blocking, anonymous **opt-in signal** — a toggle that records a user's
willingness to have their chat history saved. This is a *demand signal*, not a
storage feature.

## Scope decision: signal vs. storage (why localStorage is correct here)

This came up explicitly during design. Two different things must not be conflated:

1. **The signal (#24, this work):** a single boolean — "this user would like their
   history saved." A one-boolean preference belongs in `localStorage`. No
   conversations, no PII.
2. **Actually saving chat history (later):** genuine persistence that localStorage
   cannot serve well. That is **#29** (optional Supabase account for saved history)
   and **#30** (cross-device sync, longer memory, export).

**Storage backend for the real feature (recorded, not built here):** use the
project's existing **Supabase (Postgres)** — `conversations` + `messages` tables,
or a `JSONB` column for document-style message blobs. A separate NoSQL store was
considered and rejected: it would add a second backend and auth model and a harder
sync story, with no payoff for this data shape. Supabase also provides auth + RLS +
realtime (needed for #30 sync) in one place. This decision lives in #29/#30, not #24.

The split is deliberate: capture demand cheaply now; build storage/auth only once
Phase 1 retention data justifies it (Phase 3 is hard-gated on that).

## Non-goals (out of scope)

- **Actual history persistence** — needs #29 (auth) + a real DB.
- **The real analytics emit** — needs #23 (retention instrumentation). #24 leaves a
  clean, content-free seam for it.
- **Server sync / accounts / login changes.** The existing "Login" affordance is
  untouched; the opt-in is independent of it.

## Design

### Form & placement

A toggle in the sidebar account block (`components/chat/sidebar.tsx`), directly
below the existing "Anonim / Login untuk simpan / Login" row.

```
SIDEBAR (bottom account block)
┌──────────────────────────┐
│ (A) Anonim               │
│     Login untuk simpan   │
│                  [Login] │
├──────────────────────────┤
│ Simpan riwayat    ( ●   )│  ← new toggle
│ Biar bisa dibuka lagi    │
│ nanti kalau kamu login   │
└──────────────────────────┘
```

- **Off by default** (it is opt-*in*).
- Implemented as an accessible `<button role="switch" aria-checked={on}>` with
  `aria-label="Simpan riwayat percakapan"` — keyboard-operable, no new UI dependency
  (project has only `components/ui/button.tsx`; a Switch primitive is not warranted
  for a single toggle).

### Behavior

- Toggling writes a local flag `konseling.saveHistoryOptIn` = `'true'` | `'false'`
  in `localStorage`, matching the existing `DISCLAIMER_KEY` pattern
  (`konseling.disclaimerAccepted`). localStorage (not sessionStorage) is chosen so
  the preference persists across visits — enabling #23 to later measure return-visit
  intent.
- On mount, the toggle reflects the stored flag (SSR-safe via a `typeof window`
  guard; initial render is "off", then synced in an effect to avoid hydration
  mismatch).
- **Passive and non-blocking:** it never gates, delays, or interrupts the chat, and
  it does nothing to the actual chat or history. No modal, no confirmation step.

### Analytics seam (for #23)

An isolated helper module `lib/chat/save-history-signal.ts`:

```ts
export const SAVE_HISTORY_KEY = 'konseling.saveHistoryOptIn'

export function getSaveHistoryOptIn(): boolean { /* localStorage read, SSR-safe */ }

export function setSaveHistoryOptIn(value: boolean): void {
  /* localStorage write, SSR-safe */
  // TODO(#23): emit an anonymous, content-free opt-in event here.
}
```

#24 stores the boolean only. #23 later wires the emit into the marked seam. The flag
is a boolean — **no chat content, no PII** ever passes through it.

### Files

- **Create:** `lib/chat/save-history-signal.ts` — key + `getSaveHistoryOptIn()` /
  `setSaveHistoryOptIn(bool)` + the #23 seam. SSR-safe; one clear responsibility.
- **Modify:** `components/chat/sidebar.tsx` — add the toggle to the account block,
  wired to the helper via local state + effect. (`'use client'` already present.)
- **Test:**
  - `__tests__/lib/chat/save-history-signal.test.ts` — default is off; set→get round-trips true and false; value persists in localStorage under the exact key.
  - `__tests__/components/chat/sidebar.test.tsx` — the switch renders with its accessible name; reflects a pre-set flag on mount; clicking toggles `aria-checked` and writes the flag; history/chat content is still rendered (the toggle gates nothing).

### Accessibility

Real `role="switch"` control with an accessible name and `aria-checked` state;
keyboard-operable; visible focus. Target: Lighthouse a11y ≥ 95 on the chat route
(project rule).

### Copy (Indonesian, aku/kamu, warm)

- Label: **"Simpan riwayat"**
- Sub-copy: **"Biar bisa dibuka lagi nanti kalau kamu login."**
- `aria-label`: **"Simpan riwayat percakapan"**

## Non-negotiables honored

- Anonymous by default; the flag is a boolean only (no PII).
- Chat stays fully usable — the opt-in never blocks or gates it; core companion is
  never paywalled.
- Does not touch crisis code — the #25 crisis guardrail is unaffected.

## Definition of done

- `lib/chat/save-history-signal.ts` exists with the key, get/set, and the #23 seam
  comment.
- The sidebar renders an accessible, off-by-default "Simpan riwayat" switch wired to
  the helper.
- New tests pass; `npm test -- save-history-signal` and the sidebar test are green.
- Full `npm test` shows no NEW failures beyond the pre-existing landing/layout
  drift (#31).
- No changes to chat/crisis behavior; no new dependency added.

## Follow-ups (out of scope, logged)

- **#23** — wire the opt-in event into the `setSaveHistoryOptIn` seam (content-free).
- **#29 / #30** — real history persistence + sync on Supabase (Postgres, with JSONB
  for message blobs if desired); the localStorage flag can seed the logged-in
  preference at migration time.
