import { streamChat, type ChatStreamEvent } from '../../../lib/api/chat-client'

function makeMockResponse(
  chunks: string[],
  init: { status: number; ok: boolean; json?: () => Promise<unknown> },
): Response {
  const encoder = new TextEncoder()
  let index = 0
  const reader = {
    async read(): Promise<IteratorResult<Uint8Array>> {
      if (index >= chunks.length) return { done: true, value: undefined }
      const value = encoder.encode(chunks[index])
      index += 1
      return { done: false, value }
    },
    releaseLock() {},
  }

  return {
    ok: init.ok,
    status: init.status,
    headers: new Headers({ 'content-type': 'text/event-stream' }),
    body: {
      getReader: () => reader,
    },
    json: init.json ?? (async () => ({})),
  } as unknown as Response
}

async function collectEvents(
  generator: AsyncGenerator<ChatStreamEvent, void, void>,
): Promise<ChatStreamEvent[]> {
  const events: ChatStreamEvent[] = []
  for await (const event of generator) {
    events.push(event)
  }
  return events
}

describe('streamChat', () => {
  it('parses SSE frames across chunk boundaries', async () => {
    const fetchImpl = jest.fn(async () =>
      makeMockResponse(
        [
          'event: text\ndata: {"delta":"Hel',
          'lo"}\n\nevent: risk\ndata: {"score":82,"level":"high","shouldEscalate":true}\n\n',
          'event: done\ndata: {"stopReason":"stop"}\n\n',
        ],
        { status: 200, ok: true },
      ),
    )

    const events = await collectEvents(
      streamChat([{ role: 'user', content: 'Halo' }], { fetchImpl: fetchImpl as typeof fetch }),
    )

    expect(fetchImpl).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }),
    )
    expect(events).toEqual([
      { type: 'text', delta: 'Hello' },
      { type: 'risk', risk: { score: 82, level: 'high', shouldEscalate: true } },
      { type: 'done', stopReason: 'stop' },
    ])
  })

  it('maps non-OK responses to a friendly error event', async () => {
    const fetchImpl = jest.fn(async () =>
      makeMockResponse([], {
        status: 429,
        ok: false,
        json: async () => ({ error: 'Too many requests' }),
      }),
    )

    const events = await collectEvents(
      streamChat([{ role: 'user', content: 'Halo' }], { fetchImpl: fetchImpl as typeof fetch }),
    )

    expect(events).toEqual([{ type: 'error', message: 'Too many requests' }])
  })

  it('falls back to a generic error on fetch failure', async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error('network down')
    })

    const events = await collectEvents(
      streamChat([{ role: 'user', content: 'Halo' }], { fetchImpl: fetchImpl as typeof fetch }),
    )

    expect(events).toEqual([
      { type: 'error', message: 'Ada gangguan koneksi. Coba lagi sebentar lagi, ya.' },
    ])
  })
})
