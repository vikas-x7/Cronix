import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/client/lib/axios";
import type { CreateCronJobInput, UpdateCronJobInput } from "@/server/cronjob/cronjob.validation";

export interface CronJob {
    id: string;
    title: string;
    url: string;
    method: string;
    headers: Record<string, string> | null;
    body: string | null;
    cronExpression: string;
    timezone: string;
    status: string;
    triggerTaskId: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    _count: { executions: number };
}

// ─── Queries ─────────────────────────────────────────

export function useCronJobs() {
    return useQuery<CronJob[]>({
        queryKey: ["cronjobs"],
        queryFn: async () => {
            const { data } = await api.get("/cronjobs");
            return data.data;
        },
    });
}

export function useCronJob(id: string) {
    return useQuery<CronJob>({
        queryKey: ["cronjobs", id],
        queryFn: async () => {
            const { data } = await api.get(`/cronjobs/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

// ─── Mutations ───────────────────────────────────────

export function useCreateCronJob() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateCronJobInput) => {
            const { data } = await api.post("/cronjobs", input);
            return data.data as CronJob;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["cronjobs"] });
            qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useUpdateCronJob() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...input }: UpdateCronJobInput & { id: string }) => {
            const { data } = await api.put(`/cronjobs/${id}`, input);
            return data.data as CronJob;
        },
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["cronjobs"] });
            qc.invalidateQueries({ queryKey: ["cronjobs", variables.id] });
            qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useDeleteCronJob() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/cronjobs/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["cronjobs"] });
            qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}

export function useTriggerCronJob() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post(`/cronjobs/${id}/trigger`);
            return data.data;
        },
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: ["executions", id] });
            qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
        },
    });
}
