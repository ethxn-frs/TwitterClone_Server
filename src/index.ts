import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import 'dotenv/config';
import {AppDataSource} from "./database/database";
import {authRoutes} from "./handler/auth-routes";
import {conversationRoutes} from "./handler/conversation-routes";
import {messageRoutes} from "./handler/message-routes";
import {postRoutes} from "./handler/post-routes";
import {userRoutes} from "./handler/user-routes";



const main = async () => {
    const app = express();
    const port = 3030;

    try {
        await AppDataSource.initialize();
        console.log("Well connected to database");
        await AppDataSource.synchronize();
        console.log("Synchronized");
    } catch (error) {
        console.error("Cannot contact database", error);
        process.exit(1);
    }

    app.use(cors());
    app.use(express.json());

    try {
        authRoutes(app);
        conversationRoutes(app);
        messageRoutes(app);
        postRoutes(app);
        userRoutes(app);
        console.log("Routes are set up successfully");
    } catch (error) {
        console.error("Error setting up routes:", error);
        process.exit(1);
    }

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

main().catch((error) => {
    console.error("Failed to start the server:", error);
    process.exit(1);
});
