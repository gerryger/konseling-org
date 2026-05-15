import { ArrowRight } from 'lucide-react'
import type { Psikolog } from '@/lib/chat/types'

interface PsikologCardProps {
  psikolog: Psikolog
  variant?: 'banner' | 'takeover'
}

export function PsikologCard({ psikolog, variant = 'banner' }: PsikologCardProps) {
  if (variant === 'takeover') {
    return (
      <a href="#" className="cs-takeover-card">
        <span className="av" style={{ background: psikolog.gradient }}>{psikolog.initial}</span>
        <span className="nm">{psikolog.name}</span>
        <span className="tg">
          {psikolog.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {i > 0 && <span className="dot" />}
              {tag}
            </span>
          ))}
        </span>
        <span className="price">
          <span className="p">{psikolog.price}</span>
          <span className="cta">Hubungi</span>
        </span>
      </a>
    )
  }

  return (
    <div className="cs-psikolog">
      <div className="cs-psikolog-av" style={{ background: psikolog.gradient }}>
        {psikolog.initial}
      </div>
      <div className="cs-psikolog-meta">
        <div className="cs-psikolog-name">{psikolog.name}</div>
        <div className="cs-psikolog-tags">
          {psikolog.tags.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              {i > 0 && <span className="cs-psikolog-tag-dot" />}
              {tag}
            </span>
          ))}
        </div>
      </div>
      <a href="#" className="cs-psikolog-cta">
        Hubungi <ArrowRight size={12} />
      </a>
    </div>
  )
}
