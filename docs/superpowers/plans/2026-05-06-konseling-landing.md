# Konseling.org Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Konseling.org Next.js 14 project with full-stack infrastructure and implement the landing page as a pixel-faithful translation of the Stitch "Landing Page - Konseling.org" design.

**Architecture:** Next.js 14 App Router. All landing page sections are React Server Components (no data fetching = synchronous, fully testable with Jest). The Navbar is the only `"use client"` component (sticky scroll effect). Supabase clients are scaffolded but unused on the landing page. Four other screen routes are created as placeholder shells.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui (Button), Supabase (@supabase/supabase-js + @supabase/ssr), Vercel (target deployment), Jest + React Testing Library (tests), pnpm (package manager)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `tailwind.config.ts` | Stitch design tokens (colors, typography, spacing, radius) |
| Create | `app/globals.css` | shadcn/ui CSS vars overridden with Stitch primary blue |
| Create | `app/layout.tsx` | Root layout: Manrope font, Navbar, Footer, metadata |
| Create | `app/page.tsx` | Landing page: assembles all 6 section components |
| Create | `app/check-in/page.tsx` | Placeholder shell |
| Create | `app/crisis/page.tsx` | Placeholder shell |
| Create | `app/psikolog/page.tsx` | Placeholder shell |
| Create | `app/psikolog/[id]/page.tsx` | Placeholder shell |
| Create | `components/layout/navbar.tsx` | Sticky header, nav links, Darurat button (`"use client"`) |
| Create | `components/layout/footer.tsx` | 4-column footer, copyright bar |
| Create | `components/landing/hero-section.tsx` | 2-col split layout, 2 CTAs |
| Create | `components/landing/problem-section.tsx` | 2-col stat cards |
| Create | `components/landing/process-section.tsx` | 5-step horizontal stepper |
| Create | `components/landing/safety-section.tsx` | Centered quote + checklist |
| Create | `components/landing/features-section.tsx` | 3-col feature cards |
| Create | `components/landing/cta-section.tsx` | Full-bleed gradient CTA band |
| Create | `lib/supabase/client.ts` | Browser-side Supabase client |
| Create | `lib/supabase/server.ts` | Server-side Supabase client (cookies) |
| Create | `types/index.ts` | Shared TS types |
| Create | `jest.config.ts` | Jest + next/jest configuration |
| Create | `jest.setup.ts` | Import @testing-library/jest-dom matchers |
| Create | `.env.example` | Env variable template (not .env.local) |
| Create | `__tests__/components/layout/navbar.test.tsx` | Navbar tests |
| Create | `__tests__/components/layout/footer.test.tsx` | Footer tests |
| Create | `__tests__/components/landing/hero-section.test.tsx` | HeroSection tests |
| Create | `__tests__/components/landing/problem-section.test.tsx` | ProblemSection tests |
| Create | `__tests__/components/landing/process-section.test.tsx` | ProcessSection tests |
| Create | `__tests__/components/landing/safety-section.test.tsx` | SafetySection tests |
| Create | `__tests__/components/landing/features-section.test.tsx` | FeaturesSection tests |
| Create | `__tests__/components/landing/cta-section.test.tsx` | CTASection tests |

---

## Task 1: Scaffold Next.js Project

**Files:**
- Creates: all Next.js boilerplate files
- Modifies: nothing (fresh scaffold into existing directory)

- [ ] **Step 1: Run create-next-app in the project directory**

```powershell
pnpm create next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

If prompted "The directory contains files that could conflict. Continue? (y/N)", type `y`.

- [ ] **Step 2: Verify the scaffold succeeded**

```powershell
ls
```

Expected output includes: `app/`, `components/`, `public/`, `package.json`, `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`

- [ ] **Step 3: Verify dev server starts**

```powershell
pnpm dev
```

Expected: Server starts on http://localhost:3000. Verify in browser, then stop with Ctrl+C.

- [ ] **Step 4: Install additional dependencies**

```powershell
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

- [ ] **Step 5: Commit**

```powershell
git init
git add .
git commit -m "chore: scaffold Next.js 14 project with TypeScript, Tailwind, App Router"
```

---

