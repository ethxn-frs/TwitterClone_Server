import {DataSource} from 'typeorm';
import {User} from "./entities/user";
import {Post} from "./entities/post";
import {Message} from "./entities/message";
import {Conversation} from "./entities/conversation";

const config: any = {
    type: 'pgsql',
    host: 'localhost',
    port: 8889,
    username: 'pgsql',
    password: 'root',
    database: 'Twitter-Clone',
    logging: true,
    synchronize: true,
    entities: [User, Post, Message, Conversation],
    migrations: ['./migrations/*.ts'],
};

export const AppDataSource = new DataSource(config);
