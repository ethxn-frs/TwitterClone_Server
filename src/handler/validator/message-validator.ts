import Joi from "joi";


export const idMessageValidation = Joi.object<IdMessageRequest>({
    messageId: Joi.number().required(),
})

export interface IdMessageRequest {
    messageId: number,
}

export const createMessageValidation = Joi.object<CreateMessageRequest>({
    conversationId: Joi.number().required(),
    userId: Joi.number().required(),
    content: Joi.string().required(),
})


export interface CreateMessageRequest {
    conversationId: number,
    userId: number,
    content: string
}

export const messagesConversationValidation = Joi.object<MessageConversationRequest>({
    conversationId: Joi.number().required(),
})

export interface MessageConversationRequest {
    conversationId: number,
}

export interface IdUserSeenMessageRequest{
    userId: number
}
export const validateMessageSeen = Joi.object<IdUserSeenMessageRequest>({
    userId: Joi.number().required()
})
