"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./entities/user");
const post_1 = require("./entities/post");
const message_1 = require("./entities/message");
const conversation_1 = require("./entities/conversation");
const config = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'ethan',
    password: 'ethan',
    database: 'twitter_clone_database',
    logging: true,
    synchronize: true,
    entities: [user_1.User, post_1.Post, message_1.Message, conversation_1.Conversation],
    migrations: ['./migrations/*.ts'],
};
exports.AppDataSource = new typeorm_1.DataSource(config);
