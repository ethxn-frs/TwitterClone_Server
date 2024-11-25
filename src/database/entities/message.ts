import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Conversation} from "./conversation";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.messages, {eager: true})
    author!: User;

    @CreateDateColumn()
    sentAt!: Date;

    @Column()
    content!: string;

    @ManyToOne(() => Conversation, (conversation) => conversation.messages, {onDelete: "CASCADE"})
    conversation!: Conversation;

    @ManyToMany(() => User, {eager: true})
    @JoinTable()
    seenBy!: User[];

    constructor(id?: number, author?: User, sentAt?: Date, content?: string, conversation?: Conversation, seenBy?: User[]) {
        if (id) this.id = id;
        if (author) this.author = author;
        if (sentAt) this.sentAt = sentAt;
        if (content) this.content = content;
        if (conversation) this.conversation = conversation;
        if (seenBy) this.seenBy = seenBy;
    }
}
