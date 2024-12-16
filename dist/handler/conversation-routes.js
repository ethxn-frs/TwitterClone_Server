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
exports.conversationRoutes = void 0;
const database_1 = require("../database/database");
const conversation_service_1 = require("../domain/conversation-service");
const authenticate_1 = require("../middleware/authenticate");
const conversation_validator_1 = require("./validator/conversation-validator");
const conversationService = new conversation_service_1.ConversationService(database_1.AppDataSource);
const conversationRoutes = (app) => {
    app.post('/conversations', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, participantIds } = req.body;
        //@ts-ignore
        const creatorId = req.user.id; // ID de l'utilisateur authentifié
        try {
            const conversation = yield conversationService.createConversation(name, creatorId, participantIds);
            res.status(201).json(conversation);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/conversations/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = yield conversationService.getUserConversations(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/conversations/:conversationId/add-user', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId } = req.params;
        const { userId } = req.body;
        try {
            yield conversationService.addUserToConversation(Number(conversationId), userId);
            res.status(200).json({ message: "User added to conversation" });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/conversations/:conversationId/remove-user', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId } = req.params;
        const { userId } = req.body;
        try {
            yield conversationService.removeUserFromConversation(Number(conversationId), userId);
            res.status(200).json({ message: "User removed from conversation" });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/conversations', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const userId = req.user.id;
        try {
            const conversations = yield conversationService.getUserConversations(userId);
            res.status(200).json(conversations);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/conversations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversationIdValidate = conversation_validator_1.idConversationValidation.validate(req.params);
            const conversation = yield conversationService.getConversationById(conversationIdValidate.value.conversationId);
            res.status(200).json(conversation);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.conversationRoutes = conversationRoutes;
