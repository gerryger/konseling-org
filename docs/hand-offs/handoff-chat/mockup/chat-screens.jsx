/* global React, Sidebar, TopBar, Bubble, QuickReplies, Composer, CrisisBanner, ChatIcon, PSIKOLOG */

// ============ MOOD CHECK-IN SCREEN ============
function MoodScreen() {
  const moods = [
    { id: "senang", em: "😊", lbl: "Senang", sub: "Lega" },
    { id: "biasa", em: "🙂", lbl: "Biasa", sub: "Datar" },
    { id: "lelah", em: "😔", lbl: "Lelah", sub: "Capek" },
    { id: "cemas", em: "😟", lbl: "Cemas", sub: "Khawatir" },
    { id: "hancur", em: "😢", lbl: "Hancur", sub: "Berat" },
  ];
  return (
    <div className="cs-mood-screen">
      <Sidebar />
      <div className="cs-mood-stage">
        <div className="cs-mood-progress">
          <span className="step active"/><span className="step"/><span className="step"/>
        </div>
        <div className="cs-mood-card">
          <span className="cs-mood-eyebrow"><ChatIcon.Sparkles/>Check-in perasaan</span>
          <h1 className="cs-mood-title">Halo, gimana kabarmu sekarang?</h1>
          <p className="cs-mood-sub">
            Tidak ada jawaban yang salah. Pilih yang paling mendekati — kita akan mulai dari sana.
          </p>
          <div className="cs-mood-grid">
            {moods.map((m, i) => (
              <button key={m.id} className={`cs-mood-btn ${m.id === "lelah" ? "selected" : ""}`}>
                <span className="em">{m.em}</span>
                <span className="lbl">{m.lbl}</span>
                <span className="sub">{m.sub}</span>
              </button>
            ))}
          </div>
          <div className="cs-mood-foot">
            <button className="cs-mood-skip">Lewati, langsung ngobrol</button>
            <button className="cs-mood-cta">Lanjutkan <ChatIcon.Arrow/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ DISCLAIMER SCREEN ============
function DisclaimerScreen() {
  return (
    <div className="cs-disclaimer-screen">
      <Sidebar />
      <div className="cs-disclaimer-stage">
        <div className="cs-mood-progress">
          <span className="step active"/><span className="step active"/><span className="step"/>
        </div>
        <div className="cs-disclaimer-card">
          <div className="cs-disclaimer-icon"><ChatIcon.Shield/></div>
          <h2 className="cs-disclaimer-title">Sebelum kita mulai</h2>
          <p className="cs-disclaimer-sub">
            Beberapa hal penting yang perlu kamu tahu — supaya percakapan ini jadi yang paling membantu untukmu.
          </p>
          <ul className="cs-disclaimer-list">
            <li>
              <span className="ic"><ChatIcon.MessageBubble/></span>
              <div>
                <h5>Aku adalah AI, bukan psikolog</h5>
                <p>Aku bisa menemani refleksi awal. Untuk diagnosis dan terapi, kamu perlu profesional bersertifikat.</p>
              </div>
            </li>
            <li>
              <span className="ic"><ChatIcon.Lock/></span>
              <div>
                <h5>Anonim &amp; rahasia</h5>
                <p>Tidak perlu identitas asli. Percakapan terenkripsi dan tidak digunakan untuk iklan.</p>
              </div>
            </li>
            <li>
              <span className="ic warn"><ChatIcon.AlertTri/></span>
              <div>
                <h5>Saat ada tanda krisis</h5>
                <p>Aku akan langsung mengarahkanmu ke 119 SEJIWA dan psikolog terdekat — keselamatanmu yang utama.</p>
              </div>
            </li>
          </ul>
          <button className="cs-disclaimer-cta">Mengerti, mulai ngobrol <ChatIcon.Arrow/></button>
        </div>
      </div>
    </div>
  );
}

// ============ EMPTY CHAT (just entered) ============
function EmptyChatScreen() {
  return (
    <div className="cs-app">
      <Sidebar />
      <main className="cs-main">
        <TopBar/>
        <div className="cs-chat">
          <div className="cs-chat-inner">
            <div className="cs-day-divider">Mulai sekarang</div>
            <Bubble who="kawan" stamp="Kawan · 21:43">
              <p>Halo, senang kamu mampir 🙂</p>
              <p>Aku Kawan. Tidak ada agenda di sini — kita ngobrol pelan-pelan aja, sesuai kenyamananmu.</p>
              <p>Kalau boleh tahu, ada apa yang bikin kamu memutuskan buat cerita malam ini?</p>
            </Bubble>
            <QuickReplies items={[
              { ico: "💭", label: "Pikiranku ramai" },
              { ico: "😔", label: "Lagi capek aja" },
              { ico: "💔", label: "Habis berantem" },
              { ico: "🌧️", label: "Sedih, tapi bingung kenapa" },
              { ico: "✍️", label: "Aku tulis sendiri" },
            ]}/>
          </div>
        </div>
        <Composer/>
      </main>
    </div>
  );
}

// ============ MID CHAT ============
function MidChatScreen() {
  return (
    <div className="cs-app">
      <Sidebar />
      <main className="cs-main">
        <TopBar/>
        <div className="cs-chat">
          <div className="cs-chat-inner">
            <Bubble who="kawan" stamp="21:43">
              <p>Halo, senang kamu mampir. Ada apa yang bikin kamu cerita malam ini?</p>
            </Bubble>
            <Bubble who="user" stamp="21:44">
              <p>Aku capek banget rasanya. Kerjaan numpuk, tidur jelek, ngerasa nggak ada yang ngerti.</p>
            </Bubble>
            <Bubble who="kawan" stamp="21:44">
              <p>Itu kombinasi yang berat — fisik capek, tidur nggak nyenyak, dan rasa sendirian sekaligus. Wajar kalau hari-hari terasa lebih berat dari biasanya.</p>
              <p>Boleh aku tanya: yang paling bikin lelah itu kerjaannya, atau perasaan &quot;nggak ada yang ngerti&quot;-nya?</p>
            </Bubble>
            <Bubble who="user" stamp="21:46">
              <p>Yang nggak ada yang ngerti sih. Cerita ke temen, mereka cuma bilang "sabar". Cerita ke pasangan, malah dibilang lebay.</p>
            </Bubble>
            <Bubble who="kawan" stamp="21:46">
              <p>Itu rasanya seperti cerita ke ruang kosong, ya — udah berani buka, malah dipantulkan kembali jadi salah kamu.</p>
              <p>Aku di sini, dan aku percaya kamu nggak lebay. Capek itu sinyal nyata, bukan keluhan.</p>
            </Bubble>
            <QuickReplies items={[
              { ico: "🫂", label: "Aku butuh didengerin aja" },
              { ico: "💡", label: "Bantu aku lihat dari sudut lain" },
              { ico: "🧘", label: "Ajak aku napas pelan" },
              { ico: "📞", label: "Aku mau ngobrol sama psikolog" },
            ]}/>
          </div>
        </div>
        <Composer placeholder="Lanjut cerita..."/>
      </main>
    </div>
  );
}

// ============ CRISIS L3 (Soft Banner) ============
function CrisisBannerScreen() {
  return (
    <div className="cs-app">
      <Sidebar />
      <main className="cs-main">
        <TopBar/>
        <div className="cs-chat">
          <div className="cs-chat-inner">
            <Bubble who="user" stamp="22:11">
              <p>Aku ngerasa nggak ada yang berubah. Tiap hari sama aja. Aku capek banget sama hidupku sendiri.</p>
            </Bubble>
            <CrisisBanner/>
            <Bubble who="kawan" stamp="22:11">
              <p>Aku nggak akan langsung kasih solusi. Aku cuma mau bilang: aku dengerin, dan kamu nggak harus melewati ini sendirian.</p>
              <p>Kalau kamu mau, kita bisa ngobrol pelan dulu — atau kamu bisa langsung kontak salah satu di atas. Apa pun pilihanmu, aku temenin.</p>
            </Bubble>
            <QuickReplies items={[
              { ico: "🫂", label: "Aku mau ngobrol pelan dulu" },
              { ico: "📞", label: "Hubungi psikolog terdekat" },
              { ico: "💭", label: "Cerita lebih dalam" },
            ]}/>
          </div>
        </div>
        <Composer placeholder="Cerita pelan saja, sebanyak yang kamu mau..."/>
      </main>
    </div>
  );
}

// ============ CRISIS L4 (Takeover) ============
function CrisisTakeoverScreen() {
  return (
    <div className="cs-app">
      <Sidebar />
      <main className="cs-main">
        <TopBar/>
        <div className="cs-chat">
          <div className="cs-chat-inner" style={{ opacity: 0.3, filter: "blur(2px)" }}>
            <Bubble who="user" stamp="22:18">
              <p>Aku nggak mau bangun lagi besok. Aku capek...</p>
            </Bubble>
            <Bubble who="kawan">
              <p>...</p>
            </Bubble>
          </div>
        </div>
        <div className="cs-takeover">
          <span className="cs-takeover-eyebrow"><ChatIcon.Heart/>Aku khawatir denganmu sekarang</span>
          <h2 className="cs-takeover-title">Kamu penting. Hidupmu penting. Aku di sini bersamamu.</h2>
          <p className="cs-takeover-sub">
            Apa yang kamu rasakan sekarang berat sekali, dan aku ingin kamu bicara dengan seseorang yang bisa benar-benar membantu malam ini. Bukan untuk menghakimi — untuk menemani.
          </p>
          <a href="tel:119" className="cs-takeover-119">
            <span className="ico"><ChatIcon.Phone/></span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
              <span className="lbl">Hotline 24 jam · gratis</span>
              <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span className="num">119</span>
                <span className="name">SEJIWA · Kemenkes RI</span>
              </span>
            </span>
          </a>
          <div className="cs-takeover-grid">
            {PSIKOLOG.map((p, i) => (
              <a key={i} href="#" className="cs-takeover-card">
                <span className="av" style={{ background: p.color }}>{p.initial}</span>
                <span className="nm">{p.name}</span>
                <span className="tg">
                  {p.tags.slice(0, 2).map((t, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <span className="dot"/>}
                      <span>{t}</span>
                    </React.Fragment>
                  ))}
                </span>
                <span className="price"><span className="p">{p.price}</span><span className="cta">Hubungi</span></span>
              </a>
            ))}
          </div>
          <div className="cs-takeover-foot">
            <a href="#">Bicara dengan orang terdekat</a>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>·</span>
            <a href="#">Latihan napas singkat</a>
          </div>
          <button className="cs-takeover-resume">Aku aman sekarang, lanjut ngobrol →</button>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, {
  MoodScreen, DisclaimerScreen, EmptyChatScreen, MidChatScreen,
  CrisisBannerScreen, CrisisTakeoverScreen,
});
