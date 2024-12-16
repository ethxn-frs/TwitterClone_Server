import Joi from "joi";


export const idUserValidation = Joi.object<IdUserRequest>({
    userId: Joi.number().required()
})

export interface IdUserRequest {
    userId: number;
}

export const loginValidation = Joi.object<LoginRequest>({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export interface LoginRequest {
    email: string,
    password: string,
}

export const changePasswordValidation = Joi.object<ChangePasswordRequest>({
    userId: Joi.number().required(),
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
})

export interface ChangePasswordRequest {
    userId: number,
    currentPassword: string,
    newPassword: string,
}

export const createUserValidation = Joi.object<CreateUserRequest>({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(10).max(10).required(),
    password: Joi.string().required(),
    birthDate: Joi.date().required()
})

export interface CreateUserRequest {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    phoneNumber: string,
    password: string,
    birthDate: Date,
}

export const lostPasswordValidation = Joi.object<LostPasswordRequest>({
    email: Joi.string().email().required()
})

export interface LostPasswordRequest {
    email: string
}

export const FollowRequestValidation = Joi.object<FollowRequest>({
    followerId: Joi.number().required(),
    followeeId: Joi.number().required(),
});

export interface FollowRequest {
    followerId: number,
    followeeId: number
}

export const UnfollowRequestValidation = Joi.object<UnfollowRequest>({
    followerId: Joi.number().required(),
    followeeId: Joi.number().required(),
});

export interface UnfollowRequest {
    followerId: number,
    followeeId: number
}

export const UsernameSearchValidation = Joi.object<UsernameSearchRequest>({
    username: Joi.string().min(1).max(20).required()
})

export interface UsernameSearchRequest {
    username: string
}