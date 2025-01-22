import { Router } from "express";
import { Request, Response } from "express";

const userLogoutRouter: Router = Router();

/* Response code */

const userLogOutResponse = {
    USER_LOG_OUT: 200
}


userLogoutRouter.post("/logout", async (req: Request, res: Response) => {
    res.clearCookie('session');
    res.send("User is logged out successfully!").status(userLogOutResponse.USER_LOG_OUT);
});

export default userLogoutRouter;