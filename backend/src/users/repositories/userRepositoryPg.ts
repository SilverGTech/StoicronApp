import UserModel from "../database/userModel";
import { IUserRepository } from "./iuserRepository";
import { UserRepositoryErrors } from "./userRepositoryErrors";
import { User } from "../models/user";

export class UserRepositoryPg implements IUserRepository {

    async create(user: User): Promise<User> {
        try {
            await UserModel.create({
                email: user.email,
                password: user.password,
                name: user.name,
                username: user.username,
                birthdate: user.birthdate,
                country: user.country,
                active: user.active,
                alternative_email: user.alternative_email,
                user_provider: user.user_provider,
                role: user.role
            });
            return user;
        } catch (error) {
            throw new Error(UserRepositoryErrors.USER_NOT_CREATED);
        }
    }


    async findByUsername(username: string): Promise<User | null> {
        try{
            const user = await UserModel.findOne({ where: { username } });
            if(!user) return null;
            return user;
        }catch(error){
            throw new Error(UserRepositoryErrors.USER_NOT_FOUND);
        }
    }

    async findById(id: number): Promise<User | null> {
        try {
            const user = await UserModel.findByPk(id);
            if (!user) {
                throw new Error(UserRepositoryErrors.USER_NOT_FOUND);
            }
            const userObj: User = {
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                username: user.username,
                birthdate: user.birthdate,
                country: user.country,
                active: user.active,
                alternative_email: user.alternative_email,
                user_provider: user.user_provider,
                role: user.role
            };
            return user;
        } catch (error) {
            throw new Error(UserRepositoryErrors.USER_NOT_FOUND);
        }
    }

    async update(user: User): Promise<User> {
        try {
            await UserModel.update({
                email: user.email,
                password: user.password,
                name: user.name,
                username: user.username,
                birthdate: user.birthdate,
                country: user.country,
                active: user.active,
                alternative_email: user.alternative_email
            }, { where: { id: user.id } });
            return user;
        } catch (error) {
            throw new Error(UserRepositoryErrors.USER_NOT_UPDATED);
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await UserModel.destroy({ where: { id } });
            return true;
        } catch (error) {
            throw new Error(UserRepositoryErrors.USER_NOT_DELETED);
        }
    }
}