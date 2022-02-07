import db from "../db.js";

export default async function tokenValidationMiddleware(req, res, next) {
    const token = req.header('Authorization').split(' ')[1];

    const session = await db.collection('sessions').findOne({ token });
    if (!session || !token) {
        return res.sendStatus(401);
    }

    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) {
        return res.sendStatus(401);
    }

    const userWallet = await db.collection('userWallet').findOne({ userId: session.userId });

    res.locals.userWallet = userWallet;
    next();
}