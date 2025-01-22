import { Router, Request, Response } from "express";
import { z } from "zod";
import { UserRegisterDTO } from "../dtos/userRegisterDTO";
import { UserRegisterService } from "../services/userRegisterService";
import { UserRepositoryPg } from "../repositories/userRepositoryPg";
import { encryptPassword } from "../utils/passwordEncrypt";
import { UserProvider } from "../models/userProvider";

const userRegisterRouter: Router = Router();

/* Schema validation */

const userRegisterSchema = z.object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    birthdate: z.string(),
    country: z.string(),
    alternative_email: z.string().optional(),
    user_provider: z.string()
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

userRegisterRouter.post("/", async (req: Request, res: Response) => {
    try {
        userRegisterSchema.parse(req.body);
        let user: UserRegisterDTO = req.body;
        
        const userRegistered:Boolean = await userRegisterService.register({
            name: user.name,
            username: user.username,
            email: user.email,
            password: encryptPassword(user.password),
            birthdate: new Date(user.birthdate),
            country: user.country,
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
            alternative_email: "",
            user_provider: UserProvider.LOCAL,
            role: "user"
        });
        if(!userRegistered) {
            res.status(userRegisterResponse.USER_ALREADY_EXISTS).send(`User ${user.name} already exists!`);
            return;
        }
        res.send(`User ${user.name} is registered successfully!`).status(userRegisterResponse.USER_REGISTERED);
    } catch (error) {
        res.status(userRegisterResponse.INVALID_REQUEST).send(error);
    }
});

export default userRegisterRouter;