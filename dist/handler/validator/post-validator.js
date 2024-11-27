"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePostValidation = exports.idPostValidation = exports.deletePostValidation = exports.createPostValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createPostValidation = joi_1.default.object({
    userId: joi_1.default.number().required(),
    content: joi_1.default.string().min(1).max(200).required(),
    parentId: joi_1.default.number().optional(),
});
exports.deletePostValidation = joi_1.default.object({
    postId: joi_1.default.number().required(),
});
exports.idPostValidation = joi_1.default.object({
    postId: joi_1.default.number().required(),
});
exports.likePostValidation = joi_1.default.object({
    postId: joi_1.default.number().required(),
});
