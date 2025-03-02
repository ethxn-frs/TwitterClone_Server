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
exports.ConversationService = void 0;
const conversation_1 = require("../database/entities/conversation");
const user_1 = require("../database/entities/user");
const user_service_1 = require("./user-service");
const database_1 = require("../database/database");
const userService = new user_service_1.UserService(database_1.AppDataSource);
class ConversationService {
    constructor(db) {
        this.db = db;
    }
    deleteAllConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.manager.delete(conversation_1.Conversation, {});
        });
    }
    deleteConversationById(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.manager.delete(conversation_1.Conversation, { id: conversationId });
        });
    }
    createConversation(creatorId, participantIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const creator = yield userService.getUserById(creatorId);
            const participants = yield userService.getUsersByIds(participantIds);
            if (!creator || participants.length === 0) {
                throw new Error("Invalid creator or participants.");
            }
            for (const participant of participants) {
                participant.followers.forEach(user => console.log("abonnements : " + user.id));
                participant.following.forEach(user => console.log("abonnés : " + user.id));
            }
            for (const participant of participants) {
                const followsCreator = participant.following.some(user => user.id === creatorId);
                const followedByCreator = creator.following.some(user => user.id === participant.id);
                if (!followsCreator || !followedByCreator) {
                    throw new Error(`Mutual following is required between creator and ${participant.username}`);
                }
            }
            const conversation = new conversation_1.Conversation();
            conversation.name = Date.now.toString();
            conversation.users = [creator, ...participants];
            conversation.createdAt = new Date();
            return yield this.db.manager.save(conversation);
        });
    }
    addUserToConversation(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.db.manager.findOne(conversation_1.Conversation, {
                where: { id: conversationId },
                relations: ["users"]
            });
            const user = yield this.db.manager.findOne(user_1.User, { where: { id: userId } });
            if (!conversation || !user) {
                throw new Error("Conversation or user not found.");
            }
            if (!conversation.users.some(u => u.id === user.id)) {
                conversation.users.push(user);
                yield this.db.manager.save(conversation);
            }
        });
    }
    removeUserFromConversation(conversationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.db.manager.findOne(conversation_1.Conversation, {
                where: { id: conversationId },
                relations: ["users"]
            });
            if (!conversation) {
                throw new Error("Conversation not found.");
            }
            conversation.users = conversation.users.filter(u => u.id !== userId);
            yield this.db.manager.save(conversation);
        });
    }
    getUserConversations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager
                .createQueryBuilder(conversation_1.Conversation, "conversation")
                .leftJoinAndSelect("conversation.users", "user")
                .leftJoinAndSelect("conversation.messages", "message")
                .leftJoinAndSelect("messages.seenBy", "user")
                .where("user.id = :userId", { userId })
                .getMany();
        });
    }
    getAllTheConversations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager
                .createQueryBuilder(conversation_1.Conversation, "conversation")
                .leftJoinAndSelect("conversation.users", "user")
                .leftJoinAndSelect("conversation.messages", "message")
                .getMany();
        });
    }
    getConversationById(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.db.manager.findOne(conversation_1.Conversation, {
                where: { id: conversationId },
                relations: ["users", "messages"]
            });
            if (!conversation) {
                throw new Error("Conversation not found.");
            }
            return conversation;
        });
    }
}
exports.ConversationService = ConversationService;
