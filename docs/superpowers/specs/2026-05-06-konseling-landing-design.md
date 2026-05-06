# Konseling.org — Landing Page Design Spec
**Date:** 2026-05-06  
**Scope:** Landing page (`/`) as first screen of the full Konseling.org platform  
**Source design:** Stitch project "Konseling.org Platform Design" (`projects/16904438348623397156`)

---

## 1. Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database / Auth / Storage | Supabase |
| Hosting | Vercel |

---

## 2. Project Structure

```
konseling-org/
├── app/
│   ├── layout.tsx                  # Root layout (Manrope font, metadata)
│   ├── page.tsx                    # Landing page (/)
│   ├── check-in/
│   │   └── page.tsx                # Placeholder
│   ├── crisis/
│   │   └── page.tsx                # Placeholder
│   ├── psikolog/
│   │   ├── page.tsx                # Directory placeholder
│   │   └── [id]/page.tsx           # Profile placeholder
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── landing/
│       ├── hero-section.tsx
│       ├── problem-section.tsx
│       ├── process-section.tsx
│       ├── safety-section.tsx
│       ├── features-section.tsx
│       └── cta-section.tsx
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser client (auth, realtime)
│       └── server.ts               # Server client (RSC, route handlers)
├── types/
│   └── index.ts
├── tailwind.config.ts              # Stitch design tokens
└── .env.local                      # Supabase credentials (not committed)
```

---

## 3. Design System (Tailwind Config)

Sourced directly from Stitch design tokens.

### Colors
```ts
primary: { DEFAULT: '#0042DE', container: '#335EF7' }
secondary: { DEFAULT: '#5E3BDB', container: '#7858F5' }
surface: {
  DEFAULT: '#F7F9FB',
  low: '#F2F4F6',
  container: '#ECEEF0',
  lowest: '#FFFFFF',
}
'on-surface': '#191C1E'
'on-surface-variant': '#434655'
outline: '#747687'
error: '#BA1A1A'
```

### Typography
Font: **Manrope** loaded via `next/font/google`.

| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| headline-xl | 40px | 800 | 1.2 | -0.02em |
| headline-lg | 32px | 700 | 1.3 | — |
| headline-md | 24px | 700 | 1.4 | — |
| body-lg | 18px | 400 | 1.6 | — |
| body-md | 16px | 400 | 1.6 | — |
| label-md | 14px | 600 | 1.2 | 0.05em |

### Spacing & Layout
- Base unit: 8px
- Container max-width: 1200px, gutter: 24px
- Section gap: 80px
- Card padding minimum: 24px

### Border Radius
`sm: 0.25rem` | `DEFAULT: 0.5rem` | `md: 0.75rem` | `lg: 1rem` | `xl: 1.5rem` | `full: 9999px`

### shadcn/ui Init
Base: `neutral`. CSS variables overridden with primary blue `#335EF7`.

---

## 4. Landing Page Sections

All sections are React Server Components. Only the `Navbar` requires a `"use client"` wrapper for sticky/scroll behavior.

### 4.1 Navbar
- **Layout:** Sticky top, `backdrop-blur-md`, white/translucent background
- **Left:** Logo (`Konseling.org` wordmark)
- **Center:** Nav links — Check-in, Crisis Help, Psikolog, Sumber Daya
- **Right:** `Akun Saya` (ghost button) + `Darurat` (pill button, `error-container` bg `#FFDAD6`, `on-error-container` text `#93000A`)

### 4.2 Hero Section
- **Layout:** Two-column grid, 80px top padding
- **Left column:** `headline-xl` tagline "Pendampingan Setia dalam Krisis", `body-lg` subtitle, two CTAs
  - Primary CTA: `Mulai Check-in` (solid primary blue, pill shape) → `/check-in`
  - Secondary CTA: `Pelajari Program` (ghost, pill shape) → `#process`
- **Right column:** Illustration placeholder (`<div>` with aspect ratio, replaced with asset later)
- **Background:** Full-bleed `surface` (`#F7F9FB`)

### 4.3 Problem Section
- **Heading:** `headline-lg` "Mengapa Pendampingan Itu Penting?"
- **Layout:** 2-column card grid
- **Cards:** Material icon (trending_up / query_stats) + statistic + supporting text
- **Card style:** `surface-container` background (`#ECEEF0`), `rounded-xl`, 24px padding

### 4.4 Process Section
- **Heading:** `headline-lg` "5 Langkah Menuju Pemulihan"
- **Layout:** Horizontal 5-step stepper (collapses to vertical on mobile)
- **Steps:** Check-in → Refleksi → Edukasi → Intervensi → Konseling
- **Step style:** Numbered circle (primary blue fill) + step name + short description, connected by horizontal line

### 4.5 Safety Section
- **Layout:** Centered, full-width band with `secondary-fixed` background (`#E6DEFF`)
- **Content:** Large italic pull-quote "Kenyamanan Anda adalah prioritas utama kami..."
- **Below quote:** 3 checklist items — anonimitas, filter krisis, enkripsi
- **Link:** "Baca Selengkapnya" ghost link with arrow icon

### 4.6 Features Section
- **Heading:** `headline-lg`
- **Layout:** 3-column card grid on white cards over surface background
- **Cards:** Icon in rounded/squircle container + title + description
- **Features:** 24/7 AI chatbot (card includes `Mulai Percakapan` primary CTA → `/check-in`), reflection library, support community

### 4.7 CTA Section
- **Layout:** Centered, full-bleed gradient band (primary blue `#335EF7` → secondary purple `#7858F5`)
- **Content:** Large `headline-lg` encouragement text + `Mulai Check-in Sekarang` white solid button → `/check-in`

### 4.8 Footer
- **Layout:** 4-column grid, dark `on-surface` background
- **Columns:** Brand + tagline | Navigation links | Legal links | Language selector + contact icons
- **Text:** `body-sm`, `label-md` for column headers
- **Bottom bar:** Copyright, policy links (Privacy, Terms, Crisis Resources, Contact)

---

## 5. Full-Stack Architecture

### Supabase Clients
- `lib/supabase/client.ts` — browser-side client, used in `"use client"` components for auth state and realtime subscriptions
- `lib/supabase/server.ts` — server-side client using cookies, used in React Server Components and route handlers (`app/api/`)

### Data Flow Pattern
- Server Components read from Supabase directly (no API hop needed)
- Client Components use the browser client only for auth and realtime
- Route handlers (`app/api/`) handle mutations and external webhooks

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
Set in `.env.local` locally and in the Vercel dashboard for production.

### Vercel Deployment
- Push to `main` branch → auto-deploy on Vercel
- Environment variables mirrored in Vercel dashboard
- No `vercel.json` needed — Next.js App Router is first-class on Vercel

### Landing Page Specifically
Fully static — no Supabase calls on `/`. Rendered as React Server Components with zero client-side JS except the sticky navbar scroll effect (single `"use client"` component).

---

## 6. Placeholder Screens (scaffolded, not implemented)

| Route | Screen |
|-------|--------|
| `/check-in` | Check-in Perasaan & Refleksi AI |
| `/crisis` | Crisis Mode - Bantuan Segera |
| `/psikolog` | Direktori Psikolog Profesional |
| `/psikolog/[id]` | Profil Detail Psikolog |

Each gets a minimal page file with a "Coming Soon" shell — same Navbar and Footer, blank content area — so routing works end-to-end from day one.
