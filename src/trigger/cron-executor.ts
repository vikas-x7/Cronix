import { logger, schedules } from "@trigger.dev/sdk/v3";
import { prisma } from "@/lib/prisma";
import { getNextCronDate } from "@/lib/cron-utils";

export const cronExecutor = schedules.task({
    id: "cron-executor",
    // Run every minute to check for due jobs
    cron: "* * * * *",
    maxDuration: 300,
    run: async () => {
        const now = new Date();

        // 1. Find all active jobs whose nextExecutionAt is <= now
        const dueJobs = await prisma.cronJob.findMany({
            where: {
                status: "active",
                nextExecutionAt: { lte: now },
            },
        });

        if (dueJobs.length === 0) {
            logger.log("No due jobs found");
            return { executed: 0 };
        }

        logger.log(`Found ${dueJobs.length} due job(s)`);

        const results = [];

        for (const job of dueJobs) {
            const startTime = Date.now();
            let statusCode: number | null = null;
            let responseBody: string | null = null;
            let success = false;
            let error: string | null = null;

            try {
                // 2. Execute the HTTP request
                const fetchOptions: RequestInit = {
                    method: job.method,
                    headers: (job.headers as Record<string, string>) ?? undefined,
                };

                if (job.body && !["GET", "HEAD"].includes(job.method)) {
                    fetchOptions.body =
                        typeof job.body === "string"
                            ? job.body
                            : JSON.stringify(job.body);
                }

                const response = await fetch(job.url, fetchOptions);
                statusCode = response.status;
                responseBody = await response.text().catch(() => null);
                success = response.ok;

                if (!response.ok) {
                    error = `HTTP ${response.status}: ${response.statusText}`;
                }
            } catch (err) {
                error = err instanceof Error ? err.message : "Unknown error";
                success = false;
            }

            const duration = Date.now() - startTime;

            // 3. Log the execution record
            await prisma.execution.create({
                data: {
                    statusCode,
                    responseBody: responseBody?.substring(0, 5000) ?? null,
                    duration,
                    success,
                    error,
                    cronJob: { connect: { id: job.id } },
                },
            });

            // 4. Calculate next execution time and update the job
            try {
                const nextExecution = getNextCronDate(
                    job.cronExpression,
                    job.timezone
                );
                await prisma.cronJob.update({
                    where: { id: job.id },
                    data: { nextExecutionAt: nextExecution },
                });
            } catch (cronErr) {
                logger.error(
                    `Failed to calculate next execution for job ${job.id}`,
                    { error: cronErr }
                );
            }

            results.push({
                jobId: job.id,
                title: job.title,
                success,
                statusCode,
                duration,
            });

            logger.log(`Executed job: ${job.title}`, {
                success,
                statusCode,
                duration: `${duration}ms`,
            });
        }

        return { executed: results.length, results };
    },
});
