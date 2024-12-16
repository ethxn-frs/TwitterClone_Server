import {ChangePasswordRequest, LoginRequest, LostPasswordRequest} from "../handler/validator/user-validator";
import {User} from "../database/entities/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {DataSource} from "typeorm";
import {UserService} from "./user-service";
import {AppDataSource} from "../database/database";

const SALT_ROUNDS = 10;

const userService = new UserService(AppDataSource);

export class AuthService {

    constructor(private readonly db: DataSource) {
    }

    async login(userRequest: LoginRequest): Promise<{ user: User; token: string }> {
        const user = await userService.getUserByEmail(userRequest.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await this.checkPassword(userRequest.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        const token = this.generateToken(user);
        return {user, token};
    }

    async changePassword(request: ChangePasswordRequest): Promise<User> {
        const user = await userService.getUserById(request.userId);
        const checkPassword = await this.checkPassword(request.currentPassword, user.password);

        if (!checkPassword) {
            throw new Error("Invalid Password");
        }

        user.password = await this.hashPassword(request.newPassword);
        return await this.db.manager.save(User, user);
    }

    async lostPassword(request: LostPasswordRequest): Promise<void> {
        const user = await userService.getUserByEmail(request.email);
        const newPassword = await this.generateRandomPassword(12);
        user.password = await this.hashPassword(newPassword);
        await this.db.manager.save(User, user);
        // await mailService.sendLostPasswordMail(newPassword, user.email);
    }

    private async checkPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private generateToken(user: User): string {
        const payload = {id: user.id, username: user.username};
        return jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "1h"});
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    private async generateRandomPassword(length: number): Promise<string> {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array.from({length}, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    }
}
