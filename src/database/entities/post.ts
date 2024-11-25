import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.posts, {nullable: false})
    author!: User;

    @Column()
    content!: string;

    @ManyToMany(() => User, (user) => user.likedPosts)
    userHaveLiked!: User[];

    @ManyToMany(() => User, (user) => user.retweetedPosts)
    userHaveRetweeted!: User[];

    @OneToMany(() => Post, (post) => post.parentPost, {cascade: true})
    comments!: Post[];

    @ManyToOne(() => Post, (post) => post.comments, {nullable: true})
    parentPost!: Post | null;

    @CreateDateColumn()
    createdAt!: Date;

    @Column({default: false})
    deleted!: boolean;

    constructor(id?: number, author?: User, content?: string, userHaveLiked?: User[], userHaveRetweeted?: User[], comments?: Post[], createdAt?: Date, deleted?: boolean) {
        if (id) this.id = id;
        if (author) this.author = author;
        if (content) this.content = content;
        if (userHaveLiked) this.userHaveLiked = userHaveLiked;
        if (userHaveRetweeted) this.userHaveRetweeted = userHaveRetweeted;
        if (comments) this.comments = comments;
        if (createdAt) this.createdAt = createdAt;
        if (deleted) this.deleted = deleted;
    }

}