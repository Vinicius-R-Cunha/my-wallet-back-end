import { Router } from "express";
import { signUp, signIn } from '../controllers/authController.js'
import signInSchemaValidationMiddleware from "../middlewares/signInSchemaValidationMiddleware.js";
import signUpSchemaValidationMiddleware from "../middlewares/signUpSchemaValidationMiddleware.js";

const authRouter = Router();
authRouter.post('/sign-up', signUpSchemaValidationMiddleware, signUp);
authRouter.post('/sign-in', signInSchemaValidationMiddleware, signIn);

export default authRouter;