import { IUserRepository } from "../repositories/iuserRepository";
import { UserRepositoryErrors } from "../repositories/userRepositoryErrors";


export class UserLoginService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(username: string, password: string): Promise<string> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error(UserRepositoryErrors.USER_NOT_FOUND);
        }
        if (user.password !== password) {
            throw new Error(UserRepositoryErrors.USER_INVALID_PASSWORD);
        }
        return 'User logged in';
    }
}