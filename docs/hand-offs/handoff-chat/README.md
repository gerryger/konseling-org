# Handoff: Halaman Chat "Coba Ngobrol Sekarang"

> **Untuk Claude Code di laptop user.**
> Codebase: Next.js 15 (App Router) di folder `konseling-org/`.
> Konteks pengguna: aplikasi mental health companion untuk pengguna Indonesia.

---

## 1. Tugas singkat

Implementasikan halaman chat AI ("Coba Ngobrol Sekarang") di codebase Next.js yang sudah ada. Halaman ini punya 3 fase: **onboarding (mood + disclaimer)** → **chat dengan AI bernama "Kawan"** → **crisis detection (L3 banner / L4 takeover)** kalau sistem mendeteksi tanda krisis.

Backend AI **bukan tugas handoff ini** — UI harus siap menerima respons stream dari backend nanti, tapi sekarang cukup dummy/static.

---

## 2. Sebelum mulai — baca dulu

1. **`AGENTS.md`** di root project — Next.js di project ini bukan versi training data; ada breaking changes. Baca guide di `node_modules/next/dist/docs/` sebelum tulis kode.
2. **`DESIGN.md`** — design system "Pendampingan" (warna, tipografi Manrope, radius, spacing 8px rhythm).
3. **`app/globals.css`** — sudah ada CSS variables lengkap (`--color-primary`, `--color-secondary`, dst). **Pakai variabel ini**, jangan hardcode warna baru kecuali memang tidak ada padanan.
4. **`components/landing/*.tsx`** — referensi style/pattern komponen yang sudah ada (landing page sudah di-port dari mockup). Ikuti pola yang sama.
5. **`handoff-chat/mockup/`** (folder ini) — file mockup HTML/CSS/JSX. **Ini bukan production code untuk dicopy** — ini referensi visual. Recreate di Next.js dengan pattern codebase yang ada.

---

## 3. Fidelity

**Hi-fi.** Mockup di `mockup/` adalah pixel-perfect — warna, tipografi, spacing, radius, dan copy sudah final. Recreate seakurat mungkin di Next.js. Color tokens di mockup pakai variabel CSS sendiri (`--k-*`) untuk kemudahan eksplorasi — tugas Anda: **map ulang ke design tokens project** (`--color-primary`, `--color-secondary`, dst dari `globals.css`).

Mapping color tokens mockup → project:

| Mockup (`--k-*`) | Project (`--color-*`) |
| --- | --- |
| `--k-primary-dark` `#0042de` | `--color-primary` |
| `--k-primary` `#335ef7` | `--color-primary-container` |
| `--k-secondary` `#7858f5` | `--color-secondary-container` |
| `--k-violet-soft` `#ece8ff` | `--color-secondary-fixed` |
| `--k-blue-soft` `#e3eaff` | `--color-primary-fixed` |
| `--k-bg` `#f7f6fb` | `--color-surface` |
| `--k-surface` (white) | `--color-surface-lowest` |
| `--k-surface-2` `#f0eef7` | `--color-surface-low` |
| `--k-border` `#e6e4f0` | `--color-outline-variant` |
| `--k-text` `#1a1f3a` | `--color-on-surface` |
| `--k-text-muted` `#5a607a` | `--color-on-surface-variant` |
| `--k-text-faint` `#8a8fa3` | `--color-outline` |
| `--k-danger` `#b42318` | `--color-error` (custom; project pakai `#ba1a1a` — boleh dipakai langsung) |
| `--k-danger-soft` `#ffe4e0` | `--color-error-container` (`#ffdad6`) — pakai mockup value, lebih warm |

Font: project pakai **Manrope** (via `next/font/google` di `app/layout.tsx`). Mockup pakai **Plus Jakarta Sans** untuk variasi visual — **pakai Manrope** di production agar konsisten dengan landing.

---

## 4. Route & file structure

