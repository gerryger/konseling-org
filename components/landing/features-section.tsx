import Link from "next/link"
import { BookOpen, Users } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-20 px-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[32px] leading-[1.3] font-bold">Fitur &amp; Sumber Daya</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Large card: Chatbot — spans 2 cols × 2 rows */}
          <div className="md:col-span-2 md:row-span-2 bg-primary-container text-on-primary-container p-10 rounded-[32px] flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Chatbot Pendamping 24/7</h3>
              <p className="text-lg opacity-90 max-w-[400px]">
                Teman bicara yang selalu ada untuk mendengarkan keluh kesah Anda,
                kapan pun dan di mana pun.
              </p>
            </div>
            <div className="relative z-10">
              <Link
                href="/check-in"
                className="inline-block bg-white text-primary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Mulai Percakapan
              </Link>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Small card 1: Reflection Library */}
          <div className="bg-secondary-fixed p-8 rounded-[32px] flex flex-col gap-4 border border-secondary-container">
            <BookOpen className="w-10 h-10 text-secondary" aria-hidden="true" />
            <h4 className="font-bold text-xl">Perpustakaan Refleksi</h4>
            <p className="text-sm opacity-80">
              Ratusan artikel dan panduan untuk kesehatan mental Anda.
            </p>
          </div>

          {/* Small card 2: Community */}
          <div className="bg-tertiary-fixed p-8 rounded-[32px] flex flex-col gap-4 border border-tertiary-container">
            <Users className="w-10 h-10 text-tertiary" aria-hidden="true" />
            <h4 className="font-bold text-xl">Komunitas Pendukung</h4>
            <p className="text-sm opacity-80">
              Berbagi pengalaman dengan mereka yang mengerti posisi Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
