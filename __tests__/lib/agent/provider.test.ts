import { AnthropicProvider } from '../../../lib/agent/provider/anthropic';
import { createLLMProvider, resolveLLMProviderSelection } from '../../../lib/agent/provider/factory';

describe('LLM provider foundation', () => {
  it('defaults to the anthropic provider', () => {
    const selection = resolveLLMProviderSelection({} as NodeJS.ProcessEnv);

    expect(selection.provider).toBe('anthropic');
  });

  it('reads provider-specific environment keys', () => {
    const selection = resolveLLMProviderSelection({
      LLM_PROVIDER: 'gemini',
      GEMINI_API_KEY: 'gemini-key',
      LLM_MODEL: 'gemini-2.5-pro',
      LLM_MAX_TOKENS: '2048',
    } as unknown as NodeJS.ProcessEnv);

    expect(selection).toMatchObject({
      provider: 'gemini',
      apiKey: 'gemini-key',
      model: 'gemini-2.5-pro',
      maxTokens: 2048,
    });
  });

  it('creates an anthropic provider with the configured model', () => {
    const provider = createLLMProvider(
      {
        provider: 'anthropic',
        apiKey: 'anthropic-key',
        model: 'claude-sonnet-5',
        maxTokens: 512,
      },
      {} as NodeJS.ProcessEnv,
    );

    expect(provider).toBeInstanceOf(AnthropicProvider);
    expect(provider.name).toBe('anthropic');
    expect(provider.model).toBe('claude-sonnet-5');
  });

  it('rejects unsupported provider overrides', () => {
    expect(() =>
      createLLMProvider(
        {
          provider: 'unsupported' as never,
        },
        {} as NodeJS.ProcessEnv,
      ),
    ).toThrow('Unsupported LLM provider');
  });
});
