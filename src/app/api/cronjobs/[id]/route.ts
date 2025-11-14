import { cronJobController } from "@/server/cronjob/cronjob.controller";
import type { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    return cronJobController.getById(id);
}

export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params;
    return cronJobController.update(id, request);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    return cronJobController.delete(id);
}
