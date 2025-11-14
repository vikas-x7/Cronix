import { cronJobController } from "@/server/cronjob/cronjob.controller";
import type { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    return cronJobController.trigger(id);
}
