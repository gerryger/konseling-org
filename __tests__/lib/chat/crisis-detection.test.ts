import { detectCrisis } from '@/lib/chat/crisis-detection';

describe('detectCrisis', () => {
  it('returns "critical" for explicit suicidal phrases', () => {
    expect(detectCrisis('aku pengen mati aja')).toBe('critical');
    expect(detectCrisis('lebih baik mati')).toBe('critical');
    expect(detectCrisis('aku mau akhiri hidup')).toBe('critical');
    expect(detectCrisis('nggak mau bangun lagi besok')).toBe('critical');
  });

  it('returns "high" for crisis-adjacent phrases', () => {
    expect(detectCrisis('aku capek sama hidup')).toBe('high');
    expect(detectCrisis('tiap hari sama aja, aku capek sama hidupku')).toBe('high');
    expect(detectCrisis('nggak ada harapan lagi')).toBe('high');
    expect(detectCrisis('aku mau menyakiti diri sendiri')).toBe('high');
  });

  it('returns "none" for ordinary messages', () => {
    expect(detectCrisis('aku lagi sedih')).toBe('none');
    expect(detectCrisis('halo kawan')).toBe('none');
    expect(detectCrisis('capek kerjaan')).toBe('none');
  });

  it('is case-insensitive', () => {
    expect(detectCrisis('PENGEN MATI')).toBe('critical');
    expect(detectCrisis('Capek Sama Hidup')).toBe('high');
  });
});
