import { render, screen } from '@testing-library/react'
import { Footer } from '../../../components/layout/footer'

describe('Footer', () => {
  it('links the supporter CTA to the psikolog support section', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'Dukung kami' })).toHaveAttribute(
      'href',
      '/psikolog#dukung-kami',
    )
  })
})
