import type { CrisisLevel, Psikolog } from '../chat/types'

export interface ChatStreamRequestMessage {
  role: 'user' | 'assistant'
  content: string
}

export type ChatStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'risk'; risk: { score: number; level: CrisisLevel; shouldEscalate: boolean } }
  | { type: 'psychologists'; psychologists: Psikolog[] }
  | { type: 'done'; stopReason: string }
  | { type: 'error'; message: string }

export interface StreamChatOptions {
  endpoint?: string
  signal?: AbortSignal
  fetchImpl?: typeof fetch
}

const DEFAULT_ENDPOINT = '/api/chat'
const GENERIC_ERROR_MESSAGE = 'Ada gangguan koneksi. Coba lagi sebentar lagi, ya.'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isCrisisLevel(value: unknown): value is CrisisLevel {
  return value === 'none' || value === 'mild' || value === 'moderate' || value === 'high' || value === 'critical'
}

function parseRiskPayload(payload: Record<string, unknown>): { score: number; level: CrisisLevel; shouldEscalate: boolean } | null {
  if (
    typeof payload.score !== 'number' ||
    !isCrisisLevel(payload.level) ||
    typeof payload.shouldEscalate !== 'boolean'
  ) {
    return null
  }

  return { score: payload.score, level: payload.level, shouldEscalate: payload.shouldEscalate }
}

function toChatStreamEvent(eventName: string, payload: unknown): ChatStreamEvent | null {
  if (!isRecord(payload)) return null

  switch (eventName) {
    case 'text':
      return typeof payload.delta === 'string' ? { type: 'text', delta: payload.delta } : null
    case 'risk': {
      const risk = parseRiskPayload(payload)
      return risk ? { type: 'risk', risk } : null
    }
    case 'psychologists':
      return Array.isArray(payload.psychologists)
        ? { type: 'psychologists', psychologists: payload.psychologists as Psikolog[] }
        : null
    case 'done':
      return typeof payload.stopReason === 'string' ? { type: 'done', stopReason: payload.stopReason } : null
    case 'error':
      return typeof payload.message === 'string' ? { type: 'error', message: payload.message } : null
    default:
      return null
  }
}

function parseSseFrame(frame: string): ChatStreamEvent | null {
  let eventName = 'message'
  let dataLine: string | undefined

  for (const line of frame.split('\n')) {
    if (line.startsWith('event: ')) {
      eventName = line.slice('event: '.length)
    } else if (line.startsWith('data: ')) {
      dataLine = line.slice('data: '.length)
    }
  }

  if (dataLine === undefined) return null

  let payload: unknown
  try {
    payload = JSON.parse(dataLine)
  } catch {
    return null
  }

  return toChatStreamEvent(eventName, payload)
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null)
  if (isRecord(body) && typeof body.error === 'string' && body.error.trim()) {
    return body.error
  }
  return GENERIC_ERROR_MESSAGE
}

// Client-safe SSE parser: POSTs to the chat endpoint (EventSource can't send a
// request body) and yields structured events parsed from `event:`/`data:` frames.
export async function* streamChat(
  messages: ChatStreamRequestMessage[],
  options?: StreamChatOptions,
): AsyncGenerator<ChatStreamEvent, void, void> {
  const endpoint = options?.endpoint ?? DEFAULT_ENDPOINT

  const fetchImpl = options?.fetchImpl ?? fetch

  let response: Response
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal: options?.signal,
    })
  } catch (error) {
    if (isAbortError(error)) return
    yield { type: 'error', message: GENERIC_ERROR_MESSAGE }
    return
  }

  if (!response.ok) {
    yield { type: 'error', message: await extractErrorMessage(response) }
    return
  }

  if (!response.body) {
    yield { type: 'error', message: GENERIC_ERROR_MESSAGE }
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      let boundary = buffer.indexOf('\n\n')
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary + 2)
        const event = parseSseFrame(frame)
        if (event) yield event
        boundary = buffer.indexOf('\n\n')
      }
    }
  } catch (error) {
    if (!isAbortError(error)) {
      yield { type: 'error', message: GENERIC_ERROR_MESSAGE }
    }
  } finally {
    reader.releaseLock()
  }
}
