import {DataSource} from "typeorm";
import {Conversation} from "../database/entities/conversation";
import {User} from "../database/entities/user";
import {UserService} from "./user-service";
import {AppDataSource} from "../database/database";

const userService = new UserService(AppDataSource);

export class ConversationService {
    
    constructor(private readonly db: DataSource) {
    }

    async deleteAllConversations(): Promise<void>{
        await this.db.manager.delete(Conversation, {});
    }

    async deleteConversationById(conversationId: number): Promise<void> {
        await this.db.manager.delete(Conversation, { id: conversationId } );
    }

    async createConversation(creatorId: number, participantIds: number[]): Promise<Conversation> {

        const creator = await userService.getUserById(creatorId);
        const participants = await userService.getUsersByIds(participantIds);

        if (!creator || participants.length === 0) {
            throw new Error("Invalid creator or participants.");
        }

        for (const participant of participants) {
            participant.followers.forEach(user => console.log("abonnements : " + user.id));
            participant.following.forEach(user => console.log("abonnés : " +user.id));
        }

        for (const participant of participants) {
            const followsCreator = participant.following.some(user => user.id === creatorId);
            const followedByCreator = creator.following.some(user => user.id === participant.id);

            if (!followsCreator || !followedByCreator) {
                throw new Error(`Mutual following is required between creator and ${participant.username}`);
            }
        }

        const conversation = new Conversation();
        conversation.name = Date.now.toString();
        conversation.users = [creator, ...participants];
        conversation.createdAt = new Date();

        return await this.db.manager.save(conversation);
    }

    async addUserToConversation(conversationId: number, userId: number): Promise<void> {
        const conversation = await this.db.manager.findOne(Conversation, {
            where: {id: conversationId},
            relations: ["users"]
        });
        const user = await this.db.manager.findOne(User, {where: {id: userId}});

        if (!conversation || !user) {
            throw new Error("Conversation or user not found.");
        }

        if (!conversation.users.some(u => u.id === user.id)) {
            conversation.users.push(user);
            await this.db.manager.save(conversation);
        }
    }



    async removeUserFromConversation(conversationId: number, userId: number): Promise<void> {
        const conversation = await this.db.manager.findOne(Conversation, {
            where: {id: conversationId},
            relations: ["users"]
        });

        if (!conversation) {
            throw new Error("Conversation not found.");
        }

        conversation.users = conversation.users.filter(u => u.id !== userId);
        await this.db.manager.save(conversation);
    }

    async getUserConversations(userId: number): Promise<Conversation[]> {
        return await this.db.manager
            .createQueryBuilder(Conversation, "conversation")
            .leftJoinAndSelect("conversation.users", "conversationUser") 
            .leftJoinAndSelect("conversation.messages", "message")
            .leftJoinAndSelect("message.seenBy", "seenUser") 
            .where("conversationUser.id = :userId", { userId }) 
            .getMany();
    }

    async getAllTheConversations(): Promise<Conversation[]> {
        return await this.db.manager
            .createQueryBuilder(Conversation, "conversation")
            .leftJoinAndSelect("conversation.users", "user")
            .leftJoinAndSelect("conversation.messages", "message")
            .getMany();
    }

    async getConversationById(conversationId: number): Promise<Conversation> {
        const conversation = await this.db.manager.findOne(Conversation, {
            where: {id: conversationId},
            relations: ["users", "messages"]
        })
        if (!conversation) {
            throw new Error("Conversation not found.");
        }
        return conversation;
    }
}
