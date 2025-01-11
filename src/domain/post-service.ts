import {DataSource} from "typeorm";
import {Post} from "../database/entities/post";
import {UserService} from "./user-service";
import {AppDataSource} from "../database/database";
import {CreatePostRequest} from "../handler/validator/post-validator";
import {User} from "../database/entities/user";

const userService = new UserService(AppDataSource);

export class PostService {
    constructor(private readonly db: DataSource) {
    }

    async createPost(request: CreatePostRequest): Promise<Post> {
        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const author = await userService.getUserById(request.userId);

            const post = new Post();
            post.author = author;
            post.content = request.content;
            post.deleted = false;

            if (request.parentId) {
                const parentPost = await this.getPostById(request.parentId, queryRunner.manager);
                parentPost.comments.push(post);
                await queryRunner.manager.save(Post, parentPost);
            }

            await queryRunner.manager.save(Post, post);
            await queryRunner.commitTransaction();
            return post;
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create post: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getAllPosts(): Promise<Post[]> {
        return this.db.manager.find(Post, {
            where: {
                deleted: false
            },
            relations: ["author", "comments", "parentPost", "userHaveLiked"],
            order: {
                createdAt: "DESC"
            },
        });
    }

    async deletePost(postId: number): Promise<void> {
        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const post = await this.getPostById(postId, queryRunner.manager);
            post.deleted = true;

            await queryRunner.manager.save(Post, post);
            await queryRunner.commitTransaction();
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to delete post: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getPostById(postId: number, manager = this.db.manager): Promise<Post> {
        const post = await manager.findOne(Post, {
            where: {id: postId},
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
    }

    async likePost(userId: number, postId: number): Promise<void> {
        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const post = await queryRunner.manager.findOne(Post, {
                where: {id: postId},
                relations: ['userHaveLiked'],
            });
            const user = await queryRunner.manager.findOne(User, {where: {id: userId}});

            if (!user || !post) {
                throw new Error("Invalid user or post");
            }

            const userIndex = post.userHaveLiked.findIndex(u => u.id === user.id);

            if (userIndex >= 0) {
                post.userHaveLiked.splice(userIndex, 1);
            } else {
                post.userHaveLiked.push(user);
            }

            await queryRunner.manager.save(Post, post);
            await queryRunner.commitTransaction();
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to like/unlike post: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getComments(postId: number): Promise<Post[]> {
        return this.db.manager.find(Post, {
            where: {
                parentPost: {id: postId}
            },
            relations: ["author", "comments", "parentPost", "userHaveLiked"],
            order: {
                createdAt: "DESC"
            },
        });
    }

}