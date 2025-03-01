import express, {Request, Response} from "express";
import {
    createUserValidation,
    FollowRequestValidation,
    searchUserValidation,
    UnfollowRequestValidation
} from "./validator/user-validator";
import {AppDataSource} from "../database/database";
import {UserService} from "../domain/user-service";

const userService = new UserService(AppDataSource);

export const userRoutes = (app: express.Express) => {

    app.post('/signup', async (req: Request, res: Response) => {
        try {
            console.log(req.body)

            const userRequestValidation = createUserValidation.validate(req.body);
            const newUser = await userService.signUp(userRequestValidation.value);
            const {password, ...userWithoutPassword} = newUser;
            res.status(201).json(userWithoutPassword);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.put('/follow', async (req: Request, res: Response) => {
        try {
            console.log(req.body)
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

    app.put('/unfollow', async (req: Request, res: Response) => {
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

    app.put('/users/username')

    app.post('/users/search', async (req: Request, res: Response) => {
        try {
            const searchUsersValidate = searchUserValidation.validate(req.body);

            if (!searchUsersValidate) {
                return;
            }
            console.log(searchUsersValidate.value)
            console.log(req.body)
            console.log("---------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            const result = await userService.searchUsersByContent(searchUsersValidate.value.query);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });


    app.get('/users/:id', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserById(userId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.get('/users/:id/posts', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserPosts(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users/:id/comments', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserComments(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users/:id/likes', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserLikedPosts(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });


    app.get('/users/:id/followers', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserFollower(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users/:id/following', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserFollowing(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users/:id/followers-following/count', async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id);
        try {
            const [followers, following] = await userService.getUserFollowersAndFollowingCount(userId);
            res.status(200).json({followers, following});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users/:id/messages', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.getUserMessages(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/users', async (req: Request, res: Response) => {
        try {
            const result = await userService.getAllUsers();
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.get('/isFollowing', async (req: Request, res: Response) => {
        try {
            const {followerId, followeeId} = req.query;

            if (!followerId || !followeeId) {
                res.status(400).json({message: "IDs manquants"});
            }
            const isFollowing = await userService.isFollowing(Number(followerId), Number(followeeId));
            res.status(200).json({isFollowing});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });
}