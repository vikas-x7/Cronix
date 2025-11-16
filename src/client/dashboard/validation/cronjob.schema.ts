import { z } from "zod";

export const cronJobFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be under 100 characters"),
    url: z
        .string()
        .url("Enter a valid URL (e.g. https://example.com/api)")
        .min(1, "URL is required"),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"]).default("GET"),
    headers: z.string().optional().refine(
        (val) => {
            if (!val || val.trim() === "") return true;
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: "Headers must be valid JSON" }
    ),
    body: z.string().optional(),
    cronExpression: z
        .string()
        .min(1, "Cron expression is required"),
    timezone: z.string().default("UTC"),
});

export type CronJobFormData = z.infer<typeof cronJobFormSchema>;

// Common cron presets for the UI
export const CRON_PRESETS = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every 5 minutes", value: "*/5 * * * *" },
    { label: "Every 15 minutes", value: "*/15 * * * *" },
    { label: "Every 30 minutes", value: "*/30 * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every 6 hours", value: "0 */6 * * *" },
    { label: "Every 12 hours", value: "0 */12 * * *" },
    { label: "Daily at midnight", value: "0 0 * * *" },
    { label: "Daily at noon", value: "0 12 * * *" },
    { label: "Weekly (Mon midnight)", value: "0 0 * * 1" },
    { label: "Monthly (1st midnight)", value: "0 0 1 * *" },
] as const;

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"] as const;

export const TIMEZONES = [
    "UTC",
    "Asia/Kolkata",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Berlin",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Dubai",
    "Australia/Sydney",
    "Pacific/Auckland",
] as const;
