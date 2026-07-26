import { handleEventsRequest } from '../../../lib/api/events';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  return handleEventsRequest(request);
}
