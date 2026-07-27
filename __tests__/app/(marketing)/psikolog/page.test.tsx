import { render, screen } from '@testing-library/react'
import PsikologPage from '../../../../app/(marketing)/psikolog/page'

describe('PsikologPage', () => {
  it('renders the directory and supporter sections', () => {
    render(<PsikologPage />)

    expect(screen.getByRole('heading', { name: 'Temukan psikolog yang cocok buat kamu' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Lihat profil .*?/i })).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Dukung kami' })).toBeInTheDocument()
  })
})
