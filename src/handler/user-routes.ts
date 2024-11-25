import express, {Request, Response} from "express";
import {
    createUserValidation,
    FollowRequestValidation,
    UnfollowRequestValidation,
    UsernameSearchValidation
} from "./validator/user-validator";
import {AppDataSource} from "../database/database";
import {UserService} from "../domain/user-service";
import {authenticate} from "../middleware/authenticate";

const userService = new UserService(AppDataSource);

export const userRoutes = (app: express.Express) => {

    app.post('/signup', async (req: Request, res: Response) => {
        try {
            const userRequestValidation = createUserValidation.validate(req.body);
            const newUser = await userService.signUp(userRequestValidation.value);
            const {password, ...userWithoutPassword} = newUser;
            res.status(201).json(userWithoutPassword);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.put('/follow', authenticate, async (req: Request, res: Response) => {
        try {
            const followValidation = FollowRequestValidation.validate(req.body);

            if (!followValidation) {
                return;
            }

            const result = await userService.followUser(followValidation.value.followerId, followValidation.value.followeeId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.put('/unfollow', authenticate, async (req: Request, res: Response) => {

        try {
            const unfollowValidation = UnfollowRequestValidation.validate(req.body);

            if (!unfollowValidation) {
                return;
            }

            const result = await userService.unfollowUser(unfollowValidation.value.followerId, unfollowValidation.value.followeeId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.post('/user/username/search', async (req: Request, res: Response) => {

        try {

            const searchValidation = UsernameSearchValidation.validate(req.body);
            if (!searchValidation) {
                return;
            }

            const result = await userService.searchUserByUsername(searchValidation.value.username);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.post('/user/:id', authenticate, async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserById(userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })
}