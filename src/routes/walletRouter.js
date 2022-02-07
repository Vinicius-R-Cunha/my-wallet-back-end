import { Router } from "express";
import { addToWallet, deleteFromWallet, getWallet } from '../controllers/walletController.js';

const walletRouter = Router();
walletRouter.post('/wallet', addToWallet);
walletRouter.get('/wallet', getWallet);
walletRouter.delete('/wallet/:id', deleteFromWallet);

export default walletRouter;