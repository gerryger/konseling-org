import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '@/components/chat/sidebar'
import { SAVE_HISTORY_KEY } from '@/lib/chat/save-history-signal'

describe('Sidebar — simpan riwayat opt-in', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the save-history switch, off by default', () => {
    render(<Sidebar isOpen />)
    expect(
      screen.getByRole('switch', { name: 'Simpan riwayat percakapan' }),
    ).toHaveAttribute('aria-checked', 'false')
  })

  it('reflects a previously stored opt-in on mount', () => {
    localStorage.setItem(SAVE_HISTORY_KEY, 'true')
    render(<Sidebar isOpen />)
    expect(
      screen.getByRole('switch', { name: 'Simpan riwayat percakapan' }),
    ).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles the flag on click without gating the chat history', async () => {
    const user = userEvent.setup()
    render(<Sidebar isOpen />)
    const sw = screen.getByRole('switch', { name: 'Simpan riwayat percakapan' })

    await user.click(sw)

    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(localStorage.getItem(SAVE_HISTORY_KEY)).toBe('true')
    // The toggle gates nothing — the conversation list is still rendered.
    expect(
      screen.getByRole('navigation', { name: 'Daftar percakapan' }),
    ).toBeInTheDocument()
  })
})
