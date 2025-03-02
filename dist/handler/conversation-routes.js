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
const conversation_validator_1 = require("./validator/conversation-validator");
const conversationService = new conversation_service_1.ConversationService(database_1.AppDataSource);
const conversationRoutes = (app) => {
    app.post('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { participantIds, creatorId } = req.body;
        try {
            const conversation = yield conversationService.createConversation(creatorId, participantIds);
            res.status(201).json(conversation);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/conversations/user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            console.log(userId);
            const result = yield conversationService.getUserConversations(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/conversations/:conversationId/add-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    app.post('/conversations/:conversationId/remove-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    app.get('/conversations/:conversationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversationIdValidate = conversation_validator_1.idConversationValidation.validate(req.params);
            const conversation = yield conversationService.getConversationById(conversationIdValidate.value.conversationId);
            res.status(200).json(conversation);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        try {
            const conversations = yield conversationService.getAllTheConversations();
            res.status(200).json(conversations);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.delete('/conversations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield conversationService.deleteAllConversations();
            res.status(200).json({ message: "Toutes les conversations sont supprimées." });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.delete('/conversations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { value, error } = conversation_validator_1.idConversationValidation.validate(req.params.id);
            const conversationId = parseInt(value, 10);
            yield conversationService.deleteConversationById(conversationId);
            res.status(200).json();
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.conversationRoutes = conversationRoutes;
