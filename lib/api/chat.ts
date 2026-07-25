import { TextEncoder } from 'node:util';

import { SYSTEM_PROMPT } from '../agent/system-prompt';
import { runAgentConversation } from '../agent/run-agent';
import type { LLMProvider, LLMProviderMessage } from '../agent/provider/types';

export interface ChatRequestMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestBody {
  system?: string;
  messages: ChatRequestMessage[];
}

export interface ChatValidationSuccess {
  system: string;
  messages: LLMProviderMessage[];
}

export interface ChatRateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
const CHAT_RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_CHAT_MESSAGES = 20;
const MAX_CHAT_CONTENT_LENGTH = 4_000;
const rateLimitStore = new Map<string, { windowStart: number; count: number }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidRole(role: unknown): role is ChatRequestMessage['role'] {
  return role === 'user' || role === 'assistant';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateChatRequestBody(body: unknown):
  | { ok: true; value: ChatValidationSuccess }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  if (body.system !== undefined) {
    return { ok: false, error: 'system prompt overrides are not allowed' };
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false, error: 'messages must be a non-empty array' };
  }

  if (body.messages.length > MAX_CHAT_MESSAGES) {
    return { ok: false, error: `messages cannot exceed ${MAX_CHAT_MESSAGES} items` };
  }

  const messages: LLMProviderMessage[] = [];
  const rawMessages = body.messages as unknown[];
  for (let index = 0; index < rawMessages.length; index += 1) {
    const message = rawMessages[index];
    if (!isRecord(message)) {
      return { ok: false, error: `messages[${index}] must be an object` };
    }

    if (!isValidRole(message.role)) {
      return { ok: false, error: `messages[${index}].role must be "user" or "assistant"` };
    }

    if (!isNonEmptyString(message.content)) {
      return { ok: false, error: `messages[${index}].content must be a non-empty string` };
    }

    if (message.content.length > MAX_CHAT_CONTENT_LENGTH) {
      return {
        ok: false,
        error: `messages[${index}].content cannot exceed ${MAX_CHAT_CONTENT_LENGTH} characters`,
      };
    }

    messages.push({
      role: message.role,
      content: message.content.trim(),
    });
  }

  return {
    ok: true,
    value: {
      system: SYSTEM_PROMPT,
      messages,
    },
  };
}

export function getRequestIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = headers.get('x-real-ip')?.trim();
  return forwardedFor || realIp || 'unknown';
}

export function checkChatRateLimit(ip: string, now = Date.now()): ChatRateLimitResult {
  const bucket = rateLimitStore.get(ip);

  if (!bucket || now - bucket.windowStart >= CHAT_RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { windowStart: now, count: 1 });
    return { allowed: true, remaining: CHAT_RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (bucket.count >= CHAT_RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.windowStart + CHAT_RATE_LIMIT_WINDOW_MS - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.count += 1;
  rateLimitStore.set(ip, bucket);
  return { allowed: true, remaining: CHAT_RATE_LIMIT_MAX_REQUESTS - bucket.count };
}

export function resetChatRateLimitStore(): void {
  rateLimitStore.clear();
}

async function streamAgentResponse(
  request: ChatValidationSuccess,
  deps?: {
    providerFactory?: () => LLMProvider;
  },
): Promise<Response> {
  const stream = runAgentConversation({
    system: request.system,
    messages: request.messages,
    providerFactory: deps?.providerFactory,
  });

  const serialize = (event: Awaited<ReturnType<typeof runAgentConversation>> extends AsyncGenerator<infer E> ? E : never) => {
    switch (event.type) {
      case 'text':
        return `event: text\ndata: ${JSON.stringify({ delta: event.delta })}\n\n`;
      case 'risk':
        return `event: risk\ndata: ${JSON.stringify(event.risk)}\n\n`;
      case 'psychologists':
        return `event: psychologists\ndata: ${JSON.stringify({ psychologists: event.psychologists })}\n\n`;
      case 'done':
        return `event: done\ndata: ${JSON.stringify({ stopReason: event.stopReason })}\n\n`;
      case 'error':
        return `event: error\ndata: ${JSON.stringify({ message: event.message })}\n\n`;
    }
  };

  if (typeof globalThis.ReadableStream !== 'function') {
    const chunks: string[] = [];
    for await (const event of stream) {
      chunks.push(serialize(event as never));
    }

    return new Response(chunks.join(''), {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          controller.enqueue(encoder.encode(serialize(event as never)));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export async function handleChatRequest(
  request: Request,
  deps?: {
    now?: () => number;
    providerFactory?: () => LLMProvider;
  },
): Promise<Response> {
  const body = await request.json().catch(() => null);
  const validation = validateChatRequestBody(body);

  if (validation.ok === false) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const ip = getRequestIp(request.headers);
  const rateLimit = checkChatRateLimit(ip, deps?.now?.() ?? Date.now());
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: rateLimit.retryAfterSeconds ? { 'retry-after': String(rateLimit.retryAfterSeconds) } : undefined,
      },
    );
  }

  return streamAgentResponse(validation.value, {
    providerFactory: deps?.providerFactory,
  });
}
