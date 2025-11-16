import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { Execution } from "./useExecutions";

export interface DashboardStats {
    jobs: {
        total: number;
        active: number;
        paused: number;
    };
    executions: {
        totalExecutions: number;
        successfulExecutions: number;
        failedExecutions: number;
        successRate: number;
    };
    recentExecutions: Execution[];
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const { data } = await api.get("/dashboard/stats");
            return data.data;
        },
        refetchInterval: 30000, // auto-refresh every 30s
    });
}
