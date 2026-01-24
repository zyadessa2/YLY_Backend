// validation.schemas.ts
import { z } from 'zod';
import mongoose from 'mongoose';
/**
 * Custom Zod validators
 */
// MongoDB ObjectId validator
export const mongoIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid MongoDB ObjectId' });
// Strong password validator
export const strongPasswordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
// Email validator
export const emailSchema = z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim();
// URL validator
export const urlSchema = z.string()
    .url('Invalid URL format')
    .trim();
// Date validator (ISO string)
export const dateSchema = z.string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(z.date());
// Phone number validator (Egyptian format)
export const phoneSchema = z.string()
    .regex(/^(\+?20)?1[0125]\d{8}$/, 'Invalid Egyptian phone number');
// OTP validator
export const otpSchema = z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers');
// Slug validator
export const slugSchema = z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .trim()
    .toLowerCase();
// Pagination validators
export const paginationSchema = z.object({
    page: z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val > 0, 'Page must be greater than 0'),
    limit: z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});
/**
 * General reusable fields
 */
export const generalFields = {
    // User fields
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    otp: otpSchema,
    // MongoDB fields
    id: mongoIdSchema,
    objectId: mongoIdSchema,
    // Content fields
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(500, 'Title must not exceed 500 characters')
        .trim(),
    arabicTitle: z.string()
        .max(500, 'Arabic title must not exceed 500 characters')
        .trim()
        .optional(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .trim(),
    arabicDescription: z.string()
        .max(2000, 'Arabic description must not exceed 2000 characters')
        .trim()
        .optional(),
    content: z.string()
        .min(50, 'Content must be at least 50 characters')
        .trim(),
    arabicContent: z.string()
        .trim()
        .optional(),
    slug: slugSchema,
    // Image fields
    coverImage: urlSchema,
    contentImages: z.array(urlSchema).max(10, 'Maximum 10 images allowed').optional(),
    // Boolean fields
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    // Date fields
    publishedAt: dateSchema.optional(),
    eventDate: dateSchema,
    // Array fields
    tags: z.array(z.string().trim()).max(20, 'Maximum 20 tags allowed').optional(),
    arabicTags: z.array(z.string().trim()).max(20, 'Maximum 20 tags allowed').optional(),
    // Meta fields
    metaTitle: z.string()
        .max(150, 'Meta title must not exceed 150 characters')
        .trim()
        .optional(),
    metaDescription: z.string()
        .max(300, 'Meta description must not exceed 300 characters')
        .trim()
        .optional(),
    // Location
    location: z.string()
        .max(500, 'Location must not exceed 500 characters')
        .trim(),
    // Numbers
    price: z.number().min(0, 'Price cannot be negative').optional(),
    maxParticipants: z.number().min(1, 'Max participants must be at least 1').optional(),
    // Role
    role: z.enum(['admin', 'governorate_user']),
    // Governorate
    governorateId: mongoIdSchema.optional(),
};
/**
 * Password confirmation validator
 * Use with .refine() to check if passwords match
 */
export const passwordMatchRefine = (data) => {
    return data.password === data.confirmPassword;
};
/**
 * Helper to create password confirmation schema
 */
export const createPasswordConfirmationSchema = () => {
    return z.object({
        password: generalFields.password,
        confirmPassword: generalFields.confirmPassword
    }).refine(passwordMatchRefine, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    });
};
//# sourceMappingURL=validation.schemas.js.map