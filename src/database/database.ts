import {DataSource} from 'typeorm';
import {User} from './entities/user';
import {Post} from './entities/post';
import {Message} from './entities/message';
import {Conversation} from './entities/conversation';

// Charger les variables d'environnement
import * as dotenv from 'dotenv';

dotenv.config();

const config: any = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: process.env.DB_LOGGING === 'true',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    entities: [User, Post, Message, Conversation],
    migrations: ['./migrations/*.ts'],
};

export const AppDataSource = new DataSource(config);
