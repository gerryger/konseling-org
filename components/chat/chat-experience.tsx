'use client'

import { useReducer, useState, useCallback, useEffect, useRef } from 'react'
import type { ChatMessage, ChatPhase, Mood } from '@/lib/chat/types'
import { detectCrisis } from '@/lib/chat/crisis-detection'
import { streamChat } from '@/lib/api/chat-client'
import { emitEvent } from '@/lib/analytics/events'
import { recordVisit } from '@/lib/analytics/anon-id'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { Composer } from './composer'
import { ChatStream } from './chat-stream'
import { QuickReplies } from './quick-replies'
import { MoodScreen } from './mood-screen'
import { DisclaimerScreen, DISCLAIMER_KEY } from './disclaimer-screen'
import { CrisisBanner } from './crisis-banner'
import { CrisisTakeover } from './crisis-takeover'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'initial',
  sender: 'kawan',
  text: 'Halo, senang kamu mampir 🙂\nAku Kawan. Aku bakal dengerin pelan-pelan, tanpa menghakimi.\nKalau kamu mau, ceritain aja apa yang paling berat sekarang.',
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

const STREAM_ERROR_REPLY = 'Maaf, koneksi ke Kawan lagi bermasalah. Coba kirim pesan itu lagi, ya.'

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  isStreaming: boolean
  showBanner: boolean
  showTakeover: boolean
  bannerTriggerMsgId?: string
}

type Action =
  | { type: 'ADD_MSG'; msg: ChatMessage }
  | { type: 'SET_TYPING'; value: boolean }
  | { type: 'SET_STREAMING'; value: boolean }
  | { type: 'APPEND_STREAM_DELTA'; id: string; delta: string }
  | { type: 'SHOW_BANNER'; triggerMsgId: string }
  | { type: 'SHOW_TAKEOVER' }
  | { type: 'DISMISS_TAKEOVER' }

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'ADD_MSG':
      return { ...state, messages: [...state.messages, action.msg] }
    case 'SET_TYPING':
      return { ...state, isTyping: action.value }
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.value }
    case 'APPEND_STREAM_DELTA':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.id ? { ...msg, text: msg.text + action.delta } : msg,
        ),
      }
    case 'SHOW_BANNER':
      return state.showBanner || state.showTakeover
        ? state
        : { ...state, showBanner: true, bannerTriggerMsgId: action.triggerMsgId }
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

function toApiMessages(messages: ChatMessage[]) {
  return messages.map((msg) => ({
    role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
    content: msg.text,
  }))
}

