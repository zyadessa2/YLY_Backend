import { z } from 'zod';
import { generalFields, mongoIdSchema } from '../../middleware/validation.schemas.js';
// Create Event Schema
export const createEventSchema = z.object({
    governorateId: generalFields.governorateId,
    title: generalFields.title,
    arabicTitle: generalFields.arabicTitle,
    description: generalFields.description,
    arabicDescription: generalFields.arabicDescription,
    content: generalFields.content,
    arabicContent: generalFields.arabicContent,
    location: generalFields.location,
    arabicLocation: z.string().max(500).trim().optional(),
    eventDate: generalFields.eventDate,
    eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endDate: generalFields.eventDate.optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    coverImage: generalFields.coverImage,
    contentImages: generalFields.contentImages,
    registrationEnabled: z.boolean().default(false),
    registrationDeadline: generalFields.eventDate.optional(),
    maxParticipants: z.number().min(1).optional(),
    published: generalFields.published,
    publishedAt: generalFields.publishedAt,
    featured: generalFields.featured,
    tags: generalFields.tags,
    arabicTags: generalFields.arabicTags,
    contactEmail: generalFields.email.optional(),
    contactPhone: z.string().regex(/^(\+?20)?1[0125]\d{8}$/).optional(),
    requirements: z.string().max(1000).optional(),
    arabicRequirements: z.string().max(1000).optional(),
    metaTitle: generalFields.metaTitle,
    metaDescription: generalFields.metaDescription,
    arabicMetaTitle: generalFields.metaTitle,
    arabicMetaDescription: generalFields.metaDescription
}).refine((data) => {
    if (data.endDate && data.eventDate && data.endDate < data.eventDate) {
        return false;
    }
    return true;
}, {
    message: 'End date must be after or equal to event date',
    path: ['endDate']
}).refine((data) => {
    if (data.published && !data.publishedAt) {
        return false;
    }
    return true;
}, {
    message: 'Published date is required when event is published',
    path: ['publishedAt']
}).refine((data) => {
    if (data.registrationDeadline && data.eventDate && data.registrationDeadline > data.eventDate) {
        return false;
    }
    return true;
}, {
    message: 'Registration deadline must be before event date',
    path: ['registrationDeadline']
});
// Update Event Schema
export const updateEventSchema = createEventSchema.partial();
// Event ID Param Schema
export const eventIdParamSchema = z.object({
    id: mongoIdSchema
});
// Get Events Query Schema
export const getEventsQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    governorateId: mongoIdSchema.optional(),
    published: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    featured: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    upcoming: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    registrationEnabled: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    search: z.string().optional(),
    tags: z.string().optional(),
    sortBy: z.enum(['createdAt', 'publishedAt', 'eventDate', 'title']).optional().default('eventDate'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});
// Event Registration Schema
export const eventRegistrationSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    phone: z.string().regex(/^(\+?20)?1[0125]\d{8}$/, 'Invalid Egyptian phone number'),
    notes: z.string().max(500).trim().optional()
});
// Registration Status Update Schema
export const updateRegistrationStatusSchema = z.object({
    status: z.enum(['approved', 'rejected', 'cancelled'])
});
//# sourceMappingURL=event.validation.js.map