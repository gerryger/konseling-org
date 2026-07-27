import { getSessionId, getVisitorId } from './anon-id';
import type { ReferralSource } from '../chat/types';

export type ReferralEventName = 'referral_click';

export interface ReferralEvent {
  event: ReferralEventName;
  visitorId: string;
  sessionId: string;
  ts: string;
  psikologId: string;
  source: ReferralSource;
}

export const EVENT_ENDPOINT = '/api/referral-events';

export interface ReferralEventTransportDeps {
  transport?: (payload: ReferralEvent, endpoint: string) => void;
  endpoint?: string;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function buildReferralEvent(psikologId: string, source: ReferralSource): ReferralEvent | null {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  if (!visitorId || !sessionId || !hasText(psikologId)) {
    return null;
  }

  return {
    event: 'referral_click',
    visitorId,
    sessionId,
    ts: new Date().toISOString(),
    psikologId: psikologId.trim(),
    source,
  };
}

function defaultTransport(payload: ReferralEvent, endpoint: string) {
  void fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
}

export function emitReferralClick(
  psikologId: string,
  source: ReferralSource,
  deps?: ReferralEventTransportDeps,
): void {
  try {
    const payload = buildReferralEvent(psikologId, source)
    if (!payload) return

    const transport = deps?.transport ?? defaultTransport
    transport(payload, deps?.endpoint ?? EVENT_ENDPOINT)
  } catch {
    // Best-effort only.
  }
}
