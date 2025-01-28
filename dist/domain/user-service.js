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
exports.UserService = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../database/entities/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
class UserService {
    constructor(db) {
        this.db = db;
    }
    signUp(userRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.existingUser(userRequest.username, userRequest.email)) {
                throw new Error("Username or email already exists.");
            }
            const user = this.db.manager.create(user_1.User, {
                username: userRequest.username,
                firstName: userRequest.firstname,
                lastName: userRequest.lastname,
                phoneNumber: userRequest.phoneNumber,
                email: userRequest.email,
                password: yield this.hashPassword(userRequest.password),
                birthDate: userRequest.birthDate,
                createdAt: new Date(),
                updatedAt: null,
                followers: [],
                following: [],
                posts: [],
                likedPosts: [],
                retweetedPosts: [],
                conversations: [],
                messages: [],
            });
            return yield this.db.manager.save(user);
        });
    }
    existingUser(username, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.manager.findOne(user_1.User, {
                where: [
                    { username: username },
                    { email: email }
                ],
            });
            return result != null;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.db.manager.findOne(user_1.User, {
                where: { id: userId },
                relations: ['followers', 'following', 'messages', 'posts']
            });
            if (!user)
                throw new Error("User not found");
            return user;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager.findAndCount(user_1.User);
        });
    }
    getUserFollower(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            return user.followers;
        });
    }
    getUserFollowing(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            return user.following;
        });
    }
    getUserMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            return user.messages;
        });
    }
    getUsersByIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.db.manager.find(user_1.User, {
                where: { id: (0, typeorm_1.In)(userIds) },
                relations: { followers: true, following: true }
            });
            // Vérifie si tous les utilisateurs spécifiés ont été trouvés
            if (users.length !== userIds.length) {
                const foundIds = users.map(user => user.id);
                const missingIds = userIds.filter(id => !foundIds.includes(id));
                throw new Error(`Users not found for IDs: ${missingIds.join(", ")}`);
            }
            return users;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager.findOne(user_1.User, {
                where: { email: username },
            });
        });
    }
    searchUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager
                .createQueryBuilder(user_1.User, 'user')
                .where('user.username LIKE :username', { username: `%${username}%` })
                .getMany();
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.db.manager.findOne(user_1.User, { where: { email } });
            if (!user)
                throw new Error("User not found");
            return user;
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        });
    }
    followUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followerId === followeeId) {
                throw new Error("Users cannot follow themselves.");
            }
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const follower = yield this.getUserById(followerId);
                const followee = yield this.getUserById(followeeId);
                if (!follower || !followee) {
                    throw new Error("One or both users not found.");
                }
                // Vérifie si le follower suit déjà le followee
                if (follower.following.some((user) => user.id === followeeId)) {
                    throw new Error("User is already following this followee.");
                }
                // Ajoute le followee dans le tableau des "following"
                follower.following.push(followee);
                // Sauvegarde uniquement le follower, TypeORM synchronisera l'autre côté
                yield queryRunner.manager.save(user_1.User, follower);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to follow user: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    unfollowUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (followerId === followeeId) {
                throw new Error("Users cannot unfollow themselves.");
            }
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const follower = yield this.getUserById(followerId);
                const followee = yield this.getUserById(followeeId);
                if (!follower || !followee) {
                    throw new Error("One or both users not found.");
                }
                // Vérifie si le follower suit déjà le followee
                if (!follower.following.some((user) => user.id === followeeId)) {
                    throw new Error("User is not following this followee.");
                }
                // Retire le followee du tableau "following"
                follower.following = follower.following.filter((user) => user.id !== followeeId);
                // Sauvegarde uniquement le follower, TypeORM synchronisera l'autre côté
                yield queryRunner.manager.save(user_1.User, follower);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to unfollow user: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
}
exports.UserService = UserService;
