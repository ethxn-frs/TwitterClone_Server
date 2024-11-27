"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = require("../database/entities/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("./user-service");
const database_1 = require("../database/database");
const SALT_ROUNDS = 10;
const userService = new user_service_1.UserService(database_1.AppDataSource);
class AuthService {
    constructor(db) {
        this.db = db;
    }
    login(userRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userService.getUserByUsername(userRequest.username);
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isPasswordValid = yield this.checkPassword(userRequest.password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }
            const token = this.generateToken(user);
            return { user, token };
        });
    }
    changePassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userService.getUserById(request.userId);
            const checkPassword = yield this.checkPassword(request.currentPassword, user.password);
            if (!checkPassword) {
                throw new Error("Invalid Password");
            }
            user.password = yield this.hashPassword(request.newPassword);
            return yield this.db.manager.save(user_1.User, user);
        });
    }
    lostPassword(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userService.getUserByEmail(request.email);
            const newPassword = yield this.generateRandomPassword(12);
            user.password = yield this.hashPassword(newPassword);
            yield this.db.manager.save(user_1.User, user);
            // await mailService.sendLostPasswordMail(newPassword, user.email);
        });
    }
    checkPassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hashedPassword);
        });
    }
    generateToken(user) {
        const payload = { id: user.id, username: user.username };
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        });
    }
    generateRandomPassword(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
        });
    }
}
exports.AuthService = AuthService;
