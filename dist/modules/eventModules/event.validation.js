"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationsByGovernorateQuerySchema = exports.updateRegistrationStatusSchema = exports.eventRegistrationSchema = exports.getEventsQuerySchema = exports.eventIdParamSchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const validation_schemas_js_1 = require("../../middleware/validation.schemas.js");
// Create Event Schema
exports.createEventSchema = zod_1.z.object({
    governorateId: validation_schemas_js_1.generalFields.governorateId,
    title: validation_schemas_js_1.generalFields.title,
    arabicTitle: validation_schemas_js_1.generalFields.arabicTitle,
    description: validation_schemas_js_1.generalFields.description,
    arabicDescription: validation_schemas_js_1.generalFields.arabicDescription,
    content: validation_schemas_js_1.generalFields.content,
    arabicContent: validation_schemas_js_1.generalFields.arabicContent,
    location: validation_schemas_js_1.generalFields.location,
    arabicLocation: zod_1.z.string().max(500).trim().optional(),
    eventDate: validation_schemas_js_1.generalFields.eventDate,
    eventTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endDate: validation_schemas_js_1.generalFields.eventDate.optional(),
    endTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    coverImage: validation_schemas_js_1.generalFields.coverImage,
    contentImages: validation_schemas_js_1.generalFields.contentImages,
    registrationEnabled: zod_1.z.boolean().default(false),
    registrationDeadline: validation_schemas_js_1.generalFields.eventDate.optional(),
    maxParticipants: zod_1.z.number().min(1).optional(),
    published: validation_schemas_js_1.generalFields.published,
    publishedAt: validation_schemas_js_1.generalFields.publishedAt,
    featured: validation_schemas_js_1.generalFields.featured,
    tags: validation_schemas_js_1.generalFields.tags,
    arabicTags: validation_schemas_js_1.generalFields.arabicTags,
    contactEmail: validation_schemas_js_1.generalFields.email.optional(),
    contactPhone: zod_1.z.string().max(20).trim().optional(),
    requirements: zod_1.z.string().max(1000).optional(),
    arabicRequirements: zod_1.z.string().max(1000).optional(),
    metaTitle: validation_schemas_js_1.generalFields.metaTitle,
    metaDescription: validation_schemas_js_1.generalFields.metaDescription,
    arabicMetaTitle: validation_schemas_js_1.generalFields.metaTitle,
    arabicMetaDescription: validation_schemas_js_1.generalFields.metaDescription
}).refine((data) => {
    if (data.endDate && data.eventDate && data.endDate < data.eventDate) {
        return false;
    }
    return true;
}, {
    message: 'End date must be after or equal to event date',
    path: ['endDate']
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
exports.updateEventSchema = exports.createEventSchema.partial();
// Event ID Param Schema
exports.eventIdParamSchema = zod_1.z.object({
    id: validation_schemas_js_1.mongoIdSchema
});
// Get Events Query Schema
exports.getEventsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    governorateId: validation_schemas_js_1.mongoIdSchema.optional(),
    published: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    featured: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    upcoming: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    registrationEnabled: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    search: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'publishedAt', 'eventDate', 'title']).optional().default('eventDate'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('asc')
});
// Event Registration Schema
exports.eventRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).trim(),
    email: zod_1.z.string().email().toLowerCase().trim(),
    phone: zod_1.z.string().regex(/^(\+?20)?1[0125]\d{8}$/, 'Invalid Egyptian phone number'),
    notes: zod_1.z.string().max(500).trim().optional()
});
// Registration Status Update Schema
exports.updateRegistrationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['approved', 'rejected', 'cancelled'])
});
// Get Registrations by Governorate Query Schema
exports.getRegistrationsByGovernorateQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    status: zod_1.z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional()
});
//# sourceMappingURL=event.validation.js.map