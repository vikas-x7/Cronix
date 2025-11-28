import { dashboardController } from '@/server/dashboard/dashboard.controller';

export async function GET(request: Request) {
  return dashboardController.getStats(request);
}
