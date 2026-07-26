jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn(),
}));

import { GoogleGenAI } from '@google/genai';
import { GeminiProvider } from '../../../../lib/agent/provider/gemini';
import type { LLMProviderMessage, LLMProviderToolSpec } from '../../../../lib/agent/provider/types';

const MockGoogleGenAI = GoogleGenAI as unknown as jest.Mock;

function asyncChunks(chunks: unknown[]) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const chunk of chunks) yield chunk;
    },
  };
}

function mockGenerateContentStream(chunks: unknown[]) {
  const generateContentStream = jest.fn().mockResolvedValue(asyncChunks(chunks));
  MockGoogleGenAI.mockImplementation(() => ({ models: { generateContentStream } }));
  return generateContentStream;
}

async function collect<T>(gen: AsyncGenerator<T, void, void>): Promise<T[]> {
  const out: T[] = [];
  for await (const event of gen) out.push(event);
  return out;
}

const BASE_REQUEST = { system: 'system prompt', messages: [{ role: 'user', content: 'hi' }] as LLMProviderMessage[] };

beforeEach(() => {
  MockGoogleGenAI.mockReset();
});

describe('GeminiProvider', () => {
  it('throws when apiKey is missing', () => {
    expect(() => new GeminiProvider({ apiKey: '' })).toThrow('GEMINI_API_KEY is required for the Gemini provider');
  });

  it('defaults name and model', () => {
    const provider = new GeminiProvider({ apiKey: 'key' });
    expect(provider.name).toBe('gemini');
    expect(provider.model).toBe('gemini-2.5-flash');
  });

  it('streams text deltas in order and yields done with mapped stop reason', async () => {
    mockGenerateContentStream([
      { text: 'Hal' },
      { text: 'o' },
      { candidates: [{ finishReason: 'STOP' }] },
    ]);

    const provider = new GeminiProvider({ apiKey: 'key' });
    const events = await collect(provider.stream(BASE_REQUEST));

    expect(events).toEqual([
      { type: 'text', delta: 'Hal' },
      { type: 'text', delta: 'o' },
      { type: 'done', stopReason: 'end_turn' },
    ]);
  });

  it('maps MAX_TOKENS finish reason to max_tokens', async () => {
    mockGenerateContentStream([{ text: 'hi' }, { candidates: [{ finishReason: 'MAX_TOKENS' }] }]);

    const provider = new GeminiProvider({ apiKey: 'key' });
    const events = await collect(provider.stream(BASE_REQUEST));

    expect(events).toContainEqual({ type: 'done', stopReason: 'max_tokens' });
  });

  it('yields a tool_call event for each function call and marks done as tool_use', async () => {
    mockGenerateContentStream([
      { functionCalls: [{ name: 'assess_risk', args: { risk_score: 10 } }] },
      { candidates: [{ finishReason: 'STOP' }] },
    ]);

    const provider = new GeminiProvider({ apiKey: 'key' });
    const events = await collect(provider.stream(BASE_REQUEST));

    expect(events).toContainEqual(
      expect.objectContaining({
        type: 'tool_call',
        toolCall: expect.objectContaining({ name: 'assess_risk', input: { risk_score: 10 } }),
      }),
    );
    expect(events).toContainEqual({ type: 'done', stopReason: 'tool_use' });
  });

  it('yields an error event when the SDK call rejects', async () => {
    MockGoogleGenAI.mockImplementation(() => ({
      models: {
        generateContentStream: jest.fn().mockRejectedValue(new Error('quota exceeded')),
      },
    }));

    const provider = new GeminiProvider({ apiKey: 'key' });
    const events = await collect(provider.stream(BASE_REQUEST));

    expect(events).toEqual([{ type: 'error', message: 'quota exceeded' }]);
  });

  it('sends system instruction, prior tool calls, and tool results in the request contents', async () => {
    const generateContentStream = mockGenerateContentStream([{ candidates: [{ finishReason: 'STOP' }] }]);

    const tools: LLMProviderToolSpec[] = [
      { name: 'assess_risk', description: 'Assess risk', inputSchema: { type: 'object', properties: {} } },
    ];

    const messages: LLMProviderMessage[] = [
      { role: 'user', content: 'Aku capek banget' },
      { role: 'assistant', content: '', toolCalls: [{ id: 'assess_risk-0', name: 'assess_risk', input: { risk_score: 10 } }] },
      { role: 'tool_result', toolCallId: 'assess_risk-0', content: JSON.stringify({ risk_level: 'mild' }) },
    ];

    const provider = new GeminiProvider({ apiKey: 'key' });
    await collect(provider.stream({ system: 'system prompt', messages, tools }));

    expect(generateContentStream).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-2.5-flash',
        config: expect.objectContaining({
          systemInstruction: 'system prompt',
          tools: [{ functionDeclarations: [{ name: 'assess_risk', description: 'Assess risk', parametersJsonSchema: tools[0].inputSchema }] }],
        }),
        contents: [
          { role: 'user', parts: [{ text: 'Aku capek banget' }] },
          { role: 'model', parts: [{ functionCall: { name: 'assess_risk', args: { risk_score: 10 } } }] },
          { role: 'user', parts: [{ functionResponse: { name: 'assess_risk', response: { risk_level: 'mild' } } }] },
        ],
      }),
    );
  });
});
