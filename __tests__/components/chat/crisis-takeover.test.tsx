import { render, screen } from '@testing-library/react'
import { CrisisTakeover } from '../../../components/chat/crisis-takeover'

describe('CrisisTakeover', () => {
  it('shows three crisis referral options', () => {
    render(<CrisisTakeover onResume={jest.fn()} />)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Psikolog yang bisa dihubungi' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    const referralLinks = screen.getAllByRole('link', { name: /Hubungi .* sekarang/i })
    expect(referralLinks).toHaveLength(2)
    referralLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).not.toHaveAttribute('href', '#')
    })
  })
})
