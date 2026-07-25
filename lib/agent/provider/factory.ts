import 'server-only';

import { AnthropicProvider } from './anthropic';
import type { LLMProvider, LLMProviderName, LLMProviderSelection } from './types';

const DEFAULT_PROVIDER: LLMProviderName = 'anthropic';
const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-5';

function normalizeProviderName(value: string | undefined): LLMProviderName {
  const normalized = (value ?? DEFAULT_PROVIDER).trim().toLowerCase();

  if (normalized === 'anthropic' || normalized === 'openai' || normalized === 'gemini') {
    return normalized;
  }

  throw new Error(`Unsupported LLM provider: ${value}`);
}

function parseMaxTokens(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function resolveApiKey(provider: LLMProviderName, env: NodeJS.ProcessEnv): string | undefined {
  switch (provider) {
    case 'anthropic':
      return env.ANTHROPIC_API_KEY;
    case 'openai':
      return env.OPENAI_API_KEY;
    case 'gemini':
      return env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY;
  }
}

export function resolveLLMProviderSelection(
  env: NodeJS.ProcessEnv = process.env,
): LLMProviderSelection {
  const provider = normalizeProviderName(env.LLM_PROVIDER ?? env.AI_PROVIDER);
  const model = env.LLM_MODEL ?? env.ANTHROPIC_MODEL ?? env.OPENAI_MODEL ?? env.GEMINI_MODEL;
  const apiKey = resolveApiKey(provider, env);
  const maxTokens = parseMaxTokens(env.LLM_MAX_TOKENS);

  return {
    provider,
    model,
    apiKey,
    maxTokens,
  };
}

export function createLLMProvider(
  overrides: Partial<LLMProviderSelection> = {},
  env: NodeJS.ProcessEnv = process.env,
): LLMProvider {
  const selection = {
    ...resolveLLMProviderSelection(env),
    ...overrides,
  } satisfies LLMProviderSelection;

  const provider = normalizeProviderName(selection.provider);

  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider({
        apiKey: selection.apiKey ?? '',
        model: selection.model ?? DEFAULT_ANTHROPIC_MODEL,
        maxTokens: selection.maxTokens,
      });
    case 'openai':
    case 'gemini':
      throw new Error(`LLM provider "${provider}" is not implemented yet`);
  }
}
