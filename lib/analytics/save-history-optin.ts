// Anonymous, localStorage-backed "simpan riwayat" opt-in signal.
//
// This does NOT save any chat history — it only records that the user tapped the opt-in
// affordance, so Phase 1 retention data can measure willingness to save history (see
// docs/superpowers/specs/2026-07-26-konseling-monetization-design.md §8/§11). SSR-guarded
// and best-effort: it never throws, so it can never block the UI or the crisis flow.

const SAVE_HISTORY_OPT_IN_KEY = 'konseling.saveHistoryOptIn'

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function getSaveHistoryOptIn(): boolean {
  if (!hasWindow()) return false
  try {
    return localStorage.getItem(SAVE_HISTORY_OPT_IN_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSaveHistoryOptIn(): void {
  if (!hasWindow()) return
  try {
    localStorage.setItem(SAVE_HISTORY_OPT_IN_KEY, 'true')
  } catch {
    // Best-effort; UI still reflects the in-memory state for this session.
  }
}
