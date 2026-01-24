import { DBRepo } from './DBRepo.js';
import { UserModel } from '../models/user.model.js';
export class UserRepo extends DBRepo {
    // we make it override to provide default model and still let passing different model if needed
    constructor(model = UserModel) {
        super(model);
        this.model = model;
    }
    // this function to create user with custom logic if needed inhereted from generic create method
    async createUser({ data, options }) {
        const result = await this.create(data, options);
        const user = Array.isArray(result) ? result[0] : result;
        if (!user) {
            throw new Error("Failed to create user");
        }
        return user;
    }
}
//# sourceMappingURL=User.Repo.js.map