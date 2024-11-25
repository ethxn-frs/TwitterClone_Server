import express, {Request, Response} from "express";
import {AppDataSource} from "../database/database";
import {ConversationService} from "../domain/conversation-service";
import {authenticate} from "../middleware/authenticate";

const conversationService = new ConversationService(AppDataSource);

export const conversationRoutes = (app: express.Express) => {

    app.post('/conversations', authenticate, async (req: Request, res: Response) => {
        const {name, participantIds} = req.body;
        const creatorId = req.user.id;  // ID de l'utilisateur authentifié

        try {
            const conversation = await conversationService.createConversation(name, creatorId, participantIds);
            res.status(201).json(conversation);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.post('/conversations/:conversationId/add-user', authenticate, async (req: Request, res: Response) => {
        const {conversationId} = req.params;
        const {userId} = req.body;

        try {
            await conversationService.addUserToConversation(Number(conversationId), userId);
            res.status(200).json({message: "User added to conversation"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.post('/conversations/:conversationId/remove-user', authenticate, async (req: Request, res: Response) => {
        const {conversationId} = req.params;
        const {userId} = req.body;

        try {
            await conversationService.removeUserFromConversation(Number(conversationId), userId);
            res.status(200).json({message: "User removed from conversation"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/conversations', authenticate, async (req: Request, res: Response) => {
        const userId = req.user.id;

        try {
            const conversations = await conversationService.getUserConversations(userId);
            res.status(200).json(conversations);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });
};
