import { Menu, MoreHorizontal, Phone } from 'lucide-react'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="cs-topbar" role="banner">
      <button
        className="cs-hamburger"
        onClick={onMenuClick}
        type="button"
        aria-label="Buka menu navigasi"
      >
        <Menu size={18} />
      </button>

      <div className="cs-kawan-av" aria-hidden="true">K</div>
      <div className="cs-kawan-meta">
        <div className="cs-kawan-name">Kawan</div>
        <div className="cs-kawan-status">
          <span className="dot" aria-hidden="true" />
          Pendamping AI · Online
        </div>
      </div>

      <div className="cs-topbar-spacer" />

      <a href="tel:119" className="cs-emergency" aria-label="Hubungi hotline 119 SEJIWA">
        <Phone size={14} aria-hidden="true" />
        <span className="label">119 SEJIWA</span>
      </a>

      <button className="cs-icon-btn" type="button" aria-label="Lainnya">
        <MoreHorizontal size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
