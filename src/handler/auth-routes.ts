import express, {NextFunction, Request, Response} from "express";
import {AuthService} from "../domain/auth-service";
import {AppDataSource} from "../database/database";
import {changePasswordValidation, loginValidation, lostPasswordValidation,} from "./validator/user-validator";
import {authenticate} from "../middleware/authenticate";


const authService = new AuthService(AppDataSource);

const validateRequest = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).send({error: error.details});
    }
    next();
};

export const authRoutes = (app: express.Express) => {

    app.post('/login', validateRequest(loginValidation), async (req: Request, res: Response) => {
        try {
            const {user, token} = await authService.login(req.body);
            res.status(200).json({user, token});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.post('/change-password', authenticate, validateRequest(changePasswordValidation), async (req: Request, res: Response) => {
        try {
            const result = await authService.changePassword(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.post('/lost-password', validateRequest(lostPasswordValidation), async (req: Request, res: Response) => {
        try {
            await authService.lostPassword(req.body);
            res.status(200).json({message: "Password reset email sent"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });
};
