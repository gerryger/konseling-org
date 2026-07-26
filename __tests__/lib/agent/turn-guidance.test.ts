import { buildTurnGuidance } from '../../../lib/agent/turn-guidance'

describe('buildTurnGuidance', () => {
  it('emphasizes calming empathy for anxious messages', () => {
    const guidance = buildTurnGuidance('aku cemas banget dan takut salah')

    expect(guidance).toContain('cemas/panik')
    expect(guidance).toContain('Jangan bilang "tenang"')
  })

  it('keeps angry responses validating and non-rushing', () => {
    const guidance = buildTurnGuidance('aku marah banget sama dia')

    expect(guidance).toContain('marah/kesal')
    expect(guidance).toContain('jangan minta memaafkan atau menenangkan diri terlalu cepat')
  })

  it('falls back to the general empathy cue for neutral messages', () => {
    const guidance = buildTurnGuidance('halo kawan')

    expect(guidance).toContain('Balas dengan hangat dan natural')
  })
})
