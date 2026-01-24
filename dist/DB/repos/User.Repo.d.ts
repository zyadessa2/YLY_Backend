import { CreateOptions, HydratedDocument, Model } from 'mongoose';
import { IUser as T } from '../models/user.model.js';
import { DBRepo } from './DBRepo.js';
export declare class UserRepo extends DBRepo<T> {
    protected readonly model: Model<T, {}, {}, {}, any, any, T>;
    constructor(model?: Model<T, {}, {}, {}, any, any, T>);
    createUser({ data, options }: {
        data: Partial<T>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<T>>;
}
//# sourceMappingURL=User.Repo.d.ts.map