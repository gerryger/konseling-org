import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPsychologistProfileHref } from '@/lib/chat/psychologists'
import type { Psikolog, ReferralSource } from '@/lib/chat/types'
import { ReferralLink } from './referral-link'

interface PsikologCardProps {
  psikolog: Psikolog
  variant?: 'banner' | 'takeover' | 'directory'
  source?: ReferralSource
}

export function PsikologCard({ psikolog, variant = 'banner', source = 'directory' }: PsikologCardProps) {
  if (variant === 'takeover') {
    return (
      <ReferralLink
        psikologId={psikolog.id}
        source={source}
        href={psikolog.bookingUrl}
        className="cs-takeover-card"
        ariaLabel={`Hubungi ${psikolog.name} sekarang`}
      >
        <span className="av" style={{ background: psikolog.gradient }}>{psikolog.initial}</span>
        <span className="nm">{psikolog.name}</span>
        <span className="tg">
          {psikolog.tags.slice(0, 2).map((tag, i) => (
            <span key={tag} className="inline-flex items-center gap-1">
              {i > 0 && <span className="dot" />}
              {tag}
            </span>
          ))}
        </span>
        <span className="price">
          <span className="p">{psikolog.price}</span>
          <span className="cta">Hubungi sekarang</span>
        </span>
      </ReferralLink>
    )
  }

  if (variant === 'directory') {
    return (
      <div className="cs-psikolog">
        <div className="cs-psikolog-av" style={{ background: psikolog.gradient }}>
          {psikolog.initial}
        </div>
        <div className="cs-psikolog-meta">
          <div className="cs-psikolog-name">{psikolog.name}</div>
          <div className="cs-psikolog-tags">
            {psikolog.tags.map((tag, i) => (
              <span key={tag} className="inline-flex items-center gap-1">
                {i > 0 && <span className="cs-psikolog-tag-dot" />}
                {tag}
              </span>
            ))}
          </div>
        </div>
        <Link href={getPsychologistProfileHref(psikolog.id)} className="cs-psikolog-cta" aria-label={`Lihat profil ${psikolog.name}`}>
          Lihat profil <ArrowRight size={12} />
        </Link>
      </div>
    )
  }

  return (
    <ReferralLink
      psikologId={psikolog.id}
      source={source}
      href={psikolog.bookingUrl}
      className="cs-psikolog"
      ariaLabel={`Hubungi ${psikolog.name} sekarang`}
    >
      <span className="cs-psikolog-av" style={{ background: psikolog.gradient }}>
        {psikolog.initial}
      </span>
      <span className="cs-psikolog-meta">
        <span className="cs-psikolog-name">{psikolog.name}</span>
        <span className="cs-psikolog-tags">
          {psikolog.tags.map((tag, i) => (
            <span key={tag} className="inline-flex items-center gap-1">
              {i > 0 && <span className="cs-psikolog-tag-dot" />}
              {tag}
            </span>
          ))}
        </span>
      </span>
      <span className="cs-psikolog-cta">
        Hubungi <ArrowRight size={12} />
      </span>
    </ReferralLink>
  )
}