```
app/
  checkin/                     # ganti page.tsx yang sudah ada
    page.tsx                   # entry, render <ChatExperience />
    layout.tsx                 # opsional, kalau perlu nested layout (no navbar landing)
components/
  chat/
    chat-experience.tsx        # state machine utama: onboarding | chat
    sidebar.tsx                # left sidebar w/ history + new chat
    top-bar.tsx                # header dengan Kawan avatar + 119 button
    chat-stream.tsx            # message list (ChatGPT-style)
    composer.tsx               # textarea + send button + foot disclaimer
    message-bubble.tsx         # 1 bubble (kawan|user)
    quick-replies.tsx          # chip row
    typing-indicator.tsx       # 3-dot animasi
    mood-screen.tsx            # state: pre-chat mood picker
    disclaimer-screen.tsx      # state: pre-chat disclaimer
    crisis-banner.tsx          # L3: soft banner inline di chat
    crisis-takeover.tsx        # L4: full-screen overlay
    psikolog-card.tsx          # 1 card psikolog (dipakai banner + takeover)
lib/
  chat/
    crisis-detection.ts        # client-side heuristic + tipe Level
    types.ts                   # ChatMessage, ChatState, CrisisLevel
    mock-data.ts               # dummy history + dummy psikolog
```

`/check-in` (existing) **boleh dihapus** atau di-redirect ke `/checkin` — saya pakai tanpa dash supaya konsisten dengan URL `https://konseling.org/checkin` yang user sebut.

---

## 5. Layout & behavior per screen

### 5.1 Mood Screen (`<MoodScreen />`)

- **Layout**: Grid 280px sidebar + main. Main = full-bleed dengan radial gradient backgrounds (violet top-right + blue bottom-left + surface). Card centered, max-width 640px, padding 48px 56px.
- **Progress indicator**: 3 dots di top-right (32px top, 40px right). Step pertama active.
- **Eyebrow**: pill kecil violet "Check-in perasaan" + icon sparkles.
- **Title**: "Halo, gimana kabarmu sekarang?" 32px / 800 / -0.02em letter-spacing.
- **Sub**: "Tidak ada jawaban yang salah. Pilih yang paling mendekati — kita akan mulai dari sana." 16px muted.
- **Grid 5 mood**: 😊 Senang/Lega · 🙂 Biasa/Datar · 😔 Lelah/Capek · 😟 Cemas/Khawatir · 😢 Hancur/Berat. Emoji 36px, label 13px bold, sub 11px muted. Hover: lift -3px + violet border + soft shadow. Selected: violet gradient bg + shadow.
- **Foot**: kiri = "Lewati, langsung ngobrol" (text button). Kanan = "Lanjutkan →" (gradient pill CTA).
- **State**: `selectedMood?: 'senang'|'biasa'|'lelah'|'cemas'|'hancur'`. Required untuk lanjut. "Lewati" = set ke `undefined` dan lanjut.

### 5.2 Disclaimer Screen (`<DisclaimerScreen />`)

- Sama layout dasar dengan mood. Card max 580px, padding 44px 48px.
- **Icon**: 56px square rounded-18, violet→white gradient, shield icon.
- **Title**: "Sebelum kita mulai" 26px / 800.
- **3 list items** (icon 32px + text):
  1. Message icon — "Aku adalah AI, bukan psikolog" / "Aku bisa menemani refleksi awal. Untuk diagnosis dan terapi, kamu perlu profesional bersertifikat."
  2. Lock icon — "Anonim & rahasia" / "Tidak perlu identitas asli. Percakapan terenkripsi dan tidak digunakan untuk iklan."
  3. Alert icon (red bg `--k-danger-soft`) — "Saat ada tanda krisis" / "Aku akan langsung mengarahkanmu ke 119 SEJIWA dan psikolog terdekat — keselamatanmu yang utama."
- **CTA**: full-width "Mengerti, mulai ngobrol →" gradient.
- Disclaimer cuma muncul **sekali per sesi** — simpan flag di localStorage (`konseling.disclaimerAccepted = true`).

### 5.3 Chat Screen (`<ChatStream />` + `<TopBar />` + `<Composer />` + sidebar)

- **Sidebar 280px**:
  - Logo top.
  - "Chat baru" button (dark bg, full text).
  - Label "Riwayat" (uppercase tracking).
  - Grouped history: "Hari ini" / "Kemarin" / "Sebelumnya" — masing-masing dengan emoji avatar 28px + title 13px + timestamp 11px muted. Active item: violet-soft bg.
  - Footer: avatar "A" + "Anonim · Login untuk simpan" + small "Login" pill.
