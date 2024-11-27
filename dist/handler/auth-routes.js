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
exports.authRoutes = void 0;
const auth_service_1 = require("../domain/auth-service");
const database_1 = require("../database/database");
const authenticate_1 = require("../middleware/authenticate");
const authService = new auth_service_1.AuthService(database_1.AppDataSource);
const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details });
    }
    next();
};
const authRoutes = (app) => {
    app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, token } = yield authService.login(req.body);
            res.status(200).json({ user, token });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/change-password', authenticate_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield authService.changePassword(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/lost-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield authService.lostPassword(req.body);
            res.status(200).json({ message: "Password reset email sent" });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.authRoutes = authRoutes;
