import express from 'express';
import {PORT} from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.route.js';
import connectToDatabase from './database/db.js';
import errorMiddleWare from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleWare)

app.get('/',(req,res)=>{
    res.send('Welcome to the subscription tracker API.');
})


app.listen(PORT,async () => {
    console.log(`Server running on port : http://localhost:${PORT}`);
    // await connectToDatabase();
})

export default app;