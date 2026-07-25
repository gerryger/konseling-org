import 'server-only';

import { MOCK_PSIKOLOG } from '../../chat/mock-data';
import type { Psikolog } from '../../chat/types';
import type { AgentToolDefinition } from './types';

type GetPsychologistsInput = {
  specialty?: string;
  location?: string;
  limit?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clampLimit(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 3;
  return Math.max(1, Math.min(3, Math.round(value)));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesPsychologist(psikolog: Psikolog, input: GetPsychologistsInput): boolean {
  const specialty = input.specialty ? normalize(input.specialty) : '';
  const location = input.location ? normalize(input.location) : '';

  const haystack = [psikolog.name, ...psikolog.tags].map(normalize);

  if (specialty && !haystack.some((item) => item.includes(specialty))) {
    return false;
  }

  if (location && !haystack.some((item) => item.includes(location))) {
    return false;
  }

  return true;
}

function parseInput(input: unknown): { ok: true; value: GetPsychologistsInput } | { ok: false; error: string } {
  if (!isRecord(input)) {
    return { ok: false, error: 'get_psychologists input must be an object' };
  }

  if (input.specialty !== undefined && typeof input.specialty !== 'string') {
    return { ok: false, error: 'get_psychologists.specialty must be a string when provided' };
  }

  if (input.location !== undefined && typeof input.location !== 'string') {
    return { ok: false, error: 'get_psychologists.location must be a string when provided' };
  }

  if (input.limit !== undefined && typeof input.limit !== 'number') {
    return { ok: false, error: 'get_psychologists.limit must be a number when provided' };
  }

  return {
    ok: true,
    value: {
      specialty: typeof input.specialty === 'string' ? input.specialty : undefined,
      location: typeof input.location === 'string' ? input.location : undefined,
      limit: typeof input.limit === 'number' ? input.limit : undefined,
    },
  };
}

export const getPsychologistsTool: AgentToolDefinition = {
  spec: {
    name: 'get_psychologists',
    description: 'Get a small list of trusted psychologists that match the current context.',
    inputSchema: {
      type: 'object',
      properties: {
        specialty: { type: 'string' },
        location: { type: 'string' },
        limit: { type: 'number', minimum: 1, maximum: 3 },
      },
      additionalProperties: false,
    },
  },
  async execute(input) {
    const parsed = parseInput(input);
    if (parsed.ok === false) {
      return {
        resultContent: JSON.stringify({ error: parsed.error }),
      };
    }

    const limit = clampLimit(parsed.value.limit);
    const psychologists = MOCK_PSIKOLOG.filter((psikolog) => matchesPsychologist(psikolog, parsed.value)).slice(0, limit);

    return {
      event: {
        type: 'psychologists',
        psychologists,
      },
      resultContent: JSON.stringify({ psychologists }),
    };
  },
};
