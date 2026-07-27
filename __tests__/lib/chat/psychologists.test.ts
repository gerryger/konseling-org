import { getPsychologistById } from '../../../lib/chat/psychologists'

describe('getPsychologistById', () => {
  it('returns the psychologist for a known id', () => {
    expect(getPsychologistById('dr-rina-pertiwi')?.name).toBe('Dr. Rina Pertiwi, M.Psi')
  })

  it('returns undefined for an unknown id', () => {
    expect(getPsychologistById('missing-id')).toBeUndefined()
  })
})
