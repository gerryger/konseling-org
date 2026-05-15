---
name: Konseling.org
description: Mental health companion web app — pendamping awal sebelum ke psikolog
brand_voice: Empathic, calm, Indonesian-warm, never clinical
font_family: Manrope
colors:
  # Primary — calm trust blue
  primary: '#0042de'
  primary-container: '#335ef7'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary: '#ffffff'
  on-primary-fixed: '#001354'
  on-primary-fixed-variant: '#0036bb'

  # Secondary — empathic warm purple
  secondary: '#5e3bdb'
  secondary-container: '#7858f5'
  secondary-fixed: '#e6deff'
  secondary-fixed-dim: '#cabeff'
  on-secondary: '#ffffff'
  on-secondary-fixed: '#1c0062'

  # Tertiary — neutral grounding
  tertiary: '#4d5568'
  tertiary-container: '#666d82'
  tertiary-fixed: '#dbe2fa'
  on-tertiary-fixed: '#141b2c'

  # Surface system (8 levels for elevation)
  surface: '#f7f9fb'
  surface-low: '#f2f4f6'
  surface-lowest: '#ffffff'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  surface-dim: '#d8dadc'

  # Text
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  outline: '#747687'
  outline-variant: '#c4c5d8'

  # Semantic
  error: '#ba1a1a'
  error-container: '#ffdad6'
  on-error: '#ffffff'
  on-error-container: '#93000a'

  # Crisis (warmer red than error — never alarming)
  crisis-soft: '#ffe4e0'
  crisis-strong: '#b42318'

  # Status (used sparingly)
  success: '#1b873f'
  success-soft: '#e6f4ea'
  warn: '#b45309'
  warn-soft: '#fef3c7'

typography:
  headline-xxl:   { font-size: 'clamp(40px, 5.4vw, 64px)', weight: 800, line-height: 1.05, tracking: '-0.025em' }
  headline-xl:    { font-size: 'clamp(30px, 3.4vw, 44px)', weight: 800, line-height: 1.15, tracking: '-0.02em' }
  headline-lg:    { font-size: '32px', weight: 800, line-height: 1.2,  tracking: '-0.02em' }
  headline-md:    { font-size: '24px', weight: 800, line-height: 1.3,  tracking: '-0.015em' }
  body-lg:        { font-size: '19px', weight: 400, line-height: 1.6 }
  body-md:        { font-size: '16px', weight: 400, line-height: 1.65 }
  body-sm:        { font-size: '14px', weight: 400, line-height: 1.55 }
  label-lg:       { font-size: '14px', weight: 600, tracking: '0.04em' }
  label-md:       { font-size: '13px', weight: 600 }
  eyebrow:        { font-size: '12px', weight: 700, tracking: '0.08em', case: 'uppercase' }
  caption:        { font-size: '11px', weight: 500, tracking: '0.04em' }

radius:
  sm: '0.5rem'      # inputs, small chips
  md: '0.75rem'     # buttons inside containers
  lg: '1rem'        # standard cards
  xl: '1.5rem'      # large containers (24px)
  2xl: '1.75rem'    # bento blocks (28px)
  3xl: '2.25rem'    # hero CTA cards (36px)
  pill: '9999px'    # buttons, chips, badges

spacing:
  unit: '8px'             # all spacing snaps to 8px rhythm
  gutter: '24px'
  container: '1200px'     # max content width
  reading-pane: '720px'   # text-heavy content max-width
  section-gap: '96px'     # vertical rhythm between major sections (was 80, now generous)
  card-padding: '24px'    # minimum
  card-padding-lg: '28px-36px'

shadows:
  card: '0 10px 30px rgba(15, 23, 42, 0.04)'
  lift: '0 8px 24px rgba(15, 23, 42, 0.06)'
  soft: '0 24px 60px -20px rgba(51, 94, 247, 0.18)'   # for hero/floating cards
  cta-glow: '0 6px 16px -4px color-mix(in srgb, var(--color-primary) 40%, transparent)'
  crisis-glow: '0 24px 60px -16px rgba(200, 30, 12, 0.5)'

