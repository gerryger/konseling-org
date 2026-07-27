import { ArrowLeft, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReferralLink } from '@/components/chat/referral-link'
import { getPsychologistById } from '@/lib/chat/psychologists'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PsikologProfilePage({ params }: Props) {
  const { id } = await params
  const psikolog = getPsychologistById(id)

  if (!psikolog) {
    notFound()
  }

  return (
    <div className="pt-24 pb-20">
      <section className="container mx-auto max-w-[960px] px-8 space-y-8">
        <Link href="/psikolog" className="inline-flex items-center gap-2 text-[14px] font-semibold text-(--color-primary) hover:underline">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali ke direktori
        </Link>

        <section className="rounded-[28px] border border-(--color-outline-variant) bg-(--color-surface-low) px-6 py-7 sm:px-8 sm:py-8 space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-(--color-outline-variant) bg-(--color-surface-lowest) px-4 py-2 text-[13px] font-semibold text-(--color-on-surface-variant)">
                <Sparkles size={14} aria-hidden="true" /> Profil Psikolog
              </span>
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-[20px] text-[18px] font-extrabold text-white" style={{ background: psikolog.gradient }}>
                  {psikolog.initial}
                </span>
                <div>
                  <h1 className="text-headline-md text-on-surface">{psikolog.name}</h1>
                  <p className="text-body-md text-on-surface-variant">{psikolog.price}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {psikolog.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-(--color-surface-lowest) px-3 py-1 text-[13px] text-(--color-on-surface-variant)">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-body-md text-on-surface-variant leading-[1.75] max-w-2xl">
                {psikolog.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ReferralLink
              psikologId={psikolog.id}
              source="directory"
              href={psikolog.bookingUrl}
              ariaLabel={`Kirim permintaan booking untuk ${psikolog.name}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-primary) px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_rgba(74,144,226,0.25)] transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle size={16} aria-hidden="true" /> Kirim permintaan booking
            </ReferralLink>
            <Link
              href="/psikolog#dukung-kami"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-(--color-outline-variant) bg-white px-5 py-3 text-[14px] font-semibold text-(--color-on-surface) hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              <ShieldCheck size={16} aria-hidden="true" /> Dukung kami
            </Link>
          </div>

          <p className="text-[13px] text-(--color-on-surface-variant) leading-[1.6] max-w-2xl">
            Kami nggak menyimpan isi pesanmu. Klik ini cuma membuka kontak yang tersedia supaya
            kamu bisa lanjut booking dengan aman.
          </p>
        </section>
      </section>
    </div>
  )
}
