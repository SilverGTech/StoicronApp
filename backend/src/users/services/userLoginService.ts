import { UserRepositoryPg } from "../repositories/userRepositoryPg";

export class UserLoginService {
    private userRepository: UserRepositoryPg;

    constructor(userRepository: UserRepositoryPg) {
        this.userRepository = userRepository;
    }

    async login(username: string, password: string): Promise<string> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        if (user.password !== password) {
            throw new Error('Invalid password');
        }
        return 'User logged in';
    }
}