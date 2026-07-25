'use client'

import { useEffect, useRef } from 'react'
import { Phone, Heart, Users } from 'lucide-react'
import { MOCK_PSIKOLOG } from '@/lib/chat/mock-data'
import { PsikologCard } from './psikolog-card'

interface CrisisTakeoverProps {
  onResume: () => void
}

function OrangTerdekatCard() {
  return (
    <a href="#" className="cs-takeover-card" aria-label="Hubungi orang terdekat — aku bantu susun pesannya">
      <span className="av" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)' }}>
        <Users size={16} aria-hidden="true" />
      </span>
      <span className="nm">Orang terdekat</span>
      <span className="tg">Aku bantu susun pesan singkat ke orang yang kamu percaya.</span>
      <span className="price">
        <span className="p">Bikin pesan</span>
        <span className="cta">Hubungi</span>
      </span>
    </a>
  )
}

export function CrisisTakeover({ onResume }: CrisisTakeoverProps) {
  const resumeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    resumeRef.current?.focus()
  }, [])

  return (
    <div
      className="cs-takeover"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="takeover-title"
      aria-describedby="takeover-desc"
    >
      <span className="cs-takeover-eyebrow">
        <Heart size={14} aria-hidden="true" /> Aku khawatir denganmu sekarang
      </span>

      <h2 id="takeover-title" className="cs-takeover-title">
        Kamu penting. Hidupmu penting. Aku di sini bersamamu.
      </h2>

      <p id="takeover-desc" className="cs-takeover-sub">
        Apa yang kamu rasakan sekarang berat sekali, dan aku ingin kamu bicara dengan seseorang
        yang bisa benar-benar membantu malam ini. Bukan untuk menghakimi — untuk menemani.
      </p>

      <a href="tel:119" className="cs-takeover-119" aria-label="Hubungi hotline 119 SEJIWA — tersedia 24 jam, gratis">
        <span className="ico" aria-hidden="true">
          <Phone size={28} />
        </span>
        <span>
          <span className="lbl">Hotline 24 jam · gratis</span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="num">119</span>
            <span className="name">SEJIWA · Kemenkes RI</span>
          </span>
        </span>
      </a>

      <div className="cs-takeover-grid" role="list" aria-label="Psikolog yang bisa dihubungi">
        {MOCK_PSIKOLOG.slice(0, 2).map((p) => (
          <div key={p.initial} role="listitem">
            <PsikologCard psikolog={p} variant="takeover" />
          </div>
        ))}
        <div role="listitem">
          <OrangTerdekatCard />
        </div>
      </div>

      <div className="cs-takeover-foot">
        <a href="#">Hubungi orang terdekat</a>
        <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
        <a href="#">Latihan napas singkat</a>
      </div>

      <button
        ref={resumeRef}
        className="cs-takeover-resume"
        type="button"
        onClick={onResume}
      >
        Aku aman sekarang, lanjut ngobrol →
      </button>
    </div>
  )
}
