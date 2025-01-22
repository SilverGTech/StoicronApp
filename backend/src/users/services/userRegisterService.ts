import { IUserRepository} from "../repositories/iuserRepository";
import { UserRepositoryErrors } from "../repositories/userRepositoryErrors";
import { User } from "../models/user";

export class UserRegisterService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async register(user: User): Promise<Boolean> {
        let status: Boolean = false;
        try {
            await this.userRepository.create(user);
            status = true;
        } catch (error: any) {
            throw new Error(UserRepositoryErrors.USER_NOT_CREATED);
        } finally {
            return status;
        }
    }
}