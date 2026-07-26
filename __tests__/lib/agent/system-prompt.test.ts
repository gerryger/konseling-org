import { SYSTEM_PROMPT } from '../../../lib/agent/system-prompt'

describe('SYSTEM_PROMPT', () => {
  it('keeps the phase-1 empathy rules explicit', () => {
    expect(SYSTEM_PROMPT).toContain('Tujuan utamamu adalah mendengar dulu, lalu bantu pelan-pelan tanpa menggurui.')
    expect(SYSTEM_PROMPT).toContain('Jangan langsung lompat ke solusi.')
    expect(SYSTEM_PROMPT).toContain('Kalau belum yakin, lebih baik dengarkan daripada memaksa saran.')
    expect(SYSTEM_PROMPT).toContain('Kamu harus terdengar empatik, stabil, dan aman')
  })

  it('uses the current crisis hotline attribution', () => {
    expect(SYSTEM_PROMPT).toContain('119 SEJIWA / Kemenkes RI (24 jam, gratis)')
    expect(SYSTEM_PROMPT).not.toContain('Into The Light Indonesia: 119 ext 8')
  })
})
