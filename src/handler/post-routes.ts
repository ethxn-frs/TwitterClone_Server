import express, {Request, Response} from "express";
import {AppDataSource} from "../database/database";
import {PostService} from "../domain/post-service";
import {
    createPostValidation,
    deletePostValidation,
    idPostValidation,
    likePostValidation
} from "./validator/post-validator";
import {idUserValidation} from "./validator/user-validator";

const postService = new PostService(AppDataSource);

export const postRoutes = (app: express.Express) => {

    app.post('/post/create', async (req: Request, res: Response) => {
        try {
            const createPostValidate = createPostValidation.validate(req.body);

            if (!createPostValidate) {
                return;
            }
            const result = await postService.createPost(createPostValidate.value);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.put('/post/:id/like', async (req: Request, res: Response) => {
        try {
            const likePostValidate = likePostValidation.validate(req.params);

            if (!likePostValidate) {
                return;
            }

            const userIdValidate = idUserValidation.validate(req.body);

            if (!userIdValidate) {
                return;
            }

            const result = await postService.likePost(likePostValidate.value.postId, userIdValidate.value.userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.put('/post/:id/delete', async (req: Request, res: Response) => {
        try {
            const deletePostValidate = deletePostValidation.validate(req.params);

            if (!deletePostValidate) {
                return;
            }

            const result = await postService.deletePost(deletePostValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.get('/post/:id', async (req: Request, res: Response) => {
        try {
            const idPostValidate = idPostValidation.validate(req.params);
            if (!idPostValidate) {
                return;
            }

            const result = await postService.getPostById(idPostValidate.value.postId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })
}