import { Router, Request, Response } from "express";
import { z } from "zod";

const userLoginRouter: Router = Router();

/* Schema validation */

const userLoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

/* Response code */

const userLoginResponse = {
    USER_LOGGED_IN: 200,
    USER_NOT_FOUND: 404,
    INVALID_REQUEST: 400
}


/* Routes */

userLoginRouter.post("/", (req: Request, res: Response) => {
    try {
        userLoginSchema.parse(req.body);
        let user = req.body;
        res.send(`User ${user.username} is logged in successfully!`).status(userLoginResponse.USER_LOGGED_IN);
    } catch (error) {
        res.status(userLoginResponse.INVALID_REQUEST).send(error);
    }
});


export default userLoginRouter;