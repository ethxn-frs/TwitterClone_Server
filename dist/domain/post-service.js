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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const typeorm_1 = require("typeorm");
const post_1 = require("../database/entities/post");
const user_service_1 = require("./user-service");
const database_1 = require("../database/database");
const user_1 = require("../database/entities/user");
const userService = new user_service_1.UserService(database_1.AppDataSource);
class PostService {
    constructor(db) {
        this.db = db;
    }
    createPost(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const author = yield userService.getUserById(request.userId);
                const post = new post_1.Post();
                post.author = author;
                post.content = request.content;
                post.deleted = false;
                if (request.parentId) {
                    const parentPost = yield this.getPostById(request.parentId, queryRunner.manager);
                    parentPost.comments.push(post);
                    yield queryRunner.manager.save(post_1.Post, parentPost);
                }
                yield queryRunner.manager.save(post_1.Post, post);
                yield queryRunner.commitTransaction();
                return post;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to create post: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.manager.find(post_1.Post, {
                where: {
                    deleted: false
                },
                relations: ["author", "comments", "parentPost", "userHaveLiked"],
                order: {
                    createdAt: "DESC"
                },
            });
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const post = yield this.getPostById(postId, queryRunner.manager);
                post.deleted = true;
                yield queryRunner.manager.save(post_1.Post, post);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to delete post: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    getPostById(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, manager = this.db.manager) {
            const post = yield manager.findOne(post_1.Post, {
                where: { id: postId },
                relations: [
                    "comments",
                    "author",
                    "parentPost",
                    "userHaveLiked",
                    "comments.author",
                    "comments.userHaveLiked",
                    "comments.comments"
                ],
                order: {
                    comments: {
                        createdAt: "DESC"
                    }
                }
            });
            if (!post) {
                throw new Error("Invalid post");
            }
            return post;
        });
    }
    likePost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const post = yield queryRunner.manager.findOne(post_1.Post, {
                    where: { id: postId },
                    relations: ['userHaveLiked'],
                });
                const user = yield queryRunner.manager.findOne(user_1.User, { where: { id: userId } });
                if (!user || !post) {
                    throw new Error("Invalid user or post");
                }
                const userIndex = post.userHaveLiked.findIndex(u => u.id === user.id);
                if (userIndex >= 0) {
                    post.userHaveLiked.splice(userIndex, 1);
                }
                else {
                    post.userHaveLiked.push(user);
                }
                yield queryRunner.manager.save(post_1.Post, post);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to like/unlike post: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    getComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.manager.find(post_1.Post, {
                where: {
                    parentPost: { id: postId }
                },
                relations: ["author", "comments", "parentPost", "userHaveLiked"],
                order: {
                    createdAt: "DESC"
                },
            });
        });
    }
    searchPostsByContent(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.manager.find(post_1.Post, {
                where: {
                    content: (0, typeorm_1.ILike)(`%${query}%`),
                    deleted: false,
                },
                relations: ["author", "comments", "userHaveLiked"],
                order: {
                    createdAt: "DESC",
                },
            });
        });
    }
}
exports.PostService = PostService;
