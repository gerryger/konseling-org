import { AlertTriangle, ShieldCheck, ArrowRight, Phone, Users, UserPlus, Lock, Heart, Clock, ShieldAlert } from "lucide-react"

const detectItems = ["Niat menyakiti diri sendiri", "Pikiran ingin mengakhiri hidup", "Putus asa & tidak ada harapan", "Pikiran negatif yang intens & berulang"]
const actionItems = ["Hentikan percakapan biasa", "Tampilkan Crisis Mode dengan pesan dukungan", "Berikan teknik penenangan singkat", "Arahkan ke bantuan terpercaya"]

export function SafetySection() {
  return (
    <section className="py-24" id="safety">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="max-w-[720px] mb-12">
          <span className="k-eyebrow"><span className="dot" />Safety System</span>
          <h2 className="k-h2 mt-4">
            Crisis Detection — kami <span className="k-grad-text">langsung bertindak</span> saat ada tanda risiko.
          </h2>
          <p className="text-[18px] mt-4 text-(--color-on-surface-variant) leading-[1.65]">
            Keamanan pengguna adalah prioritas utama. Saat sistem mendeteksi tanda-tanda krisis, percakapan biasa diberhentikan dan kamu diarahkan ke bantuan nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3.5 items-stretch">
            <div className="k-flow-card detect">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="ic"><AlertTriangle className="w-4 h-4" /></span>
                <h4 className="text-[14px] font-bold">Tanda yang dideteksi</h4>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {detectItems.map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-[13px]">
                    <span className="li-ic"><AlertTriangle className="w-3 h-3" /></span>{t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid place-items-center text-(--color-primary) sm:rotate-0 rotate-90">
              <ArrowRight className="w-7 h-7" />
            </div>

            <div className="k-flow-card action">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="ic"><ShieldCheck className="w-4 h-4" /></span>
                <h4 className="text-[14px] font-bold">Sistem otomatis</h4>
              </div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {actionItems.map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-[13px]">
                    <span className="li-ic"><ShieldAlert className="w-3 h-3" /></span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="text-[13px] font-bold uppercase tracking-[0.06em] text-(--color-on-surface-variant) mb-1">
              Kami arahkan kamu ke bantuan nyata
            </div>

            <ResourceCard variant="hotline" icon={<Phone className="w-[22px] h-[22px]" />} title="119 SEJIWA" suffix="· 24 jam" desc="Hotline kesehatan jiwa, Kemenkes RI. Gratis dari seluruh Indonesia." href="tel:119" />
            <ResourceCard variant="psikolog" icon={<UserPlus className="w-[22px] h-[22px]" />} title="Psikolog terpercaya" desc="Hubungi profesional bersertifikat HIMPSI dengan tarif terjangkau." href="/psikolog" />
            <ResourceCard variant="terdekat" icon={<Users className="w-[22px] h-[22px]" />} title="Orang terdekat" desc="Bantu kamu menyusun pesan untuk meminta dukungan dari orang yang dipercaya." href="#" />

            <div className="flex gap-2.5 items-center px-[18px] py-3.5 bg-(--color-surface-low) rounded-2xl text-[12px] text-(--color-on-surface-variant)">
              <Lock className="w-4 h-4 text-(--color-primary)" />
              Percakapan kamu aman dan rahasia. Kami hanya peduli pada keselamatan kamu.
            </div>
          </div>
        </div>

        <div className="k-principle mt-14">
          <span className="seal" aria-hidden><ShieldCheck className="w-7 h-7" /></span>
          <div className="lead-text">
            <h3 className="text-[22px] font-extrabold tracking-[-0.02em]">Prinsip kami: <span className="k-grad-text">Safety over conversation.</span></h3>
            <p className="text-[13px] mt-1 text-(--color-on-surface-variant) m-0">Kami selalu memilih keselamatan kamu di atas keberlanjutan percakapan.</p>
          </div>
          <div className="pri"><span className="ic"><Heart className="w-4 h-4" /></span><p className="text-[12px] leading-[1.45] text-(--color-on-surface) m-0">Utamakan keselamatan pengguna di atas segala hal.</p></div>
          <div className="pri"><span className="ic"><Clock className="w-4 h-4" /></span><p className="text-[12px] leading-[1.45] text-(--color-on-surface) m-0">Bantuan cepat, tepat, dan terpercaya.</p></div>
          <div className="pri"><span className="ic"><Lock className="w-4 h-4" /></span><p className="text-[12px] leading-[1.45] text-(--color-on-surface) m-0">Privasi &amp; kerahasiaan selalu terjaga.</p></div>
        </div>
      </div>
    </section>
  )
}

function ResourceCard({ variant, icon, title, suffix, desc, href }: { variant: "hotline" | "psikolog" | "terdekat"; icon: React.ReactNode; title: string; suffix?: string; desc: string; href: string }) {
  return (
    <a href={href} className={`k-resource ${variant}`}>
      <span className="ic">{icon}</span>
      <div>
        <h5 className="text-[15px] font-bold m-0 mb-0.5">{title} {suffix && <span className="text-(--color-on-surface-variant) font-medium text-[12px]">{suffix}</span>}</h5>
        <p className="text-[12px] text-(--color-on-surface-variant) m-0 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="w-[18px] h-[18px] text-(--color-outline)" />
    </a>
  )
}
