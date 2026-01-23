import { z } from 'zod';
import { generalFields, mongoIdSchema, urlSchema } from '../../middleware/validation.schemas';

// Create Governorate Schema
export const createGovernorateSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    arabicName: z.string()
        .min(2, 'Arabic name must be at least 2 characters')
        .max(100, 'Arabic name cannot exceed 100 characters')
        .trim(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .trim()
        .optional(),
    arabicDescription: z.string()
        .max(1000, 'Arabic description cannot exceed 1000 characters')
        .trim()
        .optional(),
    logo: urlSchema.optional(),
    coverImage: urlSchema.optional()
});

// Update Governorate Schema
export const updateGovernorateSchema = createGovernorateSchema.partial();

// Governorate ID Param Schema
export const governorateIdParamSchema = z.object({
    id: mongoIdSchema
});

// Governorate Slug Param Schema
export const governorateSlugParamSchema = z.object({
    slug: z.string().min(1, 'Slug is required')
});

// Get Governorates Query Schema
export const getGovernoratesQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    search: z.string().optional(),
    sortBy: z.enum(['name', 'arabicName', 'createdAt']).optional().default('name'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

