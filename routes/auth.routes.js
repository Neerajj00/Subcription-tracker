import { Router } from "express";
import { signIn, signOut, signUp } from "../controller/auth.controller";

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);

export default authRouter;