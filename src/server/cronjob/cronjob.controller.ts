import { NextResponse } from "next/server";
import { cronJobService } from "./cronjob.service";
import { createCronJobSchema, updateCronJobSchema } from "./cronjob.validation";
import { getAuthSession } from "@/lib/auth";

async function getUser() {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return null;
    }
    return session.user;
}

export class CronJobController {
    async list() {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const jobs = await cronJobService.getAllByUser(user.id);
            return NextResponse.json({ data: jobs });
        } catch {
            return NextResponse.json({ error: "Failed to fetch cron jobs" }, { status: 500 });
        }
    }

    async create(request: Request) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = createCronJobSchema.safeParse(body);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                    { status: 400 }
                );
            }

            const job = await cronJobService.create(user.id, parsed.data);
            return NextResponse.json({ data: job }, { status: 201 });
        } catch {
            return NextResponse.json({ error: "Failed to create cron job" }, { status: 500 });
        }
    }

    async getById(id: string) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const job = await cronJobService.getById(id, user.id);
            return NextResponse.json({ data: job });
        } catch {
            return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
        }
    }

    async update(id: string, request: Request) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const parsed = updateCronJobSchema.safeParse(body);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
                    { status: 400 }
                );
            }

            const job = await cronJobService.update(id, user.id, parsed.data);
            return NextResponse.json({ data: job });
        } catch {
            return NextResponse.json({ error: "Failed to update cron job" }, { status: 500 });
        }
    }

    async delete(id: string) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await cronJobService.delete(id, user.id);
            return NextResponse.json({ message: "Cron job deleted" });
        } catch {
            return NextResponse.json({ error: "Failed to delete cron job" }, { status: 500 });
        }
    }

    async trigger(id: string) {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const execution = await cronJobService.triggerManually(id, user.id);
            return NextResponse.json({ data: execution });
        } catch {
            return NextResponse.json({ error: "Failed to trigger cron job" }, { status: 500 });
        }
    }
}

export const cronJobController = new CronJobController();
