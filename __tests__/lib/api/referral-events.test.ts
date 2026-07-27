/**
 * @jest-environment node
 */
import { handleReferralEventsRequest, validateReferralEventBody } from '../../../lib/api/referral-events'

function post(body: unknown): Request {
  return new Request('http://localhost/api/referral-events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validReferralEvent = {
  event: 'referral_click',
  visitorId: 'v-123',
  sessionId: 's-123',
  ts: '2026-07-27T00:00:00.000Z',
  psikologId: 'dr-rina-pertiwi',
  source: 'directory',
}

describe('validateReferralEventBody', () => {
  it('accepts a well-formed referral click payload', () => {
    expect(validateReferralEventBody(validReferralEvent).ok).toBe(true)
  })

  it('rejects any field outside the allowlist', () => {
    const result = validateReferralEventBody({ ...validReferralEvent, content: 'aku ingin booking' })
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown source', () => {
    const result = validateReferralEventBody({ ...validReferralEvent, source: 'footer' })
    expect(result.ok).toBe(false)
  })

  it('rejects a non-object body', () => {
    expect(validateReferralEventBody(null).ok).toBe(false)
    expect(validateReferralEventBody('nope').ok).toBe(false)
  })
})

describe('handleReferralEventsRequest', () => {
  it('returns 202 for a valid event and forwards a content-free row to the sink', async () => {
    const sink = jest.fn().mockResolvedValue(undefined)
    const res = await handleReferralEventsRequest(post(validReferralEvent), { sink })

    expect(res.status).toBe(202)
    expect(sink).toHaveBeenCalledTimes(1)
    const row = sink.mock.calls[0][0]
    expect(row).toEqual({
      event: 'referral_click',
      visitorId: 'v-123',
      sessionId: 's-123',
      ts: '2026-07-27T00:00:00.000Z',
      psikologId: 'dr-rina-pertiwi',
      source: 'directory',
    })
  })

  it('returns 400 for a payload with a disallowed field, and never calls the sink', async () => {
    const sink = jest.fn()
    const res = await handleReferralEventsRequest(post({ ...validReferralEvent, message: 'halo' }), { sink })
    expect(res.status).toBe(400)
    expect(sink).not.toHaveBeenCalled()
  })

  it('still returns 202 when the sink throws', async () => {
    const sink = jest.fn().mockRejectedValue(new Error('db down'))
    const res = await handleReferralEventsRequest(post(validReferralEvent), { sink })
    expect(res.status).toBe(202)
  })
})