## Task 2: Configure Tailwind with Stitch Design Tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace tailwind.config.ts with Stitch design tokens**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Stitch primary palette
        primary: {
          DEFAULT: "#0042DE",
          container: "#335EF7",
          fixed: "#DDE1FF",
          "fixed-dim": "#B8C4FF",
          "on-primary": "#FFFFFF",
          "on-container": "#F0F0FF",
        },
        // Stitch secondary palette
        secondary: {
          DEFAULT: "#5E3BDB",
          container: "#7858F5",
          fixed: "#E6DEFF",
          "fixed-dim": "#CABEFF",
          "on-secondary": "#FFFFFF",
          "on-container": "#FFFBFF",
        },
        // Surface system
        surface: {
          DEFAULT: "#F7F9FB",
          dim: "#D8DADC",
          bright: "#F7F9FB",
          lowest: "#FFFFFF",
          low: "#F2F4F6",
          container: "#ECEEF0",
          "container-high": "#E6E8EA",
          "container-highest": "#E0E3E5",
          tint: "#1A4DE7",
        },
        // Text colors
        "on-surface": "#191C1E",
        "on-surface-variant": "#434655",
        "inverse-surface": "#2D3133",
        "inverse-on-surface": "#EFF1F3",
        "inverse-primary": "#B8C4FF",
        // Utility
        outline: "#747687",
        "outline-variant": "#C4C5D8",
        // Error (used for Darurat button)
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A",
        error: "#BA1A1A",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "1.3", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      spacing: {
        "section": "80px",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0px 10px 30px rgba(0, 0, 0, 0.04)",
        nav: "0 1px 0 0 #E6E8EA",
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Verify Tailwind still compiles**

```powershell
pnpm dev
```

Expected: No CSS errors in terminal. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```powershell
git add tailwind.config.ts
git commit -m "chore: configure Tailwind with Stitch design tokens"
```

---

## Task 3: Initialize shadcn/ui and Update CSS Variables

**Files:**
- Creates: `components.json`, `lib/utils.ts`, `components/ui/button.tsx`
- Modifies: `app/globals.css`, `tailwind.config.ts` (shadcn appends CSS var colors)

- [ ] **Step 1: Initialize shadcn/ui**

```powershell
pnpm dlx shadcn@latest init --yes --base-color neutral
```

Expected: Creates `components.json`, updates `tailwind.config.ts` to add CSS variable colors, and updates `app/globals.css` with `:root` CSS variables.

- [ ] **Step 2: Add the Button component**

```powershell
pnpm dlx shadcn@latest add button
```

Expected: Creates `components/ui/button.tsx`.

- [ ] **Step 3: Override globals.css CSS variables with Stitch primary blue**

Find the `:root` block in `app/globals.css` (added by shadcn) and update the primary color variables. The full `:root` block should look like this (keep any other shadcn variables shadcn added, only change the values shown):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 33% 98%;       /* #F7F9FB */
    --foreground: 210 10% 11%;       /* #191C1E */
    --card: 0 0% 100%;               /* #FFFFFF */
    --card-foreground: 210 10% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 10% 11%;
    --primary: 225 93% 58%;          /* #335EF7 */
    --primary-foreground: 0 0% 100%; /* #FFFFFF */
    --secondary: 254 62% 55%;        /* #7858F5 */
    --secondary-foreground: 0 0% 100%;
    --muted: 210 20% 94%;
    --muted-foreground: 225 14% 31%;  /* #434655 */
    --accent: 230 100% 93%;          /* #DDE1FF */
    --accent-foreground: 225 93% 44%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 228 18% 88%;           /* #C4C5D8 */
    --input: 228 18% 88%;
    --ring: 225 93% 58%;             /* #335EF7 */
    --radius: 0.5rem;
  }
}
```

- [ ] **Step 4: Verify Button renders with primary blue**

```powershell
pnpm dev
```

Expected: Dev server starts without errors. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```powershell
git add app/globals.css components.json components/ui/ lib/utils.ts
git commit -m "chore: initialize shadcn/ui with Stitch primary blue CSS variables"
```

---

## Task 4: Set Up Supabase Clients and Environment Template

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `.env.example`, `types/index.ts`

- [ ] **Step 1: Create the browser-side Supabase client**

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create the server-side Supabase client**

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can't be set, safe to ignore
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create the environment template**

```
# .env.example
# Copy this to .env.local and fill in your Supabase project values
# Found at: https://supabase.com/dashboard/project/<your-project>/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 4: Create types/index.ts**

