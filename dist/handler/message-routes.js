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
exports.messageRoutes = void 0;
const database_1 = require("../database/database");
const message_service_1 = require("../domain/message-service");
const message_validator_1 = require("./validator/message-validator");
const messageService = new message_service_1.MessageService(database_1.AppDataSource);
const messageRoutes = (app) => {
    app.get('/messages/conversation/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messagesConversationValidate = message_validator_1.messagesConversationValidation.validate(req.params);
            if (!messagesConversationValidate) {
                return;
            }
            const conversationId = parseInt(req.params.id);
            const result = yield messageService.getMessagesInConversation(conversationId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const idMessageValidate = message_validator_1.idMessageValidation.validate(req.params);
            if (!message_validator_1.idMessageValidation) {
                return;
            }
            const result = yield messageService.getMessageById(idMessageValidate.value.id);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const createMessageValidate = message_validator_1.createMessageValidation.validate(req.body);
            if (!createMessageValidate) {
                return;
            }
            const result = yield messageService.sendMessage(createMessageValidate.value.conversationId, createMessageValidate.value.userId, createMessageValidate.value.content);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.put('/messages/seenBy/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const createMessageValidate = message_validator_1.validateMessageSeen.validate(req.body);
            const messageId = parseInt(req.params.id, 10);
            if (!createMessageValidate) {
                return;
            }
            const result = yield messageService.seenMessageById(createMessageValidate.value.userId, messageId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.delete('/messages/seenBy/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { value, error } = message_validator_1.validateMessageSeen.validate(req.body);
            const messageId = parseInt(req.params.id, 10);
            const userId = value.userId;
            const result = yield messageService.deleteMessageSeenByIdMessage(userId, messageId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.delete('/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { value, error } = message_validator_1.idMessageValidation.validate(req.params.id);
            const messageId = parseInt(value, 10);
            yield messageService.deleteMessageById(messageId);
            res.status(200).json();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.messageRoutes = messageRoutes;
