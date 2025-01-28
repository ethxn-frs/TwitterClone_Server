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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
require("dotenv/config");
const database_1 = require("./database/database");
const auth_routes_1 = require("./handler/auth-routes");
const conversation_routes_1 = require("./handler/conversation-routes");
const message_routes_1 = require("./handler/message-routes");
const post_routes_1 = require("./handler/post-routes");
const user_routes_1 = require("./handler/user-routes");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const port = parseInt(process.env.PORT || '3030', 10);
    try {
        yield database_1.AppDataSource.initialize();
        console.log("Well connected to database");
        yield database_1.AppDataSource.synchronize();
        console.log("Synchronized");
    }
    catch (error) {
        console.error("Cannot contact database", error);
        process.exit(1);
    }
    app.use((0, cors_1.default)({
        origin: '*'
    }));
    app.use(express_1.default.json());
    try {
        (0, auth_routes_1.authRoutes)(app);
        (0, conversation_routes_1.conversationRoutes)(app);
        (0, message_routes_1.messageRoutes)(app);
        (0, post_routes_1.postRoutes)(app);
        (0, user_routes_1.userRoutes)(app);
        console.log("Routes are set up successfully");
    }
    catch (error) {
        console.error("Error setting up routes:", error);
        process.exit(1);
    }
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
    });
});
main().catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1);
});
