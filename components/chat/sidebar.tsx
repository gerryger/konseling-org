'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { MOCK_HISTORY } from '@/lib/chat/mock-data'
import { emitEvent } from '@/lib/analytics/events'
import { getSaveHistoryOptIn, setSaveHistoryOptIn } from '@/lib/analytics/save-history-optin'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  activeId?: string
}

export function Sidebar({ isOpen, onClose, activeId = 'today-1' }: SidebarProps) {
  const historyOptInStored = useSyncExternalStore(
    () => () => {},
    getSaveHistoryOptIn,
    () => false,
  )
  const [confirmedThisSession, setConfirmedThisSession] = useState(false)
  const historyOptIn = historyOptInStored || confirmedThisSession

  function handleOptIn() {
    if (historyOptIn) return
    setSaveHistoryOptIn()
    emitEvent('save_history_optin')
    setConfirmedThisSession(true)
  }

  return (
    <>
      {isOpen && (
        <div
          className="cs-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`cs-sidebar${isOpen ? ' open' : ''}`} aria-label="Riwayat percakapan">
        <Link href="/" className="cs-logo" aria-label="Konseling.org — kembali ke beranda">
          <span className="cs-logo-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </span>
          <span>konseling<span className="cs-logo-tail">.org</span></span>
        </Link>

        <button className="cs-new-chat" type="button" aria-label="Mulai chat baru">
          <Plus size={16} aria-hidden="true" /> Chat baru
        </button>

        <div className="cs-history-label" aria-hidden="true">Riwayat</div>

        <nav className="cs-history" aria-label="Daftar percakapan">
          {MOCK_HISTORY.map((group) => (
            <div key={group.day}>
              <div className="cs-history-day">{group.day}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`cs-history-item${item.id === activeId ? ' active' : ''}`}
                  type="button"
                  aria-current={item.id === activeId ? 'page' : undefined}
                >
                  <span className="emo" aria-hidden="true">{item.emoji}</span>
                  <span className="meta">
                    <span className="title">{item.title}</span>
                    <span className="time">{item.time}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="cs-account">
          <div className="av" aria-hidden="true">A</div>
          <div className="info">
            <div className="n">Anonim</div>
            {historyOptIn ? (
              <div
                className="s"
                title="Ini baru menandai minatmu — riwayat beneran belum tersimpan, nyusul ya."
              >
                Ditandai, makasih
              </div>
            ) : (
              <button className="s cs-optin" type="button" onClick={handleOptIn}>
                Simpan riwayat ke sini?
              </button>
            )}
          </div>
          <button
            className="login"
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Login — segera hadir"
            title="Fitur login segera hadir"
          >
            Segera hadir
          </button>
        </div>
      </aside>
    </>
  )
}
