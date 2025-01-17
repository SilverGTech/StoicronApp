import { Router, Request, Response } from "express";
import { z } from "zod";
import { UserRegisterDTO } from "../dtos/userRegisterDTO";
import { UserRegisterService } from "../services/userRegisterService";
import { UserRepositoryPg } from "../repositories/userRepositoryPg";

const userRegisterRouter: Router = Router();

/* Schema validation */

const userRegisterSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    birthdate: z.string(),
    country: z.string()
});

/* Response code */

const userRegisterResponse = {
    USER_REGISTERED: 201,
    USER_ALREADY_EXISTS: 409,
    INVALID_REQUEST: 400
}

/* Instances  */

const userRepositoryPg = new UserRepositoryPg();
const userRegisterService = new UserRegisterService(userRepositoryPg);



/* Routes */

userRegisterRouter.post("/", (req: Request, res: Response) => {
    try {
        userRegisterSchema.parse(req.body);
        let user: UserRegisterDTO = req.body;
        // TODO: implementar userRegisterService
        
        // res.send(`User ${user.name} is registered successfully!`).status(userRegisterResponse.USER_REGISTERED);
    } catch (error) {
        res.status(userRegisterResponse.INVALID_REQUEST).send(error);
    }
});

export default userRegisterRouter;