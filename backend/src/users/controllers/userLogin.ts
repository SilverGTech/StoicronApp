import { Router, Request, Response } from "express";
import { z } from "zod";
import { UserRepositoryPg } from "../repositories/userRepositoryPg";
import { UserLoginService } from "../services/userLoginService";

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

/* Instances  */

const userRepositoryPg = new UserRepositoryPg();
const userLoginService = new UserLoginService(userRepositoryPg);

/* Routes */

userLoginRouter.post("/", async (req: Request, res: Response) => {
    try {
        userLoginSchema.parse(req.body);
        let user = req.body;
        if(await userLoginService.login(user.username, user.password)){
            res.send(`User ${user.username} is logged in successfully!`).status(userLoginResponse.USER_LOGGED_IN);
        }
    } catch (error) {
        res.status(userLoginResponse.INVALID_REQUEST).send(error);
    }
});


export default userLoginRouter;