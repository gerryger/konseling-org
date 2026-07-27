import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { MOCK_PSIKOLOG } from '@/lib/chat/mock-data'
import { PsikologCard } from '@/components/chat/psikolog-card'

export default function PsikologPage() {
  return (
    <div className="pt-24 pb-20">
      <section className="container mx-auto max-w-[1200px] px-8 space-y-10">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--color-outline-variant) bg-(--color-surface-low) px-4 py-2 text-[13px] font-semibold text-(--color-on-surface-variant)">
            <Sparkles size={14} aria-hidden="true" /> Direktori Psikolog Profesional
          </span>
          <h1 className="text-headline-lg text-on-surface">Temukan psikolog yang cocok buat kamu</h1>
          <p className="text-body-md text-on-surface-variant leading-[1.7] max-w-2xl">
            Kamu bisa lihat profil tiap psikolog, lalu lanjut ke kontak yang tersedia untuk booking.
            Kami hanya menyimpan metadata klik secara anonim, bukan isi percakapan.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {MOCK_PSIKOLOG.map((psikolog) => (
            <PsikologCard key={psikolog.id} psikolog={psikolog} variant="directory" />
          ))}
        </div>

        <section
          id="dukung-kami"
          className="rounded-[28px] border border-(--color-outline-variant) bg-(--color-surface-low) px-6 py-7 sm:px-8 sm:py-8 grid gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-center"
        >
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(74,144,226,0.12)] px-4 py-1.5 text-[13px] font-semibold text-(--color-primary)">
              <ShieldCheck size={14} aria-hidden="true" /> Dukung layanan ini
            </span>
            <h2 className="text-headline-sm text-on-surface">Bantu kami tetap gratis untuk yang butuh</h2>
            <p className="text-body-md text-on-surface-variant leading-[1.7] max-w-2xl">
              Kalau kamu merasa terbantu, kamu bisa mendukung pengembangan Konseling.org supaya
              fitur pendamping awal dan rujukan psikolog tetap bisa diakses lebih banyak orang.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href="mailto:halo@konseling.org?subject=Dukung%20Konseling.org"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-primary) px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(74,144,226,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} aria-hidden="true" /> Dukung kami
            </a>
            <p className="text-[13px] text-(--color-on-surface-variant) max-w-sm text-left lg:text-right leading-[1.6]">
              Dukung ini sifatnya opsional — akses bantuan tetap terbuka untuk semua.
            </p>
          </div>
        </section>
      </section>
    </div>
  )
}
