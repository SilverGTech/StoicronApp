import { Router, Request, Response } from "express";



const userRouter: Router = Router();

userRouter.get("/", (req: Request, res: Response) => {
    res.send("User Router is working...");
});

/* Routers */
import userRegisterRouter from "./userRegister";
import userLoginRouter from "./userLogin";
userRouter.use("/register", userRegisterRouter);
userRouter.use("/login", userLoginRouter);


export default userRouter;