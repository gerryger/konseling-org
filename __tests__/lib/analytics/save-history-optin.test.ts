import { getSaveHistoryOptIn, setSaveHistoryOptIn } from '../../../lib/analytics/save-history-optin'

describe('save-history-optin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns false when the flag has never been set', () => {
    expect(getSaveHistoryOptIn()).toBe(false)
  })

  it('persists the opt-in flag under a konseling.-prefixed key', () => {
    setSaveHistoryOptIn()
    expect(localStorage.getItem('konseling.saveHistoryOptIn')).toBe('true')
    expect(getSaveHistoryOptIn()).toBe(true)
  })

  it('never throws when storage is unavailable', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(() => getSaveHistoryOptIn()).not.toThrow()
    expect(getSaveHistoryOptIn()).toBe(false)
    spy.mockRestore()
  })

  it('never throws when storage write is unavailable', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(() => setSaveHistoryOptIn()).not.toThrow()
    spy.mockRestore()
  })
})