motion:
  micro: 140ms
  short: 180ms
  base: 200ms
  med: 320ms
  long: 600ms
  easing: 'ease'
  curve-soft: 'cubic-bezier(0.4, 0, 0.2, 1)'
---

## Brand Direction

**Konseling.org** adalah _pendamping awal_ untuk kesehatan mental — bukan pengganti psikolog, bukan platform medis. Karakter brand-nya: **"Pendampingan"** (companionship). Steady, calm, hadir tanpa menghakimi.

Target user: pengguna Indonesia yang merasa stres, cemas, atau kesepian — dari yang butuh mood check-in ringan sampai yang butuh eskalasi krisis. Banyak yang **belum pernah bicara ke psikolog** dan butuh on-ramp yang tidak menakutkan.

Tone-of-voice di setiap copy:

- **Conversational, bukan klinis.** Tulis seperti teman, bukan dokter. "Aku dengerin" > "Saya memahami kondisi Anda."
- **Empatik, bukan menggurui.** Validasi dulu, jangan langsung solusi. "Lelah itu valid" > "Coba kamu istirahat dulu."
- **Memberi ruang, bukan menekan.** Selalu kasih opsi exit / skip / pause. User pegang kontrol penuh.
- **Indonesian-natural.** Pakai "aku/kamu" yang hangat, bukan "saya/Anda" yang formal-dingin. Code-switch ke English istilah teknis OK (chatbot, app, AI), tapi inti kalimat tetap Indonesia.
- **Hindari toxic positivity.** Jangan "everything will be okay 🙂". Validate dulu, baru bantu ke arah action.
- **Disclaimer tanpa cold-shoulder.** Saat menyebut "AI bukan psikolog", balut dalam kehangatan: "Aku bisa nemenin refleksi awal — untuk diagnosis kamu butuh profesional."

## Visual Style

Fusion **Soft Minimalism** × **Modern Empathic**.

### Aesthetic principles

- **Heavy whitespace.** Reduce cognitive load — user mungkin overwhelmed. Section gap minimal 80px, card padding minimal 24px.
- **Generous radius.** Sharp corners terasa "harsh." Default 16px untuk small things, 24-36px untuk containers besar. Pill (full-rounded) untuk semua tombol primary/chip/badge.
- **Ambient shadows.** Hindari hard drop shadows. Pakai `0 10px 30px rgba(15, 23, 42, 0.04)` untuk cards — terangkat tapi tidak harsh.
- **Gradient text accent (selective).** Headlines bisa pakai gradient primary→secondary di 1-2 kata kunci untuk emphasize transformation — _jangan_ untuk seluruh title (jadi seperti adtech landing).
- **Tonal backgrounds.** Sections bergantian antara `surface` (gray-tinted white) dan `surface-low` untuk rhythm — bukan dengan warna kontras yang harsh.
- **Soft gradients di hero & CTA.** Radial gradients (lavender + soft blue + soft purple) dipakai untuk hero backgrounds — never punchy / saturated.

### Color usage rules

- **Primary blue** (`#0042de`) — primary action, links, focus states. Trust signal.
- **Secondary purple** (`#5e3bdb`) — empathy moments, accent untuk gradient text, mood/feeling indicators.
- **Primary-fixed** (`#dde1ff` lavender) — eyebrow pills, soft icon backgrounds, hover states.
- **Surface levels** — pilih level yang sesuai elevation. Surface-lowest (white) untuk cards lifted, surface (default) untuk page bg, surface-low untuk alternating sections.
- **Error / crisis** — _never_ pakai bright/saturated red. Pakai `crisis-soft #ffe4e0` untuk soft warnings, `crisis-strong #b42318` untuk explicit hotline buttons. Crisis takeover boleh pakai gradient red `#ff6b5b → #c81e0c` di **119 button only** karena harus impossible to miss.
- **Success / warn** — gunakan _sparingly_, hanya untuk semantic feedback (mis. "session saved").

### Shape language

