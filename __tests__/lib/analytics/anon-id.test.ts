import {
  getVisitorId,
  getSessionId,
  recordVisit,
  RETURN_VISIT_THRESHOLD_MS,
} from '../../../lib/analytics/anon-id'

describe('anon-id', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('getVisitorId', () => {
    it('creates and persists a token on first call, and returns the same value after', () => {
      const first = getVisitorId()
      expect(first).toBeTruthy()
      expect(localStorage.getItem('konseling.visitorId')).toBe(first)

      const second = getVisitorId()
      expect(second).toBe(first)
    })

    it('returns null when storage throws (private mode / disabled)', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied')
      })
      expect(getVisitorId()).toBeNull()
      spy.mockRestore()
    })
  })

  describe('getSessionId', () => {
    it('creates a per-visit token in sessionStorage and is stable within the visit', () => {
      const first = getSessionId()
      expect(first).toBeTruthy()
      expect(sessionStorage.getItem('konseling.sessionId')).toBe(first)
      expect(getSessionId()).toBe(first)
    })
  })

  describe('recordVisit', () => {
    it('returns false on a first-ever visit and stores lastVisitAt', () => {
      const now = 1_000_000
      expect(recordVisit(now)).toBe(false)
      expect(localStorage.getItem('konseling.lastVisitAt')).toBe(String(now))
    })

    it('returns true when the gap exceeds the threshold and updates lastVisitAt', () => {
      const first = 1_000_000
      recordVisit(first)
      const later = first + RETURN_VISIT_THRESHOLD_MS + 1
      expect(recordVisit(later)).toBe(true)
      expect(localStorage.getItem('konseling.lastVisitAt')).toBe(String(later))
    })

    it('returns false when the gap is within the threshold', () => {
      const first = 1_000_000
      recordVisit(first)
      const soon = first + RETURN_VISIT_THRESHOLD_MS - 1
      expect(recordVisit(soon)).toBe(false)
    })

    it('never throws and returns false when storage is unavailable', () => {
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('denied')
      })
      expect(() => recordVisit(1)).not.toThrow()
      expect(recordVisit(1)).toBe(false)
      spy.mockRestore()
    })
  })

  it('uses only konseling.-prefixed keys', () => {
    getVisitorId()
    getSessionId()
    recordVisit(1)
    const keys = [
      ...Object.keys(localStorage),
      ...Object.keys(sessionStorage),
    ]
    expect(keys.length).toBeGreaterThan(0)
    for (const key of keys) {
      expect(key.startsWith('konseling.')).toBe(true)
    }
  })
})
