import { cronJobRepository } from "./cronjob.repository";
import { executionRepository } from "../execution/execution.repository";
import type { CreateCronJobInput, UpdateCronJobInput } from "./cronjob.validation";

export class CronJobService {
    async getAllByUser(userId: string) {
        return cronJobRepository.findAllByUserId(userId);
    }

    async getById(id: string, userId: string) {
        const job = await cronJobRepository.findByIdAndUserId(id, userId);
        if (!job) {
            throw new Error("Cron job not found");
        }
        return job;
    }

    async create(userId: string, data: CreateCronJobInput) {
        const job = await cronJobRepository.create({
            title: data.title,
            url: data.url,
            method: data.method,
            headers: data.headers ?? undefined,
            body: data.body ?? undefined,
            cronExpression: data.cronExpression,
            timezone: data.timezone,
            user: { connect: { id: userId } },
        });

        return job;
    }

    async update(id: string, userId: string, data: UpdateCronJobInput) {
        const existing = await cronJobRepository.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new Error("Cron job not found");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.url !== undefined) updateData.url = data.url;
        if (data.method !== undefined) updateData.method = data.method;
        if (data.headers !== undefined) updateData.headers = data.headers ?? undefined;
        if (data.body !== undefined) updateData.body = data.body ?? undefined;
        if (data.cronExpression !== undefined) updateData.cronExpression = data.cronExpression;
        if (data.timezone !== undefined) updateData.timezone = data.timezone;
        if (data.status !== undefined) updateData.status = data.status;

        return cronJobRepository.update(id, updateData);
    }

    async delete(id: string, userId: string) {
        const existing = await cronJobRepository.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new Error("Cron job not found");
        }

        return cronJobRepository.delete(id);
    }

    async toggleStatus(id: string, userId: string) {
        const existing = await cronJobRepository.findByIdAndUserId(id, userId);
        if (!existing) {
            throw new Error("Cron job not found");
        }

        const newStatus = existing.status === "active" ? "paused" : "active";
        return cronJobRepository.update(id, { status: newStatus });
    }

    async triggerManually(id: string, userId: string) {
        const job = await cronJobRepository.findByIdAndUserId(id, userId);
        if (!job) {
            throw new Error("Cron job not found");
        }

        const startTime = Date.now();
        let statusCode: number | null = null;
        let responseBody: string | null = null;
        let success = false;
        let error: string | null = null;

        try {
            const fetchOptions: RequestInit = {
                method: job.method,
                headers: (job.headers as Record<string, string>) ?? undefined,
            };

            if (job.body && !["GET", "HEAD"].includes(job.method)) {
                fetchOptions.body = typeof job.body === "string" ? job.body : JSON.stringify(job.body);
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

        const execution = await executionRepository.create({
            statusCode,
            responseBody: responseBody?.substring(0, 5000) ?? null,
            duration,
            success,
            error,
            cronJob: { connect: { id: job.id } },
        });

        return execution;
    }
}

export const cronJobService = new CronJobService();
