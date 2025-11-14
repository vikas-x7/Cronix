import { NextResponse } from "next/server";
import { dashboardService } from "./dashboard.service";
import { getAuthSession } from "@/lib/auth";

export class DashboardController {
    async getStats() {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const stats = await dashboardService.getStats(session.user.id);
            return NextResponse.json({ data: stats });
        } catch {
            return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
        }
    }
}

export const dashboardController = new DashboardController();
