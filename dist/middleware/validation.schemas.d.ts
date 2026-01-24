import { z } from 'zod';
/**
 * Custom Zod validators
 */
export declare const mongoIdSchema: z.ZodString;
export declare const strongPasswordSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const urlSchema: z.ZodString;
export declare const dateSchema: z.ZodUnion<[z.ZodString, z.ZodDate]>;
export declare const phoneSchema: z.ZodString;
export declare const otpSchema: z.ZodString;
export declare const slugSchema: z.ZodString;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
}, z.core.$strip>;
/**
 * General reusable fields
 */
export declare const generalFields: {
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    otp: z.ZodString;
    id: z.ZodString;
    objectId: z.ZodString;
    title: z.ZodString;
    arabicTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    arabicDescription: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    arabicContent: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
    coverImage: z.ZodString;
    contentImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    published: z.ZodDefault<z.ZodBoolean>;
    featured: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    publishedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    eventDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    arabicTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    location: z.ZodString;
    price: z.ZodOptional<z.ZodNumber>;
    maxParticipants: z.ZodOptional<z.ZodNumber>;
    role: z.ZodEnum<{
        governorate_user: "governorate_user";
        admin: "admin";
    }>;
    governorateId: z.ZodOptional<z.ZodString>;
};
/**
 * Password confirmation validator
 * Use with .refine() to check if passwords match
 */
export declare const passwordMatchRefine: (data: {
    password: string;
    confirmPassword: string;
}) => boolean;
/**
 * Helper to create password confirmation schema
 */
export declare const createPasswordConfirmationSchema: () => z.ZodObject<{
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=validation.schemas.d.ts.map