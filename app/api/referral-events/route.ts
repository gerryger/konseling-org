import { handleReferralEventsRequest } from '@/lib/api/referral-events';

export async function POST(request: Request) {
  return handleReferralEventsRequest(request);
}
