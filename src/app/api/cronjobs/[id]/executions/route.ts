import { executionController } from "@/server/execution/execution.controller";
import type { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
    const { id } = await params;
    return executionController.listByJob(id, request);
}