```ts
// types/index.ts
// Shared TypeScript types — add domain types here as screens are implemented

export type {}
```

- [ ] **Step 5: Copy env template to .env.local (with placeholder values)**

```powershell
Copy-Item .env.example .env.local
```

- [ ] **Step 6: Add .env.local to .gitignore (verify it's already there)**

Open `.gitignore` and confirm `.env.local` is listed. `create-next-app` adds it by default.

- [ ] **Step 7: Commit**

```powershell
git add lib/supabase/ types/ .env.example
git commit -m "chore: scaffold Supabase browser and server clients"
```

---

## Task 5: Set Up Jest + React Testing Library

**Files:**
- Create: `jest.config.ts`, `jest.setup.ts`
- Modify: `tsconfig.json` (add jest types), `package.json` (add test script)

- [ ] **Step 1: Create jest.config.ts**

```ts
// jest.config.ts
import type { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({ dir: "./" })

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
}

export default createJestConfig(config)
```

`setupFilesAfterEnv` runs after Jest's test framework is installed in the environment, making `expect` and all Jest globals available. This is the correct property for importing `@testing-library/jest-dom` matchers.

- [ ] **Step 2: Create jest.setup.ts**

```ts
// jest.setup.ts
import "@testing-library/jest-dom"
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, add to the `"scripts"` object:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Run the test suite to confirm setup works**

```powershell
pnpm test
```

Expected output:
```
No tests found, exiting with code 1
```
(No tests exist yet — this confirms Jest is configured and can be invoked.)

If you see `No tests found, exiting with code 0` instead, that's also acceptable.

- [ ] **Step 5: Commit**

```powershell
git add jest.config.ts jest.setup.ts package.json
git commit -m "chore: configure Jest with React Testing Library and next/jest"
```

---

## Task 6: Navbar Component

**Files:**
- Create: `__tests__/components/layout/navbar.test.tsx`
- Create: `components/layout/navbar.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/layout/navbar.test.tsx
import { render, screen } from "@testing-library/react"
import { Navbar } from "@/components/layout/navbar"

describe("Navbar", () => {
  it("renders the brand logo", () => {
    render(<Navbar />)
    expect(screen.getByText("Konseling.org")).toBeInTheDocument()
  })

  it("renders the Check-in nav link pointing to /check-in", () => {
    render(<Navbar />)
    const link = screen.getByRole("link", { name: "Check-in" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders all four navigation links", () => {
    render(<Navbar />)
    expect(screen.getByRole("link", { name: "Check-in" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Crisis Help" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Psikolog" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Sumber Daya" })).toBeInTheDocument()
  })

  it("renders the Darurat emergency button", () => {
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /Darurat/i })).toBeInTheDocument()
  })

  it("renders the Akun Saya account button", () => {
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /Akun Saya/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/layout/navbar.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/layout/navbar'"

- [ ] **Step 3: Implement the Navbar component**

```tsx
// components/layout/navbar.tsx
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

const navLinks = [
  { label: "Check-in", href: "/check-in" },
  { label: "Crisis Help", href: "/crisis" },
  { label: "Psikolog", href: "/psikolog" },
  { label: "Sumber Daya", href: "#sumber-daya" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-nav"
          : "bg-surface"
      )}
    >
      <nav className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-extrabold text-primary tracking-tight"
        >
          Konseling.org
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-semibold text-on-surface-variant"
          >
            Akun Saya
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-error-container text-on-error-container hover:bg-error-container/80 font-semibold text-sm px-4"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
            Darurat
          </Button>
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/layout/navbar.test.tsx
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/layout/navbar.tsx __tests__/components/layout/navbar.test.tsx
git commit -m "feat: add Navbar component with sticky scroll effect"
```

---

## Task 7: Footer Component

**Files:**
- Create: `__tests__/components/layout/footer.test.tsx`
- Create: `components/layout/footer.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/layout/footer.test.tsx
import { render, screen } from "@testing-library/react"
import { Footer } from "@/components/layout/footer"

describe("Footer", () => {
  it("renders the brand name", () => {
    render(<Footer />)
    expect(screen.getByText("Konseling.org")).toBeInTheDocument()
  })

  it("renders the copyright notice", () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 Konseling.org/)).toBeInTheDocument()
  })

  it("renders the Layanan section heading", () => {
    render(<Footer />)
    expect(screen.getByText("Layanan")).toBeInTheDocument()
  })

  it("renders the Check-in Perasaan service link", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Check-in Perasaan" })).toBeInTheDocument()
  })

  it("renders the Privasi legal link", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Privasi" })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/layout/footer.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/layout/footer'"

- [ ] **Step 3: Implement the Footer component**

```tsx
// components/layout/footer.tsx
import Link from "next/link"
import { Globe, Mail, Phone } from "lucide-react"

const serviceLinks = [
  { label: "Check-in Perasaan", href: "/check-in" },
  { label: "Crisis Help", href: "/crisis" },
  { label: "Direktori Psikolog", href: "/psikolog" },
  { label: "Sumber Daya", href: "#sumber-daya" },
]

const legalLinks = [
  { label: "Privasi", href: "#" },
  { label: "Ketentuan", href: "#" },
  { label: "Sumber Krisis", href: "#" },
]

const bottomLinks = ["Kebijakan Privasi", "Syarat & Ketentuan", "Kontak"]

export function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <p className="text-xl font-extrabold text-white mb-3">Konseling.org</p>
            <p className="text-sm text-outline leading-relaxed">
              Pendampingan setia dalam setiap langkah perjalanan kesehatan mental Anda.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Layanan
            </p>
            <ul className="space-y-2">
              {serviceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-outline-variant hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-outline-variant hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              Kontak
            </p>
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Website" />
              <Mail className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Email" />
              <Phone className="w-5 h-5 text-outline hover:text-white cursor-pointer transition-colors" aria-label="Telepon" />
            </div>
          </div>
        </div>

        <div className="border-t border-surface-dim/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-outline">© 2026 Konseling.org. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            {bottomLinks.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-outline hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/layout/footer.test.tsx
```

Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/layout/footer.tsx __tests__/components/layout/footer.test.tsx
git commit -m "feat: add Footer component with service, legal, and contact columns"
```

---

## Task 8: Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace app/layout.tsx with root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Konseling.org — Pendampingan Setia dalam Krisis",
  description:
    "Temukan kejelasan mental melalui check-in perasaan yang dipandu AI dan dukungan profesional psikolog bersertifikat Indonesia.",
  keywords: ["konseling", "psikolog", "kesehatan mental", "Indonesia", "check-in perasaan"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={manrope.variable}>
      <body className="bg-surface text-on-surface font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify the layout compiles and the dev server shows Navbar + Footer**

```powershell
pnpm dev
```

Open http://localhost:3000. Verify: Navbar with "Konseling.org" logo appears at top. Footer appears at bottom. Stop with Ctrl+C.

- [ ] **Step 3: Commit**

```powershell
git add app/layout.tsx
git commit -m "feat: set up root layout with Manrope font, Navbar, and Footer"
```

---

## Task 9: HeroSection Component

**Files:**
- Create: `__tests__/components/landing/hero-section.test.tsx`
- Create: `components/landing/hero-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/hero-section.test.tsx
import { render, screen } from "@testing-library/react"
import { HeroSection } from "@/components/landing/hero-section"

describe("HeroSection", () => {
  it("renders the main headline with correct text", () => {
    render(<HeroSection />)
    expect(
      screen.getByRole("heading", { level: 1, name: /Pendampingan Setia/i })
    ).toBeInTheDocument()
  })

  it("renders the subtitle text", () => {
    render(<HeroSection />)
    expect(screen.getByText(/kejelasan mental/i)).toBeInTheDocument()
  })

  it("renders primary CTA linking to /check-in", () => {
    render(<HeroSection />)
    const link = screen.getByRole("link", { name: "Mulai Check-in" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders secondary CTA linking to #process", () => {
    render(<HeroSection />)
    const link = screen.getByRole("link", { name: /Pelajari Program/i })
    expect(link).toHaveAttribute("href", "#process")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/hero-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/hero-section'"

- [ ] **Step 3: Implement HeroSection**

```tsx
// components/landing/hero-section.tsx
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-24 pb-20 bg-surface">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-4rem)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-headline-xl text-on-surface">
                Pendampingan Setia<br />dalam Krisis
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-[480px]">
                Temukan kejelasan mental melalui check-in perasaan yang dipandu AI
                dan dukungan profesional psikolog bersertifikat Indonesia.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-primary-container hover:bg-primary text-white px-8 font-semibold"
              >
                <Link href="/check-in">Mulai Check-in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-primary-container text-primary-container hover:bg-primary-container/5 px-8 font-semibold"
              >
                <Link href="#process">
                  Pelajari Program
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full aspect-square max-w-[480px] rounded-2xl bg-gradient-to-br from-primary-fixed to-secondary-fixed flex items-center justify-center">
              <p className="text-on-surface-variant text-sm font-medium">
                Illustration placeholder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/hero-section.test.tsx
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/hero-section.tsx __tests__/components/landing/hero-section.test.tsx
git commit -m "feat: add HeroSection with primary and secondary CTAs"
```

---

## Task 10: ProblemSection Component

**Files:**
- Create: `__tests__/components/landing/problem-section.test.tsx`
- Create: `components/landing/problem-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/problem-section.test.tsx
import { render, screen } from "@testing-library/react"
import { ProblemSection } from "@/components/landing/problem-section"

describe("ProblemSection", () => {
  it("renders the section heading", () => {
    render(<ProblemSection />)
    expect(
      screen.getByRole("heading", { name: /Mengapa Pendampingan Itu Penting/i })
    ).toBeInTheDocument()
  })

  it("renders the first stat card with correct stat value", () => {
    render(<ProblemSection />)
    expect(screen.getByText("19.9 Juta")).toBeInTheDocument()
  })

  it("renders the second stat card with correct ratio", () => {
    render(<ProblemSection />)
    expect(screen.getByText("1 : 300.000")).toBeInTheDocument()
  })

  it("renders both card titles", () => {
    render(<ProblemSection />)
    expect(screen.getByText(/Orang Dengan Gangguan Mental/i)).toBeInTheDocument()
    expect(screen.getByText(/Rasio Psikolog vs Penduduk/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/problem-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/problem-section'"

- [ ] **Step 3: Implement ProblemSection**

```tsx
// components/landing/problem-section.tsx
import { TrendingUp, BarChart2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ProblemCard {
  icon: LucideIcon
  stat: string
  title: string
  description: string
}

const problems: ProblemCard[] = [
  {
    icon: TrendingUp,
    stat: "19.9 Juta",
    title: "Orang Dengan Gangguan Mental",
    description:
      "Berdasarkan data Kemenkes 2023, hampir 20 juta penduduk Indonesia mengalami gangguan mental serius, namun lebih dari 90% tidak mendapatkan penanganan yang tepat.",
  },
  {
    icon: BarChart2,
    stat: "1 : 300.000",
    title: "Rasio Psikolog vs Penduduk",
    description:
      "Indonesia hanya memiliki sekitar 3.500 psikolog klinis untuk populasi 270 juta jiwa — jauh di bawah standar WHO yang merekomendasikan 1 psikolog per 30.000 penduduk.",
  },
]

export function ProblemSection() {
  return (
    <section className="py-section bg-surface">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-12 text-center">
          Mengapa Pendampingan Itu Penting?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map(({ icon: Icon, stat, title, description }) => (
            <div
              key={title}
              className="rounded-xl bg-surface-container p-6 flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-container" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">{stat}</p>
                <p className="text-base font-bold text-on-surface">{title}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/problem-section.test.tsx
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/problem-section.tsx __tests__/components/landing/problem-section.test.tsx
git commit -m "feat: add ProblemSection with Indonesian mental health statistics"
```

---

## Task 11: ProcessSection Component

**Files:**
- Create: `__tests__/components/landing/process-section.test.tsx`
- Create: `components/landing/process-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/process-section.test.tsx
import { render, screen } from "@testing-library/react"
import { ProcessSection } from "@/components/landing/process-section"

describe("ProcessSection", () => {
  it("renders the section heading", () => {
    render(<ProcessSection />)
    expect(
      screen.getByRole("heading", { name: /5 Langkah Menuju Pemulihan/i })
    ).toBeInTheDocument()
  })

  it("renders all five step names", () => {
    render(<ProcessSection />)
    expect(screen.getByText("Check-in")).toBeInTheDocument()
    expect(screen.getByText("Refleksi")).toBeInTheDocument()
    expect(screen.getByText("Edukasi")).toBeInTheDocument()
    expect(screen.getByText("Intervensi")).toBeInTheDocument()
    expect(screen.getByText("Konseling")).toBeInTheDocument()
  })

  it("renders step numbers 1 through 5", () => {
    render(<ProcessSection />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/process-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/process-section'"

- [ ] **Step 3: Implement ProcessSection**

```tsx
// components/landing/process-section.tsx
interface Step {
  number: number
  name: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    name: "Check-in",
    description: "Ekspresikan perasaan Anda melalui panduan AI yang empatik",
  },
  {
    number: 2,
    name: "Refleksi",
    description: "Dapatkan wawasan dan pola dari jurnal emosi Anda",
  },
  {
    number: 3,
    name: "Edukasi",
    description: "Akses pustaka artikel kesehatan mental terkurasi",
  },
  {
    number: 4,
    name: "Intervensi",
    description: "Sistem deteksi krisis yang otomatis memberikan bantuan segera",
  },
  {
    number: 5,
    name: "Konseling",
    description: "Terhubung dengan psikolog profesional yang tepat untuk Anda",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-section bg-surface-lowest">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-16 text-center">
          5 Langkah Menuju Pemulihan
        </h2>
        <div className="relative">
          <div
            className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-primary-container to-secondary-container"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
            {steps.map(({ number, name, description }) => (
              <div key={number} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white font-extrabold text-lg z-10 relative">
                  {number}
                </div>
                <div>
                  <p className="font-bold text-on-surface text-base mb-1">{name}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/process-section.test.tsx
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/process-section.tsx __tests__/components/landing/process-section.test.tsx
git commit -m "feat: add ProcessSection with 5-step recovery stepper"
```

---

## Task 12: SafetySection Component

**Files:**
- Create: `__tests__/components/landing/safety-section.test.tsx`
- Create: `components/landing/safety-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/safety-section.test.tsx
import { render, screen } from "@testing-library/react"
import { SafetySection } from "@/components/landing/safety-section"

describe("SafetySection", () => {
  it("renders the pull-quote", () => {
    render(<SafetySection />)
    expect(
      screen.getByText(/Kenyamanan Anda adalah prioritas utama/i)
    ).toBeInTheDocument()
  })

  it("renders all three safety points", () => {
    render(<SafetySection />)
    expect(screen.getByText("Anonimitas Terjaga")).toBeInTheDocument()
    expect(screen.getByText("Filter Krisis AI")).toBeInTheDocument()
    expect(screen.getByText("Enkripsi End-to-End")).toBeInTheDocument()
  })

  it("renders the Baca Selengkapnya link", () => {
    render(<SafetySection />)
    expect(
      screen.getByRole("link", { name: /Baca Selengkapnya/i })
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/safety-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/safety-section'"

- [ ] **Step 3: Implement SafetySection**

```tsx
// components/landing/safety-section.tsx
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"

interface SafetyPoint {
  title: string
  description: string
}

const safetyPoints: SafetyPoint[] = [
  {
    title: "Anonimitas Terjaga",
    description: "Tidak ada data identitas yang diperlukan untuk memulai",
  },
  {
    title: "Filter Krisis AI",
    description: "Sistem deteksi otomatis untuk melindungi pengguna berisiko tinggi",
  },
  {
    title: "Enkripsi End-to-End",
    description: "Semua percakapan dilindungi dengan enkripsi TLS 1.3",
  },
]

export function SafetySection() {
  return (
    <section className="py-section bg-secondary-fixed">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-10">
          <blockquote className="text-headline-md italic text-on-surface leading-[1.4]">
            &ldquo;Kenyamanan Anda adalah prioritas utama kami dalam setiap interaksi.&rdquo;
          </blockquote>

          <div className="space-y-4 text-left max-w-md mx-auto">
            {safetyPoints.map(({ title, description }) => (
              <div key={title} className="flex gap-3">
                <ShieldCheck
                  className="w-5 h-5 text-secondary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-on-surface text-sm">{title}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
          >
            Baca Selengkapnya
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/safety-section.test.tsx
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/safety-section.tsx __tests__/components/landing/safety-section.test.tsx
git commit -m "feat: add SafetySection with privacy and safety guarantees"
```

---

## Task 13: FeaturesSection Component

**Files:**
- Create: `__tests__/components/landing/features-section.test.tsx`
- Create: `components/landing/features-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/features-section.test.tsx
import { render, screen } from "@testing-library/react"
import { FeaturesSection } from "@/components/landing/features-section"

describe("FeaturesSection", () => {
  it("renders the section heading", () => {
    render(<FeaturesSection />)
    expect(
      screen.getByRole("heading", { name: /Fitur yang Mendukung/i })
    ).toBeInTheDocument()
  })

  it("renders all three feature titles", () => {
    render(<FeaturesSection />)
    expect(screen.getByText("Chatbot AI 24/7")).toBeInTheDocument()
    expect(screen.getByText("Pustaka Refleksi")).toBeInTheDocument()
    expect(screen.getByText("Komunitas Dukungan")).toBeInTheDocument()
  })

  it("renders the Mulai Percakapan CTA linking to /check-in", () => {
    render(<FeaturesSection />)
    const link = screen.getByRole("link", { name: "Mulai Percakapan" })
    expect(link).toHaveAttribute("href", "/check-in")
  })

  it("renders only one CTA button (on the chatbot card)", () => {
    render(<FeaturesSection />)
    expect(screen.getAllByRole("link", { name: "Mulai Percakapan" })).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/features-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/features-section'"

- [ ] **Step 3: Implement FeaturesSection**

```tsx
// components/landing/features-section.tsx
import Link from "next/link"
import { Bot, BookOpen, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  cta: { label: string; href: string } | null
}

const features: Feature[] = [
  {
    icon: Bot,
    title: "Chatbot AI 24/7",
    description:
      "Tersedia kapan saja, chatbot kami memberikan respons empatik berbasis evidence-based therapy untuk menemani Anda di momen sulit.",
    cta: { label: "Mulai Percakapan", href: "/check-in" },
  },
  {
    icon: BookOpen,
    title: "Pustaka Refleksi",
    description:
      "Ratusan artikel, panduan, dan latihan mindfulness yang dikurasi oleh psikolog berpengalaman Indonesia.",
    cta: null,
  },
  {
    icon: Users,
    title: "Komunitas Dukungan",
    description:
      "Bergabunglah dengan komunitas anonim yang saling mendukung, dipantau oleh moderator profesional.",
    cta: null,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-section bg-surface">
      <div className="container">
        <h2 className="text-headline-lg text-on-surface mb-12 text-center">
          Fitur yang Mendukung Perjalanan Anda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, cta }) => (
            <div
              key={title}
              className="bg-surface-lowest rounded-xl p-6 flex flex-col gap-4 shadow-card"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary-container" aria-hidden="true" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="font-bold text-on-surface text-base">{title}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {description}
                </p>
              </div>
              {cta && (
                <Button
                  asChild
                  size="sm"
                  className="rounded-full bg-primary-container hover:bg-primary text-white font-semibold w-fit mt-2"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/features-section.test.tsx
```

Expected: PASS — 4 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/features-section.tsx __tests__/components/landing/features-section.test.tsx
git commit -m "feat: add FeaturesSection with AI chatbot, reflection library, and community cards"
```

---

## Task 14: CTASection Component

**Files:**
- Create: `__tests__/components/landing/cta-section.test.tsx`
- Create: `components/landing/cta-section.tsx`

- [ ] **Step 1: Create the failing test**

```tsx
// __tests__/components/landing/cta-section.test.tsx
import { render, screen } from "@testing-library/react"
import { CTASection } from "@/components/landing/cta-section"

describe("CTASection", () => {
  it("renders the headline text", () => {
    render(<CTASection />)
    expect(screen.getByRole("heading", { name: /Bergabunglah dengan Ribuan Orang/i })).toBeInTheDocument()
  })

  it("renders the CTA button linking to /check-in", () => {
    render(<CTASection />)
    const link = screen.getByRole("link", { name: "Mulai Check-in Sekarang" })
    expect(link).toHaveAttribute("href", "/check-in")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
pnpm test __tests__/components/landing/cta-section.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/landing/cta-section'"

- [ ] **Step 3: Implement CTASection**

```tsx
// components/landing/cta-section.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary-container to-secondary-container">
      <div className="container text-center space-y-8">
        <h2 className="text-headline-lg text-white">
          Bergabunglah dengan Ribuan Orang yang<br />
          Telah Memulai Perjalanan Mereka
        </h2>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-white text-primary-container hover:bg-white/90 px-8 font-bold"
        >
          <Link href="/check-in">Mulai Check-in Sekarang</Link>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
pnpm test __tests__/components/landing/cta-section.test.tsx
```

Expected: PASS — 2 tests passing

- [ ] **Step 5: Commit**

```powershell
git add components/landing/cta-section.tsx __tests__/components/landing/cta-section.test.tsx
git commit -m "feat: add CTASection with full-bleed gradient and primary CTA"
```

---

## Task 15: Landing Page Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx with the landing page**

```tsx
// app/page.tsx
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { ProcessSection } from "@/components/landing/process-section"
import { SafetySection } from "@/components/landing/safety-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CTASection } from "@/components/landing/cta-section"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ProcessSection />
      <SafetySection />
      <FeaturesSection />
      <CTASection />
    </>
  )
}
```

- [ ] **Step 2: Verify the full landing page renders in the browser**

```powershell
pnpm dev
```

Open http://localhost:3000. Scroll through all 6 sections. Verify:
- Navbar is sticky and shows "Konseling.org" logo
- Hero shows the headline and two CTAs
- Problem section shows two stat cards
- Process section shows 5-step stepper
- Safety section shows quote and checklist
- Features section shows 3 cards (first with CTA button)
- CTA section shows gradient background
- Footer shows at the bottom

Stop with Ctrl+C.

- [ ] **Step 3: Run the full test suite**

```powershell
pnpm test
```

Expected: All tests pass. Summary should show 8 test suites, all passing.

- [ ] **Step 4: Commit**

```powershell
git add app/page.tsx
git commit -m "feat: assemble landing page with all sections"
```

---

## Task 16: Placeholder Routes for Remaining Screens

**Files:**
- Modify: `app/check-in/page.tsx`, `app/crisis/page.tsx`, `app/psikolog/page.tsx`, `app/psikolog/[id]/page.tsx`

Note: `create-next-app` may not have created these directories. Create them now.

- [ ] **Step 1: Create app/check-in/page.tsx**

```tsx
// app/check-in/page.tsx
export default function CheckInPage() {
  return (
    <div className="pt-24 pb-20 container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-headline-lg text-on-surface">Check-in Perasaan & Refleksi AI</h1>
        <p className="text-body-md text-on-surface-variant">Segera hadir.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create app/crisis/page.tsx**

```tsx
// app/crisis/page.tsx
export default function CrisisPage() {
  return (
    <div className="pt-24 pb-20 container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-headline-lg text-on-surface">Crisis Mode — Bantuan Segera</h1>
        <p className="text-body-md text-on-surface-variant">Segera hadir.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create app/psikolog/page.tsx**

```tsx
// app/psikolog/page.tsx
export default function PsikologPage() {
  return (
    <div className="pt-24 pb-20 container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-headline-lg text-on-surface">Direktori Psikolog Profesional</h1>
        <p className="text-body-md text-on-surface-variant">Segera hadir.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create app/psikolog/[id]/page.tsx**

```tsx
// app/psikolog/[id]/page.tsx
interface Props {
  params: { id: string }
}

export default function PsikologProfilePage({ params }: Props) {
  return (
    <div className="pt-24 pb-20 container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-headline-lg text-on-surface">Profil Psikolog</h1>
        <p className="text-body-md text-on-surface-variant">ID: {params.id}</p>
        <p className="text-body-md text-on-surface-variant">Segera hadir.</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify all routes are accessible**

```powershell
pnpm dev
```

Verify these URLs all render without errors:
- http://localhost:3000/check-in
- http://localhost:3000/crisis
- http://localhost:3000/psikolog
- http://localhost:3000/psikolog/test-id

Stop with Ctrl+C.

- [ ] **Step 6: Run final test suite**

```powershell
pnpm test
```

Expected: All tests pass.

- [ ] **Step 7: Final commit**

```powershell
git add app/check-in/ app/crisis/ app/psikolog/
git commit -m "feat: add placeholder shells for check-in, crisis, psikolog, and psikolog profile routes"
```

---

## Post-Implementation Checklist

After all tasks complete, verify:

- [ ] `pnpm dev` runs without errors
- [ ] `pnpm test` shows all tests passing
- [ ] `pnpm build` completes without TypeScript or lint errors (`pnpm build`)
- [ ] All 5 routes load in the browser without 404 or 500 errors
- [ ] Landing page scrolls through all 6 sections correctly
- [ ] Navbar becomes translucent on scroll
- [ ] Both landing page CTAs link to `/check-in`
- [ ] `.env.local` is not committed to git (verify with `git status`)
