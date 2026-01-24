// news.validation.ts
import { z } from 'zod';
import { generalFields, mongoIdSchema } from '../../middleware/validation.schemas.js';

// Create News Schema
export const createNewsSchema = z.object({
    governorateId: generalFields.governorateId,
    title: generalFields.title,
    arabicTitle: generalFields.arabicTitle,
    description: generalFields.description,
    arabicDescription: generalFields.arabicDescription,
    content: generalFields.content,
    arabicContent: generalFields.arabicContent,
    author: generalFields.name,
    arabicAuthor: generalFields.name.optional(),
    coverImage: generalFields.coverImage,
    contentImages: generalFields.contentImages,
    published: generalFields.published,
    publishedAt: generalFields.publishedAt,
    featured: generalFields.featured,
    tags: generalFields.tags,
    arabicTags: generalFields.arabicTags,
    metaTitle: generalFields.metaTitle,
    metaDescription: generalFields.metaDescription,
    arabicMetaTitle: generalFields.metaTitle,
    arabicMetaDescription: generalFields.metaDescription
}).refine(
    (data) => {
        // If published, publishedAt is required
        if (data.published && !data.publishedAt) {
            return false;
        }
        return true;
    },
    {
        message: 'Published date is required when news is published',
        path: ['publishedAt']
    }
);

// Update News Schema (all fields optional)
export const updateNewsSchema = createNewsSchema.partial();

// News ID Param Schema
export const newsIdParamSchema = z.object({
    id: mongoIdSchema
});

// Get News Query Schema
export const getNewsQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    governorateId: mongoIdSchema.optional(),
    published: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    featured: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    search: z.string().optional(),
    tags: z.string().optional(), // comma separated
    sortBy: z.enum(['createdAt', 'publishedAt', 'viewCount', 'title']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});

// Increment View Schema
export const incrementViewSchema = z.object({
    id: mongoIdSchema
});

