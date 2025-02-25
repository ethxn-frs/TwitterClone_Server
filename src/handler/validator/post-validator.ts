import Joi from "joi";


export const createPostValidation = Joi.object<CreatePostRequest>({
    userId: Joi.number().required(),
    content: Joi.string().min(1).max(200).required(),
    parentId: Joi.number().optional(),
})

export interface CreatePostRequest {
    userId: number,
    content: string,
    parentId?: number
}

export const deletePostValidation = Joi.object<DeletePostRequest>({
    postId: Joi.number().required(),
})

export interface DeletePostRequest {
    postId: number,
}

export const idPostValidation = Joi.object<IdPostRequest>({
    postId: Joi.number().required(),
})

export interface IdPostRequest {
    postId: number,
}

export const likePostValidation = Joi.object<LikePostValidation>({
    postId: Joi.number().required(),
})

export interface LikePostValidation {
    postId: number,
}

export const searchPostValidation = Joi.object<SearchPostValidate>({
    query: Joi.string().required(),
})

export interface SearchPostValidate {
    query: string,
}
