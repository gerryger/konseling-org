# Crisis Guardrail Test Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one dedicated, hard-to-erode regression test that locks the sacred crisis invariants (119 SEJIWA reachability, never gated, never delayed, never auto-dismissed) so no future monetization work can break them.

**Architecture:** A single new Jest + Testing Library file at `__tests__/crisis/crisis-guardrail.test.tsx`, plus a runnable `test` script in `package.json`. The file is built up incrementally across tasks (Groups A–D). No application code changes — this is a test-and-script-only change. Each test group is proven non-vacuous with a temporary mutation-sanity-check (break the invariant → confirm the test fails → revert).

**Tech Stack:** Jest 30, `@testing-library/react`, `@testing-library/user-event`, `jest-environment-jsdom`, TypeScript, Next.js (via `next/jest`). The `@/` path alias resolves to repo root (see `jest.config.ts` `moduleNameMapper`).

## Global Constraints

- Never remove or weaken the `tel:119` SEJIWA / Kemenkes RI hotline link — it must always be present. (AGENTS.md "Crisis UX is sacred")
- Crisis UI must never auto-dismiss, never be gated behind auth/paywall, never be delayed to wait for AI streaming.
- This change is **test + `package.json` script only**. Do NOT modify any file under `app/` or `components/` as a deliverable. (Mutation-sanity-check steps edit app files temporarily, then revert with `git checkout --`.)
- Preserve the backend-classifier `TODO` comment in `lib/chat/crisis-detection.ts` — do not touch that file as a deliverable.
- Follow existing test conventions: `@/` alias imports, and the `streamChat` mock pattern from `__tests__/components/chat/chat-experience.test.tsx`.
- All Indonesian copy stays exactly as written; tests match against the existing strings verbatim.

---

## File Structure

- **Modify:** `package.json` — add `"test": "jest"` to the `scripts` block.
- **Create:** `__tests__/crisis/crisis-guardrail.test.tsx` — the guardrail. One file, four `describe` groups (A–D), built incrementally.

Reference (read-only, do not modify) — the components under guard:
- `components/chat/crisis-takeover.tsx` — critical-risk overlay; `role="alertdialog"`; `<a href="tel:119" aria-label="Hubungi hotline 119 SEJIWA — tersedia 24 jam, gratis">`; resume button "Aku aman sekarang, lanjut ngobrol →".
- `components/chat/crisis-banner.tsx` — high-risk banner; `role="alert"`; `<a href="tel:119">…Hubungi 119 SEJIWA</a>`; requires an `onContinue` prop.
- `lib/chat/crisis-detection.ts` — `detectCrisis(text): 'critical' | 'high' | 'none'`.
- `components/chat/chat-experience.tsx` — wires detection to UI: critical → takeover before streaming, aborts stream, disables composer.
- `components/chat/mood-screen.tsx` — entry screen; mood button `aria-label="Biasa — Datar"`, CTA "Lanjutkan".
- `components/chat/disclaimer-screen.tsx` — exports `DISCLAIMER_KEY`.

---

## Task 1: Make the test suite runnable

**Files:**
- Modify: `package.json` (the `scripts` object)

**Interfaces:**
- Consumes: nothing.
- Produces: an `npm test` command that runs `jest` over the whole suite. Every later task's "run the tests" step depends on this.

- [ ] **Step 1: Add the `test` script**

In `package.json`, the `scripts` block currently is:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
},
```

Change it to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest"
},
```

- [ ] **Step 2: Verify the existing suite runs green**

