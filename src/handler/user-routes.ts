import express, {Request, Response} from "express";
import {
    createUserValidation,
    FollowRequestValidation,
    searchUserValidation,
    UnfollowRequestValidation,
    UsernameSearchValidation
} from "./validator/user-validator";
import {AppDataSource} from "../database/database";
import {UserService} from "../domain/user-service";
import {ImageService} from "../domain/image-service";

const userService = new UserService(AppDataSource);
const imageService = new ImageService(AppDataSource);
const uploadMiddleware = imageService.getMulterMiddleware();


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

    app.patch('/users/:id', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const updates: { [key: string]: string } = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                res.status(400).json({message: "Aucune mise à jour fournie."});
            }

            const updatedUser = await userService.updateUserPatch(userId, updates);
            res.status(200).json({message: "Utilisateur mis à jour avec succès.", user: updatedUser});
        } catch (error: any) {
            res.status(500).json({message: error.message});
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

    app.put('/users/:userId/delete-pp', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.deleteCoverOrPP("pp", userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.put('/users/:userId/delete-cover', async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const result = await userService.deleteCoverOrPP("cover", userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.post('/users/username/search', async (req: Request, res: Response) => {

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


    app.put('/users/:userId/update-pp', uploadMiddleware, async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            // @ts-ignore
            const uploadResult = await imageService.uploadImage(req.file.path, req.file.originalname);

            if (uploadResult instanceof Error) {
                res.status(500).send({error: "Error uploading image"});
                return;
            }
            const result = await userService.updateCoverOrPP("pp", uploadResult, userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })


    app.put('/users/:userId/update-cover', uploadMiddleware, async (req: Request, res: Response) => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            // @ts-ignore
            const uploadResult = await imageService.uploadImage(req.file.path, req.file.originalname);

            if (uploadResult instanceof Error) {
                res.status(500).send({error: "Error uploading image"});
                return;
            }
            const result = await userService.updateCoverOrPP("cover", uploadResult, userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

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