import {DataSource, ILike, In, IsNull, Not} from "typeorm";
import {User} from "../database/entities/user";
import {CreateUserRequest} from "../handler/validator/user-validator";
import bcrypt from "bcrypt";
import {Message} from "../database/entities/message";
import {Post} from "../database/entities/post";

const SALT_ROUNDS = 10;

export class UserService {
    constructor(private readonly db: DataSource) {
    }

    async signUp(userRequest: CreateUserRequest): Promise<User> {

        if (await this.existingUser(userRequest.username, userRequest.email)) {
            throw new Error("Username or email already exists.");
        }
        const user = this.db.manager.create(User, {
            username: userRequest.username,
            firstName: userRequest.firstname,
            lastName: userRequest.lastname,
            phoneNumber: userRequest.phoneNumber,
            email: userRequest.email,
            password: await this.hashPassword(userRequest.password),
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
        return await this.db.manager.save(user);
    }

    async existingUser(username: string, email: string): Promise<boolean> {
        const result = await this.db.manager.findOne(User, {
            where: [
                {username: username},
                {email: email}
            ],
        });
        return result != null;
    }

    async updateUserPatch(userId: number, updates: { [key: string]: string }): Promise<void> {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("Utilisateur non trouvé.");
        }

        Object.keys(updates).forEach((field) => {
            if (["firstName", "lastName", "bio", "location", "website", "birthDate"].includes(field)) {
                (user as any)[field] = updates[field];
            }
        });

        await this.db.manager.save(user);
    }

    async getUserById(userId: number): Promise<User> {
        const user = await this.db.manager.findOne(User, {
            where: {id: userId},
            relations: ['followers', 'following', 'messages', 'posts']
        })
        if (!user) throw new Error("User not found");
        return user;
    }

    async getAllUsers(): Promise<[user: User[], count: number]> {
        return await this.db.manager.findAndCount(User);
    }

    async getUserFollower(userId: number): Promise<User[]> {
        const user = await this.getUserById(userId);
        return user.followers;
    }

    async getUserFollowersAndFollowingCount(userId: number): Promise<[followers: number, following: number]> {
        try {
            const user = await this.db.manager.findOne(User, {
                where: {id: userId},
                relations: ["followers", "following"]
            });

            if (!user) {
                throw new Error("Utilisateur introuvable.");
            }

            const followersCount = user.followers.length;
            const followingCount = user.following.length;

            return [followersCount, followingCount];
        } catch (error) {
            console.error("Erreur lors de la récupération des followers/following:", error);
            throw new Error("Impossible de récupérer les informations de followers/following.");
        }
    }

    async getUserFollowing(userId: number): Promise<User[]> {
        const user = await this.getUserById(userId);
        return user.following;
    }

    async getUserMessages(userId: number): Promise<Message[]> {
        const user = await this.getUserById(userId);
        return user.messages;
    }

    async getUsersByIds(userIds: number[]): Promise<User[]> {
        const users = await this.db.manager.find(User, {
            where: {id: In(userIds)},
            relations: {followers: true, following: true}
        });

        // Vérifie si tous les utilisateurs spécifiés ont été trouvés
        if (users.length !== userIds.length) {
            const foundIds = users.map(user => user.id);
            const missingIds = userIds.filter(id => !foundIds.includes(id));
            throw new Error(`Users not found for IDs: ${missingIds.join(", ")}`);
        }

        return users;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.db.manager.findOne(User, {
            where: {email: username},
        })
    }

    async searchUserByUsername(username: string): Promise<User[] | null> {
        return await this.db.manager
            .createQueryBuilder(User, 'user')
            .where('user.username LIKE :username', {username: `%${username}%`})
            .getMany();
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.db.manager.findOne(User, {where: {email}});
        if (!user) throw new Error("User not found");
        return user;
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    async followUser(followerId: number, followeeId: number): Promise<void> {
        if (followerId === followeeId) {
            throw new Error("Users cannot follow themselves.");
        }

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const follower = await this.getUserById(followerId);
            const followee = await this.getUserById(followeeId);

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
            await queryRunner.manager.save(User, follower);

            await queryRunner.commitTransaction();
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to follow user: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async unfollowUser(followerId: number, followeeId: number): Promise<void> {
        if (followerId === followeeId) {
            throw new Error("Users cannot unfollow themselves.");
        }

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const follower = await this.getUserById(followerId);
            const followee = await this.getUserById(followeeId);

            if (!follower || !followee) {
                throw new Error("One or both users not found.");
            }

            // Vérifie si le follower suit déjà le followee
            if (!follower.following.some((user) => user.id === followeeId)) {
                throw new Error("User is not following this followee.");
            }

            // Retire le followee du tableau "following"
            follower.following = follower.following.filter(
                (user) => user.id !== followeeId
            );

            // Sauvegarde uniquement le follower, TypeORM synchronisera l'autre côté
            await queryRunner.manager.save(User, follower);

            await queryRunner.commitTransaction();
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to unfollow user: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async searchUsersByContent(query: string): Promise<User[]> {
        return this.db.manager.find(User, {
            where: [
                {username: ILike(`%${query}%`)},
                {firstName: ILike(`%${query}%`)},
                {lastName: ILike(`%${query}%`)},
            ],
            relations: ["followers", "following", "posts"],
            order: {
                createdAt: "DESC",
            },
        });
    }

    async getUserPosts(userId: number): Promise<Post[]> {
        try {
            return await this.db.manager.find(Post, {
                where: {author: {id: userId}, deleted: false},
                order: {createdAt: "DESC"},
                relations: ["author", "comments", "userHaveLiked"],
            }) || [];
        } catch (error) {
            console.error("Error fetching user posts:", error);
            return [];
        }
    }

    async getUserComments(userId: number): Promise<Post[]> {
        try {
            return await this.db.manager.find(Post, {
                where: {author: {id: userId}, parentPost: Not(IsNull()), deleted: false},
                order: {createdAt: "DESC"},
                relations: ["author", "parentPost", "userHaveLiked", "comments"],
            }) || [];
        } catch (error) {
            console.error("Error fetching user comments:", error);
            return [];
        }
    }

    async getUserLikedPosts(userId: number): Promise<Post[]> {
        try {
            return await this.db.manager
                .createQueryBuilder(Post, "post")
                .leftJoinAndSelect("post.userHaveLiked", "user")
                .leftJoinAndSelect("post.author", "author")
                .leftJoinAndSelect("post.comments", "comments ")
                .where("user.id = :userId", {userId})
                .orderBy("post.createdAt", "DESC")
                .getMany() || [];
        } catch (error) {
            console.error("Error fetching liked posts:", error);
            return [];
        }
    }

    async isFollowing(followerId: number, followeeId: number): Promise<boolean> {
        const follower = await this.db.manager.findOne(User, {
            where: {id: followerId},
            relations: ["following"]
        });

        if (!follower) {
            throw new Error("Utilisateur non trouvé");
        }

        return follower.following.some(user => user.id === followeeId);
    }



    async deleteCoverOrPP(type: string, userId: number): Promise<void> {
        try {
            let user = await this.getUserById(userId);

            if (!user) {
                throw new Error("User not found.");
            }

            if (type == "cover") {
                user.coverPictureUrl = undefined
            } else if (type == "pp") {
                user.profilePictureUrl = undefined
            }
            await this.db.manager.save(user);
        } catch (error) {
            console.error("Error fetching liked posts:", error);
        }
    }

    async updateCoverOrPP(type: string, uploadResult: string, userId: number): Promise<void> {
        try {
            let user = await this.getUserById(userId);

            if (!user) {
                throw new Error("User not found.");
            }

            if (type == "cover") {
                user.coverPictureUrl = "https://pub-8528a192ee0f4215a701df6f312a96a8.r2.dev/" + uploadResult;
            } else if (type == "pp") {
                user.profilePictureUrl = "https://pub-8528a192ee0f4215a701df6f312a96a8.r2.dev/" + uploadResult;
            }
            await this.db.manager.save(user);
        } catch (error) {
            console.error("Error fetching liked posts:", error);
        }
    }
}
