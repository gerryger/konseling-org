# "Simpan riwayat" Opt-in Signal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a non-blocking, anonymous "Simpan riwayat" opt-in toggle to the chat sidebar that records willingness to save chat history as a local boolean flag — a demand signal for later account/DB work (#29/#30).

**Architecture:** A small SSR-safe helper module owns the `localStorage` flag and a content-free analytics seam for #23; the sidebar renders an accessible `role="switch"` button wired to it via local state + an on-mount effect. Real TDD (test first — the code does not exist yet). No new dependency; no changes to chat or crisis behavior.

**Tech Stack:** React 19 (`'use client'`), TypeScript, Jest 30 + `@testing-library/react` + `@testing-library/user-event`, Tailwind v4 + design tokens in `app/globals.css`, section CSS in `app/chat.css`. `@/` alias → repo root.

## Global Constraints

- localStorage key is exactly `konseling.saveHistoryOptIn` (matches the existing `konseling.disclaimerAccepted` pattern).
- The flag is a **boolean only** — never store chat content or any PII.
- The opt-in is **non-blocking**: it must never gate, delay, block, or interrupt the chat; core companion is never paywalled. Off by default (opt-*in*).
- Indonesian copy, `aku/kamu` register, warm — use the exact strings in this plan. Label "Simpan riwayat"; sub "Biar bisa dibuka lagi nanti kalau kamu login."; `aria-label` "Simpan riwayat percakapan".
- No new dependency (use a `role="switch"` button, not a new UI primitive). Style with existing design tokens only — **no hardcoded hex**.
- Do not touch any crisis code (`crisis-*.tsx`, `crisis-detection.ts`, crisis wiring in `chat-experience.tsx`). The #25 guardrail must stay green.
- Preserve the `// TODO(#23): …` seam comment in the helper.
- Success bar: new tests pass; full `npm test` shows no NEW failures beyond the pre-existing `landing/`+`layout/` drift (#31).

---

## File Structure

- **Create:** `lib/chat/save-history-signal.ts` — the key, `getSaveHistoryOptIn()`, `setSaveHistoryOptIn(bool)`, and the #23 seam. One responsibility; SSR-safe.
- **Create:** `__tests__/lib/chat/save-history-signal.test.ts` — helper unit tests.
- **Modify:** `components/chat/sidebar.tsx` — add the toggle to the `.cs-account` area, wired to the helper.
- **Modify:** `app/chat.css` — add `.cs-save-history` + `.cs-switch` styles (after the `.cs-account` block).
- **Create:** `__tests__/components/chat/sidebar.test.tsx` — sidebar toggle behavior + accessibility + non-gating.

---

## Task 1: Save-history signal helper (TDD)

**Files:**
- Create: `lib/chat/save-history-signal.ts`
- Test: `__tests__/lib/chat/save-history-signal.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `SAVE_HISTORY_KEY: string` (= `'konseling.saveHistoryOptIn'`), `getSaveHistoryOptIn(): boolean`, `setSaveHistoryOptIn(value: boolean): void`. Task 2's sidebar imports `getSaveHistoryOptIn` / `setSaveHistoryOptIn`; the sidebar test imports `SAVE_HISTORY_KEY`.

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/chat/save-history-signal.test.ts`:

```ts
import {
  SAVE_HISTORY_KEY,
  getSaveHistoryOptIn,
  setSaveHistoryOptIn,
} from '@/lib/chat/save-history-signal'

describe('save-history-signal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses the konseling-prefixed key', () => {
    expect(SAVE_HISTORY_KEY).toBe('konseling.saveHistoryOptIn')
  })

  it('defaults to false when nothing is stored', () => {
    expect(getSaveHistoryOptIn()).toBe(false)
  })

  it('round-trips true and false through localStorage', () => {
    setSaveHistoryOptIn(true)
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('true')
    expect(getSaveHistoryOptIn()).toBe(true)

    setSaveHistoryOptIn(false)
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('false')
    expect(getSaveHistoryOptIn()).toBe(false)
  })

  it('treats any non-"true" stored value as false', () => {
    localStorage.setItem(SAVE_HISTORY_KEY, 'garbage')
    expect(getSaveHistoryOptIn()).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- save-history-signal`
Expected: FAIL — cannot find module `@/lib/chat/save-history-signal`.

- [ ] **Step 3: Write the minimal implementation**

Create `lib/chat/save-history-signal.ts`:

```ts
// Local, anonymous opt-in signal: does the user want their chat history saved?
// This stores ONLY a boolean — never chat content, never PII. Real persistence
// arrives with accounts (#29) and premium continuity (#30).

export const SAVE_HISTORY_KEY = 'konseling.saveHistoryOptIn'

export function getSaveHistoryOptIn(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SAVE_HISTORY_KEY) === 'true'
}

export function setSaveHistoryOptIn(value: boolean): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SAVE_HISTORY_KEY, value ? 'true' : 'false')
  // TODO(#23): emit an anonymous, content-free opt-in event here (boolean only, no chat content, no PII).
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- save-history-signal`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/chat/save-history-signal.ts __tests__/lib/chat/save-history-signal.test.ts
git commit -m "feat(chat): add save-history opt-in signal helper (#24)"
```

---

## Task 2: Sidebar "Simpan riwayat" toggle (TDD)

**Files:**
- Test: `__tests__/components/chat/sidebar.test.tsx`
- Modify: `components/chat/sidebar.tsx`
- Modify: `app/chat.css`

**Interfaces:**
- Consumes: `getSaveHistoryOptIn` / `setSaveHistoryOptIn` from Task 1; `SAVE_HISTORY_KEY` in the test.
- Produces: an accessible switch with `role="switch"`, `aria-label="Simpan riwayat percakapan"`, `aria-checked` reflecting the flag.

- [ ] **Step 1: Write the failing test**

Create `__tests__/components/chat/sidebar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/chat/sidebar'
import { SAVE_HISTORY_KEY } from '@/lib/chat/save-history-signal'

describe('Sidebar — simpan riwayat opt-in', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the save-history switch, off by default', () => {
    render(<Sidebar isOpen />)
    expect(
      screen.getByRole('switch', { name: 'Simpan riwayat percakapan' }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('reflects a previously stored opt-in on mount', () => {
    localStorage.setItem(SAVE_HISTORY_KEY, 'true')
    render(<Sidebar isOpen />)
    expect(
      screen.getByRole('switch', { name: 'Simpan riwayat percakapan' }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles the flag on click without gating the chat history', async () => {
    const user = userEvent.setup()
    render(<Sidebar isOpen />)
    const sw = screen.getByRole('switch', { name: 'Simpan riwayat percakapan' })

    await user.click(sw)

    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('true')
    // The toggle gates nothing — the conversation list is still rendered.
    expect(
      screen.getByRole('navigation', { name: 'Daftar percakapan' }),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- sidebar`
Expected: FAIL — no element with `role="switch"` / accessible name "Simpan riwayat percakapan".

- [ ] **Step 3: Implement the toggle in the sidebar**

In `components/chat/sidebar.tsx`, change the imports at the top:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { MOCK_HISTORY } from '@/lib/chat/mock-data'
import { getSaveHistoryOptIn, setSaveHistoryOptIn } from '@/lib/chat/save-history-signal'
```

Add state + handlers at the start of the component body (right after the
`export function Sidebar(...) {` line):

```tsx
  const [saveHistory, setSaveHistory] = useState(false)

  useEffect(() => {
    setSaveHistory(getSaveHistoryOptIn())
  }, [])

  function handleToggleSaveHistory() {
    const next = !saveHistory
    setSaveHistory(next)
    setSaveHistoryOptIn(next)
  }
```

Then add the toggle block immediately AFTER the existing `.cs-account` `<div>…</div>`
and before the closing `</aside>`:

```tsx
        <div className="cs-save-history">
          <div className="info">
            <div className="n">Simpan riwayat</div>
            <div className="s">Biar bisa dibuka lagi nanti kalau kamu login.</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={saveHistory}
            aria-label="Simpan riwayat percakapan"
            className={`cs-switch${saveHistory ? ' on' : ''}`}
            onClick={handleToggleSaveHistory}
          >
            <span className="cs-switch-thumb" aria-hidden="true" />
          </button>
        </div>
```

- [ ] **Step 4: Add the styles**

In `app/chat.css`, immediately AFTER the `.cs-account .login:hover { … }` rule
(the line `.cs-account .login:hover { background: var(--color-secondary-fixed-dim); }`),
insert:

```css

/* ============ SAVE HISTORY OPT-IN ============ */
.cs-save-history {
  padding: 12px 14px;
  border-top: 1px solid var(--color-outline-variant);
  display: flex;
  align-items: center;
  gap: 10px;
}
.cs-save-history .info { flex: 1; min-width: 0; }
.cs-save-history .info .n { font-size: 13px; font-weight: 700; color: var(--color-on-surface); }
.cs-save-history .info .s { font-size: 11px; color: var(--color-on-surface-variant); line-height: 1.3; }
.cs-switch {
  flex-shrink: 0;
  width: 40px;
  height: 24px;
  border-radius: 999px;
  border: 0;
  padding: 2px;
  background: var(--color-outline-variant);
  cursor: pointer;
  transition: background 120ms ease;
  display: flex;
  align-items: center;
}
.cs-switch.on { background: var(--color-primary); }
.cs-switch .cs-switch-thumb {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: var(--color-surface);
  transition: transform 120ms ease;
}
.cs-switch.on .cs-switch-thumb { transform: translateX(16px); }
.cs-switch:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- sidebar`
Expected: PASS (3 tests).

- [ ] **Step 6: Confirm no regressions across the suite**

Run: `npm test`
Expected: the new `sidebar` + `save-history-signal` suites pass, all crisis/chat/lib suites pass, and the only failures are the pre-existing `landing/`+`layout/` drift (#31) — no new failures. Record the totals.

- [ ] **Step 7: Commit**

```bash
git add components/chat/sidebar.tsx app/chat.css __tests__/components/chat/sidebar.test.tsx
git commit -m "feat(chat): add non-blocking simpan riwayat toggle to sidebar (#24)"
```

---

## Self-Review

- **Spec coverage:** helper + key + seam (Task 1); sidebar toggle, off-by-default, reflects flag, toggles, accessible, non-gating (Task 2); localStorage persistence (both); Indonesian copy (Task 2); no new dependency, tokens only (Task 2); DoD "no new failures" (Task 2 Step 6). All spec items mapped.
- **Placeholder scan:** all code blocks complete; the only `TODO` is the intentional #23 seam.
- **Type consistency:** `SAVE_HISTORY_KEY` / `getSaveHistoryOptIn` / `setSaveHistoryOptIn` names identical across Tasks 1–2 and both tests; `saveHistory` state boolean throughout.

## Definition of Done

- [ ] `lib/chat/save-history-signal.ts` exists with the key, get/set, and the #23 seam.
- [ ] Sidebar renders an accessible, off-by-default "Simpan riwayat" switch wired to the helper; chat/history not gated.
- [ ] `npm test -- save-history-signal` and `npm test -- sidebar` are green.
- [ ] Full `npm test` shows no NEW failures beyond the pre-existing landing/layout drift (#31).
- [ ] No crisis code touched; no new dependency; tokens only (no hardcoded hex).

## Follow-ups (out of scope)

- **#23** — wire the opt-in event into the `setSaveHistoryOptIn` seam.
- **#29 / #30** — real history persistence + sync on Supabase (Postgres, JSONB if desired); seed the logged-in preference from this flag at migration.
