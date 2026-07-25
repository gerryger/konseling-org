import 'server-only';

import { detectCrisis } from '../../chat/crisis-detection';
import type { CrisisLevel } from '../../chat/types';
import type { AgentToolDefinition } from './types';

type AssessRiskInput = {
  risk_score: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function levelRank(level: CrisisLevel): number {
  switch (level) {
    case 'none':
      return 0;
    case 'mild':
      return 1;
    case 'moderate':
      return 2;
    case 'high':
      return 3;
    case 'critical':
      return 4;
  }
}

function riskLevelFromScore(score: number): CrisisLevel {
  if (score >= 90) return 'critical';
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'mild';
  return 'none';
}

function floorRiskLevel(level: CrisisLevel, heuristic: CrisisLevel): CrisisLevel {
  return levelRank(heuristic) > levelRank(level) ? heuristic : level;
}

function parseInput(input: unknown): { ok: true; value: AssessRiskInput } | { ok: false; error: string } {
  if (!isRecord(input)) {
    return { ok: false, error: 'assess_risk input must be an object' };
  }

  if (typeof input.risk_score !== 'number' || Number.isNaN(input.risk_score)) {
    return { ok: false, error: 'assess_risk.risk_score must be a number' };
  }

  return {
    ok: true,
    value: {
      risk_score: input.risk_score,
    },
  };
}

export const assessRiskTool: AgentToolDefinition = {
  spec: {
    name: 'assess_risk',
    description: 'Assess the current crisis risk and determine the next support step.',
    inputSchema: {
      type: 'object',
      properties: {
        risk_score: { type: 'number', minimum: 0, maximum: 100 },
      },
      required: ['risk_score'],
      additionalProperties: false,
    },
  },
  async execute(input, context) {
    const parsed = parseInput(input);
    if (parsed.ok === false) {
      return {
        resultContent: JSON.stringify({ error: parsed.error }),
      };
    }

    const score = clampScore(parsed.value.risk_score);
    const heuristicLevel = detectCrisis(context.latestUserMessage);
    const modelLevel = riskLevelFromScore(score);
    const level = floorRiskLevel(modelLevel, heuristicLevel);
    const shouldEscalate = levelRank(level) >= levelRank('moderate');

    const result = {
      risk_score: score,
      risk_level: level,
      should_escalate: shouldEscalate,
      guidance:
        level === 'critical' || level === 'high'
          ? 'Ikuti skrip eskalasi krisis pada system prompt sekarang juga.'
          : shouldEscalate
            ? 'Lanjutkan dengan dukungan reflektif sambil siapkan eskalasi bila diperlukan.'
            : 'Lanjutkan percakapan hangat dan pantau perubahan risiko.',
    };

    return {
      event: {
        type: 'risk',
        risk: {
          score,
          level,
          shouldEscalate,
        },
      },
      resultContent: JSON.stringify(result),
    };
  },
};
