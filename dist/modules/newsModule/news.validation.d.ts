import { z } from 'zod';
export declare const createNewsSchema: z.ZodObject<{
    governorateId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    arabicTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    arabicDescription: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    arabicContent: z.ZodOptional<z.ZodString>;
    author: z.ZodString;
    arabicAuthor: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodString;
    contentImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    published: z.ZodDefault<z.ZodBoolean>;
    publishedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    featured: z.ZodDefault<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    arabicTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    arabicMetaTitle: z.ZodOptional<z.ZodString>;
    arabicMetaDescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateNewsSchema: z.ZodObject<{
    governorateId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    arabicTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    arabicDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    arabicContent: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    author: z.ZodOptional<z.ZodString>;
    arabicAuthor: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coverImage: z.ZodOptional<z.ZodString>;
    contentImages: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    publishedAt: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    arabicTags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicMetaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicMetaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const newsIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const getNewsQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    governorateId: z.ZodOptional<z.ZodString>;
    published: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false" | undefined>>;
    featured: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false" | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        title: "title";
        publishedAt: "publishedAt";
        viewCount: "viewCount";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
export declare const incrementViewSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=news.validation.d.ts.map