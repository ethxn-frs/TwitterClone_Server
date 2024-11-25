import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Message} from "./message";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToMany(() => User, (user) => user.conversations)
    @JoinTable()
    users!: User[];

    @OneToMany(() => Message, (message) => message.conversation, {cascade: true})
    messages!: Message[];

    constructor(id?: number, name?: string, createdAt?: Date, users?: User[], messages?: Message[]) {

        if (id) this.id = id;
        if (name) this.name = name;
        if (createdAt) this.createdAt = createdAt;
        if (users) this.users = users;
        if (messages) this.messages = messages;
    }

}