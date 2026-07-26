import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../../../components/chat/sidebar'
import { emitEvent } from '../../../lib/analytics/events'

jest.mock('../../../lib/analytics/events', () => ({
  emitEvent: jest.fn(),
}))

const mockedEmitEvent = emitEvent as jest.MockedFunction<typeof emitEvent>

describe('Sidebar account block', () => {
  beforeEach(() => {
    localStorage.clear()
    mockedEmitEvent.mockClear()
  })

  it('renders the login button as a disabled coming-soon affordance', () => {
    render(<Sidebar />)
    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toBeDisabled()
  })

  it('shows a save-history opt-in prompt when the flag has never been set', () => {
    render(<Sidebar />)
    expect(screen.getByRole('button', { name: /simpan riwayat/i })).toBeInTheDocument()
  })

  it('tapping the opt-in prompt persists the flag, emits the event once, and swaps to the confirmed state', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)

    const optInButton = screen.getByRole('button', { name: /simpan riwayat/i })
    await user.click(optInButton)

    expect(localStorage.getItem('konseling.saveHistoryOptIn')).toBe('true')
    expect(mockedEmitEvent).toHaveBeenCalledTimes(1)
    expect(mockedEmitEvent).toHaveBeenCalledWith('save_history_optin')
    expect(screen.queryByRole('button', { name: /simpan riwayat/i })).not.toBeInTheDocument()
  })

  it('does not emit a duplicate event on a second tap after the confirmed state renders', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)

    await user.click(screen.getByRole('button', { name: /simpan riwayat/i }))
    expect(mockedEmitEvent).toHaveBeenCalledTimes(1)

    // The affordance is gone after confirmation, so there is nothing left to tap again —
    // this guards against a future regression that keeps it clickable.
    expect(screen.queryByRole('button', { name: /simpan riwayat/i })).not.toBeInTheDocument()
  })

  it('shows the confirmed state on mount without re-emitting when already opted in', () => {
    localStorage.setItem('konseling.saveHistoryOptIn', 'true')
    render(<Sidebar />)

    expect(screen.queryByRole('button', { name: /simpan riwayat/i })).not.toBeInTheDocument()
    expect(mockedEmitEvent).not.toHaveBeenCalled()
  })
})
