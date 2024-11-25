import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Conversation} from "./conversation";
import {Message} from "./message";
import {Post} from "./post";

@Entity()
export class    User {
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

    @ManyToMany(() => User, (user) => user.following)
    followers!: User[];

    @ManyToMany(() => User, (user) => user.followers)
    following!: User[];

    @OneToMany(() => Post, (post) => post.author)
    posts!: Post[];

    @ManyToMany(() => Post, (post) => post.userHaveLiked)
    likedPosts!: Post[];

    @ManyToMany(() => Post, (post) => post.userHaveRetweeted)
    retweetedPosts!: Post[];

    @ManyToMany(() => Conversation, (conversation) => conversation.users)
    conversations!: Conversation[];

    @OneToMany(() => Message, (message) => message.author)
    messages!: Message[];

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt!: Date;

    @Column({type: 'timestamp', nullable: true, onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt!: Date | null;

    constructor(
        id?: number, firstName?: string, lastName?: string, username?: string, email?: string,
        phoneNumber?: string, password?: string, birthDate?: Date, followers?: User[], following?: User[],
        posts?: Post[], likedPosts?: Post[], retweetedPosts?: Post[], createdAt?: Date, updatedAt?: Date) {
        if (id) this.id = id;
        if (firstName) this.firstName = firstName;
        if (lastName) this.lastName = lastName;
        if (username) this.username = username;
        if (email) this.email = email;
        if (phoneNumber) this.phoneNumber = phoneNumber;
        if (password) this.password = password;
        if (birthDate) this.birthDate = birthDate;
        if (followers) this.followers = followers;
        if (following) this.following = following;
        if (posts) this.posts = posts;
        if (likedPosts) this.likedPosts = likedPosts;
        if (retweetedPosts) this.retweetedPosts = retweetedPosts;
        if (createdAt) this.createdAt = createdAt;
        if (updatedAt) this.updatedAt = updatedAt;
    }
}
