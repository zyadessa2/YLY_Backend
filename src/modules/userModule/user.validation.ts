// user.validation.ts
import { z } from 'zod';

// Create User Schema
export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'governorate_user']),
    governorateId: z.string().optional()
}).refine(
    (data) => {
        if (data.role === 'governorate_user' && !data.governorateId) {
            return false;
        }
        if (data.role === 'admin' && data.governorateId) {
            return false;
        }
        return true;
    },
    {
        message: 'Governorate user must have governorateId, admin cannot have one',
        path: ['governorateId']
    }
);

// Update User Schema
export const updateUserSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    governorateId: z.string().optional(),
    isActive: z.boolean().optional()
});

// User ID Param Schema - MongoDB ObjectId format
export const userIdParamSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID")
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6)
});

