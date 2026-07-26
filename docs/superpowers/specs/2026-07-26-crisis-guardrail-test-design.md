# Crisis Guardrail Test — Design

- **Issue:** #25 — `test(crisis): guardrail for crisis UI and hotline reachability`
- **Date:** 2026-07-26
- **Roadmap slot:** Phase 1, 1c (runs in parallel with save-history opt-in #24)
- **Status:** Approved — ready for implementation plan

## Problem

The repo is about to grow a monetization roadmap (issues #23–#30: analytics, opt-in
signals, psychologist booking/referral/commission, optional accounts, premium billing).
Every one of those touches the same surfaces the crisis path lives in — the chat
experience, the psychologist cards, the directory. AGENTS.md declares crisis UX
**sacred**, but that rule is enforced only by convention today.

Concretely, there is a real gap: **no test currently asserts the `tel:119` hotline link
exists.** `crisis-takeover.test.tsx` checks the three referral options and the "orang
terdekat" link but not the 119 SEJIWA / Kemenkes RI hotline — the single most important
element. A refactor could silently remove it and the suite would stay green.

## Goal

Add one dedicated, hard-to-erode regression guardrail that locks the sacred crisis
invariants so no future monetization work can gate, delay, auto-dismiss, or remove the
crisis path. Close the `tel:119` assertion gap in the process.

## Non-goals (deliberately out of scope)

- **Fixing the standalone `/crisis` page.** It is currently a placeholder
  (`app/(marketing)/crisis/page.tsx` → "Segera hadir") with **no 119 link**. Guarding a
  hotline there would first require adding one — that is feature work. Flagged as a
  follow-up below, not done here.
- **`CrisisFab` presence/route.** The global floating button
  (`components/layout/crisis-fab.tsx` → `/crisis`) is a global entry point, not part of
  the live chat crisis flow. Deferred (scope confirmed: chat-flow only).
- **Replacing the placeholder detection heuristic.** `lib/chat/crisis-detection.ts` is a
  temporary regex; a real classifier is coming. The guardrail asserts a sacred *subset*
  of its behavior, not its completeness. The `TODO` comment about the backend classifier
  stays.

## Scope: the crisis surfaces this guardrail protects

Chat-flow only:

1. `components/chat/crisis-banner.tsx` — shown on **high** risk. Has `tel:119`
   ("Hubungi 119 SEJIWA"), `role="alert"`, 3-psikolog list.
2. `components/chat/crisis-takeover.tsx` — shown on **critical** risk. Has `tel:119`
   ("119" + "SEJIWA · Kemenkes RI"), `role="alertdialog"`, locks the chat, explicit
   resume button only.
3. `lib/chat/crisis-detection.ts` — `detectCrisis()` heuristic.
4. `components/chat/chat-experience.tsx` — wiring: critical → takeover **before**
   streaming; high → banner; takeover aborts the stream and disables the composer.

## Design

### File & structure

- **New file:** `__tests__/crisis/crisis-guardrail.test.tsx`
- Prominent header comment marking the file as sacred, referencing issue #25 and the
  AGENTS.md "Crisis UX is sacred" section, and stating the invariants must hold
  regardless of monetization work (#23–#30).
- **Self-contained:** the file must stand on its own even if every other crisis test is
  deleted. Some assertions therefore intentionally overlap existing tests
  (`crisis-takeover.test.tsx`, `crisis-detection.test.ts`, `chat-experience.test.tsx`) —
  that redundancy is the point of a guardrail, not a smell.
- Follows existing test conventions: `@testing-library/react`,
  `@testing-library/user-event`, and the `streamChat` mock pattern already used in
  `chat-experience.test.tsx`.

### package.json

Add a runnable test script (there is none today):

```json
"test": "jest"
```

A guardrail that CI cannot run is not a guardrail. No other script changes.

### The invariants (test cases), grouped

**Group A — 119 SEJIWA / Kemenkes RI hotline is always reachable** (closes the gap)

- A1. `CrisisTakeover` renders a link with `href="tel:119"` whose accessible name
  contains both "119" and "SEJIWA".
- A2. `CrisisBanner` renders a link with `href="tel:119"` labeled "Hubungi 119 SEJIWA".

**Group B — Detection is never gated and never delayed**

- B1. `detectCrisis()` returns `'critical'` for explicit suicidal text (e.g.
  "aku pengen mati") and `'high'` for crisis-adjacent text (e.g. "aku capek sama hidup").
  Sacred subset — cannot be silently dropped.
- B2. In `ChatExperience`, sending critical text shows the takeover
  (`role="alertdialog"`) **immediately, with `streamChat` called 0 times** — proves the
  crisis UI never waits on AI streaming ("never delayed").
- B3. The whole flow runs with **no auth/login setup**, proving the crisis path is
  reachable anonymously and is never paywalled.

**Group C — Crisis UI is never auto-dismissed**

- C1. Render `CrisisTakeover`, advance timers well past any plausible timeout (jest fake
  timers), assert it is **still present**. The only exit is the explicit "Aku aman
  sekarang, lanjut ngobrol" resume button (a user action) — no timer-based dismissal may
  ever be added.

**Group D — Takeover locks the ordinary chat path**

- D1. While the takeover is active, the composer textarea and the "Kirim pesan" button
  are disabled, and sending is a no-op — normal or monetization flow cannot pre-empt or
  bypass an active crisis takeover.

### Test approach notes

- Group A tests render the components in isolation (as `crisis-takeover.test.tsx` does).
- Group B/D tests drive `ChatExperience` through the mood → disclaimer → chat entry
  (reuse the `enterChat` helper pattern) and mock `streamChat`.
- B2's "no stream" assertion mirrors the existing "shows the takeover immediately"
  test: `mockedStreamChat` throws if called, and we assert it was called 0 times.
- C1 uses `jest.useFakeTimers()` around an isolated `CrisisTakeover` render; the
  component has no dismissal timer today, so the test asserts the *absence* of one and
  will fail if a future change introduces auto-dismiss.
- Group C also includes a parent-level test that drives `ChatExperience` into the
  takeover and advances fake timers (via `userEvent.setup({ advanceTimers })`), asserting
  the takeover persists and the composer stays disabled — this catches an auto-dismiss
  introduced in the reducer/parent (where monetization wiring will live), not just in the
  leaf component.

## Definition of done

- `__tests__/crisis/crisis-guardrail.test.tsx` exists with Groups A–D and the sacred
  header comment.
- `package.json` has `"test": "jest"`.
- `npm test -- crisis-guardrail` is green, and the full `npm test` shows no NEW
  failures beyond the pre-existing `landing/`/`layout/` copy-drift suites (tracked
  separately in #31 — out of scope here).
- No changes to any `app/` or `components/` crisis behavior — test + script only.
- The `crisis-detection.ts` backend-classifier `TODO` is left untouched.

## Follow-ups (out of scope, logged here)

- The `/crisis` standalone page needs a real 119 SEJIWA hotline before it can be guarded.
- `CrisisFab` presence/route could get a lightweight guardrail later.
