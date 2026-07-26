import { runAgentConversation } from '../../../lib/agent/run-agent'
import type { LLMProvider } from '../../../lib/agent/provider/types'

async function collectEvents(generator: AsyncGenerator<unknown, void, void>) {
  const events: unknown[] = []
  for await (const event of generator) {
    events.push(event)
  }
  return events
}

describe('runAgentConversation turn guidance', () => {
  it('injects empathy guidance based on the latest user message', async () => {
    const systems: string[] = []

    const provider: LLMProvider = {
      name: 'anthropic',
      model: 'test-model',
      async *stream(request) {
        systems.push(request.system)
        yield { type: 'text', delta: 'Aku di sini sama kamu.' }
        yield { type: 'done', stopReason: 'end_turn' }
      },
    }

    const events = await collectEvents(
      runAgentConversation({
        system: 'SYSTEM BASE',
        messages: [{ role: 'user', content: 'Aku cemas banget dan takut salah' }],
        providerFactory: () => provider,
      }),
    )

    expect(events).toEqual([
      { type: 'text', delta: 'Aku di sini sama kamu.' },
      { type: 'done', stopReason: 'end_turn' },
    ])
    expect(systems).toHaveLength(1)
    expect(systems[0]).toContain('SYSTEM BASE')
    expect(systems[0]).toContain('cemas/panik')
    expect(systems[0]).toContain('Jangan bilang "tenang"')
  })
})
