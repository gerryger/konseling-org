'use client'

import { Shield, MessageSquare, Lock, AlertTriangle, ArrowRight } from 'lucide-react'
import { Sidebar } from './sidebar'

export const DISCLAIMER_KEY = 'konseling.disclaimerAccepted'

interface DisclaimerScreenProps {
  onAccept: () => void
}

export function DisclaimerScreen({ onAccept }: DisclaimerScreenProps) {
  function handleAccept() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISCLAIMER_KEY, 'true')
    }
    onAccept()
  }

  return (
    <div className="cs-disclaimer-screen">
      <Sidebar />

      <div className="cs-disclaimer-stage">
        <div className="cs-mood-progress" aria-label="Langkah 2 dari 3">
          <span className="step active" />
          <span className="step active" />
          <span className="step" />
        </div>

        <div className="cs-disclaimer-card" role="main">
          <div className="cs-disclaimer-icon" aria-hidden="true">
            <Shield size={22} />
          </div>

          <h2 className="cs-disclaimer-title">Sebelum kita mulai</h2>

          <p className="cs-disclaimer-sub">
            Beberapa hal penting yang perlu kamu tahu — supaya percakapan ini jadi yang paling membantu untukmu.
          </p>

          <ul className="cs-disclaimer-list" aria-label="Ketentuan penggunaan">
            <li>
              <span className="ic" aria-hidden="true"><MessageSquare size={16} /></span>
              <div>
                <h5>Aku adalah AI, bukan psikolog</h5>
                <p>Aku bisa menemani refleksi awal. Untuk diagnosis dan terapi, kamu perlu profesional bersertifikat.</p>
              </div>
            </li>
            <li>
              <span className="ic" aria-hidden="true"><Lock size={16} /></span>
              <div>
                <h5>Anonim &amp; rahasia</h5>
                <p>Tidak perlu identitas asli. Percakapan dijaga sebaik mungkin dan tidak digunakan untuk iklan.</p>
              </div>
            </li>
            <li>
              <span className="ic warn" aria-hidden="true"><AlertTriangle size={16} /></span>
              <div>
                <h5>Saat ada tanda krisis</h5>
                <p>Aku akan langsung menghentikan obrolan biasa dan mengarahkanmu ke 119 SEJIWA atau psikolog terdekat — keselamatanmu yang utama.</p>
              </div>
            </li>
          </ul>

          <button
            className="cs-disclaimer-cta"
            type="button"
            onClick={handleAccept}
          >
            Mengerti, mulai ngobrol <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
