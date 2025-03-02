import express, {Request, Response} from "express";
import {AppDataSource} from "../database/database";
import {MessageService} from "../domain/message-service";
import {
    createMessageValidation,
    idMessageValidation,
    messagesConversationValidation,
    validateMessageSeen
} from "./validator/message-validator";
import { number } from "joi";

const messageService = new MessageService(AppDataSource);

export const messageRoutes = (app: express.Express) => {


    app.get('/messages/conversation/:id', async (req: Request, res: Response) => {
        try {
            const messagesConversationValidate = messagesConversationValidation.validate(req.params);
            if (!messagesConversationValidate) {
                return;
            }
            const conversationId = parseInt(req.params.id);
            const result = await messageService.getMessagesInConversation(conversationId);
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

    app.put('/messages/seenBy/:id', async (req: Request, res: Response)=>{
        try {
            const createMessageValidate = validateMessageSeen.validate(req.body);
            const messageId = parseInt(req.params.id, 10);
            if (!createMessageValidate) {
                return;
            }
            const result = await messageService.seenMessageById(createMessageValidate.value.userId, messageId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.delete('/messages/seenBy/:id', async (req: Request, res: Response)=>{
        try {
            const {value, error} = validateMessageSeen.validate(req.body);
            const messageId = parseInt(req.params.id, 10);
            const userId = value.userId;
            const result = await messageService.deleteMessageSeenByIdMessage(userId, messageId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({message: error.message});
        }
    })

    app.delete('/messages/:id', async (req: Request, res: Response) => {
        try{
            const {value, error} = idMessageValidation.validate(req.params.id);
            const messageId = parseInt(value, 10);
            await messageService.deleteMessageById(messageId);
            res.status(200).json();
        }catch(error: any){
            res.status(400).json({ message : error.message});
        }
    });
}