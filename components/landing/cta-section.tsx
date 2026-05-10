import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="k-final">
          <h2 className="relative z-[1] text-white max-w-[720px] mx-auto" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Kalau hari ini terasa berat, kamu nggak harus sendirian.
          </h2>
          <p className="relative z-[1] text-white/[0.78] mt-5 text-[18px] max-w-[580px] mx-auto leading-[1.6]">
            Mulai dengan satu kalimat. Itu sudah cukup. Kami menemani sisanya.
          </p>
          <div className="relative z-[1] mt-9 flex gap-3.5 justify-center flex-wrap">
            <Link href="/check-in" className="k-btn inline-flex items-center gap-2 rounded-full font-semibold" style={{ background: "white", color: "#0a1633", padding: "18px 32px", fontSize: 16 }}>
              Coba Ngobrol Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:119" className="k-btn inline-flex items-center rounded-full font-semibold" style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "18px 28px", fontSize: 16 }}>
              Hubungi 119 SEJIWA
            </a>
          </div>
          <div className="relative z-[1] mt-6 text-[13px] text-white/60">
            Anonim · Gratis · Tersedia 24 jam
          </div>
        </div>
      </div>
    </section>
  )
}
