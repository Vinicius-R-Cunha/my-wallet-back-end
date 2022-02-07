import walletSchema from '../schemas/walletSchema.js';

export default function walletSchemaValidationMiddleware(req, res, next) {
    const validation = walletSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(obj => (obj.message)));
    }

    next();
}