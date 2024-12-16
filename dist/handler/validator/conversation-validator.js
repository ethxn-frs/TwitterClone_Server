"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idConversationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.idConversationValidation = joi_1.default.object({
    conversationId: joi_1.default.number().required(),
});
