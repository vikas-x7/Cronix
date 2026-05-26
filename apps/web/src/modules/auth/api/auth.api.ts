import api from '@/shared/lib/axios';
import { API_ROUTES } from '@/shared/config/constants';
import type { User } from '../types/auth.types';

export async function getMe(): Promise<User> {
  const response = await api.get(API_ROUTES.AUTH.ME);
  const { __message, ...user } = response.data;
  return user as User;
}

export async function logout(): Promise<void> {
  await api.post(API_ROUTES.AUTH.LOGOUT);
}