export function ChatExperience() {
  const [phase, setPhase] = useState<ChatPhase>('mood')
  const [composerValue, setComposerValue] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const visitRecordedRef = useRef(false)
  const sessionStartedRef = useRef(false)

  const [chatState, dispatch] = useReducer(reducer, {
    messages: [INITIAL_MESSAGE],
    isTyping: false,
    isStreaming: false,
    showBanner: false,
    showTakeover: false,
    bannerTriggerMsgId: undefined,
  })

  useEffect(() => {
    if (chatState.showTakeover) {
      abortControllerRef.current?.abort()
    }
  }, [chatState.showTakeover])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  // Retention instrumentation (anonymous, content-free). Best-effort and fire-and-forget:
  // emitEvent never throws or blocks, so none of this can affect chat or the crisis flow.
  // Return-visit: fire once on load when this browser has a prior visit past the threshold.
  useEffect(() => {
    if (visitRecordedRef.current) return
    visitRecordedRef.current = true
    if (recordVisit()) emitEvent('return_visit')
  }, [])

  // Session start: fire exactly once when the user reaches the chat phase.
  useEffect(() => {
    if (phase !== 'chat' || sessionStartedRef.current) return
    sessionStartedRef.current = true
    emitEvent('session_start')
  }, [phase])

  function handleMoodContinue(mood?: Mood) {
    emitEvent('mood_checkin', { mood: mood ?? 'skipped' })
    const disclaimerAccepted =
      typeof window !== 'undefined' && localStorage.getItem(DISCLAIMER_KEY) === 'true'
    setPhase(disclaimerAccepted ? 'chat' : 'disclaimer')
  }

  function handleDisclaimerAccept() {
    setPhase('chat')
  }

  const streamAssistantReply = useCallback(async (history: ChatMessage[], bannerTriggerId: string) => {
    const controller = new AbortController()
    abortControllerRef.current = controller

    dispatch({ type: 'SET_STREAMING', value: true })
    dispatch({ type: 'SET_TYPING', value: true })

    const assistantMsgId = genId()
    let assistantStarted = false

    try {
      for await (const event of streamChat(toApiMessages(history), { signal: controller.signal })) {
        if (event.type === 'text') {
          if (!assistantStarted) {
            assistantStarted = true
            dispatch({ type: 'SET_TYPING', value: false })
            dispatch({
              type: 'ADD_MSG',
              msg: { id: assistantMsgId, sender: 'kawan', text: event.delta, timestamp: new Date() },
            })
          } else {
            dispatch({ type: 'APPEND_STREAM_DELTA', id: assistantMsgId, delta: event.delta })
          }
          continue
        }

        if (event.type === 'risk') {
          // Server risk events only ever add crisis UI, never remove it —
          // client-side detection already showed a banner/takeover immediately on send.
          if (event.risk.level === 'critical') {
            dispatch({ type: 'SHOW_TAKEOVER' })
            controller.abort()
          } else if (event.risk.level === 'high') {
            dispatch({ type: 'SHOW_BANNER', triggerMsgId: bannerTriggerId })
          }
          continue
        }

        if (event.type === 'error') {
          dispatch({
            type: 'ADD_MSG',
            msg: { id: genId(), sender: 'kawan', text: STREAM_ERROR_REPLY, timestamp: new Date() },
          })
          continue
        }

        if (event.type === 'psychologists') {
          // TODO: render psychologist recommendations — deferred to a later issue.
          continue
        }

        if (event.type === 'done') {
          // No-op: stream completion is handled by the for-await loop ending.
          continue
        }
      }
    } finally {
      dispatch({ type: 'SET_TYPING', value: false })
      dispatch({ type: 'SET_STREAMING', value: false })
      abortControllerRef.current = null
    }
  }, [])

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || chatState.isStreaming || chatState.showTakeover) return

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
        return
      } else if (level === 'high') {
        dispatch({ type: 'SHOW_BANNER', triggerMsgId: userMsg.id })
      }

      void streamAssistantReply([...chatState.messages, userMsg], userMsg.id)
    },
    [chatState.messages, chatState.isStreaming, chatState.showTakeover, streamAssistantReply],
  )

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
          <ChatStream
            messages={chatState.messages}
            isTyping={chatState.isTyping}
            isTakeoverActive={chatState.showTakeover}
            crisisBannerTriggerMsgId={chatState.showBanner ? chatState.bannerTriggerMsgId : undefined}
            crisisBanner={<CrisisBanner onContinue={() => {}} />}
          />

          {chatState.showTakeover && (
            <CrisisTakeover onResume={() => dispatch({ type: 'DISMISS_TAKEOVER' })} />
          )}
        </div>

        <div style={{ padding: '8px 32px 0', maxWidth: 752, margin: '0 auto', width: '100%' }}>
          <QuickReplies items={activeQuickReplies} onSelect={handleQuickReply} disabled={chatState.isStreaming || chatState.showTakeover} />
        </div>

        <Composer
          value={composerValue}
          onChange={setComposerValue}
          onSend={() => handleSend(composerValue)}
          placeholder={chatState.showBanner ? 'Cerita pelan saja, sebanyak yang kamu mau...' : undefined}
          disabled={chatState.isStreaming || chatState.showTakeover}
        />
      </main>
    </div>
  )
}
