import express from "express";
import {AppDataSource} from "../database/database";
import {MessageService} from "../domain/message-service";

const messageService = new MessageService(AppDataSource);

export const messageRoutes = (app: express.Express) => {

}