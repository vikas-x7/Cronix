import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export class CronJobRepository {
    async findAllByUserId(userId: string) {
        return prisma.cronJob.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { executions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    async findById(id: string) {
        return prisma.cronJob.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { executions: true },
                },
            },
        });
    }

    async findByIdAndUserId(id: string, userId: string) {
        return prisma.cronJob.findFirst({
            where: { id, userId },
            include: {
                _count: {
                    select: { executions: true },
                },
            },
        });
    }

    async create(data: Prisma.CronJobCreateInput) {
        return prisma.cronJob.create({ data });
    }

    async update(id: string, data: Prisma.CronJobUpdateInput) {
        return prisma.cronJob.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.cronJob.delete({ where: { id } });
    }

    async countByUserId(userId: string) {
        return prisma.cronJob.groupBy({
            by: ["status"],
            where: { userId },
            _count: { _all: true },
        });
    }
}

export const cronJobRepository = new CronJobRepository();
