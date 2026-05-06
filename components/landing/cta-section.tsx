import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 px-12">
      <div className="max-w-[1200px] mx-auto bg-surface-variant rounded-[48px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[40px] leading-[1.2] font-extrabold tracking-tight mb-4">
            Siap untuk Memulai Langkah Pertama?
          </h2>
          <p className="text-lg leading-relaxed text-on-surface-variant max-w-[640px] mx-auto">
            Bergabunglah dengan ribuan orang lainnya yang telah menemukan kedamaian
            melalui konseling.org.
          </p>
          <div className="pt-8">
            <Link
              href="/check-in"
              className="inline-block px-12 py-5 bg-primary text-on-primary rounded-full text-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Mulai Check-in Sekarang
            </Link>
          </div>
        </div>

        {/* Decorative blur shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary opacity-5 blur-[100px] pointer-events-none" />
      </div>
    </section>
  )
}