- **TopBar 64px**:
  - Avatar "K" 38px gradient + green online dot.
  - "Kawan · Pendamping AI · Online".
  - Spacer.
  - **119 SEJIWA button** (danger-soft pill, **persistent — selalu visible**).
  - More icon (kebab).
- **Chat list**:
  - Max-width 720px centered. Padding 30px top.
  - Bubbles: kawan kiri (avatar K gradient, bubble white bordered, radius 18 18 18 4), user kanan (avatar A peach, bubble gradient blue→purple, radius 18 18 4 18, white text).
  - Timestamp dalam bubble bottom-right, 11px.
  - **Quick reply chips** muncul setelah bubble Kawan terakhir, indent 44px (align dengan text), wrap, hover: violet border + bg.
- **Composer**:
  - Centered max-720, rounded-22, border, focus: violet border.
  - Textarea autosize (max-h 120px), placeholder "Ketik apa yang kamu rasakan..."
  - Mic icon kiri-tools, **send button kanan** (gradient blue→purple, 40×40, rounded-12). Disabled state: surface-low bg.
  - **Foot** small (11px muted, centered): "Anonim · Rahasia • Pengaturan privasi • Bukan pengganti psikolog"

### 5.4 Crisis L3 — Soft Banner (`<CrisisBanner />` inline di chat)

Dipicu saat `detectCrisis(message) === 'high'`. Banner muncul **inline di chat stream, sebelum respons AI berikutnya**.

- Card warm gradient `#fff5f3 → #ffe9e5`, border `#f5b3a8`, radius 22, padding 22 24.
- **Header**: 44×44 white square dengan alert icon (red), title "Aku menangkap sinyal yang berat dari ceritamu." 16px / 800, body 13.5px line-height 1.5.
- **Actions row**: button danger primary "Hubungi 119 SEJIWA" + button white ghost "Lanjut ngobrol dulu".
- **Psikolog list**: label "3 PSIKOLOG TERDEKAT — BISA DIHUBUNGI SEKARANG" uppercase tracking, lalu 3 card horizontal (avatar 48px + nama + tags `Klinis Dewasa · Jakarta Selatan · 0.9 km` + CTA "Hubungi →" dark pill).
- **Setelah banner muncul, AI tetap merespons** secara empatik ("Aku nggak akan langsung kasih solusi..."), DAN quick-replies berubah: "Aku mau ngobrol pelan dulu" / "Hubungi psikolog terdekat" / "Cerita lebih dalam".
- **Banner tetap di place, tidak hilang otomatis** — user bisa dismiss manual (close button optional, atau scroll).

### 5.5 Crisis L4 — Full Takeover (`<CrisisTakeover />`)

Dipicu saat `detectCrisis(message) === 'critical'`. **Chat normal di-pause** — overlay full-screen di atas chat area (sidebar tetap visible).

- **Background**: dark navy radial gradient `linear-gradient(180deg, #0a1024 → #1a1f3a → #2a1f5c)` + 2 radial spotlights (purple bottom-center + blue top-left).
- **Chat di belakang**: opacity 0.3 + blur 2px.
- **Eyebrow pill** (border ringan, transparent bg): "Aku khawatir denganmu sekarang" + heart icon.
- **Title** 38px / 800: "Kamu penting. Hidupmu penting. Aku di sini bersamamu."
- **Sub**: "Apa yang kamu rasakan sekarang berat sekali, dan aku ingin kamu bicara dengan seseorang yang bisa benar-benar membantu malam ini. Bukan untuk menghakimi — untuk menemani."
- **119 hero CTA** (sangat prominen): gradient `#ff6b5b → #c81e0c`, padding 22 32, rounded-22, drop shadow merah, icon 56px + label "Hotline 24 jam · gratis" + "119" 30px + "SEJIWA · Kemenkes RI".
- **3 psikolog cards** horizontal grid: glass-card style (white/0.06 bg + blur), avatar 40px gradient, nama 14, tags 11 muted, price + "Hubungi" white pill di bottom.
- **Foot links**: "Bicara dengan orang terdekat" · "Latihan napas singkat"
- **Resume button** (subtle, opacity 0.5): "Aku aman sekarang, lanjut ngobrol →" — user harus klik manual.

