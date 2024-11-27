"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const database_1 = require("../database/database");
const message_service_1 = require("../domain/message-service");
const messageService = new message_service_1.MessageService(database_1.AppDataSource);
const messageRoutes = (app) => {
};
exports.messageRoutes = messageRoutes;
