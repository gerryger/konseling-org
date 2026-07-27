import { buildReferralEvent, emitReferralClick, EVENT_ENDPOINT } from '../../../lib/analytics/referral-events'

describe('referral events', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('buildReferralEvent', () => {
    it('builds an anonymous referral click envelope with psychologist metadata', () => {
      const event = buildReferralEvent('dr-rina-pertiwi', 'directory')
      expect(event).not.toBeNull()
      expect(event!.event).toBe('referral_click')
      expect(event!.visitorId).toBeTruthy()
      expect(event!.sessionId).toBeTruthy()
      expect(event!.psikologId).toBe('dr-rina-pertiwi')
      expect(event!.source).toBe('directory')
      expect(typeof event!.ts).toBe('string')
    })

    it('returns null when the psychologist id is blank', () => {
      expect(buildReferralEvent('   ', 'directory')).toBeNull()
    })
  })

  describe('emitReferralClick', () => {
    it('forwards the built payload to the referral endpoint', () => {
      const transport = jest.fn()
      emitReferralClick('dr-rina-pertiwi', 'crisis_banner', { transport })

      expect(transport).toHaveBeenCalledTimes(1)
      const [payload, endpoint] = transport.mock.calls[0]
      expect(payload.event).toBe('referral_click')
      expect(payload.psikologId).toBe('dr-rina-pertiwi')
      expect(payload.source).toBe('crisis_banner')
      expect(endpoint).toBe(EVENT_ENDPOINT)
    })

    it('is a safe no-op when storage identity cannot be read', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied')
      })
      const transport = jest.fn()

      emitReferralClick('dr-rina-pertiwi', 'crisis_takeover', { transport })

      expect(transport).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
