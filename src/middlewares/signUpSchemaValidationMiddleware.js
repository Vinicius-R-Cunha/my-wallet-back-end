import signUpSchema from '../schemas/signUpSchema.js';

export default function signUpSchemaValidationMiddleware(req, res, next) {
    const validation = signUpSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(obj => (obj.message)));
    }

    next();
}