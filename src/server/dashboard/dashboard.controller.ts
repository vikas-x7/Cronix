import { NextResponse } from 'next/server';
import { dashboardService } from './dashboard.service';
import { getAuthSession } from '@/lib/auth';

export class DashboardController {
  async getStats(request: Request) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const statusFilter = searchParams.get('status') ?? undefined;
    const search = searchParams.get('search') ?? undefined;

    try {
      const stats = await dashboardService.getStats(session.user.id, page, limit, statusFilter, search);
      return NextResponse.json({ data: stats });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
  }
}

export const dashboardController = new DashboardController();
