import { Router } from "express";
import { addToWallet, deleteFromWallet, getWallet } from '../controllers/walletController.js';
import walletSchemaValidationMiddleware from "../middlewares/walletSchemaValidationMiddleware.js";

const walletRouter = Router();
walletRouter.post('/wallet', walletSchemaValidationMiddleware, addToWallet);
walletRouter.get('/wallet', getWallet);
walletRouter.delete('/wallet/:id', deleteFromWallet);

export default walletRouter;