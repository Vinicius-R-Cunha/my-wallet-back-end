import { Router } from "express";
import { addToWallet, deleteFromWallet, getWallet } from '../controllers/walletController.js';
import tokenValidationMiddleware from "../middlewares/tokenValidationMiddleware.js";
import walletSchemaValidationMiddleware from "../middlewares/walletSchemaValidationMiddleware.js";

const walletRouter = Router();
walletRouter.post('/wallet', walletSchemaValidationMiddleware, tokenValidationMiddleware, addToWallet);
walletRouter.get('/wallet', tokenValidationMiddleware, getWallet);
walletRouter.delete('/wallet/:id', tokenValidationMiddleware, deleteFromWallet);

export default walletRouter;