"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_types_js_1 = require("../../modules/userModule/user.types.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
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
    role: { type: String, enum: user_types_js_1.RoleEnum, default: user_types_js_1.RoleEnum.user },
    governorateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Governorate',
        default: null,
        validate: {
            validator: function (value) {
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
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
        this.password = await bcrypt_1.default.hash(this.password, saltRounds);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        return false;
    }
};
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=user.model.js.map