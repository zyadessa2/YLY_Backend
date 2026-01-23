import { CreateOptions, HydratedDocument, Model, ProjectionType, QueryOptions } from "mongoose";
import { IUser as T } from "../models/user.model";
import { DBRepo } from "./DBRepo";
import { UserModel } from "../models/user.model";


export class UserRepo extends DBRepo<T> {
    // we make it override to provide default model and still let passing different model if needed
    constructor(protected override readonly model: Model<T, {}, {}, {}, any, any, T> = UserModel)  {
        super(model);
    }

    // this function to create user with custom logic if needed inhereted from generic create method
    async createUser({
        data,
        options 
    }: {
        data: Partial<T>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<T>> {
        const result = await this.create(data, options);
        const user = Array.isArray(result) ? result[0] : result;
        if (!user) {
            throw new Error("Failed to create user");
        }
        return user
    }

    

}