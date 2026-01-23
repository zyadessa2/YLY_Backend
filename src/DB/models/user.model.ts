import mongoose, { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { RoleEnum } from "../../modules/userModule/user.types";
import bcrypt from 'bcrypt';

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

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateRefreshToken(): string;
}



const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false, // Don't return password by default
        },

        role: { type: String, enum: RoleEnum, default: RoleEnum.user },

        governorateId: {
            type: Schema.Types.ObjectId,
            ref: 'Governorate',
            default: null,
            validate: {
                validator: function (this: IUser, value: mongoose.Types.ObjectId | null) {
                    // Admin users should not have a governorateId
                    if (this.role === 'admin' && value !== null) {
                        return false;
                    }
                    // Governorate users must have a governorateId
                    if (this.role === 'governorate_user' && value === null) {
                        return false;
                    }
                    return true;
                },
                message: 'Admin users cannot have a governorateId, governorate users must have one',
            },
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
        deletedAt: {
            type: Date,
            default: null,
            index: true,
        },
        changeCredentialsTime: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
// this index helps to quickly find users by email while excluding soft-deleted ones
userSchema.index({ email: 1, deletedAt: 1 });
userSchema.index({ governorateId: 1, deletedAt: 1 });
userSchema.index({ role: 1, isActive: 1, deletedAt: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};


export const UserModel = models.User || model<IUser>('User', userSchema);
export type HUserDocument = HydratedDocument<IUser>

