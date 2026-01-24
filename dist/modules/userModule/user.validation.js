"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.userIdParamSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
// user.validation.ts
const zod_1 = require("zod");
// Create User Schema
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(['admin', 'governorate_user']),
    governorateId: zod_1.z.string().optional()
}).refine((data) => {
    if (data.role === 'governorate_user' && !data.governorateId) {
        return false;
    }
    if (data.role === 'admin' && data.governorateId) {
        return false;
    }
    return true;
}, {
    message: 'Governorate user must have governorateId, admin cannot have one',
    path: ['governorateId']
});
// Update User Schema
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    governorateId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional()
});
// User ID Param Schema - MongoDB ObjectId format
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID")
});
// Reset Password Schema
exports.resetPasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6)
});
//# sourceMappingURL=user.validation.js.map