/**
 * @jest-environment node
 */
class TestResponse {
  status: number;
  headers: Headers;
  private readonly body: BodyInit | null;

  constructor(body: BodyInit | null = null, init: ResponseInit = {}) {
    this.status = init.status ?? 200;
    this.headers = new Headers(init.headers);
    this.body = body;
  }

  async text(): Promise<string> {
    if (typeof this.body === 'string') {
      return this.body;
    }

    if (this.body && typeof (this.body as ReadableStream<Uint8Array>).getReader === 'function') {
      const reader = (this.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let output = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        output += decoder.decode(value, { stream: true });
      }

      output += decoder.decode();
      return output;
    }

    return this.body ? String(this.body) : '';
  }

  async json(): Promise<unknown> {
    return JSON.parse((await this.text()) || 'null');
  }

  static json(data: unknown, init: ResponseInit = {}): TestResponse {
    const headers = new Headers(init.headers);
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    return new TestResponse(JSON.stringify(data), { ...init, headers });
  }

  static error(): TestResponse {
    return new TestResponse('', { status: 500 });
  }

  static redirect(url: string | URL, status = 302): TestResponse {
    return new TestResponse('', {
      status,
      headers: { location: String(url) },
    });
  }
}

if (typeof globalThis.Response === 'undefined') {
  (globalThis as { Response?: unknown }).Response = TestResponse;
}

import { handleChatRequest, checkChatRateLimit, resetChatRateLimitStore, validateChatRequestBody } from '../../../lib/api/chat';

function parseSseEvents(bodyText: string): Array<{ event: string; data: unknown }> {
  return bodyText
    .trim()
    .split(/\n\n+/)
    .filter(Boolean)
    .map((block) => {
      const eventLine = block.split('\n').find((line) => line.startsWith('event: '));
      const dataLine = block.split('\n').find((line) => line.startsWith('data: '));
      return {
        event: eventLine?.slice('event: '.length) ?? '',
        data: JSON.parse(dataLine?.slice('data: '.length) ?? 'null'),
      };
    });
}

