import { BookOpen, Users, UserPlus, Lock } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-24 bg-(--color-surface-low)" id="fitur">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-[720px] mb-12">
          <span className="k-eyebrow"><span className="dot" />Fitur &amp; Sumber Daya</span>
          <h2 className="k-h2 mt-4">
            Semua yang kamu butuhkan,<br /><span className="k-grad-text">dalam satu tempat yang aman.</span>
          </h2>
          <p className="text-[18px] mt-4 text-(--color-on-surface-variant) leading-[1.65]">
            Dirancang untuk menemanimu di setiap momen — saat butuh ngobrol, saat butuh refleksi, atau saat butuh bantuan profesional.
          </p>
        </div>

        <div className="k-bento">
          <div className="k-bento-card k-bento-hero">
            <div className="glow" aria-hidden />
            <span className="tag">Inti dari Konseling.org</span>
            <h3 className="text-[30px] font-extrabold leading-[1.15] mt-4 max-w-[360px] text-white">
              AI Pendamping 24/7 — selalu ada untuk mendengar.
            </h3>
            <p className="text-white/85 mt-3.5 max-w-[380px] text-[15px] leading-[1.6] m-0">
              Teman ngobrol yang sabar, empatik, dan tidak menghakimi. Saat semua orang sibuk, kami tetap di sini.
            </p>
            <div className="mt-auto pt-7 flex flex-col gap-2">
              <div className="k-bento-bubble">Halo, gimana harimu hari ini? Cerita aja kalau mau.</div>
              <div className="k-bento-bubble user">Lagi capek banget rasanya...</div>
              <div className="k-bento-bubble">Lelah itu sinyal yang valid. Aku dengerin — apa yang paling bikin capek?</div>
            </div>
          </div>

          <BentoSmall variant="lib" icon={<BookOpen className="w-[22px] h-[22px]" />} title="Perpustakaan refleksi" desc="Panduan, latihan grounding, dan bacaan singkat untuk menemanimu memahami diri." stats={[{ n: "120+", l: "Artikel" }, { n: "25", l: "Latihan" }]} />
          <BentoSmall variant="komunitas" icon={<Users className="w-[22px] h-[22px]" />} title="Komunitas pendukung" desc="Berbagi cerita anonim dengan mereka yang mengerti — saling menguatkan, tanpa menghakimi." stats={[{ n: "8.5K", l: "Member" }, { n: "Anonim", l: "By default" }]} />
          <BentoSmall variant="psikolog" icon={<UserPlus className="w-[22px] h-[22px]" />} title="Direktori psikolog" desc="Cari psikolog bersertifikat HIMPSI berdasarkan keahlian, kota, dan tarif." stats={[{ n: "50+", l: "Mitra psikolog" }, { n: "12", l: "Kota" }]} />
          <BentoSmall variant="aman" icon={<Lock className="w-[22px] h-[22px]" />} title="Privasi yang dijaga" desc="Anonim secara default. Percakapan dijaga sebaik mungkin. Tidak ada percakapan yang dijual atau dipakai untuk iklan." stats={[{ n: "Privat", l: "By default" }, { n: "0", l: "Iklan / tracker" }]} />
        </div>
      </div>
    </section>
  )
}

function BentoSmall({ variant, icon, title, desc, stats }: { variant: string; icon: React.ReactNode; title: string; desc: string; stats: { n: string; l: string }[] }) {
  return (
    <div className={`k-bento-card ${variant}`}>
      <span className="ic">{icon}</span>
      <h3 className="text-[22px] font-bold leading-[1.3]">{title}</h3>
      <p className="text-[14px] text-(--color-on-surface-variant) leading-[1.55] m-0">{desc}</p>
      <div className="stats-mini">
        {stats.map(s => (
          <div key={s.l} className="flex flex-col gap-0.5">
            <span className="n">{s.n}</span>
            <span className="l">{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
