import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { stripHtml } from "string-strip-html";
import db from '../db.js';

export async function signUp(req, res) {
    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().lowercase().strict().required(),
        password: joi.string().required(),
        passwordConfirmation: joi.string().required()
    });

    try {
        const validation = signUpSchema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(obj => (obj.message)));
        }

        const passwordsMatch = (req.body.password === req.body.passwordConfirmation);
        if (!passwordsMatch) {
            return res.sendStatus(409);
        }

        const name = stripHtml(req.body.name).result.trim();
        const email = stripHtml(req.body.email).result.trim();
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const user = { name, email, password: passwordHash };

        const userExists = await db.collection('users').findOne({ email: user.email });
        if (userExists) {
            return res.status(409).send('used email');
        }

        await db.collection('users').insertOne({ ...user, password: passwordHash });

        const userCreated = await db.collection('users').findOne({ name: user.name });
        await db.collection('userWallet').insertOne({ userId: userCreated._id, expenses: [] });

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function signIn(req, res) {
    const signInSchema = joi.object({
        email: joi.string().lowercase().strict().required(),
        password: joi.string().required()
    });

    try {
        const user = req.body;

        const validation = signInSchema.validate(user, { abortEarly: false });
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(obj => (obj.message)));
        }

        user.email = stripHtml(user.email).result.trim();

        const userExists = await db.collection('users').findOne({ email: user.email });
        const passwordIsCorrect = bcrypt.compareSync(req.body.password, userExists.password);

        if (userExists && passwordIsCorrect) {

            const token = uuid();

            const sessionExists = await db.collection('sessions').findOne({ userId: userExists._id, });

            if (sessionExists) {
                await db.collection('sessions').updateOne({ _id: sessionExists._id }, {
                    $set: { token: token }
                });
            } else {
                await db.collection('sessions').insertOne(
                    {
                        userId: userExists._id,
                        token
                    }
                );
            }

            res.status(200).send({
                name: capitalizeFirstLetterOfFirstName(userExists.name),
                email: userExists.email,
                token
            });
            return;
        } else {
            return res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

function capitalizeFirstLetterOfFirstName(string) {
    const firstName = string.split(' ')[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}