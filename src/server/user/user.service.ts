import { userRepository } from "./user.repository";

export class UserService {
    async getById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async getByEmail(email: string) {
        return userRepository.findByEmail(email);
    }
}

export const userService = new UserService();
