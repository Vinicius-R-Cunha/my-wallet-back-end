import joi from 'joi';

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().lowercase().strict().required(),
    password: joi.string().required(),
    passwordConfirmation: joi.string().required()
});

export default signUpSchema;