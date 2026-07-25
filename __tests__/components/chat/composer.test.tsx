import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Composer } from '../../../components/chat/composer'

describe('Composer', () => {
  it('disables the textarea and send button when streaming is active', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const onSend = jest.fn()

    render(
      <Composer
        value="Halo"
        onChange={onChange}
        onSend={onSend}
        disabled
      />,
    )

    const textarea = screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
    const sendButton = screen.getByRole('button', { name: 'Kirim pesan' })

    expect(textarea).toBeDisabled()
    expect(sendButton).toBeDisabled()

    await user.click(sendButton)
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 })

    expect(onSend).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('sends on Enter when enabled', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const onSend = jest.fn()

    render(
      <Composer
        value="Halo"
        onChange={onChange}
        onSend={onSend}
      />,
    )

    const textarea = screen.getByRole('textbox', { name: 'Ketik pesan untuk Kawan' })
    await user.click(textarea)
    await user.keyboard('{Enter}')

    expect(onSend).toHaveBeenCalledTimes(1)
  })
})