---

## 6. State management

Cukup React `useState` + `useReducer` lokal, **belum perlu Zustand/Redux**. Backend AI / Supabase persistence akan dipasang nanti via Claude Code session berbeda.

```ts
// lib/chat/types.ts
export type ChatPhase = 'mood' | 'disclaimer' | 'chat';
export type Mood = 'senang' | 'biasa' | 'lelah' | 'cemas' | 'hancur';
export type CrisisLevel = 'none' | 'mild' | 'moderate' | 'high' | 'critical';
export type Sender = 'kawan' | 'user';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  crisisLevel?: CrisisLevel;     // tagged kalau message ini trigger crisis
}

export interface ChatSession {
  id: string;
  mood?: Mood;
  messages: ChatMessage[];
  highestCrisisLevel: CrisisLevel;
  startedAt: Date;
}
```

State machine kasar:

```
mood → disclaimer → chat
                      ↓
                      (kalau crisis level high) → tampilkan <CrisisBanner /> inline
                      (kalau crisis level critical) → render <CrisisTakeover /> overlay
```

Di mockup, semua state ditampilkan di **canvas multi-artboard**. Di production, cuma 1 state aktif — drive dengan local state di `<ChatExperience />`.

### Mock data untuk demo

```ts
// lib/chat/mock-data.ts
export const MOCK_HISTORY = [
  { day: 'Hari ini', items: [
    { id: 'today-1', emoji: '😔', title: 'Lagi capek banget hari ini', time: 'Sekarang', active: true }
  ]},
  { day: 'Kemarin', items: [
    { id: 'y1', emoji: '😟', title: 'Cemas soal kerjaan', time: 'Kemarin · 21:14' },
    { id: 'y2', emoji: '🙂', title: 'Hari yang biasa aja', time: 'Kemarin · 09:32' },
  ]},
  { day: 'Sebelumnya', items: [
    { id: 'e1', emoji: '😢', title: 'Berantem sama keluarga', time: '5 hari lalu' },
    { id: 'e2', emoji: '😊', title: 'Cerita hal yang bikin senang', time: '1 minggu lalu' },
    { id: 'e3', emoji: '😔', title: 'Kehilangan yang masih terasa', time: '2 minggu lalu' },
  ]},
];

export const MOCK_PSIKOLOG = [
  { initial: 'DR', gradient: 'linear-gradient(135deg, #335ef7, #7858f5)',
    name: 'Dr. Rina Pertiwi, M.Psi',
    tags: ['Klinis Dewasa', 'Jakarta Selatan', '0.9 km'],
    price: 'Rp 280rb / sesi' },
  { initial: 'AK', gradient: 'linear-gradient(135deg, #18b663, #0e9252)',
    name: 'Adi Kusumawardhana, M.Psi',
    tags: ['Trauma & Krisis', 'Jakarta Pusat', '2.4 km'],
    price: 'Rp 250rb / sesi' },
  { initial: 'MW', gradient: 'linear-gradient(135deg, #f97316, #b34719)',
    name: 'Maya Wulandari, M.Psi',
    tags: ['Remaja & Dewasa Muda', 'Online', 'Telekonsultasi'],
    price: 'Rp 220rb / sesi' },
];
```

---

## 7. Crisis detection (placeholder logic)

Backend AI yang akan klasifikasi krisis nantinya (kemungkinan via dedicated classifier + LLM). Untuk sekarang, buat heuristic client-side simple di `lib/chat/crisis-detection.ts` sebagai **placeholder** — supaya UI L3/L4 bisa di-trigger dengan testing manual.

```ts
// lib/chat/crisis-detection.ts
const CRITICAL_PATTERNS = [
  /bunuh diri/i, /nggak mau bangun/i, /pengen mati/i, /akhiri hidup/i,
  /nggak ada gunanya hidup/i, /lebih baik mati/i, /mau pergi selamanya/i,
];
const HIGH_PATTERNS = [
  /capek sama hidup/i, /tidak ada harapan/i, /putus asa/i,
  /tidak ada yang berubah/i, /tiap hari sama aja/i, /menyakiti diri/i,
  /self.?harm/i,
];

export function detectCrisis(text: string): CrisisLevel {
  if (CRITICAL_PATTERNS.some(p => p.test(text))) return 'critical';
  if (HIGH_PATTERNS.some(p => p.test(text))) return 'high';
  return 'none';
}
```

