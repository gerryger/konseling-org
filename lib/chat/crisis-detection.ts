import type { CrisisLevel } from './types';

// PLACEHOLDER — heuristic regex only. A real ML classifier from the backend
// will replace this. Do NOT rely on this as the single source of truth.
// False negatives (missed crises) are dangerous. TODO: wire backend classifier.
const CRITICAL_PATTERNS = [
  /bunuh diri/i,
  /nggak mau bangun/i,
  /pengen mati/i,
  /akhiri hidup/i,
  /nggak ada gunanya hidup/i,
  /lebih baik mati/i,
  /mau pergi selamanya/i,
];

const HIGH_PATTERNS = [
  /capek sama hidup/i,
  /tidak ada harapan/i,
  /nggak ada harapan/i,
  /putus asa/i,
  /tidak ada yang berubah/i,
  /tiap hari sama aja/i,
  /menyakiti diri/i,
  /self.?harm/i,
];

export function detectCrisis(text: string): CrisisLevel {
  if (CRITICAL_PATTERNS.some((p) => p.test(text))) return 'critical';
  if (HIGH_PATTERNS.some((p) => p.test(text))) return 'high';
  return 'none';
}
