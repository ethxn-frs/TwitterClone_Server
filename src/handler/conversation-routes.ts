import express, {Request, Response} from "express";
import {AppDataSource} from "../database/database";
import {ConversationService} from "../domain/conversation-service";
import {idConversationValidation} from "./validator/conversation-validator";

const conversationService = new ConversationService(AppDataSource);

export const conversationRoutes = (app: express.Express) => {

    app.post('/conversations', async (req: Request, res: Response) => {
        const {participantIds, creatorId} = req.body;
        try {
            const conversation = await conversationService.createConversation(creatorId, participantIds);
            res.status(201).json(conversation);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/conversations/user/:id', async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = await conversationService.getUserConversations(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.post('/conversations/:conversationId/add-user', async (req: Request, res: Response) => {
        const {conversationId} = req.params;
        const {userId} = req.body;

        try {
            await conversationService.addUserToConversation(Number(conversationId), userId);
            res.status(200).json({message: "User added to conversation"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.post('/conversations/:conversationId/remove-user', async (req: Request, res: Response) => {
        const {conversationId} = req.params;
        const {userId} = req.body;

        try {
            await conversationService.removeUserFromConversation(Number(conversationId), userId);
            res.status(200).json({message: "User removed from conversation"});
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/conversations', async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.user.id;

        try {
            const conversations = await conversationService.getUserConversations(userId);
            res.status(200).json(conversations);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });

    app.get('/conversations/:id', async (req: Request, res: Response) => {
        try {
            const conversationIdValidate = idConversationValidation.validate(req.params);
            const conversation = await conversationService.getConversationById(conversationIdValidate.value.conversationId);
            res.status(200).json(conversation);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    });
};
