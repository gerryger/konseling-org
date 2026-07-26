import {
  SAVE_HISTORY_KEY,
  getSaveHistoryOptIn,
  setSaveHistoryOptIn,
} from '@/lib/chat/save-history-signal'

describe('save-history-signal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('uses the konseling-prefixed key', () => {
    expect(SAVE_HISTORY_KEY).toBe('konseling.saveHistoryOptIn')
  })

  it('defaults to false when nothing is stored', () => {
    expect(getSaveHistoryOptIn()).toBe(false)
  })

  it('round-trips true and false through localStorage', () => {
    setSaveHistoryOptIn(true)
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('true')
    expect(getSaveHistoryOptIn()).toBe(true)

    setSaveHistoryOptIn(false)
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('false')
    expect(getSaveHistoryOptIn()).toBe(false)
  })

  it('treats any non-"true" stored value as false', () => {
    localStorage.setItem(SAVE_HISTORY_KEY, 'garbage')
    expect(getSaveHistoryOptIn()).toBe(false)
  })
})
