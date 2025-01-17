import { IUserRepository} from "../repositories/iuserRepository";
import { UserRepositoryErrors } from "../repositories/userRepositoryErrors";
import { User } from "../models/user";

export class UserRegisterService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async register(user: User): Promise<string> {
        try {
            await this.userRepository.create(user);
        } catch (error: any) {
            if (error.message === UserRepositoryErrors.USER_ALREADY_EXISTS) {
                throw new Error('User already exists');
            }
            if (error.message === UserRepositoryErrors.USER_NOT_CREATED) {
                throw new Error('User not created');
            }
        } 
        return 'User registered';
    }
}