import express from 'express';
//import cors from 'cors';
import authRouter from './routes/authRouter.js';
import walletRouter from './routes/walletRouter.js';

const app = express();
app.use(express.json());
//app.use(cors());

app.use(authRouter);
app.use(walletRouter);

app.listen(process.env.PORT, () => {
    console.log("Server running on port " + process.env.PORT);
});