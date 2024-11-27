import {DataSource} from 'typeorm';
import {User} from "./entities/user";
import {Post} from "./entities/post";
import {Message} from "./entities/message";
import {Conversation} from "./entities/conversation";

const config: any = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'ethan',
    password: 'ethan',
    database: 'twitter_clone_database',
    logging: true,
    synchronize: true,
    entities: [User, Post, Message, Conversation],
    migrations: ['./migrations/*.ts'],
};

export const AppDataSource = new DataSource(config);
