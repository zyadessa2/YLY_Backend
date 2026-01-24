import { z } from 'zod';
export declare const createGovernorateSchema: z.ZodObject<{
    name: z.ZodString;
    arabicName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    arabicDescription: z.ZodOptional<z.ZodString>;
    logo: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateGovernorateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    arabicName: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coverImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const governorateIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const governorateSlugParamSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
export declare const getGovernoratesQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        name: "name";
        arabicName: "arabicName";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
//# sourceMappingURL=governorate.validation.d.ts.map