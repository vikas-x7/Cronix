import api from '@/shared/lib/axios';
import { API_ROUTES } from '@/shared/config/constants';
import type { Workspace, CreateWorkspaceInput } from '../types/workspace.types';

interface PaginatedResponse<T> {
  items: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const response = await api.get<{ data: PaginatedResponse<Workspace> }>(
    API_ROUTES.WORKSPACES.BASE,
    { params: { limit: 1000 } },
  );
  return response.data.data.items;
}

export async function createWorkspace(
  data: CreateWorkspaceInput,
): Promise<Workspace> {
  const response = await api.post<{ data: Workspace }>(
    API_ROUTES.WORKSPACES.BASE,
    data,
  );
  return response.data.data;
}

export async function deleteWorkspace(id: string): Promise<void> {
  await api.delete(API_ROUTES.WORKSPACES.DETAIL(id));
}
