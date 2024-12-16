"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameSearchValidation = exports.UnfollowRequestValidation = exports.FollowRequestValidation = exports.lostPasswordValidation = exports.createUserValidation = exports.changePasswordValidation = exports.loginValidation = exports.idUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.idUserValidation = joi_1.default.object({
    userId: joi_1.default.number().required()
});
exports.loginValidation = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.changePasswordValidation = joi_1.default.object({
    userId: joi_1.default.number().required(),
    currentPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().required(),
});
exports.createUserValidation = joi_1.default.object({
    firstname: joi_1.default.string().min(3).required(),
    lastname: joi_1.default.string().min(3).required(),
    username: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().min(10).max(10).required(),
    password: joi_1.default.string().required(),
    birthDate: joi_1.default.date().required()
});
exports.lostPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.FollowRequestValidation = joi_1.default.object({
    followerId: joi_1.default.number().required(),
    followeeId: joi_1.default.number().required(),
});
exports.UnfollowRequestValidation = joi_1.default.object({
    followerId: joi_1.default.number().required(),
    followeeId: joi_1.default.number().required(),
});
exports.UsernameSearchValidation = joi_1.default.object({
    username: joi_1.default.string().min(1).max(20).required()
});
