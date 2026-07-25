import 'server-only';

import { createLLMProvider } from './provider/factory';
import type {
  LLMProvider,
  LLMProviderMessage,
  LLMProviderStopReason,
  LLMProviderToolCall,
} from './provider/types';
import { getAgentTool, getAgentToolSpecs } from './tools/registry';
import type { AgentStreamEvent } from './tools/types';

const MAX_TOOL_ROUNDS = 4;

function getLatestUserMessage(messages: LLMProviderMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === 'user' && 'content' in message) {
      return message.content;
    }
  }

  return '';
}

function makeAssistantToolUseMessage(toolCalls: LLMProviderToolCall[], content = ''): LLMProviderMessage {
  return content
    ? { role: 'assistant', content, toolCalls }
    : { role: 'assistant', toolCalls };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export interface RunAgentConversationInput {
  system: string;
  messages: LLMProviderMessage[];
  providerFactory?: () => LLMProvider;
}

export async function* runAgentConversation(
  input: RunAgentConversationInput,
): AsyncGenerator<AgentStreamEvent, void, void> {
  const providerFactory = input.providerFactory ?? createLLMProvider;
  const conversation: LLMProviderMessage[] = [...input.messages];
  const toolSpecs = getAgentToolSpecs();

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    let provider: LLMProvider;

    try {
      provider = providerFactory();
    } catch (error) {
      yield { type: 'error', message: errorMessage(error, 'Unable to initialize provider') };
      return;
    }

    let assistantText = '';
    const toolCalls: LLMProviderToolCall[] = [];
    let stopReason: LLMProviderStopReason = 'unknown';

    try {
      for await (const event of provider.stream({ system: input.system, messages: conversation, tools: toolSpecs })) {
        if (event.type === 'text') {
          assistantText += event.delta;
          yield event;
          continue;
        }

        if (event.type === 'tool_call') {
          toolCalls.push(event.toolCall);
          continue;
        }

        if (event.type === 'done') {
          stopReason = event.stopReason;
          continue;
        }

        if (event.type === 'error') {
          yield event;
          return;
        }
      }
    } catch (error) {
      yield { type: 'error', message: errorMessage(error, 'Unable to stream provider response') };
      return;
    }

    if (toolCalls.length === 0) {
      yield { type: 'done', stopReason };
      return;
    }

    conversation.push(makeAssistantToolUseMessage(toolCalls, assistantText.trim()));

    const latestUserMessage = getLatestUserMessage(conversation);
    for (const toolCall of toolCalls) {
      const tool = getAgentTool(toolCall.name);
      if (!tool) {
        yield { type: 'error', message: `Unknown tool: ${toolCall.name}` };
        return;
      }

      let result;
      try {
        result = await tool.execute(toolCall.input, { latestUserMessage });
      } catch (error) {
        yield { type: 'error', message: errorMessage(error, `Tool failed: ${toolCall.name}`) };
        return;
      }

      if (result.event) {
        yield result.event;
      }

      conversation.push({
        role: 'tool_result',
        toolCallId: toolCall.id,
        content: result.resultContent,
      });
    }
  }

  yield { type: 'error', message: 'Maximum tool rounds reached' };
}
