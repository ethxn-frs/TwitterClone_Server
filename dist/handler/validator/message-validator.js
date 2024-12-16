"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesConversationValidation = exports.createMessageValidation = exports.idMessageValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.idMessageValidation = joi_1.default.object({
    messageId: joi_1.default.number().required(),
});
exports.createMessageValidation = joi_1.default.object({
    conversationId: joi_1.default.number().required(),
    userId: joi_1.default.number().required(),
    content: joi_1.default.string().required(),
});
exports.messagesConversationValidation = joi_1.default.object({
    conversationId: joi_1.default.number().required(),
});
