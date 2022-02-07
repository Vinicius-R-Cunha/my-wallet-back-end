import joi from 'joi';

const signInSchema = joi.object({
    email: joi.string().lowercase().strict().required(),
    password: joi.string().required()
});

export default signInSchema;