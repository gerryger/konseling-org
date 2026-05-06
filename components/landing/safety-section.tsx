import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"

const safetyPoints = [
  "Anonimitas terjamin untuk setiap sesi refleksi.",
  "Filter krisis otomatis untuk deteksi risiko dini.",
  "Data terenkripsi dengan standar medis internasional.",
]

export function SafetySection() {
  return (
    <section className="py-20 px-12 bg-surface-low">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Image side */}
        <div className="lg:w-1/2 order-2 lg:order-1">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-primary-fixed to-secondary-fixed aspect-square flex items-center justify-center">
              <p className="text-on-surface-variant text-sm font-medium">
                Illustration — Safety Principle
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.04)] max-w-[240px] border border-surface-variant">
              <p className="text-sm font-medium text-primary">
                &ldquo;Kenyamanan Anda adalah prioritas utama kami dalam setiap interaksi.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="lg:w-1/2 order-1 lg:order-2 space-y-6">
          <h2 className="text-[32px] leading-[1.3] font-bold">
            Prinsip &lsquo;Safety over Conversation&rsquo;
          </h2>
          <p className="text-lg leading-relaxed text-on-surface-variant">
            Kami percaya bahwa percakapan yang bermakna hanya dapat terjadi dalam lingkungan yang aman.
            Kami menempatkan protokol keamanan dan privasi di atas segalanya.
          </p>
          <ul className="space-y-4">
            {safetyPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-medium">{point}</span>
              </li>
            ))}
          </ul>
          <div className="pt-4">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
            >
              Baca Selengkapnya tentang Privasi
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
