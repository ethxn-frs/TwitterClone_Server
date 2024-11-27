import Joi from "joi";


export const idConversationValidation = Joi.object<IdConversationRequest>({
    conversationId: Joi.number().required(),
})

export interface IdConversationRequest {
    conversationId: number,
}
