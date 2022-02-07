import joi from 'joi';

const walletSchema = joi.object({
    value: joi.string().required(),
    description: joi.string().required(),
    expense: joi.bool().required()
});

export default walletSchema;