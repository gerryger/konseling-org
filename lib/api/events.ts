// Server sink for anonymous retention events.
//
// Validates against a strict field allowlist and REJECTS any unexpected field (e.g.
// `content`, `text`, `message`) rather than silently dropping it, so a future careless
// caller fails loudly. Persistence is best-effort: a failing sink never fails the
// request, and instrumentation must never affect the crisis flow.

import type { Mood } from '../chat/types'

export type RetentionEventName = 'session_start' | 'return_visit' | 'mood_checkin'
export type MoodBucket = Mood | 'skipped'

export interface RetentionEventRow {
  event: RetentionEventName
  visitorId: string
  sessionId: string
  ts: string
  mood?: MoodBucket
}

const EVENT_NAMES: readonly RetentionEventName[] = ['session_start', 'return_visit', 'mood_checkin']
const MOODS: readonly Mood[] = ['senang', 'biasa', 'lelah', 'cemas', 'hancur']
const ALLOWED_FIELDS = new Set(['event', 'visitorId', 'sessionId', 'ts', 'mood'])

// Guards against abuse / accidental payload bloat. These are opaque tokens + ISO string.
const MAX_TOKEN_LENGTH = 200
const MAX_TS_LENGTH = 40

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max
}

function isEventName(value: unknown): value is RetentionEventName {
  return EVENT_NAMES.includes(value as RetentionEventName)
}

function isMoodBucket(value: unknown): value is MoodBucket {
  return value === 'skipped' || MOODS.includes(value as Mood)
}

export function validateEventBody(
  body: unknown,
): { ok: true; value: RetentionEventRow } | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: 'Request body must be a JSON object' }
  }

  // Reject any field outside the allowlist — the core privacy guarantee.
  for (const key of Object.keys(body)) {
    if (!ALLOWED_FIELDS.has(key)) {
      return { ok: false, error: `Unexpected field "${key}" is not allowed` }
    }
  }

  if (!isEventName(body.event)) {
    return { ok: false, error: 'event must be one of session_start, return_visit, mood_checkin' }
  }

  if (!isNonEmptyString(body.visitorId, MAX_TOKEN_LENGTH)) {
    return { ok: false, error: 'visitorId must be a non-empty token' }
  }

  if (!isNonEmptyString(body.sessionId, MAX_TOKEN_LENGTH)) {
    return { ok: false, error: 'sessionId must be a non-empty token' }
  }

  if (!isNonEmptyString(body.ts, MAX_TS_LENGTH)) {
    return { ok: false, error: 'ts must be a non-empty timestamp string' }
  }

  if (body.event === 'mood_checkin') {
    if (!isMoodBucket(body.mood)) {
      return { ok: false, error: 'mood must be a mood bucket or "skipped" for mood_checkin' }
    }
  } else if (body.mood !== undefined) {
    return { ok: false, error: `mood is only allowed for mood_checkin` }
  }

  const value: RetentionEventRow = {
    event: body.event,
    visitorId: body.visitorId,
    sessionId: body.sessionId,
    ts: body.ts,
  }
  if (body.event === 'mood_checkin') {
    value.mood = body.mood as MoodBucket
  }

  return { ok: true, value }
}

export type EventSink = (row: RetentionEventRow) => Promise<void>

// Default persistence sink. Inserts one row per event into Supabase `retention_events`.
//
// STUB until infra is provisioned: if Supabase env vars are unset (current repo state —
// no tables, no service key), this is a safe no-op. The table + RLS anon-insert policy
// live in `supabase/migrations/*_retention_events.sql`. No column ever holds message text.
async function defaultSink(row: RetentionEventRow): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, key)
  await supabase.from('retention_events').insert({
    event: row.event,
    visitor_id: row.visitorId,
    session_id: row.sessionId,
    mood: row.mood ?? null,
  })
}

export async function handleEventsRequest(
  request: Request,
  deps?: { sink?: EventSink },
): Promise<Response> {
  const body = await request.json().catch(() => null)
  const validation = validateEventBody(body)

  if (validation.ok === false) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  // Best-effort: a failing sink is swallowed so a broken pipe never surfaces to the
  // user or blocks anything. Message content can never reach here (allowlist above).
  try {
    await (deps?.sink ?? defaultSink)(validation.value)
  } catch {
    // Intentionally ignored.
  }

  return new Response(null, { status: 202 })
}
