/* global React */
const { useState } = React;

// ============ ICONS (inline SVG to avoid lucide load) ============
const Icon = {
  Plus: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Phone: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7a2 2 0 0 1 1.72 2z"/></svg>,
  Send: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>,
  Sparkles: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>,
  Mic: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>,
  Settings: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  AlertTri: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  Heart: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>,
  Lock: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Compass: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Arrow: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Shield: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  MessageBubble: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  More: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  X: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>,
};

// ============ SIDEBAR ============
function Sidebar({ activeId = "current" }) {
  const today = [
    { id: "current", emoji: "😔", title: "Lagi capek banget hari ini", time: "Sekarang" },
  ];
  const yesterday = [
    { id: "y1", emoji: "😟", title: "Cemas soal kerjaan", time: "Kemarin · 21:14" },
    { id: "y2", emoji: "🙂", title: "Hari yang biasa aja", time: "Kemarin · 09:32" },
  ];
  const earlier = [
    { id: "e1", emoji: "😢", title: "Berantem sama keluarga", time: "5 hari lalu" },
    { id: "e2", emoji: "😊", title: "Cerita hal yang bikin senang", time: "1 minggu lalu" },
    { id: "e3", emoji: "😔", title: "Kehilangan yang masih terasa", time: "2 minggu lalu" },
  ];

  const Item = ({ it }) => (
    <button className={`cs-history-item ${it.id === activeId ? "active" : ""}`}>
      <span className="emo">{it.emoji}</span>
      <span className="meta">
        <span className="title">{it.title}</span>
        <span className="time">{it.time}</span>
      </span>
    </button>
  );

  return (
    <aside className="cs-sidebar">
      <div className="cs-logo">
        <span className="cs-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </span>
        <span>konseling<span className="cs-logo-tail">.org</span></span>
      </div>
      <button className="cs-new-chat">
        <Icon.Plus /> Chat baru
      </button>
      <div className="cs-history-label">Riwayat</div>
      <div className="cs-history">
        <div className="cs-history-day">Hari ini</div>
        {today.map(it => <Item key={it.id} it={it} />)}
        <div className="cs-history-day">Kemarin</div>
        {yesterday.map(it => <Item key={it.id} it={it} />)}
        <div className="cs-history-day">Sebelumnya</div>
        {earlier.map(it => <Item key={it.id} it={it} />)}
      </div>
      <div className="cs-account">
        <div className="av">A</div>
        <div className="info">
          <div className="n">Anonim</div>
          <div className="s">Login untuk simpan</div>
        </div>
        <button className="login">Login</button>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="cs-topbar">
      <div className="cs-kawan-av">K</div>
      <div className="cs-kawan-meta">
        <div className="cs-kawan-name">Kawan</div>
        <div className="cs-kawan-status"><span className="dot"/>Pendamping AI · Online</div>
      </div>
      <div className="cs-topbar-spacer"/>
      <a href="tel:119" className="cs-emergency"><Icon.Phone/>119 SEJIWA</a>
      <button className="cs-icon-btn" aria-label="Lainnya"><Icon.More/></button>
    </div>
  );
}

// ============ MESSAGE BUBBLES ============
function Bubble({ who, children, stamp }) {
  const av = who === "kawan" ? "K" : "A";
  return (
    <div className={`cs-bubble-row ${who}`}>
      <div className={`cs-bubble-av ${who}`}>{av}</div>
      <div className={`cs-bubble ${who}`}>
        {children}
        {stamp && <div className="stamp">{stamp}</div>}
      </div>
    </div>
  );
}

function QuickReplies({ items }) {
  return (
    <div className="cs-quick-replies">
      {items.map((it, i) => (
        <button key={i} className="cs-chip">
          {it.ico && <span className="ico">{it.ico}</span>}{it.label}
        </button>
      ))}
    </div>
  );
}

function Composer({ value = "", placeholder = "Ketik apa yang kamu rasakan..." }) {
  return (
    <>
      <div className="cs-composer-wrap">
        <div className="cs-composer">
          <textarea className="cs-composer-input" rows="1" placeholder={placeholder} defaultValue={value}/>
          <div className="cs-composer-tools">
            <button className="cs-tool-btn" aria-label="Suara"><Icon.Mic/></button>
          </div>
          <button className="cs-send" aria-label="Kirim" disabled={!value}><Icon.Send/></button>
        </div>
        <div className="cs-composer-foot">
          <span>Anonim · Rahasia</span>
          <span>•</span>
          <a href="#">Pengaturan privasi</a>
          <span>•</span>
          <span>Bukan pengganti psikolog</span>
        </div>
      </div>
    </>
  );
}

// ============ PSIKOLOG CARD ============
const PSIKOLOG = [
  { initial: "DR", color: "linear-gradient(135deg, #335ef7, #7858f5)", name: "Dr. Rina Pertiwi, M.Psi", tags: ["Klinis Dewasa", "Jakarta Selatan", "0.9 km"], price: "Rp 280rb / sesi" },
  { initial: "AK", color: "linear-gradient(135deg, #18b663, #0e9252)", name: "Adi Kusumawardhana, M.Psi", tags: ["Trauma & Krisis", "Jakarta Pusat", "2.4 km"], price: "Rp 250rb / sesi" },
  { initial: "MW", color: "linear-gradient(135deg, #f97316, #b34719)", name: "Maya Wulandari, M.Psi", tags: ["Remaja & Dewasa Muda", "Online", "Telekonsultasi"], price: "Rp 220rb / sesi" },
];

function PsikologRow({ p }) {
  return (
    <div className="cs-psikolog">
      <div className="cs-psikolog-av" style={{ background: p.color }}>{p.initial}</div>
      <div className="cs-psikolog-meta">
        <div className="cs-psikolog-name">{p.name}</div>
        <div className="cs-psikolog-tags">
          {p.tags.map((t, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="cs-psikolog-tag-dot"/>}
              <span>{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <a href="#" className="cs-psikolog-cta">Hubungi <Icon.Arrow/></a>
    </div>
  );
}

function CrisisBanner() {
  return (
    <div className="cs-crisis-banner">
      <div className="cs-crisis-head">
        <span className="cs-crisis-icon"><Icon.AlertTri/></span>
        <div>
          <div className="cs-crisis-title">Aku menangkap sinyal yang berat dari ceritamu.</div>
          <p className="cs-crisis-text">
            Apa yang kamu rasakan itu valid — dan kamu tidak harus menghadapinya sendiri.
            Aku ingin mengarahkanmu ke bantuan yang lebih siap mendengarkan saat ini.
          </p>
        </div>
      </div>
      <div className="cs-crisis-actions">
        <a href="tel:119" className="cs-crisis-btn primary"><Icon.Phone/>Hubungi 119 SEJIWA</a>
        <button className="cs-crisis-btn ghost">Lanjut ngobrol dulu</button>
      </div>
      <div>
        <div className="cs-psikolog-list-label">3 Psikolog terdekat — bisa dihubungi sekarang</div>
        <div className="cs-psikolog-list" style={{ marginTop: 8 }}>
          {PSIKOLOG.map((p, i) => <PsikologRow key={i} p={p}/>)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ChatIcon: Icon, Sidebar, TopBar, Bubble, QuickReplies, Composer,
  PsikologRow, CrisisBanner, PSIKOLOG,
});
