export const API_ROUTES = {
  AUTH: {
    GOOGLE: '/auth/google',
    GITHUB: '/auth/github',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
  WORKSPACES: {
    BASE: '/workspaces',
    DETAIL: (id: string) => `/workspaces/${id}`,
  },
  JOBS: {
    BASE: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    PAUSE: (id: string) => `/jobs/${id}/pause`,
    RESUME: (id: string) => `/jobs/${id}/resume`,
    RUN: (id: string) => `/jobs/${id}/run`,
  },
  EXECUTIONS: {
    BASE: '/executions',
    STORE: '/executions/store',
    DETAIL: (id: string) => `/executions/${id}`,
    LOGS: (id: string) => `/executions/${id}/logs`,
  },
} as const;
