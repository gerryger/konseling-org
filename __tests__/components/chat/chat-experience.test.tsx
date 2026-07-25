import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatExperience } from '../../../components/chat/chat-experience'
import { DISCLAIMER_KEY } from '../../../components/chat/disclaimer-screen'
import { streamChat } from '../../../lib/api/chat-client'

jest.mock('../../../lib/api/chat-client', () => ({
  streamChat: jest.fn(),
}))

const mockedStreamChat = streamChat as jest.MockedFunction<typeof streamChat>

async function enterChat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Biasa — Datar' }))
  await user.click(screen.getByRole('button', { name: 'Lanjutkan' }))
  await screen.findByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
}

describe('ChatExperience', () => {
  beforeEach(() => {
    localStorage.setItem(DISCLAIMER_KEY, 'true')
    mockedStreamChat.mockReset()
  })

  it('streams assistant text and disables the composer until done', async () => {
    const user = userEvent.setup()
    let releaseDone!: () => void
    const done = new Promise<void>((resolve) => {
      releaseDone = resolve
    })

    mockedStreamChat.mockImplementation(() =>
      (async function* () {
        yield { type: 'text', delta: 'Halo' } as const
        await done
        yield { type: 'done', stopReason: 'stop' } as const
      })(),
    )

    render(<ChatExperience />)
    await enterChat(user)

    const textarea = screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
    const sendButton = screen.getByRole('button', { name: 'Kirim pesan' })

    await user.type(textarea, 'Aku cuma capek banget hari ini')
    await user.click(sendButton)

    await screen.findByText('Aku cuma capek banget hari ini')
    await screen.findByText('Halo')

    expect(sendButton).toBeDisabled()
    expect(textarea).toBeDisabled()

    releaseDone()
    await waitFor(() => expect(mockedStreamChat).toHaveBeenCalledTimes(1))
  })

  it('shows the crisis banner from a server risk event even when the client heuristic misses it', async () => {
    const user = userEvent.setup()

    mockedStreamChat.mockImplementation(() =>
      (async function* () {
        yield {
          type: 'risk',
          risk: { score: 84, level: 'high', shouldEscalate: true },
        } as const
        yield { type: 'done', stopReason: 'stop' } as const
      })(),
    )

    render(<ChatExperience />)
    await enterChat(user)

    await user.type(screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' }), 'Aku cuma capek banget hari ini')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('locks the chat flow when a streamed critical risk escalates to takeover', async () => {
    const user = userEvent.setup()
    let releaseDone!: () => void
    const done = new Promise<void>((resolve) => {
      releaseDone = resolve
    })
    let capturedSignal: AbortSignal | undefined

    mockedStreamChat.mockImplementation((_, options) => {
      capturedSignal = options?.signal
      return (async function* () {
        yield {
          type: 'risk',
          risk: { score: 97, level: 'critical', shouldEscalate: true },
        } as const
        await done
        yield { type: 'done', stopReason: 'stop' } as const
      })()
    })

    render(<ChatExperience />)
    await enterChat(user)

    await user.type(screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' }), 'Aku cuma capek banget hari ini')
    await user.click(screen.getByRole('button', { name: 'Kirim pesan' }))

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    await waitFor(() => expect(capturedSignal?.aborted).toBe(true))
    expect(screen.getByRole('button', { name: 'Kirim pesan' })).toBeDisabled()

    releaseDone()
    await waitFor(() => expect(mockedStreamChat).toHaveBeenCalledTimes(1))
  })
})
