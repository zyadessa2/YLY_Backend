import mongoose, { HydratedDocument } from "mongoose";
import { RoleEnum } from "../../modules/userModule/user.types";
export interface IUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    role: RoleEnum;
    governorateId: mongoose.Types.ObjectId | null;
    isActive: boolean;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    changeCredentialsTime?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateRefreshToken(): string;
}
export declare const UserModel: any;
export type HUserDocument = HydratedDocument<IUser>;
//# sourceMappingURL=user.model.d.ts.map