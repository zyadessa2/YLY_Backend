"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPasswordConfirmationSchema = exports.passwordMatchRefine = exports.generalFields = exports.paginationSchema = exports.slugSchema = exports.otpSchema = exports.phoneSchema = exports.dateSchema = exports.urlSchema = exports.emailSchema = exports.strongPasswordSchema = exports.mongoIdSchema = void 0;
// validation.schemas.ts
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Custom Zod validators
 */
// MongoDB ObjectId validator
exports.mongoIdSchema = zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val), { message: 'Invalid MongoDB ObjectId' });
// Strong password validator
exports.strongPasswordSchema = zod_1.z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
// Email validator
exports.emailSchema = zod_1.z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .toLowerCase()
    .trim();
// URL validator
exports.urlSchema = zod_1.z.string()
    .url('Invalid URL format')
    .trim();
// Date validator (ISO string)
exports.dateSchema = zod_1.z.string()
    .datetime({ message: 'Invalid date format. Use ISO 8601 format' })
    .or(zod_1.z.date());
// Phone number validator (Egyptian format)
exports.phoneSchema = zod_1.z.string()
    .regex(/^(\+?20)?1[0125]\d{8}$/, 'Invalid Egyptian phone number');
// OTP validator
exports.otpSchema = zod_1.z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers');
// Slug validator — supports both Latin and Arabic/Unicode characters
exports.slugSchema = zod_1.z.string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u, 'Invalid slug format (letters, numbers, and hyphens only)')
    .trim();
// Pagination validators
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val > 0, 'Page must be greater than 0'),
    limit: zod_1.z.string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
});
/**
 * General reusable fields
 */
exports.generalFields = {
    // User fields
    name: zod_1.z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email: exports.emailSchema,
    password: exports.strongPasswordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Password confirmation is required'),
    otp: exports.otpSchema,
    // MongoDB fields
    id: exports.mongoIdSchema,
    objectId: exports.mongoIdSchema,
    // Content fields
    title: zod_1.z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(500, 'Title must not exceed 500 characters')
        .trim(),
    arabicTitle: zod_1.z.string()
        .max(500, 'Arabic title must not exceed 500 characters')
        .trim()
        .optional(),
    description: zod_1.z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description must not exceed 2000 characters')
        .trim(),
    arabicDescription: zod_1.z.string()
        .max(2000, 'Arabic description must not exceed 2000 characters')
        .trim()
        .optional(),
    content: zod_1.z.string()
        .min(50, 'Content must be at least 50 characters')
        .trim(),
    arabicContent: zod_1.z.string()
        .trim()
        .optional(),
    slug: exports.slugSchema,
    // Image fields
    coverImage: exports.urlSchema,
    contentImages: zod_1.z.array(exports.urlSchema).max(10, 'Maximum 10 images allowed').optional(),
    // Boolean fields
    published: zod_1.z.boolean().default(false),
    featured: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    // Date fields
    publishedAt: exports.dateSchema.optional(),
    eventDate: exports.dateSchema,
    // Array fields
    tags: zod_1.z.array(zod_1.z.string().trim()).max(20, 'Maximum 20 tags allowed').optional(),
    arabicTags: zod_1.z.array(zod_1.z.string().trim()).max(20, 'Maximum 20 tags allowed').optional(),
    // Meta fields
    metaTitle: zod_1.z.string()
        .max(150, 'Meta title must not exceed 150 characters')
        .trim()
        .optional(),
    metaDescription: zod_1.z.string()
        .max(300, 'Meta description must not exceed 300 characters')
        .trim()
        .optional(),
    // Location
    location: zod_1.z.string()
        .max(500, 'Location must not exceed 500 characters')
        .trim(),
    // Numbers
    price: zod_1.z.number().min(0, 'Price cannot be negative').optional(),
    maxParticipants: zod_1.z.number().min(1, 'Max participants must be at least 1').optional(),
    // Role
    role: zod_1.z.enum(['admin', 'governorate_user']),
    // Governorate
    governorateId: exports.mongoIdSchema.optional(),
};
/**
 * Password confirmation validator
 * Use with .refine() to check if passwords match
 */
const passwordMatchRefine = (data) => {
    return data.password === data.confirmPassword;
};
exports.passwordMatchRefine = passwordMatchRefine;
/**
 * Helper to create password confirmation schema
 */
const createPasswordConfirmationSchema = () => {
    return zod_1.z.object({
        password: exports.generalFields.password,
        confirmPassword: exports.generalFields.confirmPassword
    }).refine(exports.passwordMatchRefine, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    });
};
exports.createPasswordConfirmationSchema = createPasswordConfirmationSchema;
//# sourceMappingURL=validation.schemas.js.map