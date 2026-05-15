interface QuickReplyItem {
  emoji?: string
  label: string
}

interface QuickRepliesProps {
  items: QuickReplyItem[]
  onSelect: (label: string) => void
}

export function QuickReplies({ items, onSelect }: QuickRepliesProps) {
  return (
    <div className="cs-quick-replies">
      {items.map((item) => (
        <button
          key={item.label}
          className="cs-chip"
          onClick={() => onSelect(item.label)}
          type="button"
        >
          {item.emoji && <span className="ico" aria-hidden="true">{item.emoji}</span>}
          {item.label}
        </button>
      ))}
    </div>
  )
}
