import { z } from "zod";

export const createCronJobSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be under 100 characters"),
    url: z
        .string()
        .url("Must be a valid URL")
        .min(1, "URL is required"),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], {
        message: "Invalid HTTP method",
    }).default("GET"),
    headers: z
        .record(z.string(), z.string())
        .optional()
        .nullable(),
    body: z
        .string()
        .optional()
        .nullable(),
    cronExpression: z
        .string()
        .min(1, "Cron expression is required")
        .regex(
            /^(\*|([0-9]|[1-5][0-9])|\*\/([0-9]|[1-5][0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|[12][0-9]|3[01])|\*\/([1-9]|[12][0-9]|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|[0-6]|\*\/[0-6])$/,
            "Invalid cron expression (use 5-field format: min hour day month weekday)"
        ),
    timezone: z
        .string()
        .default("UTC"),
});

export const updateCronJobSchema = createCronJobSchema.partial().extend({
    status: z.enum(["active", "paused"]).optional(),
});

export type CreateCronJobInput = z.infer<typeof createCronJobSchema>;
export type UpdateCronJobInput = z.infer<typeof updateCronJobSchema>;
