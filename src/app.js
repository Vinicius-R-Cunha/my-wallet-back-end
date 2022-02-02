import express from 'express';
import cors from 'cors';
import joi from 'joi';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());
app.use(cors());

const mongoclient = new MongoClient(process.env.MONGO_URI);
let db;
mongoclient.connect(() => {
    db = mongoclient.db('my-wallet');
});




app.listen(5000);