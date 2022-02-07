import signInSchema from "../schemas/signInSchema.js";

export default function signInSchemaValidationMiddleware(req, res, next) {
    const validation = signInSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        return res.status(422).send(validation.error.details.map(obj => (obj.message)));
    }

    next();
}