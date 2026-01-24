"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGovernoratesQuerySchema = exports.governorateSlugParamSchema = exports.governorateIdParamSchema = exports.updateGovernorateSchema = exports.createGovernorateSchema = void 0;
const zod_1 = require("zod");
const validation_schemas_js_1 = require("../../middleware/validation.schemas.js");
// Create Governorate Schema
exports.createGovernorateSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    arabicName: zod_1.z.string()
        .min(2, 'Arabic name must be at least 2 characters')
        .max(100, 'Arabic name cannot exceed 100 characters')
        .trim(),
    description: zod_1.z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .trim()
        .optional(),
    arabicDescription: zod_1.z.string()
        .max(1000, 'Arabic description cannot exceed 1000 characters')
        .trim()
        .optional(),
    logo: validation_schemas_js_1.urlSchema.optional(),
    coverImage: validation_schemas_js_1.urlSchema.optional()
});
// Update Governorate Schema
exports.updateGovernorateSchema = exports.createGovernorateSchema.partial();
// Governorate ID Param Schema
exports.governorateIdParamSchema = zod_1.z.object({
    id: validation_schemas_js_1.mongoIdSchema
});
// Governorate Slug Param Schema
exports.governorateSlugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, 'Slug is required')
});
// Get Governorates Query Schema
exports.getGovernoratesQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['name', 'arabicName', 'createdAt']).optional().default('name'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('asc')
});
//# sourceMappingURL=governorate.validation.js.map