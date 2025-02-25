import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { PostService } from "../domain/post-service";
import {
    createPostValidation,
    deletePostValidation,
    idPostValidation,
    likePostValidation,
    searchPostValidation
} from "./validator/post-validator";
import { idUserValidation } from "./validator/user-validator";

const postService = new PostService(AppDataSource);

export const postRoutes = (app: express.Express) => {

    app.post('/posts/create', async (req: Request, res: Response) => {
        try {
            const createPostValidate = createPostValidation.validate(req.body);

            if (!createPostValidate) {
                return;
            }
            const result = await postService.createPost(createPostValidate.value);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    });

    app.post('/posts/search', async (req: Request, res: Response) => {
        try {
            const searchPostsValidate = searchPostValidation.validate(req.body);
            if (!searchPostsValidate) {
                return;
            }
            console.log(searchPostsValidate.value.query)
            console.log("---------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            const result = await postService.searchPostsByContent(searchPostsValidate.value.query);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    });

    app.put('/posts/:postId/like', async (req: Request, res: Response) => {
        try {
            const likePostValidate = likePostValidation.validate(req.params);

            if (!likePostValidate) {
                return;
            }

            const userIdValidate = idUserValidation.validate(req.body);

            if (!userIdValidate) {
                return;
            }

            const result = await postService.likePost(userIdValidate.value.userId, likePostValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    })

    app.get('/posts/:postId/comments', async (req: Request, res: Response) => {
        try {
            const postIdValidate = idPostValidation.validate(req.params);
            if (!postIdValidate) {
                return;
            }

            const result = await postService.getComments(postIdValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    })

    app.put('/posts/:postId/delete', async (req: Request, res: Response) => {
        try {
            const deletePostValidate = deletePostValidation.validate(req.params);

            if (!deletePostValidate) {
                return;
            }

            const result = await postService.deletePost(deletePostValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    })

    app.get('/posts/:postId', async (req: Request, res: Response) => {
        try {
            const idPostValidate = idPostValidation.validate(req.params);
            if (!idPostValidate) {
                return;
            }

            const result = await postService.getPostById(idPostValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    })

    app.get('/posts', async (req: Request, res: Response) => {
        try {
            const result = await postService.getAllPosts();
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    })
}