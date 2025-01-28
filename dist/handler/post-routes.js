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
exports.postRoutes = void 0;
const database_1 = require("../database/database");
const post_service_1 = require("../domain/post-service");
const post_validator_1 = require("./validator/post-validator");
const user_validator_1 = require("./validator/user-validator");
const postService = new post_service_1.PostService(database_1.AppDataSource);
const postRoutes = (app) => {
    app.post('/posts/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const createPostValidate = post_validator_1.createPostValidation.validate(req.body);
            if (!createPostValidate) {
                return;
            }
            const result = yield postService.createPost(createPostValidate.value);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.put('/posts/:postId/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const likePostValidate = post_validator_1.likePostValidation.validate(req.params);
            if (!likePostValidate) {
                return;
            }
            const userIdValidate = user_validator_1.idUserValidation.validate(req.body);
            if (!userIdValidate) {
                return;
            }
            const result = yield postService.likePost(userIdValidate.value.userId, likePostValidate.value.postId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/posts/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const postIdValidate = post_validator_1.idPostValidation.validate(req.params);
            if (!postIdValidate) {
                return;
            }
            const result = yield postService.getComments(postIdValidate.value.postId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.put('/posts/:postId/delete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletePostValidate = post_validator_1.deletePostValidation.validate(req.params);
            if (!deletePostValidate) {
                return;
            }
            const result = yield postService.deletePost(deletePostValidate.value.postId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/posts/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const idPostValidate = post_validator_1.idPostValidation.validate(req.params);
            if (!idPostValidate) {
                return;
            }
            const result = yield postService.getPostById(idPostValidate.value.postId);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
    app.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield postService.getAllPosts();
            res.status(201).json(result);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }));
};
exports.postRoutes = postRoutes;
