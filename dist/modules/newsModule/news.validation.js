"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementViewSchema = exports.getNewsQuerySchema = exports.newsIdParamSchema = exports.updateNewsSchema = exports.createNewsSchema = void 0;
// news.validation.ts
const zod_1 = require("zod");
const validation_schemas_js_1 = require("../../middleware/validation.schemas.js");
// Create News Schema
exports.createNewsSchema = zod_1.z.object({
    governorateId: validation_schemas_js_1.generalFields.governorateId,
    title: validation_schemas_js_1.generalFields.title,
    arabicTitle: validation_schemas_js_1.generalFields.arabicTitle,
    description: validation_schemas_js_1.generalFields.description,
    arabicDescription: validation_schemas_js_1.generalFields.arabicDescription,
    content: validation_schemas_js_1.generalFields.content,
    arabicContent: validation_schemas_js_1.generalFields.arabicContent,
    author: validation_schemas_js_1.generalFields.name,
    arabicAuthor: validation_schemas_js_1.generalFields.name.optional(),
    coverImage: validation_schemas_js_1.generalFields.coverImage,
    contentImages: validation_schemas_js_1.generalFields.contentImages,
    published: validation_schemas_js_1.generalFields.published,
    publishedAt: validation_schemas_js_1.generalFields.publishedAt,
    featured: validation_schemas_js_1.generalFields.featured,
    tags: validation_schemas_js_1.generalFields.tags,
    arabicTags: validation_schemas_js_1.generalFields.arabicTags,
    metaTitle: validation_schemas_js_1.generalFields.metaTitle,
    metaDescription: validation_schemas_js_1.generalFields.metaDescription,
    arabicMetaTitle: validation_schemas_js_1.generalFields.metaTitle,
    arabicMetaDescription: validation_schemas_js_1.generalFields.metaDescription
});
// Update News Schema (all fields optional)
exports.updateNewsSchema = exports.createNewsSchema.partial();
// News ID Param Schema
exports.newsIdParamSchema = zod_1.z.object({
    id: validation_schemas_js_1.mongoIdSchema
});
// Get News Query Schema
exports.getNewsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    governorateId: validation_schemas_js_1.mongoIdSchema.optional(),
    published: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    featured: zod_1.z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    search: zod_1.z.string().optional(),
    tags: zod_1.z.string().optional(), // comma separated
    sortBy: zod_1.z.enum(['createdAt', 'publishedAt', 'viewCount', 'title']).optional().default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
});
// Increment View Schema
exports.incrementViewSchema = zod_1.z.object({
    id: validation_schemas_js_1.mongoIdSchema
});
//# sourceMappingURL=news.validation.js.map