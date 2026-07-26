/**
 * @jest-environment node
 */
import { validateEventBody, handleEventsRequest } from '../../../lib/api/events'

// The events sink is server-side; run under the node environment where Request/Response
// are real globals (jsdom does not provide them).
function post(body: unknown): Request {
  return new Request('http://localhost/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validSessionStart = {
  event: 'session_start',
  visitorId: 'v-123',
  sessionId: 's-123',
  ts: '2026-07-26T00:00:00.000Z',
}

describe('validateEventBody', () => {
  it('accepts a well-formed session_start', () => {
    const result = validateEventBody(validSessionStart)
    expect(result.ok).toBe(true)
  })

  it('accepts a mood_checkin carrying a valid mood bucket', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'mood_checkin', mood: 'cemas' })
    expect(result.ok).toBe(true)
  })

  it('accepts a mood_checkin with "skipped"', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'mood_checkin', mood: 'skipped' })
    expect(result.ok).toBe(true)
  })

  it('accepts a well-formed save_history_optin', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'save_history_optin' })
    expect(result.ok).toBe(true)
  })

  it('rejects mood on a save_history_optin event', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'save_history_optin', mood: 'cemas' })
    expect(result.ok).toBe(false)
  })

  it('rejects any field outside the allowlist (privacy guarantee)', () => {
    const result = validateEventBody({ ...validSessionStart, content: 'aku merasa sedih sekali' })
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown event name', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'page_view' })
    expect(result.ok).toBe(false)
  })

  it('rejects mood on a non-mood event', () => {
    const result = validateEventBody({ ...validSessionStart, mood: 'cemas' })
    expect(result.ok).toBe(false)
  })

  it('rejects a mood_checkin with an out-of-set mood', () => {
    const result = validateEventBody({ ...validSessionStart, event: 'mood_checkin', mood: 'euphoric' })
    expect(result.ok).toBe(false)
  })

  it('rejects a missing visitor token', () => {
    const result = validateEventBody({ event: 'session_start', sessionId: 's', ts: 't' })
    expect(result.ok).toBe(false)
  })

  it('rejects a non-object body', () => {
    expect(validateEventBody(null).ok).toBe(false)
    expect(validateEventBody('nope').ok).toBe(false)
  })
})

describe('handleEventsRequest', () => {
  it('returns 202 for a valid event and forwards a content-free row to the sink', async () => {
    const sink = jest.fn().mockResolvedValue(undefined)
    const res = await handleEventsRequest(
      post({ ...validSessionStart, event: 'mood_checkin', mood: 'lelah' }),
      { sink },
    )
    expect(res.status).toBe(202)
    expect(sink).toHaveBeenCalledTimes(1)
    const row = sink.mock.calls[0][0]
    expect(row).toEqual({
      event: 'mood_checkin',
      visitorId: 'v-123',
      sessionId: 's-123',
      ts: '2026-07-26T00:00:00.000Z',
      mood: 'lelah',
    })
  })

  it('returns 400 for a payload with a disallowed field, and never calls the sink', async () => {
    const sink = jest.fn()
    const res = await handleEventsRequest(post({ ...validSessionStart, message: 'halo' }), { sink })
    expect(res.status).toBe(400)
    expect(sink).not.toHaveBeenCalled()
  })

  it('still returns 202 when the sink throws (best-effort persistence)', async () => {
    const sink = jest.fn().mockRejectedValue(new Error('db down'))
    const res = await handleEventsRequest(post(validSessionStart), { sink })
    expect(res.status).toBe(202)
  })
})