**Penting**: tambahkan komentar di file ini bahwa heuristic ini *sementara*, dan classifier real akan datang dari backend. Heuristic regex tidak boleh jadi single source of truth — false negatives berbahaya.

---

## 8. Sample copy (gunakan persis)

### Bubble awal (empty state, setelah disclaimer)
```
Halo, senang kamu mampir 🙂
Aku Kawan. Tidak ada agenda di sini — kita ngobrol pelan-pelan aja, sesuai kenyamananmu.
Kalau boleh tahu, ada apa yang bikin kamu memutuskan buat cerita malam ini?
```

Quick replies awal: 💭 "Pikiranku ramai" · 😔 "Lagi capek aja" · 💔 "Habis berantem" · 🌧️ "Sedih, tapi bingung kenapa" · ✍️ "Aku tulis sendiri"

### Mid-conversation sample (untuk testing/dev)
Lihat `mockup/chat-screens.jsx` → `<MidChatScreen />` untuk script lengkap user ↔ Kawan.

### Saat L3 ter-trigger
Banner copy:
> **Aku menangkap sinyal yang berat dari ceritamu.**
> Apa yang kamu rasakan itu valid — dan kamu tidak harus menghadapinya sendiri. Aku ingin mengarahkanmu ke bantuan yang lebih siap mendengarkan saat ini.

AI bubble setelah banner:
> Aku nggak akan langsung kasih solusi. Aku cuma mau bilang: aku dengerin, dan kamu nggak harus melewati ini sendirian.
> Kalau kamu mau, kita bisa ngobrol pelan dulu — atau kamu bisa langsung kontak salah satu di atas. Apa pun pilihanmu, aku temenin.

Quick replies di L3: 🫂 "Aku mau ngobrol pelan dulu" · 📞 "Hubungi psikolog terdekat" · 💭 "Cerita lebih dalam"

### Saat L4 ter-trigger
Eyebrow: "Aku khawatir denganmu sekarang"
Title: **Kamu penting. Hidupmu penting. Aku di sini bersamamu.**
Sub: Apa yang kamu rasakan sekarang berat sekali, dan aku ingin kamu bicara dengan seseorang yang bisa benar-benar membantu malam ini. Bukan untuk menghakimi — untuk menemani.

---

## 9. Animations & micro-interactions

| Element | Behavior |
| --- | --- |
| Mood button | `:hover { translateY(-3px); }` 200ms ease, border violet, soft shadow |
| Mood button selected | violet gradient bg, lifted shadow |
| Quick reply chip | `:hover { translateY(-1px); }` 160ms, violet border + violet-soft bg |
| Send button | `:hover { translateY(-1px); }` 140ms; disabled = surface-low bg, no transform |
| New message bubble | Fade in + translate-y(8px → 0) 320ms ease |
| Typing indicator | 3 dots, stagger 0.2s, 1.4s infinite, bounce-y 3px |
| Crisis banner | Slide-down + fade 320ms ease saat muncul; **no auto-dismiss** |
| Crisis takeover | Fade in 240ms, chat di belakang di-blur(2px) opacity 0.3 |
| Topbar 119 button | `:hover` background-darken 8% |

Pakai CSS transitions, jangan motion library.

---

## 10. Accessibility checklist

- [ ] Semua button punya `aria-label` kalau cuma ikon (mic, send, more).
- [ ] Chat stream `role="log" aria-live="polite"` supaya screen reader announce new messages.
- [ ] Crisis takeover `role="alertdialog" aria-modal="true"` + focus trap di dalam.
- [ ] 119 link: `<a href="tel:119">` (jangan button).
- [ ] Mood buttons: `<button>` dengan `aria-pressed`.
- [ ] Composer textarea: `aria-label="Ketik pesan untuk Kawan"`.
- [ ] Color contrast: pastikan text di crisis banner (warm bg) tetap >= 4.5:1 — kalau border-line, darken text ke `#5e1810`.

