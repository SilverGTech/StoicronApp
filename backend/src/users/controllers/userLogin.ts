import { Router, Request, Response } from "express";
import { z } from "zod";
import { UserRepositoryPg } from "../repositories/userRepositoryPg";
import { UserLoginService } from "../services/userLoginService";
import { sign, verify } from "../utils/jwt";

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
        const userInternal = await userLoginService.login(user.username, user.password)
        let payload = {
            username: userInternal.username,
            role: userInternal.role
        };
        let token = sign(payload);
        if(!userInternal){
            res.send().status(userLoginResponse.INVALID_REQUEST);
            return;
        }
        res.status(userLoginResponse.USER_LOGGED_IN).cookie('session', token, { httpOnly: true }).send();
    } catch (error) {
        res.status(userLoginResponse.INVALID_REQUEST).send(error);
    }
});


export default userLoginRouter;