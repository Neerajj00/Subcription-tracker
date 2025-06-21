import { Router } from "express";
import { cancelSubscription, createSubscription, deleteSubscription, getAllSubscriptions, getSubscriptions, updateSubscription } from "../controllers/subscription.controller.js";
import authorize from './../middleware/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', getAllSubscriptions); // for admin

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/user/:id',authorize, updateSubscription);

subscriptionRouter.delete('/user/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id',authorize, getSubscriptions);

subscriptionRouter.put('/user/:id/cancel',authorize , cancelSubscription);



export default subscriptionRouter;
