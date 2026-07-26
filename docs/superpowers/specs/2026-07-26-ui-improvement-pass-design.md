# Konseling.org — UI Improvement Pass (Bugs + Consistency + Targeted Polish)
**Date:** 2026-07-26
**Scope:** Existing pages only (`/`, `/checkin`). No new pages, no backend/content work.
**Branch:** `feature/ui-improvement-pass` (created off `main`)

---

## 1. Why

An audit of the current implementation against `DESIGN.md` found the design token system itself is solid, but downstream usage has drifted, and — more importantly — the primary conversion path is currently broken. This spec scopes a single pass that fixes the broken/dead interactions first, then tightens design-token consistency, then does light visual refinement on a small set of low-risk, high-visibility surfaces.

Explicitly **not** in scope: building out `/crisis`, `/psikolog`, `/psikolog/[id]` beyond their current placeholder state; footer links to pages that don't exist yet (FAQ, Komunitas, Legal); restyling the crisis banner/takeover (their wiring gets fixed, their visuals do not change). These all require new content/backend work, not a UI pass, and touching crisis visuals carries risk the AGENTS.md "Crisis UX is sacred" rule warns against taking on without dedicated review.

---

## 2. Phase 1 — Bug fixes

| # | Issue | Files | Fix |
|---|-------|-------|-----|
| 1 | Every primary CTA links to `/check-in` (hyphenated); actual route is `/checkin` — main conversion path 404s | `components/layout/navbar.tsx`, `components/layout/footer.tsx`, `components/landing/hero-section.tsx`, `components/landing/cta-section.tsx` | Change all hrefs to `/checkin` |
| 2 | Hero primary/secondary CTA buttons have no `href`/`onClick` | `components/landing/hero-section.tsx` | Primary → link to `/checkin`. Secondary ("Lihat cara kerjanya") → anchor scroll to `#solusi` |
| 3 | `CrisisBanner`'s `onContinue` is a hardwired no-op — "Lanjut ngobrol dulu" does nothing | `components/chat/chat-experience.tsx` (reducer + render), `components/chat/crisis-banner.tsx` (if prop wiring needs adjustment) | Add a `DISMISS_BANNER` reducer action (mirrors existing `DISMISS_TAKEOVER`); wire `onContinue={() => dispatch({ type: 'DISMISS_BANNER' })}` |
| 4 | Footer copyright hardcoded `© 2026` | `components/layout/footer.tsx` | Compute year via `new Date().getFullYear()` |

**Data flow for #3:** `showBanner: boolean` already exists in `ChatState`. `DISMISS_BANNER` sets it back to `false`, same shape as `DISMISS_TAKEOVER`. No new state shape, no migration concern.

**Not fixed in this phase** (documented, not silently dropped): `composer.tsx`'s "Pengaturan privasi" link (`href="#"`) — no privacy settings page exists yet; sidebar "Chat baru" / history items / "Login" buttons — inert, but wiring them needs actual session/history logic, not a UI fix; `PsikologCard`/`OrangTerdekatCard` "Hubungi" links inside the crisis takeover — need real psychologist/contact data, explicitly out of scope per §1.

---

## 3. Phase 2 — Token consistency

Replace hardcoded hex colors and ad hoc border-radius values in `app/(marketing)/landing.css` and `app/chat.css` with the existing CSS variable tokens from `app/globals.css`, where a component's current styling diverges from an established token (color) or the declared radius scale (4/8/12/16/24px, full).

- Scope this to values that have a clear token equivalent already defined (e.g. `#ffe4e0`/`#b42318` → `--color-crisis-soft`/`--color-crisis-strong`, per DESIGN.md's own color-usage rules). Don't invent new tokens in this pass.
- Radius values get snapped to the nearest step in the declared scale rather than left as arbitrary pixel values (9px/10px/18px/20px/22px → nearest of 8/16/24px or `pill` for buttons/chips per DESIGN.md's shape language).
- Leave the shadcn `Button` vs. `.k-btn` dual-system question alone — reconciling that is a bigger architectural call (Approach C from the design discussion) that wasn't chosen for this pass. Note it in the PR description as a follow-up, don't act on it.

---

## 4. Phase 3 — Targeted visual refinement

Surfaces in scope, chosen for high visibility + low risk (no crisis-path UI):
- Hero section (`components/landing/hero-section.tsx`)
- Problem + Features sections (`components/landing/problem-section.tsx`, `features-section.tsx`)
- Chat composer + quick-replies (`components/chat/composer.tsx`, `components/chat/quick-replies.tsx`) — excluding anything crisis-triggered

Use the `frontend-design` skill and `ui-ux-pro-max`'s search tool (design-system/style/typography/motion domains) to inform specific refinements — sharper hero composition, more intentional gradient/shadow use per DESIGN.md's existing "Soft Minimalism × Modern Empathic" language, spacing/motion polish. Refinements stay inside the existing token system from Phase 2 — no new colors, no new font, no new component patterns without flagging to the user first (per AGENTS.md §7).

---

## 5. Testing / verification

- Manually click every CTA touched in Phase 1 and confirm it lands somewhere real (no new dead links introduced).
- Manually re-trigger both crisis paths (Level 3 banner, Level 4 takeover) after the reducer change and confirm: banner still appears correctly, "Lanjut ngobrol dulu" now dismisses it, takeover behavior is unchanged, 119 link still present and unstyled-by-this-pass.
- Run `npm run lint` and existing tests in `__tests__/`; update snapshots only for components intentionally changed.
- Visual check in browser (light mode; dark mode is optional/not yet active per AGENTS.md) at mobile/tablet/desktop breakpoints for the three Phase 3 surfaces.
- No console errors on `/` and `/checkin` load.

---

## 6. Out of scope (follow-ups to flag, not build)

- `/crisis`, `/psikolog`, `/psikolog/[id]` real content
- Footer links to FAQ / Komunitas / Legal pages
- Crisis takeover "Hubungi" contact wiring (needs real psychologist data)
- Sidebar chat history / login functionality
- Reconciling shadcn `Button` vs `.k-btn` into one system