Run: `npm test`
Expected: PASS — all existing test files (landing, layout, chat, lib) pass. This confirms the runner is wired before we add the guardrail.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add npm test script (#25)"
```

---

## Task 2: Group A — 119 SEJIWA hotline is always reachable

This closes the real gap: no test asserts the `tel:119` link exists today.

**Files:**
- Create: `__tests__/crisis/crisis-guardrail.test.tsx`

**Interfaces:**
- Consumes: `npm test` (Task 1). `CrisisTakeover` (prop `onResume: () => void`), `CrisisBanner` (prop `onContinue: () => void`).
- Produces: the guardrail file with its header comment + `describe('Group A …')`. Later tasks append more `describe` blocks to the same file.

- [ ] **Step 1: Write the file with the sacred header and Group A**

Create `__tests__/crisis/crisis-guardrail.test.tsx`:

```tsx
/**
 * CRISIS GUARDRAIL — DO NOT WEAKEN. (issue #25)
 *
 * These invariants must hold regardless of ANY future monetization work
 * (issues #23–#30). See AGENTS.md → "Crisis UX is sacred".
 *
 *   A. The 119 SEJIWA / Kemenkes RI hotline is always reachable.
 *   B. Crisis detection is never gated and never delayed.
 *   C. Crisis UI is never auto-dismissed — only explicit user action closes it.
 *   D. An active takeover locks the ordinary chat path.
 *
 * The crisis path is also anonymous by design: this whole file drives the flow
 * with NO auth/login setup (there is no auth surface in the app yet). When
 * optional accounts land (#29), add an explicit "reachable while logged out"
 * assertion here.
 *
 * This file is intentionally self-contained and partly overlaps other crisis
 * tests. That redundancy is the point — the guardrail must survive even if the
 * other tests are deleted. Do not "DRY it up" by removing assertions.
 */
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CrisisTakeover } from '@/components/chat/crisis-takeover'
import { CrisisBanner } from '@/components/chat/crisis-banner'
import { ChatExperience } from '@/components/chat/chat-experience'
import { DISCLAIMER_KEY } from '@/components/chat/disclaimer-screen'
import { detectCrisis } from '@/lib/chat/crisis-detection'
import { streamChat } from '@/lib/api/chat-client'

jest.mock('@/lib/api/chat-client', () => ({
  streamChat: jest.fn(),
}))

const mockedStreamChat = streamChat as jest.MockedFunction<typeof streamChat>

describe('Group A — 119 SEJIWA hotline is always reachable', () => {
  it('takeover exposes a tel:119 link naming SEJIWA', () => {
    render(<CrisisTakeover onResume={jest.fn()} />)

    const link = screen.getByRole('link', { name: /119.*SEJIWA/i })
    expect(link).toHaveAttribute('href', 'tel:119')
  })

  it('banner exposes a tel:119 link to 119 SEJIWA', () => {
    render(<CrisisBanner onContinue={jest.fn()} />)

    const link = screen.getByRole('link', { name: /Hubungi 119 SEJIWA/i })
    expect(link).toHaveAttribute('href', 'tel:119')
  })
})
```

- [ ] **Step 2: Run Group A — expect PASS**

Run: `npm test -- crisis-guardrail`
Expected: PASS (2 tests). The app code already renders both links correctly.

- [ ] **Step 3: Mutation-sanity-check — prove the guard is real**

Temporarily break the takeover link: in `components/chat/crisis-takeover.tsx`, change `href="tel:119"` (line ~56) to `href="#"`.
Run: `npm test -- crisis-guardrail`
Expected: FAIL — "takeover exposes a tel:119 link" fails on the `toHaveAttribute` assertion.

Then break the banner link too: in `components/chat/crisis-banner.tsx`, change `href="tel:119"` (line ~27) to `href="#"`.
Run: `npm test -- crisis-guardrail`
Expected: FAIL — both Group A tests fail.

- [ ] **Step 4: Revert the mutations and confirm PASS**

```bash
git checkout -- components/chat/crisis-takeover.tsx components/chat/crisis-banner.tsx
```
Run: `npm test -- crisis-guardrail`
Expected: PASS (2 tests). Confirm no app files remain modified: `git status` shows only the new test file.

- [ ] **Step 5: Commit**

```bash
git add __tests__/crisis/crisis-guardrail.test.tsx
git commit -m "test(crisis): guard 119 SEJIWA hotline reachability (#25)"
```

---

## Task 3: Group B — detection is never gated and never delayed

**Files:**
- Modify: `__tests__/crisis/crisis-guardrail.test.tsx` (append a `describe` + a shared `enterChat` helper + `beforeEach`)

**Interfaces:**
- Consumes: `detectCrisis` (returns `'critical' | 'high' | 'none'`), `ChatExperience`, `DISCLAIMER_KEY`, `mockedStreamChat` (from Task 2).
- Produces: an `enterChat(user)` helper and a `beforeEach` reused by Group D.

- [ ] **Step 1: Append the helper, `beforeEach`, and Group B**

Add to `__tests__/crisis/crisis-guardrail.test.tsx` (after the Group A block):

```tsx
// Drives the mood → chat entry. Disclaimer is pre-accepted so we land on the
// composer. This is onboarding, NOT auth — the crisis path stays anonymous.
async function enterChat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Biasa — Datar' }))
  await user.click(screen.getByRole('button', { name: 'Lanjutkan' }))
  await screen.findByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
}

