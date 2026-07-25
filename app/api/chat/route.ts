import { handleChatRequest } from '../../../lib/api/chat';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request);
}
