import express from 'express';
import cors from 'cors';
import joi from 'joi';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();

const mongoclient = new MongoClient(process.env.MONGO_URI);
let db;
mongoclient.connect(() => {
    db = mongoclient.db('my-wallet');
});

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', async (req, res) => {
    const signUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().lowercase().strict().required(),
        password: joi.string().required()
    });

    try {
        const user = req.body;
        const passwordHash = bcrypt.hashSync(user.password, 10);

        const validation = signUpSchema.validate(user, { abortEarly: false });
        if (validation.error) {
            return res.status(422).send(validation.error.details.map(obj => (obj.message)));
        }

        const userExists = await db.collection('users').findOne({ email: user.email });
        if (!userExists) {
            return res.sendStatus(409);
        }

        await db.collection('users').insertOne({ ...user, password: passwordHash });

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/sign-in', async (req, res) => {
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

        const userExists = await db.collection('users').findOne({ email: user.email });
        const passwordIsCorrect = bcrypt.compareSync(req.body.password, userExists.password);

        if (userExists && passwordIsCorrect) {
            const token = uuid();

            await db.collection('sessions').insertOne(
                {
                    userId: userExists._id,
                    token
                }
            );

            res.status(200).send(token);
        } else {
            return res.sendStatus(409);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


app.listen(5000);