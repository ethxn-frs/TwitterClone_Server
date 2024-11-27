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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const conversation_1 = require("./conversation");
let Message = class Message {
    constructor(id, author, sentAt, content, conversation, seenBy) {
        if (id)
            this.id = id;
        if (author)
            this.author = author;
        if (sentAt)
            this.sentAt = sentAt;
        if (content)
            this.content = content;
        if (conversation)
            this.conversation = conversation;
        if (seenBy)
            this.seenBy = seenBy;
    }
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, (user) => user.messages, { eager: true }),
    __metadata("design:type", user_1.User)
], Message.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_1.Conversation, (conversation) => conversation.messages, { onDelete: "CASCADE" }),
    __metadata("design:type", conversation_1.Conversation)
], Message.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_1.User, { eager: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Message.prototype, "seenBy", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, user_1.User, Date, String, conversation_1.Conversation, Array])
], Message);
