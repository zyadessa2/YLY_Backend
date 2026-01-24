import { z } from 'zod';
export declare const createEventSchema: z.ZodObject<{
    governorateId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    arabicTitle: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    arabicDescription: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    arabicContent: z.ZodOptional<z.ZodString>;
    location: z.ZodString;
    arabicLocation: z.ZodOptional<z.ZodString>;
    eventDate: z.ZodUnion<[z.ZodString, z.ZodDate]>;
    eventTime: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    endTime: z.ZodOptional<z.ZodString>;
    coverImage: z.ZodString;
    contentImages: z.ZodOptional<z.ZodArray<z.ZodString>>;
    registrationEnabled: z.ZodDefault<z.ZodBoolean>;
    registrationDeadline: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    maxParticipants: z.ZodOptional<z.ZodNumber>;
    published: z.ZodDefault<z.ZodBoolean>;
    publishedAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    featured: z.ZodDefault<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    arabicTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    requirements: z.ZodOptional<z.ZodString>;
    arabicRequirements: z.ZodOptional<z.ZodString>;
    metaTitle: z.ZodOptional<z.ZodString>;
    metaDescription: z.ZodOptional<z.ZodString>;
    arabicMetaTitle: z.ZodOptional<z.ZodString>;
    arabicMetaDescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateEventSchema: z.ZodObject<{
    governorateId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    arabicTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    arabicDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    arabicContent: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodString>;
    arabicLocation: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    eventDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    eventTime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    endTime: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coverImage: z.ZodOptional<z.ZodString>;
    contentImages: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    registrationEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    registrationDeadline: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    maxParticipants: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    published: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    publishedAt: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>>;
    featured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    arabicTags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    contactEmail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contactPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    requirements: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicRequirements: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicMetaTitle: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    arabicMetaDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const eventIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const getEventsQuerySchema: z.ZodObject<{
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
    upcoming: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false" | undefined>>;
    registrationEnabled: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean, "true" | "false" | undefined>>;
    search: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        createdAt: "createdAt";
        title: "title";
        publishedAt: "publishedAt";
        eventDate: "eventDate";
    }>>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>>;
}, z.core.$strip>;
export declare const eventRegistrationSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateRegistrationStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        approved: "approved";
        rejected: "rejected";
        cancelled: "cancelled";
    }>;
}, z.core.$strip>;
export declare const getRegistrationsByGovernorateQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    status: z.ZodOptional<z.ZodEnum<{
        pending: "pending";
        approved: "approved";
        rejected: "rejected";
        cancelled: "cancelled";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=event.validation.d.ts.map