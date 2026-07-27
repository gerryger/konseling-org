import type { ReferralSource } from '../chat/types';

export interface ReferralEventRow {
  event: 'referral_click';
  visitorId: string;
  sessionId: string;
  ts: string;
  psikologId: string;
  source: ReferralSource;
}

interface ValidationOk {
  ok: true;
  value: ReferralEventRow;
}

interface ValidationErr {
  ok: false;
  error: string;
}

export type ValidationResult = ValidationOk | ValidationErr;

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isReferralSource(value: unknown): value is ReferralSource {
  return value === 'directory' || value === 'crisis_banner' || value === 'crisis_takeover';
}

function hasOnlyAllowedFields(body: Record<string, unknown>): boolean {
  const allowed = new Set(['event', 'visitorId', 'sessionId', 'ts', 'psikologId', 'source'])
  return Object.keys(body).every((key) => allowed.has(key))
}

export function validateReferralEventBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Body must be a JSON object' }
  }

  const record = body as Record<string, unknown>
  if (!hasOnlyAllowedFields(record)) {
    return { ok: false, error: 'Unexpected field in referral event payload' }
  }

  if (
    record.event !== 'referral_click' ||
    !isString(record.visitorId) ||
    !record.visitorId.trim() ||
    !isString(record.sessionId) ||
    !record.sessionId.trim() ||
    !isString(record.ts) ||
    !record.ts.trim() ||
    !isString(record.psikologId) ||
    !record.psikologId.trim() ||
    !isReferralSource(record.source)
  ) {
    return { ok: false, error: 'Referral event payload failed validation' }
  }

  return {
    ok: true,
    value: {
      event: 'referral_click',
      visitorId: record.visitorId.trim(),
      sessionId: record.sessionId.trim(),
      ts: record.ts.trim(),
      psikologId: record.psikologId.trim(),
      source: record.source,
    },
  }
}

async function defaultSink(row: ReferralEventRow): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return
  }

  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error } = await client.from('referral_events').insert({
    event: row.event,
    visitor_id: row.visitorId,
    session_id: row.sessionId,
    psikolog_id: row.psikologId,
    source: row.source,
  })

  if (error) {
    throw error
  }
}

export async function handleReferralEventsRequest(
  request: Request,
  options?: { sink?: (row: ReferralEventRow) => Promise<void> },
): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 })
  }

  const result = validateReferralEventBody(body)
  if (!result.ok) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 })
  }

  try {
    await (options?.sink ?? defaultSink)(result.value)
  } catch {
    // Best-effort persistence.
  }

  return new Response(JSON.stringify({ ok: true }), { status: 202 })
}
