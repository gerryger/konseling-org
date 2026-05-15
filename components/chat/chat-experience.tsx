'use client'

import { useReducer, useState, useCallback, useEffect, useRef } from 'react'
import type { ChatMessage, ChatPhase, Mood } from '@/lib/chat/types'
import { detectCrisis } from '@/lib/chat/crisis-detection'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { Composer } from './composer'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { QuickReplies } from './quick-replies'
import { MoodScreen } from './mood-screen'
import { DisclaimerScreen, DISCLAIMER_KEY } from './disclaimer-screen'
import { CrisisBanner } from './crisis-banner'
import { CrisisTakeover } from './crisis-takeover'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial',
  sender: 'kawan',
  text: 'Halo, senang kamu mampir 🙂\nAku Kawan. Tidak ada agenda di sini — kita ngobrol pelan-pelan aja, sesuai kenyamananmu.\nKalau boleh tahu, ada apa yang bikin kamu memutuskan buat cerita malam ini?',
  timestamp: new Date(),
}

const INITIAL_QUICK_REPLIES = [
  { emoji: '💭', label: 'Pikiranku ramai' },
  { emoji: '😔', label: 'Lagi capek aja' },
  { emoji: '💔', label: 'Habis berantem' },
  { emoji: '🌧️', label: 'Sedih, tapi bingung kenapa' },
  { emoji: '✍️', label: 'Aku tulis sendiri' },
]

const CRISIS_L3_QUICK_REPLIES = [
  { emoji: '🫂', label: 'Aku mau ngobrol pelan dulu' },
  { emoji: '📞', label: 'Hubungi psikolog terdekat' },
  { emoji: '💭', label: 'Cerita lebih dalam' },
]

const DUMMY_REPLY = 'Aku dengerin. Ceritain lebih lanjut, ya.'
const CRISIS_L3_REPLY =
  'Aku nggak akan langsung kasih solusi. Aku cuma mau bilang: aku dengerin, dan kamu nggak harus melewati ini sendirian.\nKalau kamu mau, kita bisa ngobrol pelan dulu — atau kamu bisa langsung kontak salah satu di atas. Apa pun pilihanmu, aku temenin.'

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  showBanner: boolean
  showTakeover: boolean
  bannerTriggerMsgId?: string
}

type Action =
  | { type: 'ADD_MSG'; msg: ChatMessage }
  | { type: 'SET_TYPING'; value: boolean }
  | { type: 'SHOW_BANNER'; triggerMsgId: string }
  | { type: 'SHOW_TAKEOVER' }
  | { type: 'DISMISS_TAKEOVER' }

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'ADD_MSG':
      return { ...state, messages: [...state.messages, action.msg] }
    case 'SET_TYPING':
      return { ...state, isTyping: action.value }
    case 'SHOW_BANNER':
      return { ...state, showBanner: true, bannerTriggerMsgId: action.triggerMsgId }
    case 'SHOW_TAKEOVER':
      return { ...state, showTakeover: true }
    case 'DISMISS_TAKEOVER':
      return { ...state, showTakeover: false }
    default:
      return state
  }
}

function genId(): string {
  return Math.random().toString(36).slice(2)
}

export function ChatExperience() {
  const [phase, setPhase] = useState<ChatPhase>('mood')
  const [composerValue, setComposerValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)

  const [chatState, dispatch] = useReducer(reducer, {
    messages: [INITIAL_MESSAGE],
    isTyping: false,
    showBanner: false,
    showTakeover: false,
    bannerTriggerMsgId: undefined,
  })

  // Auto-scroll on new messages / typing
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatState.messages, chatState.isTyping, chatState.showBanner])

  function handleMoodContinue(_mood?: Mood) {
    const disclaimerAccepted =
      typeof window !== 'undefined' && localStorage.getItem(DISCLAIMER_KEY) === 'true'
    setPhase(disclaimerAccepted ? 'chat' : 'disclaimer')
  }

  function handleDisclaimerAccept() {
    setPhase('chat')
  }

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return

    const level = detectCrisis(text)
    const userMsg: ChatMessage = {
      id: genId(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
      crisisLevel: level !== 'none' ? level : undefined,
    }

    dispatch({ type: 'ADD_MSG', msg: userMsg })
    setComposerValue('')

    if (level === 'critical') {
      dispatch({ type: 'SHOW_TAKEOVER' })
    } else if (level === 'high') {
      dispatch({ type: 'SHOW_BANNER', triggerMsgId: userMsg.id })
    }

    dispatch({ type: 'SET_TYPING', value: true })
    setTimeout(() => {
      dispatch({ type: 'SET_TYPING', value: false })
      const replyText = level === 'high' ? CRISIS_L3_REPLY : DUMMY_REPLY
      dispatch({
        type: 'ADD_MSG',
        msg: {
          id: genId(),
          sender: 'kawan',
          text: replyText,
          timestamp: new Date(),
        },
      })
    }, 1600)
  }, [])

  function handleQuickReply(label: string) {
    if (label === 'Aku tulis sendiri') return
    handleSend(label)
  }

  if (phase === 'mood') return <MoodScreen onContinue={handleMoodContinue} />
  if (phase === 'disclaimer') return <DisclaimerScreen onAccept={handleDisclaimerAccept} />

  const activeQuickReplies = chatState.showBanner ? CRISIS_L3_QUICK_REPLIES : INITIAL_QUICK_REPLIES

  return (
    <div className="cs-app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="cs-main">
        <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />

        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div
            className="cs-chat"
            role="log"
            aria-live="polite"
            aria-label="Percakapan dengan Kawan"
          >
            <div className={`cs-chat-inner${chatState.showTakeover ? ' blurred' : ''}`}>
              <div className="cs-day-divider">Mulai sekarang</div>
              {chatState.messages.map((msg) => (
                <div key={msg.id}>
                  <MessageBubble
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.timestamp}
                  />
                  {chatState.showBanner && chatState.bannerTriggerMsgId === msg.id && (
                    <CrisisBanner onContinue={() => {}} />
                  )}
                </div>
              ))}
              {chatState.isTyping && <TypingIndicator />}
              <div ref={scrollAnchorRef} />
            </div>
          </div>

          {chatState.showTakeover && (
            <CrisisTakeover onResume={() => dispatch({ type: 'DISMISS_TAKEOVER' })} />
          )}
        </div>

        <div style={{ padding: '8px 32px 0', maxWidth: 752, margin: '0 auto', width: '100%' }}>
          <QuickReplies items={activeQuickReplies} onSelect={handleQuickReply} />
        </div>

        <Composer
          value={composerValue}
          onChange={setComposerValue}
          onSend={() => handleSend(composerValue)}
          placeholder={chatState.showBanner ? 'Cerita pelan saja, sebanyak yang kamu mau...' : undefined}
        />
      </main>
    </div>
  )
}
