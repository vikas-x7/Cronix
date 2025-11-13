import { cronJobController } from "@/server/cronjob/cronjob.controller";

export async function GET() {
    return cronJobController.list();
}

export async function POST(request: Request) {
    return cronJobController.create(request);
}
