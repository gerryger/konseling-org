declare const require: NodeRequire;

import type {
  LLMProvider,
  LLMProviderEvent,
  LLMProviderMessage,
  LLMProviderRequest,
  LLMProviderStopReason,
  LLMProviderToolSpec,
} from './types';

type AnthropicTool = {
  name: string;
  description?: string;
  input_schema: Record<string, unknown>;
};

type AnthropicToolResultBlock = {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
};

type AnthropicMessage =
  | {
      role: 'user' | 'assistant';
      content: string;
    }
  | {
      role: 'user';
      content: AnthropicToolResultBlock[];
    };

type AnthropicStreamEvent = {
  type?: string;
  delta?: {
    type?: string;
    text?: string;
  };
};

type AnthropicContentBlock = {
  type?: string;
  id?: string;
  name?: string;
  input?: unknown;
};

type AnthropicFinalMessage = {
  content?: AnthropicContentBlock[];
  stop_reason?: unknown;
};

type AnthropicStreamLike = AsyncIterable<AnthropicStreamEvent> & {
  finalMessage(): Promise<AnthropicFinalMessage>;
};

type AnthropicClientLike = {
  messages: {
    stream(body: Record<string, unknown>, options?: Record<string, unknown>): AnthropicStreamLike;
  };
};

type AnthropicCtorLike = new (options: {
  apiKey: string;
  dangerouslyAllowBrowser?: boolean;
}) => AnthropicClientLike;

const anthropicModule = require('@anthropic-ai/sdk') as {
  default?: AnthropicCtorLike;
  Anthropic?: AnthropicCtorLike;
};
const AnthropicClientCtor =
  anthropicModule.default ?? anthropicModule.Anthropic ?? (anthropicModule as unknown as AnthropicCtorLike);

const DEFAULT_MODEL = 'claude-sonnet-5';
const DEFAULT_MAX_TOKENS = 1024;

function normalizeStopReason(reason: unknown): LLMProviderStopReason {
  switch (reason) {
    case 'end_turn':
    case 'max_tokens':
    case 'stop_sequence':
    case 'tool_use':
    case 'pause_turn':
    case 'refusal':
      return reason;
    default:
      return 'unknown';
  }
}

function toAnthropicTool(tool: LLMProviderToolSpec): AnthropicTool {
  return {
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  };
}

function toAnthropicMessage(message: LLMProviderMessage): AnthropicMessage {
  if (message.role === 'tool_result') {
    return {
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: message.toolCallId,
          content: message.content,
          ...(message.isError ? { is_error: true } : {}),
        },
      ],
    };
  }

  return {
    role: message.role,
    content: message.content,
  };
}

function extractTextDelta(event: AnthropicStreamEvent): string | null {
  if (event.type !== 'content_block_delta') return null;
  if (event.delta?.type !== 'text_delta') return null;
  return typeof event.delta.text === 'string' ? event.delta.text : null;
}

export class AnthropicProvider implements LLMProvider {
  readonly name = 'anthropic' as const;
  readonly model: string;

  private readonly apiKey: string;
  private readonly maxTokens: number;

  constructor(options: { apiKey: string; model?: string; maxTokens?: number }) {
    if (!options.apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required for the Anthropic provider');
    }

    this.apiKey = options.apiKey;
    this.model = options.model ?? DEFAULT_MODEL;
    this.maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  }

  private createClient(): AnthropicClientLike {
    return new AnthropicClientCtor({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async *stream(request: LLMProviderRequest): AsyncGenerator<LLMProviderEvent, void, void> {
    try {
      const client = this.createClient();
      const stream = client.messages.stream(
        {
          model: this.model,
          max_tokens: this.maxTokens,
          system: request.system,
          messages: request.messages.map(toAnthropicMessage) as unknown as Record<string, unknown>[],
          ...(request.tools?.length
            ? { tools: request.tools.map(toAnthropicTool) as unknown as Record<string, unknown>[] }
            : {}),
        },
        request.signal ? ({ signal: request.signal } as Record<string, unknown>) : undefined,
      );

      for await (const event of stream) {
        const text = extractTextDelta(event);
        if (text) {
          yield { type: 'text', delta: text };
        }
      }

      const finalMessage = await stream.finalMessage();

      for (const block of finalMessage.content ?? []) {
        if (block.type !== 'tool_use') continue;

        yield {
          type: 'tool_call',
          toolCall: {
            id: block.id ?? '',
            name: block.name ?? '',
            input: block.input,
          },
        };
      }

      yield { type: 'done', stopReason: normalizeStopReason(finalMessage.stop_reason) };
    } catch (error) {
      yield {
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown Anthropic provider error',
      };
    }
  }
}
