'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/lib/chat/types'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'

interface ChatStreamProps {
  messages: ChatMessage[]
  isTyping: boolean
  isTakeoverActive: boolean
  crisisBannerTriggerMsgId?: string
  crisisBanner?: React.ReactNode
}

export function ChatStream({ messages, isTyping, isTakeoverActive, crisisBannerTriggerMsgId, crisisBanner }: ChatStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div
      className="cs-chat"
      role="log"
      aria-live="polite"
      aria-label="Percakapan dengan Kawan"
    >
      <div className={`cs-chat-inner${isTakeoverActive ? ' blurred' : ''}`}>
        <div className="cs-day-divider">Mulai sekarang</div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble
              sender={msg.sender}
              text={msg.text}
              timestamp={msg.timestamp}
            />
            {crisisBannerTriggerMsgId === msg.id && crisisBanner}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
