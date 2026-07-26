// Anonymous, content-free retention instrumentation — the client emitter.
//
// Exactly three event names, a strict field allowlist, and best-effort fire-and-forget
// transport. This layer NEVER carries chat content, message text, or PII (AGENTS.md §5,
// monetization design spec §8). `emitEvent` never throws and never blocks the UI or the
// crisis flow — failures are swallowed on purpose.

import type { Mood } from '../chat/types'
import { getSessionId, getVisitorId } from './anon-id'

export type RetentionEventName = 'session_start' | 'return_visit' | 'mood_checkin'

// The only free-form-ish value we ever send, and it is a closed set.
export type MoodBucket = Mood | 'skipped'

// The shared envelope. This is the complete allowlist of fields that may leave the
// browser — nothing else is ever attached.
export interface RetentionEvent {
  event: RetentionEventName
  visitorId: string
  sessionId: string
  ts: string
  mood?: MoodBucket
}

export const EVENT_ENDPOINT = '/api/events'

type Transport = (payload: RetentionEvent, endpoint: string) => void

interface EmitDeps {
  transport?: Transport
  endpoint?: string
}

// Builds the content-free envelope. Returns null when identity is unavailable
// (SSR or storage disabled), which makes emission a safe no-op there.
export function buildEvent(
  event: RetentionEventName,
  extra?: { mood?: MoodBucket },
): RetentionEvent | null {
  const visitorId = getVisitorId()
  const sessionId = getSessionId()
  if (!visitorId || !sessionId) return null

  const payload: RetentionEvent = {
    event,
    visitorId,
    sessionId,
    ts: new Date().toISOString(),
  }

  // `mood` is only meaningful for the mood check-in; never attach it otherwise.
  if (event === 'mood_checkin' && extra?.mood) {
    payload.mood = extra.mood
  }

  return payload
}

function defaultTransport(payload: RetentionEvent, endpoint: string): void {
  if (typeof fetch !== 'function') return
  // keepalive lets the beacon survive a page transition; errors are ignored so a
  // flaky network can never surface to the user.
  void fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}

// Fire-and-forget. Builds the envelope and hands it to the transport. Any failure —
// build, serialization, or transport — is swallowed.
export function emitEvent(
  event: RetentionEventName,
  extra?: { mood?: MoodBucket },
  deps?: EmitDeps,
): void {
  try {
    const payload = buildEvent(event, extra)
    if (!payload) return
    ;(deps?.transport ?? defaultTransport)(payload, deps?.endpoint ?? EVENT_ENDPOINT)
  } catch {
    // Instrumentation must never break the app.
  }
}
