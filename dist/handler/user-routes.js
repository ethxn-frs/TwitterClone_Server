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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_validator_1 = require("./validator/user-validator");
const database_1 = require("../database/database");
const user_service_1 = require("../domain/user-service");
const userService = new user_service_1.UserService(database_1.AppDataSource);
const userRoutes = (app) => {
    app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userRequestValidation = user_validator_1.createUserValidation.validate(req.body);
            const newUser = yield userService.signUp(userRequestValidation.value);
            const { password } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
            res.status(201).json(userWithoutPassword);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.put('/follow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const followValidation = user_validator_1.FollowRequestValidation.validate(req.body);
            if (!followValidation) {
                return;
            }
            const result = yield userService.followUser(followValidation.value.followerId, followValidation.value.followeeId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.put('/unfollow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const unfollowValidation = user_validator_1.UnfollowRequestValidation.validate(req.body);
            if (!unfollowValidation) {
                return;
            }
            const result = yield userService.unfollowUser(unfollowValidation.value.followerId, unfollowValidation.value.followeeId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.post('/users/username/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchValidation = user_validator_1.UsernameSearchValidation.validate(req.body);
            if (!searchValidation) {
                return;
            }
            const result = yield userService.searchUserByUsername(searchValidation.value.username);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/users/:id/followers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = yield userService.getUserFollower(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/users/:id/following', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = yield userService.getUserFollowing(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/users/:id/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = yield userService.getUserMessages(userId);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = yield userService.getUserById(userId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield userService.getAllUsers();
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.userRoutes = userRoutes;
