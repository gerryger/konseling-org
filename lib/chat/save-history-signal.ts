// Local, anonymous opt-in signal: does the user want their chat history saved?
// This stores ONLY a boolean — never chat content, never PII. Real persistence
// arrives with accounts (#29) and premium continuity (#30).

export const SAVE_HISTORY_KEY = 'konseling.saveHistoryOptIn'

export function getSaveHistoryOptIn(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SAVE_HISTORY_KEY) === 'true'
}

export function setSaveHistoryOptIn(value: boolean): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SAVE_HISTORY_KEY, value ? 'true' : 'false')
  // TODO(#23): emit an anonymous, content-free opt-in event here (boolean only, no chat content, no PII).
}
