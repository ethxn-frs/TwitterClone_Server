import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {Conversation} from "./conversation";
import {Message} from "./message";
import {Post} from "./post";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({unique: true})
    username!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    phoneNumber!: string;

    @Column()
    password!: string;

    @Column()
    birthDate!: Date;

    @Column({nullable: true})
    profilePictureUrl?: string;

    @Column({nullable: true})
    coverPictureUrl?: string;

    @Column({nullable: true})
    location?: string;

    @Column({type: "text", nullable: true})
    bio?: string;

    @Column({nullable: true})
    website?: string;

    @ManyToMany(() => User, (user) => user.following)
    followers!: User[];

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable()
    following!: User[];

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @ManyToMany(() => Post, (post) => post.userHaveLiked)
    likedPosts!: Post[];

    @ManyToMany(() => Conversation, (conversation) => conversation.users)
    conversations!: Conversation[];

    @OneToMany(() => Message, (message) => message.author)
    messages!: Message[];

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: "timestamp", nullable: true, onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date | null;
}
