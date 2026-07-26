// Anonymous, content-free visitor/session identity for retention instrumentation.
//
// Privacy: these tokens are random and opaque — NOT linked to identity, email, or
// IP-derived data (AGENTS.md §4/§5). All storage keys use the `konseling.` prefix.
// Every helper is SSR-guarded and best-effort: it never throws, so instrumentation
// can never block the UI or the crisis flow.

const VISITOR_KEY = 'konseling.visitorId'
const SESSION_KEY = 'konseling.sessionId'
const LAST_VISIT_KEY = 'konseling.lastVisitAt'

// A visit that follows a prior visit by more than this gap counts as a return visit.
export const RETURN_VISIT_THRESHOLD_MS = 30 * 60 * 1000 // 30 minutes

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

function randomToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback for environments without Web Crypto — still opaque, still anonymous.
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
}

// Reads (or lazily creates) a stable per-browser visitor token from localStorage.
// Returns null when unavailable (SSR, or storage disabled/private mode).
export function getVisitorId(): string | null {
  if (!hasWindow()) return null
  try {
    const existing = localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const token = randomToken()
    localStorage.setItem(VISITOR_KEY, token)
    return token
  } catch {
    return null
  }
}

// Reads (or lazily creates) a per-visit session token from sessionStorage.
export function getSessionId(): string | null {
  if (!hasWindow()) return null
  try {
    const existing = sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const token = randomToken()
    sessionStorage.setItem(SESSION_KEY, token)
    return token
  } catch {
    return null
  }
}

// Records the current visit and reports whether it follows a prior visit past the
// threshold. Always overwrites `konseling.lastVisitAt` with `now`. A first-ever
// visit returns false.
export function recordVisit(now: number = Date.now()): boolean {
  if (!hasWindow()) return false
  try {
    const raw = localStorage.getItem(LAST_VISIT_KEY)
    const last = raw ? Number(raw) : NaN
    const isReturnVisit = Number.isFinite(last) && now - last >= RETURN_VISIT_THRESHOLD_MS
    localStorage.setItem(LAST_VISIT_KEY, String(now))
    return isReturnVisit
  } catch {
    return false
  }
}
