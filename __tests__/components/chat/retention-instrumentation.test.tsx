import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatExperience } from '../../../components/chat/chat-experience'
import { DISCLAIMER_KEY } from '../../../components/chat/disclaimer-screen'
import { streamChat } from '../../../lib/api/chat-client'

jest.mock('../../../lib/api/chat-client', () => ({
  streamChat: jest.fn(),
}))

const mockedStreamChat = streamChat as jest.MockedFunction<typeof streamChat>

// The retention emitter posts to /api/events via global fetch. We intercept it to read
// the content-free envelopes the UI emits, without a real network call.
type EmittedEvent = { event: string; visitorId: string; sessionId: string; ts: string; mood?: string }

function mockFetch(impl?: () => Promise<Response>) {
  const fetchMock = jest.fn(impl ?? (() => Promise.resolve(new Response(null, { status: 202 }))))
  ;(global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch
  return fetchMock
}

function emittedEvents(fetchMock: jest.Mock): EmittedEvent[] {
  return fetchMock.mock.calls
    .filter(([url]) => url === '/api/events')
    .map(([, init]) => JSON.parse((init as RequestInit).body as string))
}

async function selectMoodAndContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Cemas — Khawatir' }))
  await user.click(screen.getByRole('button', { name: 'Lanjutkan' }))
  await screen.findByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
}

describe('retention instrumentation wiring', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem(DISCLAIMER_KEY, 'true')
    mockedStreamChat.mockReset()
    mockedStreamChat.mockImplementation(() =>
      (async function* () {
        yield { type: 'done', stopReason: 'stop' } as const
      })(),
    )
  })

  it('emits exactly one session_start when the user reaches the chat phase', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)

    await selectMoodAndContinue(user)

    await waitFor(() => {
      expect(emittedEvents(fetchMock).some((e) => e.event === 'session_start')).toBe(true)
    })
    const starts = emittedEvents(fetchMock).filter((e) => e.event === 'session_start')
    expect(starts).toHaveLength(1)
    expect(starts[0].visitorId).toBeTruthy()
    expect(starts[0].sessionId).toBeTruthy()
    expect(starts[0].mood).toBeUndefined()
  })

  it('emits mood_checkin with the selected mood bucket', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)

    await selectMoodAndContinue(user)

    const checkins = emittedEvents(fetchMock).filter((e) => e.event === 'mood_checkin')
    expect(checkins).toHaveLength(1)
    expect(checkins[0].mood).toBe('cemas')
  })

  it('emits mood_checkin with "skipped" when the user skips mood selection', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)

    await user.click(screen.getByRole('button', { name: 'Lewati, langsung ngobrol' }))

    const checkins = emittedEvents(fetchMock).filter((e) => e.event === 'mood_checkin')
    expect(checkins).toHaveLength(1)
    expect(checkins[0].mood).toBe('skipped')
  })

  it('emits return_visit only when a prior visit past the threshold exists', async () => {
    // Seed a prior visit well past the 30-minute threshold.
    localStorage.setItem('konseling.lastVisitAt', String(1))
    const fetchMock = mockFetch()
    render(<ChatExperience />)

    await waitFor(() => {
      expect(emittedEvents(fetchMock).some((e) => e.event === 'return_visit')).toBe(true)
    })
    expect(emittedEvents(fetchMock).filter((e) => e.event === 'return_visit')).toHaveLength(1)
  })

  it('does not emit return_visit on a first-ever visit', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)
    await selectMoodAndContinue(user)

    expect(emittedEvents(fetchMock).some((e) => e.event === 'return_visit')).toBe(false)
  })

  it('never carries chat content or fields outside the allowlist', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)
    await selectMoodAndContinue(user)

    const allowed = new Set(['event', 'visitorId', 'sessionId', 'ts', 'mood'])
    for (const evt of emittedEvents(fetchMock)) {
      for (const key of Object.keys(evt)) {
        expect(allowed.has(key)).toBe(true)
      }
    }
  })

  it('leaves the crisis takeover and 119 hotline reachable after the save-history opt-in is tapped', async () => {
    const fetchMock = mockFetch()
    const user = userEvent.setup()
    render(<ChatExperience />)

    await selectMoodAndContinue(user)

    // Tap the new "simpan riwayat" opt-in in the sidebar — this must not interfere with
    // crisis detection or the takeover in any way.
    await user.click(screen.getByRole('button', { name: /simpan riwayat/i }))
    await waitFor(() => {
      expect(emittedEvents(fetchMock).some((e) => e.event === 'save_history_optin')).toBe(true)
    })

    const composer = screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
    await user.type(composer, 'aku pengen mati aja')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    const takeover = await screen.findByRole('alertdialog')
    expect(takeover).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tersedia 24 jam, gratis/i })).toHaveAttribute('href', 'tel:119')
  })

  it('never breaks the UI or the crisis flow when the transport fails', async () => {
    // Transport rejects on every emit — instrumentation must be invisible to the user.
    mockFetch(() => Promise.reject(new Error('network down')))
    const user = userEvent.setup()
    render(<ChatExperience />)

    // Chat still reaches the chat phase.
    await selectMoodAndContinue(user)

    // A critical message still triggers the crisis takeover.
    const composer = screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
    await user.type(composer, 'aku pengen mati aja')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
  })
})
