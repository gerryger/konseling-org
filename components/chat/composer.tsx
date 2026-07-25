'use client'

import { useRef, useEffect } from 'react'
import { Mic, Send } from 'lucide-react'

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
}

export function Composer({
  value,
  onChange,
  onSend,
  placeholder = 'Ketik apa yang kamu rasakan...',
  disabled = false,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) onSend()
    }
  }

  return (
    <div className="cs-composer-wrap">
      <div className="cs-composer">
        <button
          className="cs-tool-btn"
          type="button"
          aria-label="Input suara (tidak tersedia)"
          disabled
        >
          <Mic size={18} aria-hidden="true" />
        </button>

        <textarea
          ref={textareaRef}
          className="cs-composer-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Ketik pesan untuk Kawan"
          disabled={disabled}
        />

        <button
          className="cs-send"
          type="button"
          aria-label="Kirim pesan"
          disabled={!value.trim() || disabled}
          onClick={onSend}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="cs-composer-foot" aria-label="Informasi privasi">
        <span>Anonim · Rahasia</span>
        <span aria-hidden="true">•</span>
        <a href="#">Pengaturan privasi</a>
        <span aria-hidden="true">•</span>
        <span>Bukan pengganti psikolog</span>
      </div>
    </div>
  )
}