- **Squircles, bukan circles.** Icon containers pakai rounded-square (radius 9-14px) — terlihat friendly tapi tetap modern.
- **Cards melayang, bukan menempel.** Kasih shadow ambient + radius generous + border ringan (1px `outline-variant`).
- **Buttons pill atau soft-rounded.** Primary CTA = pill (full radius). Secondary = radius-lg (16px) dengan border. Icon button = rounded-md (12px).

## Typography

**Manrope** sebagai single typeface — chosen for tall x-height + open counters (legibility for stressed/fatigued users) + balance geometric-modern dan organic-warm.

Weight ladder:
- 800 (Extrabold) → headlines & impactful labels
- 700 (Bold) → sub-headings, important inline
- 600 (Semibold) → buttons, eyebrows, navigation
- 500 (Medium) → small UI labels, captions
- 400 (Regular) → body text — _generous_ line-height (1.6+) untuk reading comfort

Letter-spacing:
- Headlines: tracking-tight (`-0.02em` to `-0.025em`) — confident, not cramped
- Body: default (`0`)
- Eyebrows / caps labels: wide (`0.06em` to `0.08em`) — clean & readable

Text-wrap: gunakan `text-wrap: balance` untuk headlines, `text-wrap: pretty` untuk paragraphs.

Max line-length untuk reading: **720px** (~70 chars). Long-form copy melebihi ini sulit dibaca.

## Layout & Spacing

Grid system: 8px rhythm.

- **Container max-width:** 1200px (most pages), 720px (long-form reading).
- **Section padding vertical:** 96px standard, 80px tight, 64px hero override.
- **Section padding horizontal:** 32px desktop, 16px mobile.
- **Card padding:** 24px minimum, 28-36px untuk hero / feature cards.
- **Gap between cards in grid:** 16px tight, 24px standard.
- **Vertical rhythm in card:** stack with 8/14/20/24px gaps — bukan random.

Responsive breakpoints:
- mobile: < 600px
- tablet: 600 – 960px
- desktop: > 960px

Mobile-first untuk komponen interaktif (chat, check-in). Marketing pages bisa desktop-first dengan graceful mobile fallback.

## Elevation & Depth

3 elevation levels:

1. **Surface (flat)** — page background, alternating section.
2. **Lifted (cards)** — `shadow-card`, 1px outline-variant border, sits on surface. Hover: elevate dengan `shadow-lift`.
3. **Floating (overlays, hero phones)** — `shadow-soft` — deep diffused shadow, used for hero mockups, modals, toasts.

**Gradients** untuk transformation cues:
- Hero buttons / final CTAs: `linear-gradient(135deg, primary, secondary-container)` — feels like "step forward."
- Crisis takeover dark bg: `linear-gradient(180deg, #0a1024 → #1a1f3a → #2a1f5c)` + radial spotlights.
- Hero backgrounds: subtle radial blends of primary-fixed + secondary-fixed di atas surface.

## Components

### Buttons

| Variant | Style |
| --- | --- |
| **Primary** | Pill, `bg-primary`, `text-on-primary`, padding `11px 20px` (`16px 28px` for lg), gradient hover lift -1px, soft CTA glow |
| **Ghost / Secondary** | Pill, transparent bg, 1px outline-variant border, on-surface text |
| **Emergency / Crisis** | Pill, `bg-error-container` or `crisis-soft`, `text-error` or `crisis-strong`, _always reachable in topbar_ |
| **Quick reply chip** | Pill, white bg, outline-variant border, on-surface text, hover: violet-soft bg + secondary border |
| **Icon button** | Rounded-md (12px), white bg, 36-40px square |

Hover: lift -1px translation + slight shadow bump. Active: scale 0.97. Disabled: surface-low bg, faint text, no transform.

### Cards

