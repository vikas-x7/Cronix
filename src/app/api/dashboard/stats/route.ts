import { dashboardController } from "@/server/dashboard/dashboard.controller";

export async function GET() {
    return dashboardController.getStats();
}
