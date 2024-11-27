import express, {Request, Response} from "express";
import {AppDataSource} from "../database/database";
import {MessageService} from "../domain/message-service";
import {
    createMessageValidation,
    idMessageValidation,
    messagesConversationValidation
} from "./validator/message-validator";

const messageService = new MessageService(AppDataSource);

export const messageRoutes = (app: express.Express) => {


    app.get('/messages/conversation/:id', async (req: Request, res: Response) => {
        try {
            const messagesConversationValidate = messagesConversationValidation.validate(req.params);

            if (!messagesConversationValidate) {
                return;
            }
            const result = await messageService.getMessagesInConversation(messagesConversationValidate.value.conversationId);
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.get('/messages/:id', async (req: Request, res: Response) => {
        try {
            const idMessageValidate = idMessageValidation.validate(req.params);
            if (!idMessageValidation) {
                return;
            }

            const result = await messageService.getMessageById(idMessageValidate.value.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.post('/messages', async (req: Request, res: Response) => {
        try {
            const createMessageValidate = createMessageValidation.validate(req.body);
            if (!createMessageValidate) {
                return;
            }
            const result = await messageService.sendMessage(createMessageValidate.value.conversationId, createMessageValidate.value.userId, createMessageValidate.value.content);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })
}