describe('chat api helpers', () => {
  beforeEach(() => {
    resetChatRateLimitStore();
  });

  it('rejects invalid request bodies', () => {
    expect(validateChatRequestBody(null)).toEqual({ ok: false, error: 'Request body must be a JSON object' });
    expect(validateChatRequestBody({ messages: [] })).toEqual({ ok: false, error: 'messages must be a non-empty array' });
    expect(validateChatRequestBody({ system: 'override', messages: [{ role: 'user', content: 'hi' }] })).toEqual({
      ok: false,
      error: 'system prompt overrides are not allowed',
    });
    expect(
      validateChatRequestBody({
        messages: Array.from({ length: 21 }, (_, index) => ({ role: 'user', content: `msg ${index}` })),
      }),
    ).toEqual({
      ok: false,
      error: 'messages cannot exceed 20 items',
    });

    expect(validateChatRequestBody({ messages: [{ role: 'user', content: 'x'.repeat(4_001) }] })).toEqual({
      ok: false,
      error: 'messages[0].content cannot exceed 4000 characters',
    });

    expect(validateChatRequestBody({ messages: [{ role: 'user', content: '' }] })).toEqual({
      ok: false,
      error: 'messages[0].content must be a non-empty string',
    });
  });

  it('applies per-ip rate limiting', () => {
    for (let i = 0; i < 5; i += 1) {
      const result = checkChatRateLimit('203.0.113.10', 1_000 + i);
      expect(result.allowed).toBe(true);
    }

    const limited = checkChatRateLimit('203.0.113.10', 1_005);
    expect(limited.allowed).toBe(false);
    expect(limited.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('returns SSE error events when the provider stream fails', async () => {
    const response = await handleChatRequest(
      {
        json: async () => ({ messages: [{ role: 'user', content: 'help' }] }),
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.100',
        }),
      } as Request,
      {
        providerFactory: () => ({
          name: 'anthropic' as const,
          model: 'test-model',
          async *stream() {
            yield { type: 'error', message: 'provider exploded' };
          },
        }),
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    await expect(response.text()).resolves.toBe('event: error\ndata: {"message":"provider exploded"}\n\n');
  });

  it('returns SSE error events when the provider cannot be created', async () => {
    const response = await handleChatRequest(
      {
        json: async () => ({ messages: [{ role: 'user', content: 'help' }] }),
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.99',
        }),
      } as Request,
      {
        providerFactory: () => {
          throw new Error('Missing API key');
        },
      },
    );

    expect(response.status).toBe(200);
    const events = parseSseEvents(await response.text());
    expect(events).toEqual([{ event: 'error', data: { message: 'Missing API key' } }]);
  });

  it('streams crisis scoring and tool round-trips end-to-end', async () => {
    let streamCallCount = 0;

    const response = await handleChatRequest(
      {
        json: async () => ({
          messages: [{ role: 'user', content: 'Aku sangat putus asa dan ingin mengakhiri semuanya' }],
        }),
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '198.51.100.1',
        }),
      } as Request,
      {
        providerFactory: () => ({
          name: 'anthropic' as const,
          model: 'test-model',
          async *stream(request) {
            streamCallCount += 1;

            if (streamCallCount === 1) {
              expect(request.tools?.map((tool) => tool.name)).toEqual(expect.arrayContaining(['assess_risk', 'get_psychologists']));
              yield { type: 'text', delta: 'Aku akan cek risikonya.' };
              yield {
                type: 'tool_call',
                toolCall: {
                  id: 'tool-assess-risk-1',
                  name: 'assess_risk',
                  input: { risk_score: 82 },
                },
              };
              yield { type: 'done', stopReason: 'tool_use' as const };
              return;
            }

            expect(request.messages.some((message) => message.role === 'assistant' && 'toolCalls' in message)).toBe(true);
            expect(request.messages.some((message) => message.role === 'tool_result')).toBe(true);
            yield { type: 'text', delta: 'Saya tetap di sini dan akan bantu langkah berikutnya.' };
            yield { type: 'done', stopReason: 'end_turn' as const };
          },
        }),
        now: () => 1_000,
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');

    const events = parseSseEvents(await response.text());
    expect(events.map((event) => event.event)).toEqual(['text', 'risk', 'text', 'done']);
    expect(events[0]).toEqual({ event: 'text', data: { delta: 'Aku akan cek risikonya.' } });
    expect(events[1]).toEqual({
      event: 'risk',
      data: {
        score: 82,
        level: 'high',
        shouldEscalate: true,
      },
    });
    expect(events[2]).toEqual({ event: 'text', data: { delta: 'Saya tetap di sini dan akan bantu langkah berikutnya.' } });
    expect(events[3]).toEqual({ event: 'done', data: { stopReason: 'end_turn' } });
  });

  it('returns 429 when the request exceeds the limit', async () => {
    for (let i = 0; i < 5; i += 1) {
      await handleChatRequest(
        {
          json: async () => ({ messages: [{ role: 'user', content: `Msg ${i}` }] }),
          headers: new Headers({
            'content-type': 'application/json',
            'x-forwarded-for': '198.51.100.2',
          }),
        } as Request,
        {
          providerFactory: () => ({
            name: 'anthropic' as const,
            model: 'test-model',
            async *stream() {
              yield { type: 'text', delta: 'ok' };
              yield { type: 'done', stopReason: 'end_turn' as const };
            },
          }),
          now: () => 1_000,
        },
      );
    }

    const limited = await handleChatRequest(
      {
        json: async () => ({ messages: [{ role: 'user', content: 'one more' }] }),
        headers: new Headers({
          'content-type': 'application/json',
          'x-forwarded-for': '198.51.100.2',
        }),
      } as Request,
      {
        providerFactory: () => ({
          name: 'anthropic' as const,
          model: 'test-model',
          async *stream() {
            yield { type: 'text', delta: 'blocked' };
            yield { type: 'done', stopReason: 'end_turn' as const };
          },
        }),
        now: () => 1_000,
      },
    );

    expect(limited.status).toBe(429);
    await expect(limited.json()).resolves.toEqual({ error: 'Too many requests' });
  });
});
