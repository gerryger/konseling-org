class TestResponse {
  status: number;
  headers: Headers;
  private readonly bodyText: string;

  constructor(body: BodyInit | null = null, init: ResponseInit = {}) {
    this.status = init.status ?? 200;
    this.headers = new Headers(init.headers);
    this.bodyText = typeof body === 'string' ? body : body ? String(body) : '';
  }

  async text(): Promise<string> {
    return this.bodyText;
  }

  async json(): Promise<unknown> {
    return JSON.parse(this.bodyText || 'null');
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

    expect(
      validateChatRequestBody({ messages: [{ role: 'user', content: 'x'.repeat(4_001) }] }),
    ).toEqual({
      ok: false,
      error: 'messages[0].content cannot exceed 4000 characters',
    });

    expect(
      validateChatRequestBody({ messages: [{ role: 'user', content: '' }] }),
    ).toEqual({
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

  it('returns a structured 500 when the provider cannot be created', async () => {
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

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Missing API key' });
  });

  it('streams provider text end-to-end for a valid request', async () => {
    const request = {
      json: async () => ({
        messages: [{ role: 'user', content: 'Halo' }],
      }),
      headers: new Headers({
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.1',
      }),
    } as Request;

    const response = await handleChatRequest(
      request,
      {
        providerFactory: () => ({
          name: 'anthropic' as const,
          model: 'test-model',
          async *stream() {
            yield { type: 'text', delta: 'Halo' };
            yield { type: 'text', delta: ' dunia' };
            yield { type: 'done', stopReason: 'end_turn' as const };
          },
        }),
        now: () => 1_000,
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/plain');
    await expect(response.text()).resolves.toBe('Halo dunia');
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
