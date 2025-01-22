import { Request, Response } from "express";
import {  verify } from "../utils/jwt";

export const authUser = (req: Request, res: Response, next: Function) => {
    const token = req.cookies['session'];
    if(!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const payload = verify(token);
        req.body.user = payload;
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
}