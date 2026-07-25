export type LLMProviderName = 'anthropic' | 'openai' | 'gemini';

export interface LLMProviderTextMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMProviderToolResultMessage {
  role: 'tool_result';
  toolCallId: string;
  content: string;
  isError?: boolean;
}

export type LLMProviderMessage = LLMProviderTextMessage | LLMProviderToolResultMessage;

export interface LLMProviderToolSpec {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface LLMProviderToolCall {
  id: string;
  name: string;
  input: unknown;
}

export type LLMProviderStopReason =
  | 'end_turn'
  | 'max_tokens'
  | 'stop_sequence'
  | 'tool_use'
  | 'pause_turn'
  | 'refusal'
  | 'unknown';

export type LLMProviderEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool_call'; toolCall: LLMProviderToolCall }
  | { type: 'done'; stopReason: LLMProviderStopReason }
  | { type: 'error'; message: string };

export interface LLMProviderRequest {
  system: string;
  messages: LLMProviderMessage[];
  tools?: LLMProviderToolSpec[];
  signal?: AbortSignal;
}

export interface LLMProvider {
  readonly name: LLMProviderName;
  readonly model: string;
  stream(request: LLMProviderRequest): AsyncGenerator<LLMProviderEvent, void, void>;
}

export interface LLMProviderSelection {
  provider: LLMProviderName;
  model?: string;
  apiKey?: string;
  maxTokens?: number;
}
