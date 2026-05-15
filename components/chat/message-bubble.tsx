import type { Sender } from '@/lib/chat/types'

interface MessageBubbleProps {
  sender: Sender
  text: string
  timestamp: Date
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ sender, text, timestamp }: MessageBubbleProps) {
  const avatar = sender === 'kawan' ? 'K' : 'A'
  const lines = text.split('\n').filter(Boolean)

  return (
    <div className={`cs-bubble-row ${sender}`}>
      <div className={`cs-bubble-av ${sender}`} aria-hidden="true">
        {avatar}
      </div>
      <div className={`cs-bubble ${sender}`}>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        <span className="stamp">{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}
