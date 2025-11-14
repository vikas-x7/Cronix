import { NextResponse } from "next/server";
import { executionService } from "./execution.service";
import { getAuthSession } from "@/lib/auth";
import { cronJobService } from "../cronjob/cronjob.service";

async function getUser() {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return null;
    }
    return session.user;
}

export class ExecutionController {
    async listByJob(jobId: string, request: Request) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            // Verify job belongs to user
            await cronJobService.getById(jobId, user.id);

            const { searchParams } = new URL(request.url);
            const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
            const offset = parseInt(searchParams.get("offset") ?? "0");

            const executions = await executionService.getByJobId(jobId, limit, offset);
            return NextResponse.json({ data: executions });
        } catch {
            return NextResponse.json({ error: "Failed to fetch executions" }, { status: 500 });
        }
    }
}

export const executionController = new ExecutionController();
