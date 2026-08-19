import api from '@/lib/api/axios';
import { API_ROUTES } from '@/shared/config/constants';
import type { DashboardStats } from '../types/dashboard.types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get(API_ROUTES.DASHBOARD.STATS);
  return response.data.data;
}
