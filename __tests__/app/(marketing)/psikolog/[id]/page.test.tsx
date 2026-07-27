import { render, screen } from '@testing-library/react'
import PsikologProfilePage from '../../../../app/(marketing)/psikolog/[id]/page'

describe('PsikologProfilePage', () => {
  it('renders a psychologist profile and outbound booking CTA', async () => {
    render(await PsikologProfilePage({ params: Promise.resolve({ id: 'dr-rina-pertiwi' }) }))

    expect(screen.getByRole('heading', { name: 'Dr. Rina Pertiwi, M.Psi' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Kirim permintaan booking untuk Dr. Rina Pertiwi, M.Psi' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dukung kami' })).toBeInTheDocument()
  })
})
