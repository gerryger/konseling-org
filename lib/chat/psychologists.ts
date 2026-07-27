import { MOCK_PSIKOLOG } from './mock-data';
import type { Psikolog } from './types';

export function getPsychologistById(id: string): Psikolog | undefined {
  return MOCK_PSIKOLOG.find((psychologist) => psychologist.id === id);
}

export function getPsychologistProfileHref(id: string): string {
  return `/psikolog/${id}`;
}
