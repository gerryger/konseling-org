import { buildEvent, emitEvent, EVENT_ENDPOINT } from '../../../lib/analytics/events'
import type { RetentionEvent } from '../../../lib/analytics/events'

describe('analytics events', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('buildEvent', () => {
    it('builds an envelope with visitorId, sessionId, ts and the event name', () => {
      const event = buildEvent('session_start')
      expect(event).not.toBeNull()
      expect(event!.event).toBe('session_start')
      expect(event!.visitorId).toBeTruthy()
      expect(event!.sessionId).toBeTruthy()
      expect(typeof event!.ts).toBe('string')
      // No mood on a non-mood event.
      expect(event!.mood).toBeUndefined()
    })

    it('attaches mood only for mood_checkin', () => {
      const checkin = buildEvent('mood_checkin', { mood: 'cemas' })
      expect(checkin!.mood).toBe('cemas')

      // A stray mood on another event is dropped.
      const start = buildEvent('session_start', { mood: 'cemas' })
      expect(start!.mood).toBeUndefined()
    })

    it('never carries a field outside the allowlist', () => {
      const event = buildEvent('mood_checkin', { mood: 'skipped' })
      const allowed = new Set(['event', 'visitorId', 'sessionId', 'ts', 'mood'])
      for (const key of Object.keys(event as RetentionEvent)) {
        expect(allowed.has(key)).toBe(true)
      }
    })
  })

  describe('emitEvent', () => {
    it('hands the built envelope to the transport at the events endpoint', () => {
      const transport = jest.fn()
      emitEvent('session_start', undefined, { transport })
      expect(transport).toHaveBeenCalledTimes(1)
      const [payload, endpoint] = transport.mock.calls[0]
      expect(payload.event).toBe('session_start')
      expect(payload.visitorId).toBeTruthy()
      expect(endpoint).toBe(EVENT_ENDPOINT)
    })

    it('resolves without throwing when the transport fails', () => {
      const transport = jest.fn(() => {
        throw new Error('network down')
      })
      expect(() => emitEvent('return_visit', undefined, { transport })).not.toThrow()
    })

    it('is a safe no-op when identity is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied')
      })
      const transport = jest.fn()
      emitEvent('session_start', undefined, { transport })
      expect(transport).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })
})
