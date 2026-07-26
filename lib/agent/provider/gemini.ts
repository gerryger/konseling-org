import 'server-only';

declare const require: NodeRequire;

import type {
  LLMProvider,
  LLMProviderEvent,
  LLMProviderMessage,
  LLMProviderRequest,
  LLMProviderStopReason,
  LLMProviderToolCall,
  LLMProviderToolSpec,
} from './types';

type GeminiFunctionCall = {
  id?: string;
  name?: string;
  args?: Record<string, unknown>;
};

type GeminiPart = {
  text?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  functionResponse?: { id?: string; name: string; response: Record<string, unknown> };
};

type GeminiContent = {
  role: 'user' | 'model';
  parts: GeminiPart[];
};

type GeminiStreamChunk = {
  text?: string;
  functionCalls?: GeminiFunctionCall[];
  candidates?: Array<{ finishReason?: string }>;
};

type GeminiFunctionDeclaration = {
  name: string;
  description?: string;
  parametersJsonSchema: Record<string, unknown>;
};

type GeminiGenerateContentStreamParams = {
  model: string;
  contents: GeminiContent[];
  config: Record<string, unknown>;
};

type GeminiClientLike = {
  models: {
    generateContentStream(params: GeminiGenerateContentStreamParams): Promise<AsyncIterable<GeminiStreamChunk>>;
  };
};

type GeminiClientCtorLike = new (options: { apiKey: string }) => GeminiClientLike;

const genaiModule = require('@google/genai') as { GoogleGenAI?: GeminiClientCtorLike };
const GoogleGenAICtor = genaiModule.GoogleGenAI as GeminiClientCtorLike;

const DEFAULT_MODEL = 'gemini-2.5-flash';
const DEFAULT_MAX_TOKENS = 1024;

function normalizeStopReason(reason: string | undefined, hasToolCalls: boolean): LLMProviderStopReason {
  if (hasToolCalls) return 'tool_use';

  switch (reason) {
    case 'STOP':
      return 'end_turn';
    case 'MAX_TOKENS':
      return 'max_tokens';
    case 'SAFETY':
    case 'RECITATION':
    case 'MALFORMED_FUNCTION_CALL':
      return 'refusal';
    default:
      return 'unknown';
  }
}

function toFunctionDeclaration(tool: LLMProviderToolSpec): GeminiFunctionDeclaration {
  return {
    name: tool.name,
    description: tool.description,
    parametersJsonSchema: tool.inputSchema,
  };
}

function parseToolResultContent(content: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(content) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : { result: parsed };
  } catch {
    return { result: content };
  }
}

function toGeminiContents(messages: LLMProviderMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];
  const toolNameById = new Map<string, string>();
  let pendingFunctionResponses: GeminiPart[] = [];

  const flushFunctionResponses = () => {
    if (pendingFunctionResponses.length === 0) return;
    contents.push({ role: 'user', parts: pendingFunctionResponses });
    pendingFunctionResponses = [];
  };

  for (const message of messages) {
    if (message.role === 'tool_result') {
      const name = toolNameById.get(message.toolCallId) ?? message.toolCallId;
      pendingFunctionResponses.push({
        functionResponse: {
          name,
          response: parseToolResultContent(message.content),
        },
      });
      continue;
    }

    flushFunctionResponses();

    if ('toolCalls' in message) {
      const parts: GeminiPart[] = [];
      if (message.content?.trim()) {
        parts.push({ text: message.content.trim() });
      }
      for (const toolCall of message.toolCalls) {
        toolNameById.set(toolCall.id, toolCall.name);
        parts.push({ functionCall: { name: toolCall.name, args: (toolCall.input as Record<string, unknown>) ?? {} } });
      }
      contents.push({ role: 'model', parts });
      continue;
    }

    contents.push({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    });
  }

  flushFunctionResponses();
  return contents;
}

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini' as const;
  readonly model: string;

  private readonly apiKey: string;
  private readonly maxTokens: number;

  constructor(options: { apiKey: string; model?: string; maxTokens?: number }) {
    if (!options.apiKey) {
      throw new Error('GEMINI_API_KEY is required for the Gemini provider');
    }

    this.apiKey = options.apiKey;
    this.model = options.model ?? DEFAULT_MODEL;
    this.maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  }

  private createClient(): GeminiClientLike {
    return new GoogleGenAICtor({ apiKey: this.apiKey });
  }

  async *stream(request: LLMProviderRequest): AsyncGenerator<LLMProviderEvent, void, void> {
    try {
      const client = this.createClient();
      const stream = await client.models.generateContentStream({
        model: this.model,
        contents: toGeminiContents(request.messages),
        config: {
          systemInstruction: request.system,
          maxOutputTokens: this.maxTokens,
          ...(request.tools?.length
            ? { tools: [{ functionDeclarations: request.tools.map(toFunctionDeclaration) }] }
            : {}),
          ...(request.signal ? { abortSignal: request.signal } : {}),
        },
      });

      const toolCalls: LLMProviderToolCall[] = [];
      let finishReason: string | undefined;
      let callIndex = 0;

      for await (const chunk of stream) {
        if (chunk.text) {
          yield { type: 'text', delta: chunk.text };
        }

        for (const call of chunk.functionCalls ?? []) {
          if (!call.name) continue;
          const id = call.id ?? `${call.name}-${callIndex}`;
          callIndex += 1;
          toolCalls.push({ id, name: call.name, input: call.args ?? {} });
        }

        const reason = chunk.candidates?.[0]?.finishReason;
        if (reason) finishReason = reason;
      }

      for (const toolCall of toolCalls) {
        yield { type: 'tool_call', toolCall };
      }

      yield { type: 'done', stopReason: normalizeStopReason(finishReason, toolCalls.length > 0) };
    } catch (error) {
      yield {
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown Gemini provider error',
      };
    }
  }
}
