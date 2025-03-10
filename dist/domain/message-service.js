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
exports.MessageService = void 0;
const message_1 = require("../database/entities/message");
const user_1 = require("../database/entities/user");
const conversation_1 = require("../database/entities/conversation");
const user_service_1 = require("./user-service");
const database_1 = require("../database/database");
const userService = new user_service_1.UserService(database_1.AppDataSource);
class MessageService {
    constructor(db) {
        this.db = db;
    }
    sendMessage(conversationId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const conversation = yield this.db.manager.findOne(conversation_1.Conversation, {
                where: { id: conversationId },
                relations: ["users"]
            });
            const author = yield this.db.manager.findOne(user_1.User, { where: { id: userId } });
            if (!conversation || !author) {
                throw new Error("Conversation or user not found.");
            }
            if (!conversation.users.some(user => user.id === author.id)) {
                throw new Error("User is not a member of this conversation.");
            }
            const message = new message_1.Message();
            message.author = author;
            message.content = content;
            message.sentAt = new Date();
            message.conversation = conversation;
            return yield this.db.manager.save(message);
        });
    }
    getMessagesInConversation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.manager.find(message_1.Message, {
                where: { conversation: { id: conversationId } },
                relations: ["author"],
                order: { sentAt: "ASC" }
            });
        });
    }
    deleteMessage(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.db.manager.findOne(message_1.Message, { where: { id: messageId }, relations: ["author"] });
            if (!message) {
                throw new Error("Message not found.");
            }
            if (message.author.id !== userId) {
                throw new Error("You can only delete your own messages.");
            }
            yield this.db.manager.remove(message);
        });
    }
    getMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.db.manager.findOne(message_1.Message, {
                where: { id: messageId },
                relations: ["author", "conversation"]
            });
            if (!message)
                throw new Error("Message not found.");
            return message;
        });
    }
    seenMessageById(userId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = this.db.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            const message = yield this.db.manager.findOne(message_1.Message, {
                where: { id: messageId },
                relations: ["author", "conversation", "seenBy"]
            });
            const user = yield userService.getUserById(userId);
            if (!user || !message) {
                throw new Error("User or message not found");
            }
            try {
                message.seenBy.push(user);
                yield queryRunner.manager.save(message_1.Message, message);
                yield queryRunner.commitTransaction();
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                throw new Error(`Failed to save message: ${error.message}`);
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
}
exports.MessageService = MessageService;