describe('Group B — detection is never gated and never delayed', () => {
  beforeEach(() => {
    localStorage.setItem(DISCLAIMER_KEY, 'true')
    mockedStreamChat.mockReset()
  })

  it('detects the sacred crisis subset', () => {
    expect(detectCrisis('aku pengen mati')).toBe('critical')
    expect(detectCrisis('lebih baik mati')).toBe('critical')
    expect(detectCrisis('aku capek sama hidup')).toBe('high')
    expect(detectCrisis('nggak ada harapan lagi')).toBe('high')
  })

  it('shows the takeover immediately on critical text — before any AI stream', async () => {
    const user = userEvent.setup()
    mockedStreamChat.mockImplementation(() => {
      throw new Error('stream must not start for a critical local crisis')
    })

    render(<ChatExperience />)
    await enterChat(user)

    await user.type(
      screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' }),
      'Aku pengen mati',
    )
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(mockedStreamChat).toHaveBeenCalledTimes(0)
  })
})
```

- [ ] **Step 2: Run Group B — expect PASS**

Run: `npm test -- crisis-guardrail`
Expected: PASS (Group A + Group B, 4 tests total).

- [ ] **Step 3: Mutation-sanity-check**

In `components/chat/chat-experience.tsx`, find this block in `handleSend`:

```tsx
      if (level === 'critical') {
        dispatch({ type: 'SHOW_TAKEOVER' })
        return
      } else if (level === 'high') {
        dispatch({ type: 'SHOW_BANNER', triggerMsgId: userMsg.id })
      }
```

Temporarily neutralize the critical branch by commenting it out so critical text falls through to streaming instead of an immediate takeover:

```tsx
      // if (level === 'critical') {
      //   dispatch({ type: 'SHOW_TAKEOVER' })
      //   return
      // } else
      if (level === 'high') {
        dispatch({ type: 'SHOW_BANNER', triggerMsgId: userMsg.id })
      }
