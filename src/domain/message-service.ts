import {DataSource} from "typeorm";
import {Message} from "../database/entities/message";
import {User} from "../database/entities/user";
import {Conversation} from "../database/entities/conversation";

export class MessageService {
    constructor(private readonly db: DataSource) {
    }

    async sendMessage(conversationId: number, userId: number, content: string): Promise<Message> {
        const conversation = await this.db.manager.findOne(Conversation, {
            where: {id: conversationId},
            relations: ["users"]
        });
        const author = await this.db.manager.findOne(User, {where: {id: userId}});

        if (!conversation || !author) {
            throw new Error("Conversation or user not found.");
        }

        if (!conversation.users.some(user => user.id === author.id)) {
            throw new Error("User is not a member of this conversation.");
        }

        const message = new Message();
        message.author = author;
        message.content = content;
        message.sentAt = new Date();
        message.conversation = conversation;

        return await this.db.manager.save(message);
    }

    async getMessagesInConversation(conversationId: number): Promise<Message[]> {
        return await this.db.manager.find(Message, {
            where: {conversation: {id: conversationId}},
            relations: ["author"],
            order: {sentAt: "ASC"}
        });
    }

    async deleteMessage(messageId: number, userId: number): Promise<void> {
        const message = await this.db.manager.findOne(Message, {where: {id: messageId}, relations: ["author"]});

        if (!message) {
            throw new Error("Message not found.");
        }

        if (message.author.id !== userId) {
            throw new Error("You can only delete your own messages.");
        }

        await this.db.manager.remove(message);
    }
}
