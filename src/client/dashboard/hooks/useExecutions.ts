import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export interface Execution {
    id: string;
    statusCode: number | null;
    responseBody: string | null;
    duration: number;
    success: boolean;
    error: string | null;
    executedAt: string;
    cronJobId: string;
    cronJob?: {
        id: string;
        title: string;
        url: string;
    };
}

export function useExecutions(jobId: string, limit = 50) {
    return useQuery<Execution[]>({
        queryKey: ["executions", jobId, limit],
        queryFn: async () => {
            const { data } = await api.get(`/cronjobs/${jobId}/executions`, {
                params: { limit },
            });
            return data.data;
        },
        enabled: !!jobId,
    });
}
