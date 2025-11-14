import { prisma } from "@/lib/prisma";

export class UserRepository {
    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }
}

export const userRepository = new UserRepository();
