import express from 'express';
import cors from 'cors';
import { signIn, signUp } from './controllers/authController.js';
import { addToWallet, deleteFromWallet, getWallet } from './controllers/walletController.js';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);

app.post('/wallet', addToWallet);
app.get('/wallet', getWallet);
app.delete('/wallet/:id', deleteFromWallet);

app.listen(5000);