---

## 11. Responsiveness

Mockup didesain di **1280×820 desktop**. Untuk Next.js production, support:

- **Desktop** ≥ 1024px: layout penuh (sidebar 280 + main).
- **Tablet** 768–1023px: sidebar collapse jadi drawer (hamburger di topbar).
- **Mobile** < 768px: sidebar full-overlay drawer; topbar full-width; composer sticky bottom; psikolog cards di crisis banner stack vertikal.

**119 button harus tetap visible** di semua viewport — di mobile bisa jadi icon-only di topbar (label hidden, tetap clickable).

---

## 12. File-file mockup yang disertakan

Di folder `mockup/`:

- **`Chat Page.html`** — root HTML, render `DesignCanvas` dengan 6 artboard. **Hanya untuk visual reference**, bukan dipakai di production.
- **`chat-styles.css`** — semua styling dengan `--k-*` tokens. **Penting**: re-map ke tokens project (lihat tabel section 3) saat porting.
- **`chat-shell.jsx`** — komponen Sidebar, TopBar, Bubble, QuickReplies, Composer, PsikologRow, CrisisBanner. Pola ini bisa langsung dijadikan React component di Next.js (ganti `Object.assign(window, ...)` dengan `export`).
- **`chat-screens.jsx`** — 6 screen-level component yang composite shell components di atas. Pakai sebagai blueprint untuk page-level component.

Buka `Chat Page.html` di browser (atau pakai `npx serve mockup/`) untuk lihat referensi visual. Klik artboard untuk fokus full-screen.

---

## 13. Definition of done

- [ ] `/checkin` route render mood screen secara default.
- [ ] Pilih mood → klik "Lanjutkan" → masuk disclaimer (kalau belum accept) → masuk chat. Skip mood juga work.
- [ ] Disclaimer hanya muncul 1x (localStorage flag).
- [ ] Chat UI fully functional: type pesan → muncul di stream sebagai user bubble → setelah 800ms muncul typing indicator di Kawan side → setelah 1.6s ganti jadi response dummy "Aku dengerin, ceritain lebih lanjut..." (no AI integration, OK).
- [ ] Quick reply chip klik → isi composer (atau langsung kirim, terserah).
- [ ] **Trigger L3**: ketik "tiap hari sama aja, aku capek sama hidup" → banner muncul inline + psikolog cards + 119 button.
- [ ] **Trigger L4**: ketik "aku nggak mau bangun lagi besok" → full takeover overlay.
- [ ] "Lanjut ngobrol dulu" di L3 → banner tetap, chat tetap aktif.
- [ ] "Aku aman sekarang, lanjut ngobrol →" di L4 → overlay dismissed, kembali ke chat.
- [ ] 119 button selalu reachable (topbar persistent + di banner + di takeover).
- [ ] Sidebar history dummy bisa diklik (tidak harus restore session — cukup highlight active).
- [ ] Responsive di mobile (sidebar drawer, sticky composer).
- [ ] Lighthouse a11y >= 95.

---

## 14. Hal yang BUKAN scope handoff ini

- ❌ Integrasi LLM / streaming dari backend (akan ditangani session terpisah).
- ❌ Supabase auth & persistent history (skema chat_sessions/messages table — nanti).
- ❌ Real crisis classifier (heuristic regex hanya placeholder).
- ❌ Voice input fungsional (mic button cukup ada di UI, klik no-op).
- ❌ Direktori psikolog real / database (pakai `MOCK_PSIKOLOG` saja).

---

## 15. Pertanyaan untuk klarifikasi dengan user (kalau perlu)

1. Apakah `/checkin` (existing) memang akan di-replace, atau bikin route baru?
2. Authentication mau di-stub sebagai context provider sekarang (`useAuth()` return null), atau skip dulu sampai Supabase integration?
3. Crisis takeover: apakah "Aku aman sekarang" perlu konfirmasi modal kedua, atau langsung dismiss?
4. Mobile: ada preferensi untuk bottom sheet style (Material) vs slide-from-left drawer untuk sidebar?

Tanyakan ke user kalau ragu — jangan asumsikan diam-diam.
