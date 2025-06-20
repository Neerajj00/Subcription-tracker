import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", getUser);

userRouter.post("/", (req, res) => res.send({ title: "create a new user " }));

userRouter.put("/:id", (req, res) => res.send({ title: "update user " }));

userRouter.delete('/:id', (req,res) => res.send({ title: "delete user" }));

export default userRouter;
