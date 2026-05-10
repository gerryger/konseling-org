"use client"

import { useEffect, useState } from "react"
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react"

type Mood = "senang" | "biasa" | "lelah" | "cemas" | "hancur"

const MOODS: { id: Mood; emoji: string; label: string; userText: string; aiReply: string }[] = [
  { id: "senang", emoji: "😊", label: "Senang", userText: "Aku senang hari ini.", aiReply: "Syukurlah. Kalau boleh tahu, hal apa yang bikin kamu merasa baik hari ini?" },
  { id: "biasa", emoji: "🙂", label: "Biasa", userText: "Hari ini biasa-biasa aja sih.", aiReply: "Kadang 'biasa saja' juga butuh ruang. Mau ceritakan harimu sebentar?" },
  { id: "lelah", emoji: "😔", label: "Lelah", userText: "Aku merasa capek banget...", aiReply: "Lelah itu valid. Kamu nggak harus produktif terus. Apa yang paling bikin capek?" },
  { id: "cemas", emoji: "😟", label: "Cemas", userText: "Pikiranku ramai banget, cemas.", aiReply: "Aku di sini. Ambil napas dulu — pelan-pelan. Ada hal spesifik yang bikin kamu cemas?" },
  { id: "hancur", emoji: "😢", label: "Hancur", userText: "Aku ngerasa hancur sekarang.", aiReply: "Kamu nggak sendirian. Aku dengerin sepenuhnya. Boleh cerita pelan-pelan?" },
]

export function HeroSection() {
  const [mood, setMood] = useState<Mood>("lelah")
  const [showUser, setShowUser] = useState(false)
  const [showAi, setShowAi] = useState(false)
  const [aiTyping, setAiTyping] = useState(true)

  useEffect(() => {
    setShowUser(false); setShowAi(false); setAiTyping(true)
    const t1 = setTimeout(() => setShowUser(true), 60)
    const t2 = setTimeout(() => setShowAi(true), 360)
    const t3 = setTimeout(() => setAiTyping(false), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [mood])

  const active = MOODS.find(m => m.id === mood)!

  return (
    <section className="k-hero">
      <div className="max-w-[1200px] mx-auto px-8 k-hero-grid">
        <div>
          <span className="k-eyebrow"><span className="dot" />Pendamping awal sebelum ke psikolog</span>
          <h1 className="k-h1 mt-5">
            <span className="block">Mau cerita,</span>
            <span className="block k-grad-text">tapi bingung ke siapa?</span>
          </h1>
          <p className="text-[19px] leading-[1.6] text-(--color-on-surface-variant) max-w-[540px] mt-5">
            Konseling.org adalah teman ngobrol berbasis AI yang menemani saat stres, cemas, atau merasa sendirian — tanpa menghakimi, tanpa menggurui. Kami bukan pengganti psikolog, tapi pendamping refleksi awal yang aman.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button className="k-btn k-btn-primary k-btn-lg" type="button">
              Coba Ngobrol Sekarang <ArrowRight className="w-4 h-4" />
            </button>
            <button className="k-btn k-btn-ghost k-btn-lg" type="button">Lihat cara kerjanya</button>
          </div>
          <div className="flex gap-6 flex-wrap mt-7 text-[13px] text-(--color-on-surface-variant)">
            <span className="inline-flex items-center gap-1.5 font-medium"><span className="text-(--color-primary) font-bold">✓</span> Anonim &amp; rahasia</span>
            <span className="inline-flex items-center gap-1.5 font-medium"><span className="text-(--color-primary) font-bold">✓</span> Gratis untuk dicoba</span>
            <span className="inline-flex items-center gap-1.5 font-medium"><span className="text-(--color-primary) font-bold">✓</span> Tersedia 24/7</span>
          </div>
        </div>

        <div className="k-hero-stage">
          <div className="k-float tl">
            <span className="icon"><ShieldCheck className="w-4 h-4" /></span>
            <div>
              <div className="text-[11px] text-(--color-on-surface-variant) font-semibold">Aman &amp; rahasia</div>
              <div className="text-[13px] font-bold">Tidak dihakimi</div>
            </div>
          </div>

          <div className="k-phone" aria-label="Pratinjau aplikasi check-in perasaan">
            <div className="k-phone-screen">
              <div className="k-phone-notch" />
              <div className="k-phone-status">
                <span>9:41</span>
                <span>● ●●●</span>
              </div>

              <div className="k-chat-greeting">
                <div className="flex items-center gap-2 mb-2">
                  <span className="k-ai-avatar">K</span>
                  <div>
                    <div className="text-[12px] font-bold text-[#1a1f3a]">Kawan</div>
                    <div className="text-[10px] text-[#5e3bdb] font-semibold inline-flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online sekarang
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-[1.5] text-[#2a2d40] m-0">
                  Halo, senang kamu mampir. Apa yang sedang kamu rasakan saat ini?
                </p>
              </div>

              <div className="k-mood-prompt">Pilih yang paling mendekati</div>
              <div className="k-mood-row">
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`k-mood-btn ${mood === m.id ? "active" : ""}`}
                    onClick={() => setMood(m.id)}
                    aria-label={`Pilih mood ${m.label}`}
                  >
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                    <span className="lbl">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className={`k-bubble-user ${showUser ? "show" : ""}`}>{active.userText}</div>
              <div className={`k-bubble-ai ${showAi ? "show" : ""}`}>
                {aiTyping ? (
                  <span className="k-typing"><span className="d" /><span className="d" /><span className="d" /></span>
                ) : active.aiReply}
              </div>
            </div>
          </div>

          <div className="k-float br">
            <span className="icon"><MessageSquare className="w-4 h-4" /></span>
            <div>
              <div className="text-[11px] text-(--color-on-surface-variant) font-semibold">Pendamping AI</div>
              <div className="text-[13px] font-bold">Aktif 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
