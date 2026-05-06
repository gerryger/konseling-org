import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"

interface SafetyPoint {
  title: string
  description: string
}

const safetyPoints: SafetyPoint[] = [
  {
    title: "Anonimitas Terjaga",
    description: "Tidak ada data identitas yang diperlukan untuk memulai",
  },
  {
    title: "Filter Krisis AI",
    description: "Sistem deteksi otomatis untuk melindungi pengguna berisiko tinggi",
  },
  {
    title: "Enkripsi End-to-End",
    description: "Semua percakapan dilindungi dengan enkripsi TLS 1.3",
  },
]

export function SafetySection() {
  return (
    <section className="py-section bg-secondary-fixed">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-10">
          <blockquote className="text-headline-md italic text-on-surface leading-[1.4]">
            &ldquo;Kenyamanan Anda adalah prioritas utama kami dalam setiap interaksi.&rdquo;
          </blockquote>

          <div className="space-y-4 text-left max-w-md mx-auto">
            {safetyPoints.map(({ title, description }) => (
              <div key={title} className="flex gap-3">
                <ShieldCheck
                  className="w-5 h-5 text-secondary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-on-surface text-sm">{title}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="#"
            className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
          >
            Baca Selengkapnya
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