- **Stat / problem card** — surface-lowest bg, outline-variant border, radius-2xl (24px), padding 24-28px, shadow-card. Hover: lift -3px + primary-fixed-dim border.
- **Bento card** — radius-3xl (28px), padding 28-36px. Hero variant: gradient bg primary→secondary, white text, glow ornaments.
- **Resource card** (psikolog, hotline) — grid `48px 1fr auto` (avatar + meta + cta), padding 18-20px, radius-xl (20px).
- **Crisis banner** — warm gradient `#fff5f3 → #ffe9e5`, `#f5b3a8` border, radius-xl (22px), padding 22-24px. Header icon di squircle white.

### Inputs

- **Text input / composer** — radius-xl, 1px outline-variant, padding `12px 16px`, focus: secondary border + soft outer glow.
- **Composer** (chat) — radius-2xl (22px), inset send button (40×40 gradient pill at right), footer disclaimer text 11px center.

### Specialized

- **Eyebrow pill** — `primary-fixed` bg, `on-primary-fixed` text, padding `7px 14px`, optional leading 6px dot. Always uppercase tracking-wide.
- **Step indicator** — circular numbered badges, soft connecting dashed line, gradient bg untuk icon container.
- **Mood button** — squircle (radius-xl), emoji 36px + label 13px bold + sub 11px muted, selected state: violet gradient bg + lifted shadow.
- **Chat bubble** — radius `18 18 18 4` for Kawan (left), `18 18 4 18` for user (right). User bubble: gradient primary→secondary, white text, deep shadow.
- **Avatar** — circular, gradient bg, monogram or initials in white bold. Add 11px green online dot for active state.

## Iconography

Library: **lucide-react** (already installed). Stroke width 1.8-2.4 (heavier than lucide default — looks more friendly). Icons inside containers should be sized 60-70% of container.

When custom needed: inline SVG with `currentColor` stroke, rounded line caps/joins.

## Accessibility

- Text contrast ≥ 4.5:1 (AAA target on body text).
- Hit targets ≥ 44px on mobile (chat composer, mood buttons, CTAs).
- Focus rings: 3px outer ring `ring/50` color (built into shadcn button).
- Screen reader: chat stream = `role="log" aria-live="polite"`. Crisis takeover = `role="alertdialog" aria-modal="true"` + focus trap.
- 119 hotline: `<a href="tel:119">` (not button — preserves OS behavior).
- Crisis copy must remain readable even when user is in distress — short sentences, large type (≥ 16px body), high contrast.

## Crisis UX Principles

This is the most sensitive part of the product. Follow strictly:

1. **Safety over conversation.** Always interrupt a chat to surface crisis resources — never bury them.
2. **119 always reachable.** Topbar 119 button visible in every chat state.
3. **Two-tier escalation.** Soft banner (Level 3 — high risk) for "I'm tired of life" style messages. Full takeover (Level 4 — critical) only for explicit suicidal intent / self-harm language.
4. **Never auto-dismiss crisis UI.** User must take an action.
5. **Always offer a "stay" path.** Even in takeover, "Aku aman sekarang, lanjut ngobrol" must be available — user agency matters.
6. **No solution before validation.** AI copy at crisis trigger: validate ("apa yang kamu rasakan valid") → offer resources → offer to keep listening.
7. **Real options only.** Psikolog cards in crisis must be _real_ profile data (post-MVP). No "Hubungi" button that leads to a 404.

## Don'ts

- ❌ Bright/saturated reds, oranges in primary palette
- ❌ Hard drop shadows, sharp corners
- ❌ Stock photo people smiling (feels insincere)
- ❌ Emoji in headlines (boleh di body, chat, dan mood UI)
- ❌ "AI-style" gradient backgrounds with high saturation
- ❌ Clinical / corporate stock illustrations
- ❌ Animated loading spinners (use typing dots, skeleton, or static)
- ❌ Auto-playing audio / video
- ❌ Forced sign-up walls (anonim selalu jadi default)

## Reference Files

- `app/globals.css` — runtime design tokens (CSS variables + `@theme inline` block for shadcn-tailwind v4)
- `components/landing/*.tsx` — implemented examples of the system
- `components/ui/button.tsx` — shadcn button (uses tokens via theme block)
- `handoff-chat/` — chat page handoff package (next implementation target)
