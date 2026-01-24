/**
 * Custom Zod validators
 */
export declare const mongoIdSchema: any;
export declare const strongPasswordSchema: any;
export declare const emailSchema: any;
export declare const urlSchema: any;
export declare const dateSchema: any;
export declare const phoneSchema: any;
export declare const otpSchema: any;
export declare const slugSchema: any;
export declare const paginationSchema: any;
/**
 * General reusable fields
 */
export declare const generalFields: {
    name: any;
    email: any;
    password: any;
    confirmPassword: any;
    otp: any;
    id: any;
    objectId: any;
    title: any;
    arabicTitle: any;
    description: any;
    arabicDescription: any;
    content: any;
    arabicContent: any;
    slug: any;
    coverImage: any;
    contentImages: any;
    published: any;
    featured: any;
    isActive: any;
    publishedAt: any;
    eventDate: any;
    tags: any;
    arabicTags: any;
    metaTitle: any;
    metaDescription: any;
    location: any;
    price: any;
    maxParticipants: any;
    role: any;
    governorateId: any;
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
export declare const createPasswordConfirmationSchema: () => any;
//# sourceMappingURL=validation.schemas.d.ts.map