import { stripHtml } from "string-strip-html";
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import db from '../db.js';

export async function addToWallet(req, res) {
    try {
        const expense = req.body;
        expense.description = stripHtml(expense.description).result.trim();

        const { userWallet } = res.locals;

        await db.collection('userWallet').updateOne({ _id: userWallet._id },
            {
                $push: { expenses: { _id: new ObjectId(), ...expense, date: dayjs().format('DD/MM') } }
            });

        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getWallet(req, res) {
    try {
        const { userWallet } = res.locals;

        const subtotal = calculateSubtotal(userWallet.expenses);

        res.status(200).send({ expenses: userWallet.expenses, subtotal });
    } catch (error) {
        res.status(500).send(error);
    }
}

function calculateSubtotal(expenses) {
    let subtotal = 0;
    for (let i = 0; i < expenses.length; i++) {
        const value = parseFloat((expenses[i].value).replace(',', '.'));
        if (expenses[i].expense) {
            subtotal -= value;
        } else {
            subtotal += value;
        }
    }

    return subtotal.toFixed(2).replace('.', ',');
}

export async function deleteFromWallet(req, res) {
    try {
        const _id = new ObjectId(req.params.id);
        const { userWallet } = res.locals;

        await db.collection('userWallet').updateOne({ _id: userWallet._id }, {
            $pull: { expenses: { _id } }
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
}