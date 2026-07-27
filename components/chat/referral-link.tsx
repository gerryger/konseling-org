'use client'

import type { ReactNode } from 'react'
import { emitReferralClick } from '@/lib/analytics/referral-events'
import type { ReferralSource } from '@/lib/chat/types'

interface ReferralLinkProps {
  psikologId: string
  source: ReferralSource
  href: string
  children: ReactNode
  className?: string
  ariaLabel?: string
}

export function ReferralLink({ psikologId, source, href, children, className, ariaLabel }: ReferralLinkProps) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => emitReferralClick(psikologId, source)}
    >
      {children}
    </a>
  )
}
