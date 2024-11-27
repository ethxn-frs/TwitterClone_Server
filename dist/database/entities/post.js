"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
let Post = class Post {
    constructor(id, author, content, userHaveLiked, comments, createdAt, deleted) {
        if (id)
            this.id = id;
        if (author)
            this.author = author;
        if (content)
            this.content = content;
        if (userHaveLiked)
            this.userHaveLiked = userHaveLiked;
        if (comments)
            this.comments = comments;
        if (createdAt)
            this.createdAt = createdAt;
        if (deleted)
            this.deleted = deleted;
    }
};
exports.Post = Post;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.posts, { nullable: false }),
    __metadata("design:type", user_1.User)
], Post.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_1.User, (user) => user.likedPosts),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Post.prototype, "userHaveLiked", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Post, (post) => post.parentPost, { cascade: true }),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post, (post) => post.comments, { nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "parentPost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Post.prototype, "deleted", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, user_1.User, String, Array, Array, Date, Boolean])
], Post);
