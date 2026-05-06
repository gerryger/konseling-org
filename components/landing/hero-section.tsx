import Link from "next/link"
import { ShieldCheck } from "lucide-react"

export function HeroSection() {
  return (
    <section
      className="py-24 px-12"
      style={{ background: "linear-gradient(135deg, #f7f9fb 0%, #dde1ff 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-on-primary-fixed rounded-full text-sm font-semibold tracking-wide">
            <ShieldCheck className="w-[18px] h-[18px]" aria-hidden="true" />
            Pendampingan Setia dalam Krisis
          </div>

          <h1 className="text-[40px] leading-[1.2] font-extrabold tracking-tight text-on-surface">
            Teman Setia untuk Kesehatan Mental Anda.
          </h1>

          <p className="text-lg leading-relaxed text-on-surface-variant max-w-[600px]">
            Dapatkan kejernihan mental melalui proses check-in yang tenang, terarah, dan profesional.
            Kami hadir untuk membantu Anda memahami diri lebih dalam.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/check-in"
              className="px-8 py-4 rounded-full bg-primary text-on-primary text-lg font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Mulai Check-in
            </Link>
            <Link
              href="#process"
              className="px-8 py-4 rounded-full bg-surface text-primary border border-outline-variant text-lg font-semibold tracking-wide hover:bg-surface-container transition-all"
            >
              Pelajari Program
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-fixed to-secondary-fixed aspect-[4/3] flex items-center justify-center">
            <p className="text-on-surface-variant text-sm font-medium">
              Illustration — Emotional Support
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
