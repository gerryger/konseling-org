import { AlertTriangle, Phone } from 'lucide-react'
import { MOCK_PSIKOLOG } from '@/lib/chat/mock-data'
import { PsikologCard } from './psikolog-card'

interface CrisisBannerProps {
  onContinue: () => void
}

export function CrisisBanner({ onContinue }: CrisisBannerProps) {
  return (
    <div className="cs-crisis-banner" role="alert" aria-live="assertive">
      <div className="cs-crisis-head">
        <span className="cs-crisis-icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </span>
        <div>
          <div className="cs-crisis-title">Aku menangkap sinyal yang berat dari ceritamu.</div>
          <p className="cs-crisis-text">
            Apa yang kamu rasakan itu valid — dan kamu tidak harus menghadapinya sendiri.
            Aku ingin mengarahkanmu ke bantuan yang lebih siap mendengarkan saat ini.
          </p>
        </div>
      </div>

      <div className="cs-crisis-actions">
        <a href="tel:119" className="cs-crisis-btn primary">
          <Phone size={14} aria-hidden="true" /> Hubungi 119 SEJIWA
        </a>
        <button className="cs-crisis-btn ghost" type="button" onClick={onContinue}>
          Lanjut ngobrol dulu
        </button>
      </div>

      <div>
        <div className="cs-psikolog-list-label" aria-hidden="true">
          3 Psikolog terdekat — bisa dihubungi sekarang
        </div>
        <div role="list" aria-label="Psikolog yang bisa dihubungi">
          {MOCK_PSIKOLOG.map((p) => (
            <div key={p.initial} role="listitem">
              <PsikologCard psikolog={p} variant="banner" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
