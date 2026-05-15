<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Konseling.org

Mental health companion web app untuk pengguna Indonesia. **Bukan platform medis.** Aplikasi ini adalah pendamping awal — teman ngobrol berbasis AI saat user merasa stres, cemas, atau kesepian — dengan crisis detection yang mengeskalasi ke psikolog/hotline saat dibutuhkan.

**Tagline:** Pendamping awal sebelum ke psikolog.

## Mission

Banyak orang Indonesia (54+ juta) mengalami gangguan emosional, tapi hanya 8% yang mendapat bantuan. Sebagian besar tidak tahu harus mulai dari mana — atau takut/malu mencari psikolog. Konseling.org adalah on-ramp yang aman, anonim, dan mudah diakses sebelum mereka siap ke profesional.

## Important — what this product is NOT

- ❌ **Bukan pengganti psikolog.** Tidak mendiagnosa, tidak meresepkan, tidak menggantikan terapi.
- ❌ **Bukan layanan medis.** Tidak ada klaim kesehatan, tidak ada hubungan dokter-pasien.
- ❌ **Bukan chat sosial.** Bukan komunitas anonim, bukan teman virtual untuk hiburan.

Selalu pakai disclaimer ini di copy: _"Aku bisa nemenin refleksi awal — untuk diagnosis kamu butuh profesional."_

## Stack

- **Framework:** Next.js 15 (App Router) — **lihat catatan di atas, baca docs lokal sebelum coding**
- **UI:** React 19, Tailwind v4 (CSS-first via `@theme inline`), shadcn/ui (`components/ui/`)
- **Auth & DB:** Supabase (`lib/supabase/`) — implementation post-MVP
- **AI:** TBD (akan dipasang via Claude Code session terpisah)
- **Fonts:** Manrope (Google Fonts via `next/font/google`)
- **Icons:** lucide-react

## File structure (relevant)

```
app/
  globals.css            # Design tokens + Tailwind theme (DO NOT add brand colors here, see DESIGN.md)
  layout.tsx             # Root layout with Navbar + Footer + CrisisFab
  page.tsx               # Landing page
  checkin/page.tsx       # Chat experience (TO BE BUILT — see handoff-chat/)
  crisis/page.tsx        # Crisis resources standalone page
  psikolog/page.tsx      # Direktori psikolog
components/
  landing/               # Landing page sections (already implemented)
  layout/                # Navbar, Footer, CrisisFab
  chat/                  # Chat experience (TO BE BUILT)
  ui/                    # shadcn primitives
lib/
  supabase/              # Client + server helpers
  utils.ts               # cn() helper
DESIGN.md                # Design system (READ BEFORE EDITING UI)
AGENTS.md                # This file
```

## Working principles for AI agents

### 1. Read DESIGN.md before any UI change

Brand voice, color usage, component patterns, and crisis UX rules are all there. Do not introduce new colors, new font weights, or new component patterns without checking that file first. Tokens live in `app/globals.css` — use the existing variables; don't hardcode hex.

### 2. Crisis UX is sacred

Anything that affects crisis detection, crisis banners, the 119 button, or the takeover overlay needs extra care:

- Never remove the 119 SEJIWA hotline link.
- Never make crisis UI auto-dismiss.
- Never delay crisis UI to wait for AI streaming — it should appear ASAP when triggered.
- Test trigger paths manually after any change.
- The placeholder regex heuristic (`lib/chat/crisis-detection.ts` once built) is _temporary_ — never delete the TODO comment that says a real classifier is coming.

### 3. Indonesian-first copy

UI labels, buttons, error messages, and chat copy must be in **natural Indonesian** — _aku/kamu_ register, not formal _saya/Anda_. Tone: warm, validating, never clinical. See DESIGN.md "Brand Direction" for full guide.

English technical strings (mis. console errors, code comments, commit messages) are OK in English.

### 4. Anonimity by default

User flows should not _require_ login for core experience (chat, mood check-in, resources). Login is optional, untuk save history. Auth gates harus minimal.

### 5. Privacy hygiene

- Never log chat message content to console or analytics.
- Never send chat content to third-party services besides the configured AI backend.
- Crisis events boleh di-log (anonymous, aggregated) untuk product safety — tapi konten message sendiri tidak boleh.
- localStorage OK untuk session-scoped flags (disclaimer accepted, current session id). Tidak OK untuk PII.

### 6. Component patterns

- Functional components, hooks-only.
- Server components by default; mark `"use client"` only when needed (interactivity, hooks).
- Style via Tailwind utility classes + design tokens. Plain CSS in `app/globals.css` or section-specific files (mis. `app/landing.css`) saat utility classes terlalu verbose.
- Reusable primitives in `components/ui/`, feature components in `components/<feature>/`.
- Co-locate types in `types/` or feature folder.

### 7. Asking the user

When unsure about intent, ASK. Common ambiguity points:

- Adding a new section/page → confirm scope first.
- Removing existing copy → confirm before deleting.
- New external dependency → confirm before installing.
- Touching `globals.css` color tokens → confirm; biasanya jangan.

### 8. Testing

`__tests__/` punya beberapa component tests existing. Saat menambah komponen baru di `components/landing/` atau `components/layout/`, ikuti pola test yang sama. Untuk `components/chat/`, test difokuskan ke crisis detection logic + state transitions (bukan visual).

## How to work with handoff packages

Folder `handoff-chat/` (dan future handoff folders) berisi instruksi detail dari sesi design. Saat user bilang "lanjutkan dari handoff," prosedurnya:

1. Baca `<handoff-folder>/README.md` end-to-end dulu — jangan lompat ke implementation.
2. Eksplor `<handoff-folder>/mockup/` untuk lihat visual references — `Chat Page.html` dst.
3. Cross-check token mapping table di README dengan `app/globals.css` — pastikan semua warna mockup punya padanan project.
4. Cek "Definition of done" checklist — itu acceptance criteria.
5. Tanyakan ke user kalau ada poin di "Pertanyaan untuk klarifikasi" yang belum jelas.

Setelah implementation selesai, _boleh_ delete folder handoff-nya (atau pindahkan ke `docs/archive/`).

## Common pitfalls

- **Memakai font selain Manrope.** Project punya 1 font. Jangan tambah display font, mono font, dll tanpa diskusi.
- **Hardcode warna brand.** Pakai `var(--color-primary)` atau Tailwind class yang map ke token. Jangan tulis `#0042de` di JSX/CSS.
- **Menambahkan emoji ke headlines.** Emoji OK di chat & mood UI; tidak OK di hero copy.
- **Mengganti tone "aku/kamu" jadi "saya/Anda."** Jangan, kecuali user eksplisit minta.
- **Lupa update DESIGN.md.** Kalau tambah komponen pattern baru yang akan dipakai berulang, dokumentasikan di sana.

## Commands

```bash
npm run dev          # Local dev (default port 3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint check
```

## When you ship

- Verify Lighthouse a11y ≥ 95 on changed pages.
- Verify no console errors on page load.
- Verify dark mode (kalau project sudah aktifkan — saat ini optional via `data-theme="dark"` on `<html>`).
- Verify crisis flow masih intact (untuk perubahan di area chat).
- Update test snapshots kalau ada.

## AI Agent — system prompt
- Lives in: `lib/agent/system-prompt.ts`
- Language: Bahasa Indonesia santai
- DO NOT rewrite or shorten this prompt without explicit instruction
- The escalation scripts (risk 40-69 and 70+) are verbatim — preserve exact wording