import { User } from '../models/user';

export interface IUserRepository {
    create(user: User): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<boolean>;
}

export const UserRepositoryErrors = {
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    USER_NOT_CREATED: 'User not created',
    USER_NOT_UPDATED: 'User not updated',
    USER_NOT_DELETED: 'User not deleted'
};