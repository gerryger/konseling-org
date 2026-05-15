'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { Mood } from '@/lib/chat/types'
import { Sidebar } from './sidebar'

const MOODS: { id: Mood; emoji: string; label: string; sub: string }[] = [
  { id: 'senang', emoji: '😊', label: 'Senang', sub: 'Lega' },
  { id: 'biasa',  emoji: '🙂', label: 'Biasa',  sub: 'Datar' },
  { id: 'lelah',  emoji: '😔', label: 'Lelah',  sub: 'Capek' },
  { id: 'cemas',  emoji: '😟', label: 'Cemas',  sub: 'Khawatir' },
  { id: 'hancur', emoji: '😢', label: 'Hancur', sub: 'Berat' },
]

interface MoodScreenProps {
  onContinue: (mood?: Mood) => void
}

export function MoodScreen({ onContinue }: MoodScreenProps) {
  const [selected, setSelected] = useState<Mood | undefined>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="cs-mood-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="cs-mood-stage">
        <div className="cs-mood-progress" aria-label="Langkah 1 dari 3">
          <span className="step active" />
          <span className="step" />
          <span className="step" />
        </div>

        <div className="cs-mood-card" role="main">
          <span className="cs-mood-eyebrow">
            <Sparkles size={14} aria-hidden="true" /> Check-in perasaan
          </span>

          <h1 className="cs-mood-title">Halo, gimana kabarmu sekarang?</h1>

          <p className="cs-mood-sub">
            Tidak ada jawaban yang salah. Pilih yang paling mendekati — kita akan mulai dari sana.
          </p>

          <div className="cs-mood-grid" role="group" aria-label="Pilih perasaanmu">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                className={`cs-mood-btn${selected === mood.id ? ' selected' : ''}`}
                type="button"
                onClick={() => setSelected(mood.id)}
                aria-pressed={selected === mood.id}
                aria-label={`${mood.label} — ${mood.sub}`}
              >
                <span className="em" aria-hidden="true">{mood.emoji}</span>
                <span className="lbl">{mood.label}</span>
                <span className="sub">{mood.sub}</span>
              </button>
            ))}
          </div>

          <div className="cs-mood-foot">
            <button
              className="cs-mood-skip"
              type="button"
              onClick={() => onContinue(undefined)}
            >
              Lewati, langsung ngobrol
            </button>
            <button
              className="cs-mood-cta"
              type="button"
              disabled={!selected}
              onClick={() => onContinue(selected)}
            >
              Lanjutkan <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
