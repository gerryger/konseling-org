import { render, screen } from '@testing-library/react'
import { MOCK_PSIKOLOG } from '../../../lib/chat/mock-data'
import { PsikologCard } from '../../../components/chat/psikolog-card'

describe('PsikologCard', () => {
  it('links directory cards to the profile page', () => {
    render(<PsikologCard psikolog={MOCK_PSIKOLOG[0]} variant="directory" />)

    const link = screen.getByRole('link', { name: `Lihat profil ${MOCK_PSIKOLOG[0].name}` })
    expect(link).toHaveAttribute('href', `/psikolog/${MOCK_PSIKOLOG[0].id}`)
  })

  it('opens crisis referral cards in a new tab and points at the outbound contact URL', () => {
    render(<PsikologCard psikolog={MOCK_PSIKOLOG[0]} variant="banner" source="crisis_banner" />)

    const link = screen.getByRole('link', { name: `Hubungi ${MOCK_PSIKOLOG[0].name} sekarang` })
    expect(link).toHaveAttribute('href', MOCK_PSIKOLOG[0].bookingUrl)
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('keeps takeover cards wired to outbound referral links as well', () => {
    render(<PsikologCard psikolog={MOCK_PSIKOLOG[1]} variant="takeover" source="crisis_takeover" />)

    const link = screen.getByRole('link', { name: `Hubungi ${MOCK_PSIKOLOG[1].name} sekarang` })
    expect(link).toHaveAttribute('href', MOCK_PSIKOLOG[1].bookingUrl)
    expect(link).toHaveAttribute('target', '_blank')
  })
})
