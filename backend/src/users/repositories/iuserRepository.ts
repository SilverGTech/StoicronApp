import { User } from '../models/user';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
}