```
Run: `npm test -- crisis-guardrail`
Expected: FAIL — "shows the takeover immediately …" fails (no `alertdialog`, and `streamChat` gets called / throws).

- [ ] **Step 4: Revert and confirm PASS**

```bash
git checkout -- components/chat/chat-experience.tsx
```
Run: `npm test -- crisis-guardrail`
Expected: PASS (4 tests). `git status` shows only the test file modified.

- [ ] **Step 5: Commit**

```bash
git add __tests__/crisis/crisis-guardrail.test.tsx
git commit -m "test(crisis): guard detection is never gated or delayed (#25)"
```

---

## Task 4: Group C — crisis UI is never auto-dismissed

**Files:**
- Modify: `__tests__/crisis/crisis-guardrail.test.tsx` (append a `describe`)

**Interfaces:**
- Consumes: `CrisisTakeover` (prop `onResume`), `act`, `userEvent` (all already imported in Task 2).
- Produces: nothing new for later tasks.

- [ ] **Step 1: Append Group C**

Add to `__tests__/crisis/crisis-guardrail.test.tsx`:

```tsx
describe('Group C — crisis UI is never auto-dismissed', () => {
  it('never dismisses the takeover on a timer', () => {
    jest.useFakeTimers()
    try {
      const onResume = jest.fn()
      render(<CrisisTakeover onResume={onResume} />)

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(10 * 60 * 1000) // 10 minutes
      })

      expect(onResume).not.toHaveBeenCalled()
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    } finally {
      jest.useRealTimers()
    }
  })

  it('closes only when the user clicks the explicit resume button', async () => {
    const user = userEvent.setup()
    const onResume = jest.fn()
    render(<CrisisTakeover onResume={onResume} />)

    await user.click(screen.getByRole('button', { name: /Aku aman sekarang/i }))

    expect(onResume).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run Group C — expect PASS**

Run: `npm test -- crisis-guardrail`
Expected: PASS (6 tests total).

- [ ] **Step 3: Mutation-sanity-check**

In `components/chat/crisis-takeover.tsx`, add an auto-dismiss timer inside the component body (just after the existing `useEffect` that focuses `resumeRef`):

```tsx
  useEffect(() => {
    const t = setTimeout(() => onResume(), 3000)
    return () => clearTimeout(t)
  }, [onResume])
```

Run: `npm test -- crisis-guardrail`
Expected: FAIL — "never dismisses the takeover on a timer" fails (`onResume` was called after advancing timers).

- [ ] **Step 4: Revert and confirm PASS**

```bash
git checkout -- components/chat/crisis-takeover.tsx
```
Run: `npm test -- crisis-guardrail`
Expected: PASS (6 tests). `git status` shows only the test file modified.

- [ ] **Step 5: Commit**

```bash
git add __tests__/crisis/crisis-guardrail.test.tsx
git commit -m "test(crisis): guard takeover is never auto-dismissed (#25)"
```

---

## Task 5: Group D — an active takeover locks the ordinary chat path

**Files:**
- Modify: `__tests__/crisis/crisis-guardrail.test.tsx` (append a `describe`)

**Interfaces:**
- Consumes: `ChatExperience`, `enterChat`, `DISCLAIMER_KEY`, `mockedStreamChat` (from Tasks 2–3).
- Produces: the complete guardrail file.

- [ ] **Step 1: Append Group D**

Add to `__tests__/crisis/crisis-guardrail.test.tsx`:

```tsx
describe('Group D — an active takeover locks the ordinary chat path', () => {
  beforeEach(() => {
    localStorage.setItem(DISCLAIMER_KEY, 'true')
    mockedStreamChat.mockReset()
    mockedStreamChat.mockImplementation(() => {
      throw new Error('stream must not start for a critical local crisis')
    })
  })

  it('disables the composer and send button while the takeover is active', async () => {
    const user = userEvent.setup()
    render(<ChatExperience />)
    await enterChat(user)

    await user.type(
      screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' }),
      'Aku pengen mati',
    )
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Kirim pesan' })).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run Group D — expect PASS**

Run: `npm test -- crisis-guardrail`
Expected: PASS (7 tests total).

- [ ] **Step 3: Mutation-sanity-check**

In `components/chat/chat-experience.tsx`, find the `Composer` render near the bottom:

```tsx
        <Composer
          value={composerValue}
          onChange={setComposerValue}
          onSend={() => handleSend(composerValue)}
          placeholder={chatState.showBanner ? 'Cerita pelan saja, sebanyak yang kamu mau...' : undefined}
          disabled={chatState.isStreaming || chatState.showTakeover}
        />
```

Temporarily change `disabled={chatState.isStreaming || chatState.showTakeover}` to `disabled={chatState.isStreaming}`.
Run: `npm test -- crisis-guardrail`
Expected: FAIL — "disables the composer …" fails (composer/send not disabled during takeover).

- [ ] **Step 4: Revert and confirm PASS**

```bash
git checkout -- components/chat/chat-experience.tsx
```
Run: `npm test -- crisis-guardrail`
Expected: PASS (7 tests).

- [ ] **Step 5: Confirm the guardrail is green and no regressions were introduced**

Run: `npm test -- crisis-guardrail`
Expected: PASS (7 tests). `git status` shows only the new test file present (no app files modified).

Then run the full suite to confirm no NEW failures: `npm test`
Expected: the same 8 pre-existing `landing/` + `layout/` copy-drift suites fail as before (28 tests) and nothing else — all crisis/chat/lib suites, including the new guardrail, pass. Those pre-existing failures are OUT OF SCOPE for #25 and tracked in a separate issue (see Follow-ups).

- [ ] **Step 6: Commit**

```bash
git add __tests__/crisis/crisis-guardrail.test.tsx
git commit -m "test(crisis): guard takeover locks the chat path (#25)"
```

---

## Definition of Done

- [ ] `__tests__/crisis/crisis-guardrail.test.tsx` exists with Groups A–D and the sacred header comment.
- [ ] `package.json` has `"test": "jest"`.
- [ ] `npm test -- crisis-guardrail` is green (7 tests), and the full suite shows no NEW failures beyond the pre-existing landing/layout copy-drift (tracked separately).
- [ ] No `app/` or `components/` crisis behavior changed (all mutations reverted; `git status` clean except the new test file across the branch).
- [ ] The `lib/chat/crisis-detection.ts` backend-classifier `TODO` is untouched.
- [ ] Each guardrail group was proven non-vacuous via its mutation-sanity-check.

## Follow-ups (out of scope — logged for later issues)

- **Stale landing/layout tests:** 8 suites (28 tests) fail on copy drift, pre-existing and unrelated to crisis. Tracked in #31; not fixed here.
- The standalone `/crisis` page (`app/(marketing)/crisis/page.tsx`) is a placeholder with no 119 link; add a real hotline before guarding it.
- `CrisisFab` presence/route could get a lightweight guardrail.
- When optional accounts (#29) land, add an explicit "crisis reachable while logged out" assertion to Group B.
