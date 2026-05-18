import { z } from 'zod';

export const createJobSchema = z.object({
  name: z.string().min(1, 'Job name is required').max(200),
  type: z.enum(['CRON', 'EVENT']),
  workspaceId: z.string().min(1, 'Workspace is required'),
  endpoint: z.string().url('Must be a valid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  schedule: z.string().optional(),
  body: z.string().optional(),
  retryCount: z.coerce.number().min(0).max(10),
  retryDelay: z.coerce.number().min(1),
  timeout: z.coerce.number().min(5).max(300),
  failureEmail: z.boolean(),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;
