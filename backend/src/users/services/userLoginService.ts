import { IUserRepository } from "../repositories/iuserRepository";
import { UserRepositoryErrors } from "../repositories/userRepositoryErrors";
import { comparePassword } from "../utils/passwordEncrypt";


export class UserLoginService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async login(username: string, password: string): Promise<Boolean> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error(UserRepositoryErrors.USER_NOT_FOUND);
        }
        if (!comparePassword(password, user.password)) {
            throw new Error(UserRepositoryErrors.USER_INVALID_PASSWORD);
        }
        return true;
    }
}